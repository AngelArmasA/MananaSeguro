import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export function QuickConnectScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [msId, setMsId] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [requestReady, setRequestReady] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    if (!msId.trim() || !termsAccepted) return
    setRequestReady(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#12100f] text-[#f5efe9]">
      <LandingNavbar compactRegister onVolver={() => navigate(location.state?.from || '/')} />

      <main className="flex w-full flex-1 items-center px-4 py-8 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <section className="px-1 pt-6 lg:pt-10">
              <h1 className="font-display text-[3.1rem] font-black leading-[0.9] tracking-[-0.07em] text-[#f5efe8] sm:text-[4.2rem] lg:text-[6rem]">
                {t('quickConnect.titulo')}
              </h1>
              <h2 className="font-display text-[3.1rem] font-black leading-[0.9] tracking-[-0.07em] text-[#e4741d] sm:text-[4.2rem] lg:text-[6rem]">
                {t('quickConnect.tituloAccent')}
              </h2>

              <p className="mt-5 max-w-[470px] text-[1.1rem] leading-relaxed text-[#d2c7bd] sm:text-[1.35rem]">
                {t('quickConnect.descripcion')}
              </p>
            </section>

            <section className="flex justify-center">
              <div className="w-full max-w-[440px] rounded-[22px] border border-[#2f2a29] bg-[#171513]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm sm:p-6">
                <div className="mb-4 text-[1.75rem] font-black tracking-[-0.04em] text-[#f3efe8]">
                  {t('quickConnect.msId')}
                </div>

                <form onSubmit={handleSubmit}>
                  <input
                    id="quick-connect-msid"
                    type="text"
                    value={msId}
                    onChange={(event) => {
                      setMsId(event.target.value.toUpperCase())
                      setRequestReady(false)
                    }}
                    placeholder={t('quickConnect.msIdPlaceholder')}
                    autoCapitalize="characters"
                    autoComplete="off"
                    required
                    className="mb-2 w-full rounded-xl border border-[#4a4541] bg-[#2a2725] px-4 py-3.5 text-[1.05rem] font-medium text-[#f3efe8] outline-none transition placeholder:text-[#9b928a] focus:border-[#d98a37] focus:ring-2 focus:ring-[#d98a37]/20"
                    aria-label={t('quickConnect.msId')}
                  />

                  <p className="mb-4 text-xs text-[#b6aba2]">{t('quickConnect.ejemplo')}: MS-0324-DR</p>

                  <label className="flex items-start gap-3 rounded-xl border border-[#483f39] bg-[#1d1a19] px-3 py-3 text-sm text-[#f0e7de]">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(event) => {
                        setTermsAccepted(event.target.checked)
                        setRequestReady(false)
                      }}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#e4741d]"
                      aria-label={t('quickConnect.aceptarBeneficio')}
                    />
                    <span className="leading-relaxed text-[#f0e7de] opacity-80">
                      {t('quickConnect.aceptarBeneficio')}
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={!msId.trim() || !termsAccepted}
                    className="mt-5 w-full rounded-xl bg-[#e4741d] px-4 py-3.5 text-center text-base font-semibold text-white transition hover:bg-[#d56a1a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {t('quickConnect.otorgarBeneficio')}
                  </button>

                  {requestReady && (
                    <p className="mt-3 rounded-lg border border-[#3d7a48] bg-[#1f2e24] px-3 py-2 text-sm text-[#dff6e6]" role="status">
                      {t('quickConnect.requestReady')}
                    </p>
                  )}
                </form>

                <p className="mt-4 text-center text-[0.72rem] leading-relaxed text-[#b6aba2]">
                  {t('quickConnect.aviso')}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
