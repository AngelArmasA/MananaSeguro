import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const CODE_LENGTH = 5
const RESEND_SECONDS = 29

export function VerificationScreen({ phone = '', onSubmit, onResend }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''))
  const [seconds, setSeconds] = useState(RESEND_SECONDS)
  const inputsRef = useRef([])

  useEffect(() => {
    if (seconds <= 0) return
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [seconds])

  const formattedTime = `0:${String(seconds).padStart(2, '0')}`
  const isComplete = digits.every((d) => d !== '')

  const handleChange = (index, value) => {
    const clean = value.replace(/[^0-9]/g, '').slice(-1)
    const next = [...digits]
    next[index] = clean
    setDigits(next)
    if (clean && index < CODE_LENGTH - 1) inputsRef.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    const next = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((ch, i) => (next[i] = ch))
    setDigits(next)
    inputsRef.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  const handleSubmit = () => {
    const code = digits.join('')
    if (code.length === CODE_LENGTH) onSubmit ? onSubmit(code) : navigate('/dashboard')
  }

  const handleResend = () => {
    if (seconds > 0) return
    setSeconds(RESEND_SECONDS)
    setDigits(Array(CODE_LENGTH).fill(''))
    inputsRef.current[0]?.focus()
    onResend?.()
  }

  return (
    <section className="bg-[#0f0e0d] min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-12 text-white font-sans antialiased">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* ================= SECCIÓN IZQUIERDA (Escritorio / lg) ================= */}
          <div className="hidden lg:flex flex-col items-start space-y-6">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#2a1708] text-[#d96b00] border border-[#d96b00]/30 tracking-wide">
              {t('verificacion.badge', 'Seguridad')}
            </span>

            <h1 className="font-display font-black text-white text-5xl xl:text-6xl tracking-tight leading-[1.05]">
              {t('verificacion.titulo', 'Verificación')}
            </h1>

            <p className="text-white/50 text-lg leading-relaxed max-w-md">
              {t('verificacion.descripcion', 'Enviamos un código de 5 dígitos a tu número de teléfono, ingrésalo debajo para acceder.')}
            </p>
          </div>

          {/* ================= TARJETA PRINCIPAL (Móvil & Escritorio) ================= */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-[#141312] sm:bg-[#181716] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-black/80 flex flex-col">
              
              {/* Botón "Regresar" (móvil y escritorio) */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mb-6 text-sm font-medium self-start cursor-pointer group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>{t('verificacion.regresar', 'Regresar')}</span>
              </button>

              {/* Encabezado Móvil (Alineado a la izquierda) */}
              <div className="lg:hidden mb-8 text-left">
                <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                  {t('verificacion.titulo', 'Verificación')}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  {t('verificacion.descripcion', 'Enviamos un código de 5 dígitos a tu número de teléfono, ingrésalo debajo para acceder.')}
                </p>
              </div>

              {/* Encabezado Escritorio (Alineado al centro dentro de la tarjeta) */}
              <div className="hidden lg:block mb-8 text-center">
                <h3 className="font-display font-black text-xl text-white mb-2">
                  {t('verificacion.cardTitulo', 'Ingresa tu código')}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {phone
                    ? t('verificacion.cardDescripcion', { phone, defaultValue: 'Lo enviamos al número {{phone}}.' })
                    : t('verificacion.cardDescripcionSinTelefono', 'Lo enviamos a tu número de teléfono.')}
                </p>
              </div>

              {/* Casillas de Entrada con Placeholders 1 2 3 4 5 y bordes ambarinos */}
              <div className="flex justify-between items-center gap-2 sm:gap-3 mb-8" onPaste={handlePaste}>
                {digits.map((digit, i) => {
                  const isFilled = digit !== ''
                  return (
                    <input
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      placeholder={(i + 1).toString()}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      aria-label={t('verificacion.digitoLabel', { n: i + 1, defaultValue: `Dígito ${i + 1}` })}
                      className={`
                        w-full max-w-[56px] h-16 sm:max-w-[64px] sm:h-20 
                        text-center text-2xl font-black rounded-2xl sm:rounded-[18px]
                        bg-[#1c1b1a] text-white placeholder:text-white/25
                        border transition-all duration-200 outline-none
                        ${isFilled 
                          ? 'border-[#d96b00] ring-1 ring-[#d96b00]/40 bg-[#221a12]' 
                          : 'border-white/15 focus:border-[#d96b00] focus:ring-2 focus:ring-[#d96b00]/40'
                        }
                      `}
                    />
                  )
                })}
              </div>

              {/* Botón Principal "Acceder" */}
              <button
                type="button"
                disabled={!isComplete}
                onClick={handleSubmit}
                className="w-full bg-[#d96b00] hover:bg-[#c45f00] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#d96b00]/20 mb-5 text-base cursor-pointer"
              >
                {t('verificacion.acceder', 'Acceder')}
              </button>

              {/* Temporizador / Reenvío */}
              <div className="text-center mb-5">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={seconds > 0}
                  className="text-xs sm:text-sm text-white/60 underline underline-offset-4 hover:text-white disabled:hover:text-white/60 transition-colors cursor-pointer disabled:cursor-default"
                >
                  {seconds > 0
                    ? `${t('verificacion.reenviarEn', 'Solicitar otro código en')} ${formattedTime} ${t('verificacion.segundos', 'segundos')}`
                    : t('verificacion.reenviarAhora', 'Solicitar código ahora')}
                </button>
              </div>

              {/* Nota al pie */}
              <p className="text-center text-white/40 text-xs leading-relaxed max-w-xs mx-auto">
                {t('verificacion.nota', 'El código enviado es de un solo uso y tiene 3 minutos de duración.')}
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}