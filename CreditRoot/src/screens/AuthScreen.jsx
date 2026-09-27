import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TriangleAlert } from 'lucide-react'
import Footer from './components/Footer'
import LandingNavbar from './components/LandingNavbar'
import { conectarWallet } from '../lib/wallet'
import ardilla from '../assets/Ardilla_vector.png'
import { BrandLogo } from '../components/ui/BrandLogo'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function AuthScreen({ onAuth, onVolver }) {
  const { t } = useTranslation()
  const [paso, setPaso] = useState('inicio') // 'inicio' | 'freighter' | 'nombre'
  const [walletAddressFreighter, setWalletAddressFreighter] = useState(null)
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [googleListo, setGoogleListo] = useState(false)
  const googleBtnRef = useRef(null)

  // Callback de Google , cuando el usuario selecciona su cuenta
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

  // Freighter: conectar wallet
  async function handleConectarFreighter() {
    setLoading(true)
    setError(null)
    try {
      const address = await conectarWallet()
      setWalletAddressFreighter(address)
      setPaso('nombre')
    } catch (e) {
      if (e.message.includes('Freighter no está disponible')) {
        setError(t('auth.errorFreighterNoInstalado'))
      } else if (e.message.includes('Cancelaste')) {
        setError(t('auth.errorConexionCancelada'))
      } else {
        setError(e.message ?? t('auth.errorWalletConexion'))
      }
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim()) {
      setError(t('auth.errorCampoRequerido', { campo: t('auth.nombreLabel') }))
      return
    }
    onAuth({ nombre: nombre.trim(), walletAddress: walletAddressFreighter })
  }

  return (
    <div className="bg-[#0f0e0d] min-h-screen overflow-x-hidden">
      <LandingNavbar soloVolver onVolver={onVolver} />

      <div className="container mx-auto px-4 pt-10 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start min-h-[calc(100vh-80px)]">

          {/* ── Columna izquierda ── */}
          <div className="hidden lg:flex flex-col anim-fade-up-1">
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
                      Tener tu futuro en tus manos<br />nuca había sido tan fácil
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

              {/* Paso registro — próximamente */}
              {paso === 'registro' && (
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e37310" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h2 className="font-display font-bold text-white text-2xl mb-2">Datos personales</h2>
                    <p className="text-white/45 text-sm leading-relaxed max-w-xs mx-auto">
                      El formulario de registro estará disponible próximamente.
                    </p>
                  </div>
                  <button
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all cursor-pointer"
                    onClick={() => { setPaso('inicio'); setError(null) }}>
                    Volver
                  </button>
                </div>
              )}

              {/* Paso nombre (Freighter) */}
              {paso === 'nombre' && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="bg-green-500/8 border border-green-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-green-700 font-semibold mb-0.5">{t('auth.walletConectada')}</p>
                      <p className="text-xs text-ink/40 dark:text-white/40 font-mono truncate">{walletAddressFreighter}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-black text-ink dark:text-white text-2xl mb-1">
                      {t('auth.tituloNombre')} <em className="text-brand italic">{t('auth.tituloNombreAccent')}</em>
                    </h3>
                    <p className="text-ink/40 dark:text-white/40 text-sm">{t('auth.descNombre')}</p>
                  </div>
                  <div>
                    <label htmlFor="auth-nombre" className="block text-xs font-semibold text-ink/40 dark:text-white/40 uppercase tracking-widest mb-2">{t('auth.nombreLabel')}</label>
                    <input
                      id="auth-nombre"
                      className="w-full rounded-xl px-5 py-3.5 text-base bg-white dark:bg-white/5 outline-none transition-all duration-200 border border-ink/10 dark:border-white/10 focus:border-brand focus:ring-2 focus:ring-brand/20 text-ink dark:text-white"
                      placeholder={t('auth.nombrePlaceholder')}
                      value={nombre}
                      onChange={e => setNombre(e.target.value)}
                      autoFocus
                    />
                  </div>
                  {error && (
                    <div className="bg-red-500/8 border border-dashed border-red-400/40 text-red-500 text-sm text-center px-4 py-3 rounded-xl"><TriangleAlert size={16} className="inline shrink-0" aria-hidden="true" /> {error}</div>
                  )}
                  <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-4 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-brand/30 cursor-pointer">
                    {t('auth.entrar')}
                  </button>
                  <button type="button" className="text-sm text-ink/30 dark:text-white/30 hover:text-ink/60 dark:hover:text-white/60 transition-colors cursor-pointer"
                    onClick={() => { setPaso('inicio'); setError(null) }}>
                    {t('auth.cambiarWallet')}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
