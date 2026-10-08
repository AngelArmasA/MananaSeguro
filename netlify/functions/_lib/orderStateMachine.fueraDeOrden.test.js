// netlify/functions/_lib/orderStateMachine.fueraDeOrden.test.js
//
// Escenario B4 — entrega fuera de orden.
//
// orderStateMachine.test.js ya prueba cada transición suelta. Aquí se
// prueba la historia completa de UNA orden: recorre su ciclo normal y,
// después, le llegan otra vez eventos viejos (como pasa cuando Etherfuse
// reintenta un webhook o la red los entrega desordenados).
import { describe, it, expect, beforeEach } from 'vitest'
import { canTransition, applyTransition, ESTADOS_TERMINALES } from './orderStateMachine.js'

// Lleva una orden por el ciclo normal aplicando cada evento en orden.
function recorrerCicloNormal() {
    let estado = null
    estado = applyTransition(estado, 'created')
    estado = applyTransition(estado, 'funded')
    estado = applyTransition(estado, 'completed')
    return estado
}

describe('entrega fuera de orden — ciclo normal', () => {
    it('una orden recorre null → created → funded → completed', () => {
        const historial = []
        let estado = null
        for (const evento of ['created', 'funded', 'completed']) {
            estado = applyTransition(estado, evento)
            historial.push(estado)
        }
        expect(historial).toEqual(['created', 'funded', 'completed'])
        expect(ESTADOS_TERMINALES).toContain(estado)
    })
})

describe('entrega fuera de orden — eventos viejos después de completed', () => {
    let estado

    beforeEach(() => {
        estado = recorrerCicloNormal()
    })

    it('el reenvío del funded original no se acepta', () => {
        expect(canTransition(estado, 'funded')).toBe(false)
        expect(() => {
            estado = applyTransition(estado, 'funded')
        }).toThrow('completed → funded')
    })

    it('tras rechazar el funded tardío la orden sigue en completed', () => {
        try {
            estado = applyTransition(estado, 'funded')
        } catch {
            // Se espera el error; lo que importa es el estado que queda.
        }
        expect(estado).toBe('completed')
    })

    it('el reenvío del created original también se rechaza y la orden sigue en completed', () => {
        expect(canTransition(estado, 'created')).toBe(false)
        expect(() => {
            estado = applyTransition(estado, 'created')
        }).toThrow('completed → created')
        expect(estado).toBe('completed')
    })

    it('varios eventos viejos seguidos no mueven la orden de completed', () => {
        for (const eventoViejo of ['funded', 'created', 'funded']) {
            expect(() => {
                estado = applyTransition(estado, eventoViejo)
            }).toThrow(/Transición inválida/)
        }
        expect(estado).toBe('completed')
    })
})
