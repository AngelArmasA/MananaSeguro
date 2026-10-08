// netlify/functions/_lib/etherfuse-webhook.fueraDeOrden.test.js
//
// Escenario B4 — entrega fuera de orden, a nivel del handler del webhook.
//
// orderStateMachine.fueraDeOrden.test.js prueba que la máquina de estados
// rechaza el funded tardío. Aquí se prueba que el handler REAL respeta esa
// decisión: no toca la orden y no vuelve a acreditar en Stellar.
//
// Todo lo externo está simulado: Supabase con el mock encadenable del repo
// y la acreditación en Stellar (soroban.js) con una función espía. No hay
// red, y los secretos e ids son inventados.
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest'
import { crearSupabaseMock } from './testing/supabaseMock.js'
import { generaFirma } from './webhookHarness.js'

let mock
let ordenEnBase

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mock.cliente,
}))

// Reemplaza soroban.js completo: así nunca se carga el SDK de Stellar ni
// se intenta firmar nada de verdad.
vi.mock('./soroban.js', () => ({
  ejecutarIntent: vi.fn(),
  IntentError: class IntentError extends Error {},
}))

const SECRETO_FALSO = 'secreto-webhook-de-prueba'
const ORDEN_ID = 'orden-falsa-0001'
const USUARIO_FALSO = { id: 'usuario-falso-A', lock_years_default: 5 }

let handler
let ejecutarIntent

beforeAll(async () => {
  ;({ handler } = await import('../etherfuse-webhook.js'))
  ;({ ejecutarIntent } = await import('./soroban.js'))
})

// Responde según la consulta en curso (las llamadas desde el último from).
function resolverBase(llamadas) {
  const inicio = llamadas.map((c) => c.metodo).lastIndexOf('from')
  const consulta = llamadas.slice(inicio)
  const tabla = consulta[0].args[0]
  const metodos = consulta.map((c) => c.metodo)

  if (metodos.includes('update')) return { data: null, error: null }
  if (tabla === 'ordenes') return { data: ordenEnBase, error: null }
  if (tabla === 'usuarios') return { data: USUARIO_FALSO, error: null }
  return { data: null, error: null }
}

// Arma un webhook order_updated firmado con el secreto falso.
function webhookFirmado(datosOrden) {
  const payload = { type: 'order_updated', data: datosOrden }
  return {
    httpMethod: 'POST',
    headers: { 'x-signature': generaFirma(payload, SECRETO_FALSO) },
    body: JSON.stringify(payload),
  }
}

// Updates hechos sobre la tabla ordenes, con los campos que se mandaron.
function updatesDeOrdenes() {
  const updates = []
  let tabla = null
  for (const c of mock.llamadas) {
    if (c.metodo === 'from') tabla = c.args[0]
    if (c.metodo === 'update' && tabla === 'ordenes') updates.push(c.args[0])
  }
  return updates
}

beforeEach(() => {
  vi.stubEnv('WEBHOOK_SECRET', SECRETO_FALSO)
  vi.stubEnv('WEBHOOK_SECRET_2', '')
  vi.stubEnv('SUPABASE_URL', 'https://proyecto-falso.supabase.co')
  vi.stubEnv('SUPABASE_SERVICE_KEY', 'service-key-falsa')
  mock = crearSupabaseMock(resolverBase)
  ejecutarIntent.mockReset()
  ejecutarIntent.mockResolvedValue({ hash: 'hash-falso-abc123' })
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('etherfuse-webhook — funded tardío sobre una orden completed', () => {
  // La orden ya terminó su ciclo y ya se acreditó una vez.
  beforeEach(() => {
    ordenEnBase = {
      order_id: ORDEN_ID,
      status: 'completed',
      updated_at: '2026-10-01T10:05:00.000Z',
      usuario_id: USUARIO_FALSO.id,
    }
  })

  // El funded original: mismo orderId, timestamp anterior al completed.
  const fundedOriginal = {
    orderId: ORDEN_ID,
    status: 'funded',
    updatedAt: '2026-10-01T10:02:00.000Z',
    amountInFiat: 500,
    amountInTokens: 26,
  }

  it('responde 200 para que Etherfuse no siga reintentando', async () => {
    const res = await handler(webhookFirmado(fundedOriginal))
    expect(res.statusCode).toBe(200)
  })

  it('sí consulta la orden (la firma se aceptó y el evento se procesó)', async () => {
    await handler(webhookFirmado(fundedOriginal))
    expect(mock.filtros()).toContainEqual(['order_id', ORDEN_ID])
  })

  it('no actualiza la orden a funded', async () => {
    await handler(webhookFirmado(fundedOriginal))
    expect(updatesDeOrdenes()).toEqual([])
  })

  it('no vuelve a acreditar en Stellar', async () => {
    await handler(webhookFirmado(fundedOriginal))
    expect(ejecutarIntent).not.toHaveBeenCalled()
  })
})

describe('etherfuse-webhook — caso de control: completed legítimo sobre funded', () => {
  // Sin este caso, "no se llamó a ejecutarIntent" podría pasar aunque el
  // mock estuviera mal conectado. Aquí se demuestra que el espía sí detecta
  // la acreditación cuando corresponde.
  beforeEach(() => {
    ordenEnBase = {
      order_id: ORDEN_ID,
      status: 'funded',
      updated_at: '2026-10-01T10:02:00.000Z',
      usuario_id: USUARIO_FALSO.id,
    }
  })

  const completed = {
    orderId: ORDEN_ID,
    status: 'completed',
    updatedAt: '2026-10-01T10:05:00.000Z',
    amountInFiat: 500,
    amountInTokens: 26,
  }

  it('actualiza la orden a completed y acredita exactamente una vez', async () => {
    const res = await handler(webhookFirmado(completed))

    expect(res.statusCode).toBe(200)
    expect(updatesDeOrdenes()[0]).toMatchObject({ status: 'completed' })
    expect(ejecutarIntent).toHaveBeenCalledTimes(1)
    expect(ejecutarIntent).toHaveBeenCalledWith(
      { type: 'deposit', amountUsdc: 26, lockYears: 5 },
      USUARIO_FALSO
    )
  })

  it('completed seguido del funded tardío deja una sola acreditación', async () => {
    await handler(webhookFirmado(completed))
    // La "base" ya refleja el completed que se acaba de guardar.
    ordenEnBase = { ...ordenEnBase, status: 'completed', updated_at: completed.updatedAt }
    const updatesAntes = updatesDeOrdenes().length

    await handler(
      webhookFirmado({ ...completed, status: 'funded', updatedAt: '2026-10-01T10:02:00.000Z' })
    )

    expect(ejecutarIntent).toHaveBeenCalledTimes(1)
    expect(updatesDeOrdenes().length).toBe(updatesAntes)
  })
})
