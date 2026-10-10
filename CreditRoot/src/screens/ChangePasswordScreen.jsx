import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, Circle, Eye, EyeOff, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'

export function ChangePasswordScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [requestReady, setRequestReady] = useState(false)
  const requirements = [
    { id: 'length', valid: password.length >= 12 },
    { id: 'uppercase', valid: /\p{Lu}/u.test(password) },
    { id: 'lowercase', valid: /\p{Ll}/u.test(password) },
    { id: 'number', valid: /\p{N}/u.test(password) },
    { id: 'symbol', valid: /[^\p{L}\p{N}]/u.test(password) },
  ]
  const passwordIsValid = requirements.every((requirement) => requirement.valid)
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!passwordIsValid || !passwordsMatch) return
    setRequestReady(true)
  }

  function handleBack() {
    navigate(location.state?.from || '/signin')
  }

  return (
    <div className="bg-[#0f0e0d] min-h-screen flex flex-col text-white">
      <LandingNavbar soloVolver onVolver={handleBack} />

      <section className="flex-1 py-10 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

            {/* Izquierda */}
            <div className="hidden lg:flex flex-col justify-start items-start space-y-6 pt-2">
              <h1
                className="font-display font-bold text-white tracking-tight leading-[1.05]"
                style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
              >
                {t('changePassword.title')}{' '}
                <em className="text-brand not-italic block">{t('changePassword.titleAccent')}</em>
              </h1>
              <p className="text-white/55 text-base leading-relaxed max-w-md">
                {t('changePassword.description')}
              </p>
            </div>

            {/* Tarjeta */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-[#1a1917] border border-white/10 shadow-2xl shadow-black/80 p-6 sm:p-10 rounded-3xl flex flex-col">

                {/* Encabezado móvil */}
                <div className="lg:hidden mb-6">
                  <h2 className="font-display font-bold text-white text-3xl tracking-tight mb-2">
                    {t('changePassword.title')}{' '}
                    <em className="text-brand not-italic">{t('changePassword.titleAccent')}</em>
                  </h2>
                </div>

                {/* Encabezado escritorio */}
                <div className="hidden lg:block mb-6 text-center">
                  <h3 className="font-display font-bold text-2xl text-white">
                    {t('changePassword.cardTitle')}
                  </h3>
                  <p className="text-white/55 text-sm mt-1">{t('changePassword.cardSubtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <label className="relative block">
                    <span className="sr-only">{t('changePassword.newPassword')}</span>
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => { setPassword(event.target.value); setRequestReady(false) }}
                      placeholder={t('changePassword.newPassword')}
                      autoComplete="new-password"
                      required
                      className="w-full bg-[#1c1b1a] text-white text-sm border border-white/20 rounded-xl py-3 pl-11 pr-11 outline-none transition-colors focus:border-[#d96b00] focus:ring-2 focus:ring-[#d96b00]/40 placeholder:text-white/35"
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white transition-colors"
                      aria-label={t('changePassword.showPassword')}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </label>

                  <div className="rounded-xl border border-white/10 bg-[#1c1b1a] p-4">
                    <p className="mb-3 text-sm font-semibold text-white">{t('changePassword.requirementsTitle')}</p>
                    <ul className="space-y-2">
                      {requirements.map(({ id, valid }) => (
                        <li key={id} className={`flex items-center gap-2 text-sm ${valid ? 'text-green-400' : 'text-white/45'}`}>
                          {valid ? <Check size={14} /> : <Circle size={12} />}
                          <span>{t(`changePassword.requirements.${id}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <label className="relative block">
                    <span className="sr-only">{t('changePassword.confirmPassword')}</span>
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) => { setConfirmPassword(event.target.value); setRequestReady(false) }}
                      placeholder={t('changePassword.confirmPassword')}
                      autoComplete="new-password"
                      required
                      className="w-full bg-[#1c1b1a] text-white text-sm border border-white/20 rounded-xl py-3 pl-11 pr-11 outline-none transition-colors focus:border-[#d96b00] focus:ring-2 focus:ring-[#d96b00]/40 placeholder:text-white/35"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                      className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white transition-colors"
                      aria-label={t('changePassword.showConfirmPassword')}>
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </label>

                  {confirmPassword && (
                    <p className={`text-sm ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`} role="status">
                      {t(passwordsMatch ? 'changePassword.passwordsMatch' : 'changePassword.passwordsDoNotMatch')}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!passwordIsValid || !passwordsMatch}
                    className="w-full bg-[#d96b00] hover:bg-[#c05e00] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-[#d96b00]/30 text-base cursor-pointer"
                  >
                    {t('changePassword.submit')}
                  </button>

                  {requestReady && (
                    <p className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400 text-center" role="status">
                      {t('changePassword.requestReady')}
                    </p>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer dark />
    </div>
  )
}
