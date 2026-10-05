// src/screens/VerificacionScreen.jsx
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { XCircle } from 'lucide-react'
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'
import { OtpInput } from '../components/ui/OtpInput'
import { verifyCode } from '../lib/auth.mock'

const RESEND_SECONDS = 30

export function VerificacionScreen({ identificador, onAuth, onVolver, guardarSesion = true }) {
  const { t } = useTranslation()
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [segundos, setSegundos] = useState(RESEND_SECONDS)
  const intervalRef = useRef(null)

  // Contador regresivo
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSegundos(s => {
        if (s <= 1) { clearInterval(intervalRef.current); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  function handleReenviar() {
    if (segundos > 0) return
    setCodigo('')
    setError(null)
    setSegundos(RESEND_SECONDS)
    intervalRef.current = setInterval(() => {
      setSegundos(s => {
        if (s <= 1) { clearInterval(intervalRef.current); return 0 }
        return s - 1
      })
    }, 1000)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (codigo.length < 5) return
    setLoading(true)
    setError(null)
    setTimeout(() => {
      const resultado = verifyCode(identificador, codigo)
      setLoading(false)
      if (resultado) {
        if (guardarSesion) {
          localStorage.setItem('ms_usuario', JSON.stringify(resultado))
        }
        onAuth(resultado)
      } else {
        setError(t('verificacion.errorCodigo'))
      }
    }, 600)
  }

  const minutos = String(Math.floor(segundos / 60)).padStart(1, '0')
  const segs = String(segundos % 60).padStart(2, '0')

  return (
    <div className="bg-bg min-h-screen overflow-x-hidden flex flex-col">
      <LandingNavbar soloVolver onVolver={onVolver} />

      <div className="container mx-auto px-4 pt-10 pb-16 flex-1">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Columna izquierda ── */}
          <div className="hidden lg:flex flex-col anim-fade-up-1">
            <h1
              className="font-display font-bold text-white tracking-tight mb-6"
              style={{ fontSize: 'clamp(3rem,7vw,5rem)', lineHeight: 1.05 }}
            >
              {t('verificacion.tituloIzq')}
            </h1>
            <p className="text-white/55 text-base leading-relaxed max-w-sm">
              {t('verificacion.descIzq')}
            </p>
          </div>

          {/* ── Columna derecha — card ── */}
          <div className="anim-fade-up-2">
            <div className="bg-card border border-white/10 rounded-3xl p-8 lg:p-10">

              {/* Estado de error */}
              {error ? (
                <div className="flex flex-col items-center gap-5 text-center">
                  <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                    <XCircle size={32} className="text-red-400" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-white text-2xl mb-2">
                      {t('verificacion.errorTitulo')}
                    </h2>
                    <p className="text-white/50 text-sm">{error}</p>
                  </div>
                  <button
                    className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-4 rounded-xl transition-all cursor-pointer"
                    onClick={() => { setError(null); setCodigo('') }}
                  >
                    {t('verificacion.regresar')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="text-center">
                    <h2 className="font-display font-bold text-white text-3xl mb-2">
                      {t('verificacion.titulo')}
                    </h2>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {t('verificacion.subtitulo')}
                    </p>
                  </div>

                  <OtpInput
                    length={5}
                    value={codigo}
                    onChange={setCodigo}
                    disabled={loading}
                  />

                  <p className="text-white/45 text-xs text-center leading-relaxed">
                    {t('verificacion.instruccion', { medio: t('verificacion.medio') })}
                  </p>

                  <button
                    type="submit"
                    disabled={codigo.length < 5 || loading}
                    className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-4 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-brand/30 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg aria-hidden="true" className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                        {t('verificacion.verificando')}
                      </span>
                    ) : t('verificacion.acceder')}
                  </button>

                  <p className="text-center text-xs">
                    {segundos > 0 ? (
                      <span className="text-white/30">
                        {t('verificacion.reenviarEn', { tiempo: `${minutos}:${segs}` })}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleReenviar}
                        className="text-brand underline underline-offset-2 hover:text-brand-dark transition-colors cursor-pointer"
                      >
                        {t('verificacion.solicitarOtro')}
                      </button>
                    )}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer dark />
    </div>
  )
}
