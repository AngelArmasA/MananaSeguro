// src/lib/auth.mock.js
// Punto único de importación para el mock de autenticación.
// En producción (import.meta.env.DEV === false) verifyCode siempre rechaza.
// Para cambiar al endpoint real: reemplaza solo este archivo.

import { MOCK_USERS } from '../data/mockUsers'

const MOCK_CODE = import.meta.env.DEV ? '54321' : null

/**
 * Simula el envío del código OTP al usuario.
 * En producción esto llamaría al endpoint real.
 */
export function sendCode(identificador) {
  if (!import.meta.env.DEV) return Promise.resolve()
  console.info('[auth.mock] Código enviado a', identificador, '→', MOCK_CODE)
  return Promise.resolve()
}

/**
 * Verifica el código OTP.
 * @param {string} identificador  email del usuario
 * @param {string} codigo         código de 5 dígitos ingresado
 * @returns {{ usuario, token, expiresAt } | null}
 */
export function verifyCode(identificador, codigo) {
  if (!import.meta.env.DEV) return null
  if (codigo !== MOCK_CODE) return null

  const usuario = MOCK_USERS.find(
    u => u.email.toLowerCase() === identificador.toLowerCase()
  ) ?? { email: identificador, nombre: 'Usuario', apellido: '' }

  const expiresAt = Date.now() + 1000 * 60 * 60 * 24
  const token = `mock_token_${Date.now()}`
  return { ...usuario, token, expiresAt }
}
