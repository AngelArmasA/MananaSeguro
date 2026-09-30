import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Check, ChevronDown } from 'lucide-react'
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'

const monthOptions = [12, 18, 24, 36]

export function EmergencyWithdrawalScreen() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('1200000')
  const [selectedMonths, setSelectedMonths] = useState(24)
  const [termsAccepted, setTermsAccepted] = useState(true)
  const [requestReady, setRequestReady] = useState(false)

  const formattedAmount = useMemo(() => {
    const parsed = Number(amount || 0)
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(parsed)
  }, [amount])

  const handleSubmit = (event) => {
    event.preventDefault()
    setRequestReady(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#12100f] text-[#f5efe9]">
      <LandingNavbar compactRegister />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1380px]">
          <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 xl:gap-16">
            <section className="w-full max-w-[560px]">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#e4741d] text-2xl font-black text-white shadow-[0_10px_24px_rgba(228,116,29,0.35)]">
                  M
                </div>
                <div className="text-[2rem] font-black leading-none tracking-[-0.06em] text-[#f5efe8] sm:text-[2.6rem]">
                  {t('emergencyWithdrawal.brand')}{' '}
                  <span className="text-[#e4741d]">{t('emergencyWithdrawal.brandAccent')}</span>
                </div>
              </div>

              <div className="mb-6 text-[1.05rem] font-medium text-[#d4cac2] sm:text-[1.3rem]">
                {t('emergencyWithdrawal.title')}
                <span className="mt-2 block text-[#e4741d]">{t('emergencyWithdrawal.titleAccent')}</span>
              </div>

              <h1 className="text-[3.1rem] font-black leading-[0.9] tracking-[-0.08em] text-[#f8f3ee] sm:text-[4.3rem] lg:text-[5.6rem]">
                {t('emergencyWithdrawal.title')}
                <span className="mt-2 block text-[#e4741d]">{t('emergencyWithdrawal.titleAccent')}</span>
              </h1>
            </section>

            <section className="w-full max-w-[560px]">
              <div className="rounded-[20px] border border-[#3b3634] bg-[#171513]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3 text-[#d8d0ca]">
                  <span className="text-[0.96rem] font-medium">{t('emergencyWithdrawal.accountLabel')}</span>
                  <button
                    type="button"
                    className="rounded-full border border-[#4f4945] bg-[#1f1d1b] px-3 py-1 text-xs font-semibold text-[#d8d0ca] transition hover:border-[#6a625d] hover:text-white"
                    onClick={() => setRequestReady(false)}
                  >
                    {t('emergencyWithdrawal.availableLabel')}
                  </button>
                </div>

                <div className="rounded-[16px] bg-[#1f1d1b] p-4">
                  <div className="text-[1.1rem] font-medium text-[#d8d0ca]">{t('emergencyWithdrawal.accountLabel')}</div>
                  <div className="mt-3 text-[2.4rem] font-black leading-none tracking-[-0.06em] text-[#f5efe8] sm:text-[3.4rem]">
                    {formattedAmount}
                  </div>
                  <div className="mt-4 text-[0.9rem] text-[#d5c9c0]">{t('emergencyWithdrawal.rateLabel')} 4.59%</div>
                </div>

                <div className="mt-4 rounded-[16px] border border-[#332f2d] bg-[#171513]/80 p-4 text-[#d7cec7]">
                  <div className="text-[1.1rem] leading-relaxed text-[#d7cec7]">
                    Cantidad disponible para retiro de emergencia. Este valor se usa como base del cálculo del 30%.
                  </div>
                  <div className="mt-5 text-[2.2rem] font-black leading-none tracking-[-0.06em] text-[#f5efe8] sm:text-[3rem]">
                    ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(1200000)}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-[0.96rem] font-medium text-[#f1e9e3]">
                      {t('emergencyWithdrawal.stepOne')}
                    </label>
                    <div className="flex items-center overflow-hidden rounded-xl border border-[#4a4541] bg-[#272422]">
                      <span className="flex items-center justify-center border-r border-[#4a4541] bg-[#201e1d] px-4 py-3.5 text-xl font-medium text-[#f1e9e3]">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        className="w-full bg-transparent px-4 py-3.5 text-lg text-[#f5efe8] outline-none placeholder:text-[#b7ada2]"
                        placeholder="0"
                        aria-label={t('emergencyWithdrawal.stepOne')}
                      />
                    </div>
                    <div className="mt-3 text-[0.94rem] text-[#d7cdc5]">{t('emergencyWithdrawal.disposable')}</div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.96rem] font-medium text-[#f1e9e3]">
                      {t('emergencyWithdrawal.stepTwo')}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedMonths}
                        onChange={(event) => setSelectedMonths(Number(event.target.value))}
                        className="w-full appearance-none rounded-xl border border-[#4a4541] bg-[#272422] px-4 py-3.5 pr-12 text-lg text-[#f5efe8] outline-none transition focus:border-[#d98a37] focus:ring-2 focus:ring-[#d98a37]/20"
                        aria-label={t('emergencyWithdrawal.stepTwo')}
                      >
                        {monthOptions.map((months) => (
                          <option key={months} value={months}>
                            {months} {t('emergencyWithdrawal.optionLabel')}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#d7cdc5]" size={18} />
                    </div>
                    <div className="mt-3 text-[0.78rem] text-[#b8ada4]">
                      Cada mes retraso se paga mensualmente equivalente a 1% menos de rendimiento por 1 año.
                    </div>
                  </div>

                  <label className="flex items-start gap-3 rounded-xl border border-[#443e3a] bg-[#1d1b1a] px-3 py-3 text-sm text-[#f0e7de]">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(event) => setTermsAccepted(event.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#e4741d]"
                      aria-label={t('emergencyWithdrawal.terms')}
                    />
                    <span className="leading-relaxed text-[#f0e7de] opacity-85">{t('emergencyWithdrawal.terms')}</span>
                  </label>

                  <button
                    type="submit"
                    className="mt-1 w-full rounded-xl bg-[#e4741d] px-4 py-3.5 text-base font-semibold text-white shadow-[0_12px_24px_rgba(228,116,29,0.28)] transition hover:bg-[#d56a1a] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!amount || !termsAccepted}
                  >
                    {t('emergencyWithdrawal.submit')}
                  </button>

                  {requestReady && (
                    <div className="rounded-xl border border-[#3d7a48] bg-[#1f2e24] px-3 py-3 text-sm text-[#dff6e6]">
                      <div className="mb-1 flex items-center gap-2 font-semibold">
                        <Check size={16} />
                        {t('emergencyWithdrawal.statusLabel')}
                      </div>
                      <div className="text-[#dff6e6]/80">{t('emergencyWithdrawal.statusMessage')}</div>
                    </div>
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
