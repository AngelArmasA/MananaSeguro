// Mock "BD" — usuario de prueba para el flujo frontend
export const MOCK_USERS = [
  {
    email: 'Margarito@mail.com',
    password: 'Margarito1989',
    nombre: 'Margarito',
    apellido: 'Hernández Ruiz',
    fechaNacimiento: '1989-03-14',
    curp: 'HERM890314HDFRNR09',
    rfc: 'HERM890314AB1',
    telefono: '+52 55 1234 5678',
    walletAddress: 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37',
    kyc: 'verificado',
    // Datos financieros simulados
    saldoMXN: 4000000,
    saldoUSDC: 235.29,
    tasaCetes: 4.59,
    metaAnios: 25,
    totalEstimadoMXN: 1000000,
    mesesActivo: 21,
    historial: [
      { tipo: 'deposito',   fecha: '04/07/2026', hora: '18:00:45', monto: +1000,  moneda: 'MXN' },
      { tipo: 'deposito',   fecha: '04/07/2026', hora: '18:00:45', monto: +1000,  moneda: 'MXN' },
      { tipo: 'emergencia', fecha: '04/07/2026', hora: '18:00:45', monto: -30000, moneda: 'MXN' },
    ],
  },
]

export function autenticarUsuario(email, password) {
  return MOCK_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  ) ?? null
}
