import { createClient } from '@supabase/supabase-js'
import { ejecutarIntent } from '../_lib/soroban.js'

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { persistSession: false } }
)

const usuarioId = process.argv[2]
if (!usuarioId) {
    console.error('Uso: node scripts/generar-transacciones-prueba.mjs <usuarioId>')
    process.exit(1)
}

const { data: usuario, error } = await supabase
    .from('usuarios').select('*').eq('id', usuarioId).single()

if (error || !usuario) {
    console.error('Usuario no encontrado:', error?.message)
    process.exit(1)
}

const resultados = []

for (let i = 0; i < 20; i++) {
    try {
        const { hash } = await ejecutarIntent(
            { type: 'deposit', amountUsdc: 1, lockYears: 5 },
            usuario
        )
        const timestamp = new Date().toISOString()
        console.log(`${i + 1}/20 — ${timestamp} — ${hash}`)
        resultados.push({ hash, timestamp })
    } catch (err) {
        console.error(`Fallo en intento ${i + 1}:`, err.message)
    }
}

console.log('\n=== Resumen ===')
console.log(JSON.stringify(resultados, null, 2))