// netlify/functions/_lib/orderStateMachine.test.js
import { describe, it, expect } from 'vitest'
import { canTransition, applyTransition, ESTADOS_TERMINALES } from './orderStateMachine.js'

describe('canTransition — transiciones válidas', () => {
    const casosValidos = [
        { desde: null, hacia: 'created' },
        { desde: 'created', hacia: 'funded' },
        { desde: 'created', hacia: 'failed' },
        { desde: 'created', hacia: 'cancelled' },
        { desde: 'funded', hacia: 'completed' },
        { desde: 'funded', hacia: 'failed' },
    ]

    it.each(casosValidos)('permite $desde → $hacia', ({ desde, hacia }) => {
        expect(canTransition(desde, hacia)).toBe(true)
    })
})

describe('canTransition — transiciones inválidas', () => {
    const casosInvalidos = [
        { desde: null, hacia: 'funded' },
        { desde: null, hacia: 'completed' },
        { desde: 'created', hacia: 'completed' },
        { desde: 'completed', hacia: 'funded' },
        { desde: 'funded', hacia: 'created' },
        { desde: 'completed', hacia: 'created' },
        { desde: 'failed', hacia: 'funded' },
        { desde: 'failed', hacia: 'created' },
        { desde: 'cancelled', hacia: 'created' },
        { desde: 'completed', hacia: 'failed' },
        { desde: 'estado_inventado', hacia: 'created' },
        { desde: undefined, hacia: 'created' },
        { desde: 'created', hacia: 'evento_que_no_existe' },
    ]

    it.each(casosInvalidos)('rechaza $desde → $hacia', ({ desde, hacia }) => {
        expect(canTransition(desde, hacia)).toBe(false)
    })
})

describe('applyTransition', () => {
    it('devuelve el nuevo estado si la transición es válida', () => {
        expect(applyTransition('created', 'funded')).toBe('funded')
    })

    it('lanza error si la transición es inválida', () => {
        expect(() => applyTransition('completed', 'created')).toThrow(/Transición inválida/)
    })

    it('el mensaje de error incluye estado origen y destino', () => {
        expect(() => applyTransition('funded', 'created')).toThrow('funded → created')
    })

    it('maneja el estado inicial (null) en el mensaje de error', () => {
        expect(() => applyTransition(null, 'completed')).toThrow('(nueva) → completed')
    })
})

describe('ESTADOS_TERMINALES', () => {
    it('ningún estado terminal tiene transiciones de salida', () => {
        for (const estado of ESTADOS_TERMINALES) {
            const posiblesDestinos = ['created', 'funded', 'completed', 'failed', 'cancelled']
            for (const destino of posiblesDestinos) {
                expect(canTransition(estado, destino)).toBe(false)
            }
        }
    })
})