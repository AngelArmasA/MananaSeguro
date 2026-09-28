import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, TriangleAlert } from 'lucide-react'
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'
import { BrandLogo } from '../components/ui/BrandLogo'
import { autenticarUsuario } from '../data/mockUsers'

export function SignInScreen({ onAuth, onVolver, onRegister }) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.')
      return
    }
    setLoading(true)
    setError(null)
    setTimeout(() => {
      const usuario = autenticarUsuario(email, password)
      setLoading(false)
      if (usuario) {
        onAuth(usuario)
      } else {
        setError('Correo o contraseña incorrectos.')
      }
    }, 600)
  }

  return (
    <div className="bg-[#0f0e0d] min-h-screen overflow-x-hidden">
      <LandingNavbar soloVolver onVolver={onVolver} />

      <div className="container mx-auto px-4 pt-10 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start min-h-[calc(100vh-80px)]">

          {/* ── Columna izquierda ── */}
          <div className="hidden lg:flex flex-col anim-fade-up-1">
            <div className="flex items-center gap-4 mb-10">
              <BrandLogo size="lg" />
              <div>
                <p className="text-white/60 text-sm font-medium leading-tight">Somos</p>
                <p className="text-white font-display font-bold text-xl leading-tight">MañanaSeguro.</p>
              </div>
            </div>
            <h1
              className="font-display font-bold text-white tracking-tight"
              style={{ fontSize: 'clamp(3rem,7vw,5rem)', lineHeight: 1.05 }}
            >
              Tu <em className="text-brand not-italic">dinero,</em><br />
              Tus <em className="text-brand not-italic">reglas,</em><br />
              Tu <em className="text-brand not-italic">retiro</em>
            </h1>
          </div>

          {/* ── Columna derecha — card sign in ── */}
          <div className="anim-fade-up-2">
            <div className="bg-[#1a1814] border border-white/10 rounded-3xl p-8 lg:p-10">
              <div className="flex flex-col gap-5">

                <div className="text-center mb-1">
                  <h2 className="font-display font-bold text-white text-4xl mb-3">
                    Inicio de sesión
                  </h2>
                  <p className="text-white/55 text-base leading-relaxed">
                    Accede a tu cuenta,<br />ingresa tu correo y contraseña
                  </p>
                </div>

                {error && (
                  <div className="bg-red-500/8 border border-dashed border-red-400/40 text-red-500 text-sm text-center px-4 py-3 rounded-xl">
                    <TriangleAlert size={16} className="inline shrink-0 mr-1" aria-hidden="true" />{error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* Email */}
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand transition-colors">
                    <Mail size={16} className="text-white/40 shrink-0" aria-hidden="true" />
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-white/35 outline-none"
                      autoComplete="email"
                    />
                  </div>

                  {/* Contraseña */}
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand transition-colors">
                    <Lock size={16} className="text-white/40 shrink-0" aria-hidden="true" />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-white/35 outline-none"
                      autoComplete="current-password"
                    />
                  </div>

                  {/* Recuperar */}
                  <p className="text-xs text-white/40 text-center">
                    ¿Olvidaste tu contraseña?{' '}
                    <button type="button" className="text-white/60 underline underline-offset-2 hover:text-white transition-colors cursor-pointer">
                      Recuperar
                    </button>
                  </p>

                  {/* CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-4 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-brand/30 cursor-pointer disabled:opacity-60 mt-1"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg aria-hidden="true" className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                        Entrando...
                      </span>
                    ) : 'Continuar'}
                  </button>
                </form>

                {/* Link registro */}
                <p className="text-sm text-white/45 text-center">
                  ¿No tienes cuenta?{' '}
                  <button
                    onClick={onRegister}
                    className="text-white font-semibold underline underline-offset-2 hover:text-brand transition-colors cursor-pointer"
                  >
                    Regístrate
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

              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
