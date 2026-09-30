import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'

export function ChangePasswordScreen() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#12100f] text-[#f5efe9]">
      <LandingNavbar compactRegister />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative mx-auto w-full max-w-[1400px]">
          <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
            <div className="h-full w-full bg-[linear-gradient(rgba(244,62,62,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(244,62,62,0.18)_1px,transparent_1px)] bg-[size:42px_42px] [background-position:center_center] opacity-30" />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
            <section className="w-full max-w-[520px] lg:max-w-[560px]">
              <button
                type="button"
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
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder={t('changePassword.newPassword')}
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

                  <label className="relative block">
                    <span className="sr-only">{t('changePassword.confirmPassword')}</span>
                    <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#d9d1c9]">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder={t('changePassword.confirmPassword')}
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

                  <button
                    type="submit"
                    className="mt-2 w-full rounded-xl bg-[#e4741d] px-4 py-3.5 text-base font-semibold text-white shadow-[0_10px_20px_rgba(228,116,29,0.25)] transition hover:bg-[#d56a1a]"
                  >
                    {t('changePassword.submit')}
                  </button>
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
