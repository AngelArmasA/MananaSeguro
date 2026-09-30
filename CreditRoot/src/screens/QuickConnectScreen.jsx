import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'
import { useTranslation } from 'react-i18next'

export function QuickConnectScreen() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-[#12100f] text-[#f5efe9]">
      <LandingNavbar compactRegister />

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

                <div className="mb-2 rounded-xl border border-[#4a4541] bg-[#2a2725] px-4 py-3.5 text-[1.05rem] font-medium text-[#f3efe8] opacity-90">
                  MS-0324-DR
                </div>

                <p className="mb-4 text-xs text-[#b6aba2]">{t('quickConnect.ejemplo')}: MS-0324-DR</p>

                <label className="flex items-start gap-3 rounded-xl border border-[#483f39] bg-[#1d1a19] px-3 py-3 text-sm text-[#f0e7de]">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-[#e4741d]"
                    aria-label={t('quickConnect.aceptarBeneficio')}
                  />
                  <span className="leading-relaxed text-[#f0e7de] opacity-80">
                    {t('quickConnect.aceptarBeneficio')}
                  </span>
                </label>

                <div className="mt-5 w-full rounded-xl bg-[#e4741d] px-4 py-3.5 text-center text-base font-semibold text-white opacity-80">
                  {t('quickConnect.otorgarBeneficio')}
                </div>

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
