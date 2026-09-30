import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Circle, Eye, EyeOff, Lock } from 'lucide-react'
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
    navigate(location.state?.from || '/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#12100f] text-[#f5efe9]">
      <LandingNavbar compactRegister />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mx-auto w-full max-w-[1400px]">
          <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <section className="w-full max-w-[520px] lg:max-w-[560px]">
              <button
                type="button"
                onClick={handleBack}
                className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#d7d0ca] transition hover:text-white"
              >
                <ArrowLeft size={16} />
                <span>{t('changePassword.back')}</span>
              </button>

              <h1 className="font-display text-[2.8rem] font-black leading-[0.9] tracking-[-0.08em] text-[#f3efe8] sm:text-[4rem] lg:text-[5.8rem]">
                {t('changePassword.title')}
                <span className="mt-1 block text-[#e4741d]">{t('changePassword.titleAccent')}</span>
              </h1>

              <p className="mt-6 max-w-[420px] text-[1.05rem] leading-relaxed text-[#d1c7bf] sm:text-[1.25rem]">
                {t('changePassword.description')}
              </p>
            </section>

            <section className="w-full max-w-[500px]">
              <div className="rounded-[20px] border border-[#3c3735] bg-[#181614]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm sm:p-6">
                <h2 className="text-[2rem] font-black leading-[1.05] tracking-[-0.06em] text-[#f3efe8] sm:text-[2.4rem]">
                  {t('changePassword.cardTitle')}
                </h2>
                <p className="mt-2 text-[1rem] leading-relaxed text-[#d9d1c9] sm:text-[1.05rem]">
                  {t('changePassword.cardSubtitle')}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <label className="relative block">
                    <span className="sr-only">{t('changePassword.newPassword')}</span>
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#d9d1c9]">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        setRequestReady(false)
                      }}
                      placeholder={t('changePassword.newPassword')}
                      autoComplete="new-password"
                      required
                      className="w-full rounded-xl border border-[#4d4744] bg-[#2b2927] py-3.5 pl-11 pr-11 text-base text-[#f3efe8] placeholder:text-[#b7aea7] outline-none transition focus:border-[#d98a37] focus:ring-2 focus:ring-[#d98a37]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-4 flex items-center text-[#d9d1c9] transition hover:text-white"
                      aria-label={t('changePassword.showPassword')}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </label>

                  <div className="rounded-xl border border-[#3c3735] bg-[#201e1c] p-4">
                    <p className="mb-3 text-sm font-semibold text-[#f3efe8]">{t('changePassword.requirementsTitle')}</p>
                    <ul className="space-y-2" aria-label={t('changePassword.requirementsTitle')}>
                      {requirements.map(({ id, valid }) => (
                        <li key={id} className={`flex items-center gap-2 text-sm ${valid ? 'text-[#8bd4a0]' : 'text-[#bdb4ad]'}`}>
                          {valid ? <Check size={16} aria-hidden="true" /> : <Circle size={14} aria-hidden="true" />}
                          <span>{t(`changePassword.requirements.${id}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <label className="relative block">
                    <span className="sr-only">{t('changePassword.confirmPassword')}</span>
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#d9d1c9]">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value)
                        setRequestReady(false)
                      }}
                      placeholder={t('changePassword.confirmPassword')}
                      autoComplete="new-password"
                      required
                      className="w-full rounded-xl border border-[#4d4744] bg-[#2b2927] py-3.5 pl-11 pr-11 text-base text-[#f3efe8] placeholder:text-[#b7aea7] outline-none transition focus:border-[#d98a37] focus:ring-2 focus:ring-[#d98a37]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute inset-y-0 right-4 flex items-center text-[#d9d1c9] transition hover:text-white"
                      aria-label={t('changePassword.showConfirmPassword')}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </label>

                  {confirmPassword && (
                    <p className={`text-sm ${passwordsMatch ? 'text-[#8bd4a0]' : 'text-[#e59a8e]'}`} role="status">
                      {t(passwordsMatch ? 'changePassword.passwordsMatch' : 'changePassword.passwordsDoNotMatch')}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!passwordIsValid || !passwordsMatch}
                    className="mt-2 w-full rounded-xl bg-[#e4741d] px-4 py-3.5 text-base font-semibold text-white shadow-[0_10px_20px_rgba(228,116,29,0.25)] transition hover:bg-[#d56a1a] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t('changePassword.submit')}
                  </button>
                  {requestReady && (
                    <p className="rounded-lg border border-[#3d7a48] bg-[#1f2e24] px-3 py-2 text-sm text-[#dff6e6]" role="status">
                      {t('changePassword.requestReady')}
                    </p>
                  )}
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
