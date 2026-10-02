import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TriangleAlert, ArrowRight, ArrowLeft } from 'lucide-react'
import Footer from './components/Footer'
import LandingNavbar from './components/LandingNavbar'
import ardilla from '../assets/Ardilla_vector.png'
import { BrandLogo } from '../components/ui/BrandLogo'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function AuthScreen({ onAuth, onVolver, initialStep = 'inicio' }) {
  const { t, i18n } = useTranslation()
  const [paso, setPaso] = useState(initialStep)
  const [formRegistro, setFormRegistro] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    password: '',
    confirmPassword: '',
    pais: 'México',
    telefono: '',
    aceptaTerminos: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [googleListo, setGoogleListo] = useState(false)
  const googleBtnRef = useRef(null)

  useEffect(() => {
    setPaso(initialStep)
  }, [initialStep])

  // Callback de Google, cuando el usuario selecciona su cuenta
  const handleCredentialResponse = useCallback(async (response) => {
    if (!response.credential) {
      setError(t('auth.errorSinCredencial'))
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t('auth.errorLogin'))
      localStorage.setItem('ms_usuario', JSON.stringify(data.usuario))
      onAuth(data.usuario)
    } catch (err) {
      setError(err.message || t('auth.errorLoginReintentar'))
    } finally {
      setLoading(false)
    }
  }, [onAuth, t])

  // Inicializar SDK de Google
  const inicializarGoogle = useCallback(() => {
    if (!window.google?.accounts) return
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      ux_mode: 'popup',
    })
    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: googleBtnRef.current.offsetWidth || 360,
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      })
    }
    setGoogleListo(true)
  }, [handleCredentialResponse])

  // Cargar SDK de Google
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError(t('auth.errorConfig'))
      return
    }
    if (window.google?.accounts) {
      inicializarGoogle()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = inicializarGoogle
    script.onerror = () => setError(t('auth.errorGoogleCarga'))
    document.head.appendChild(script)
  }, [inicializarGoogle, t])

  function handleRegistroChange(e) {
    const { name, value, type, checked } = e.target
    setFormRegistro(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (error) setError(null)
  }

  async function handleSubmitRegistro(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      nombre: formRegistro.nombre.trim(),
      apellidoPaterno: formRegistro.apellidoPaterno.trim(),
      apellidoMaterno: formRegistro.apellidoMaterno.trim(),
      email: formRegistro.email.trim(),
      password: formRegistro.password,
      confirmPassword: formRegistro.confirmPassword,
      pais: formRegistro.pais.trim() || 'México',
      telefono: formRegistro.telefono.trim(),
      aceptaTerminos: formRegistro.aceptaTerminos,
    }

    if (!payload.nombre || !payload.email || !payload.password || !payload.telefono || !payload.apellidoPaterno || !payload.apellidoMaterno) {
      setError(t('auth.registro.errorCampos'))
      setLoading(false)
      return
    }

    if (payload.password !== payload.confirmPassword) {
      setError(t('auth.registro.errorPassword'))
      setLoading(false)
      return
    }

    if (!payload.aceptaTerminos) {
      setError(t('auth.registro.errorTerminos'))
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/register-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || data.message || t('auth.registro.errorCrear'))
      }

      localStorage.setItem('ms_usuario', JSON.stringify(data.usuario))
      onAuth(data.usuario)
    } catch (err) {
      setError(err.message || t('auth.registro.errorReintentar'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0f0e0d] min-h-screen overflow-x-hidden">
      <LandingNavbar soloVolver onVolver={onVolver} />

      <div className="container mx-auto px-4 pt-10 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-80px)]">

          {/* ── Columna izquierda ── */}
          <div className="hidden lg:flex flex-col justify-center anim-fade-up-1">
            {/* Logo + tagline */}
            <div className="flex items-center gap-4 mb-10">
              <BrandLogo size="lg" />
              <div>
                <p className="text-white/60 text-sm font-medium leading-tight">Somos</p>
                <p className="text-white font-display font-bold text-xl leading-tight">MañanaSeguro.</p>
              </div>
            </div>

            {/* H1 */}
            <h1
              className="font-display font-bold text-white tracking-tight"
              style={{ fontSize: 'clamp(3rem,7vw,5rem)', lineHeight: 1.05 }}
            >
              Tu <em className="text-brand not-italic">dinero,</em><br />
              Tus <em className="text-brand not-italic">reglas,</em><br />
              Tu <em className="text-brand not-italic">retiro</em>
            </h1>
          </div>

          {/* ── Columna derecha — card de auth ── */}
          <div className="anim-fade-up-2">
            <div className="bg-[#1a1814] border border-white/10 rounded-3xl p-8 lg:p-10">

              {/* Paso inicio */}
              {paso === 'inicio' && (
                <div className="flex flex-col items-center gap-5">
                  <div className="text-center">
                    <h2 className="font-display font-bold text-white text-4xl mb-3">
                      Regístrate
                    </h2>
                    <p className="text-white/55 text-base leading-relaxed">
                      Tener tu futuro en tus manos<br />nunca había sido tan fácil
                    </p>
                  </div>

                  {/* Ardilla */}
                  <img
                    src={ardilla}
                    alt={t('auth.mascotaAlt')}
                    className="h-44 object-contain float-squirrel"
                  />

                  {error && (
                    <div className="w-full bg-red-500/8 border border-dashed border-red-400/40 text-red-500 text-sm text-center px-4 py-3 rounded-xl">
                      <TriangleAlert size={16} className="inline shrink-0" aria-hidden="true" /> {error}
                    </div>
                  )}

                  {loading && (
                    <div className="flex flex-col items-center gap-3 py-2">
                      <svg aria-hidden="true" className="animate-spin text-brand" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      <p className="text-sm text-white/50">{t('auth.conectando')}</p>
                    </div>
                  )}

                  {/* CTA principal */}
                  {!loading && (
                    <button
                      className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-4 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-brand/30 cursor-pointer text-base"
                      onClick={() => setPaso('registro')}
                    >
                      Crear cuenta con correo
                    </button>
                  )}

                  {/* Link iniciar sesión */}
                  <p className="text-sm text-white/45">
                    {t('calc.yaTienesCuenta')}{' '}
                    <button
                      onClick={onVolver}
                      className="text-white font-semibold underline underline-offset-2 hover:text-brand transition-colors cursor-pointer"
                    >
                      {t('calc.iniciarSesion')}
                    </button>
                  </p>

                  {/* Términos */}
                  <p className="text-xs text-white/30 text-center leading-relaxed">
                    Al hacer clic en &ldquo;Continuar&rdquo; aceptas<br />
                    los{' '}
                    <a href="#" className="underline underline-offset-2 hover:text-white/60 transition-colors">
                      términos y condiciones de uso
                    </a>
                  </p>

                  {/* Google SDK oculto — se inicializa pero no se muestra */}
                  <div ref={googleBtnRef} className="hidden" />
                </div>
              )}

              {/* Paso registro */}
              {paso === 'registro' && (
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e3730d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                      <line x1="12" y1="12" x2="12" y2="16" />
                      <line x1="10" y1="14" x2="14" y2="14" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-2xl mb-2">Datos personales</h3>
                    <p className="text-white/45 text-sm leading-relaxed max-w-xs mx-auto">Próximamente</p>
                  </div>
                  <button
                    className="text-sm text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                    onClick={() => { setPaso('inicio'); setError(null) }}
                  >
                    <ArrowLeft size={14} className="inline" aria-hidden="true" /> {t('nav.volverInicio')}
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
