import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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

  const navigate = useNavigate()

  return (
    <div className="bg-bg min-h-screen flex flex-col text-white">
      <LandingNavbar soloVolver onVolver={() => navigate('/main')} />

      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            {/* IZQUIERDA */}
            <div className="flex flex-col gap-5 lg:gap-8">
              <h1
                className="font-display font-bold text-white tracking-tight leading-[1.05]"
                style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
              >
                {t('emergencyWithdrawal.title')}
                <em className="text-brand not-italic block">{t('emergencyWithdrawal.titleAccent')}</em>
              </h1>
              <p className="text-sm text-white/60 leading-relaxed max-w-md">
                Estamos contigo en los momentos imprevistos. Solicita tu retiro de forma rápida y segura, y ajusta tus pagos mensuales según tus posibilidades.
              </p>
            </div>

            {/* DERECHA */}
            <div className="w-full">
              <div className="bg-card border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80">
                <div className="mb-5 flex items-center justify-between gap-3 text-[#d8d0ca]">
                  <span className="text-[0.96rem] font-medium">{t('emergencyWithdrawal.accountLabel')}</span>
                  <button
                    type="button"
                    className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
                    onClick={() => setRequestReady(false)}
                  >
                    {t('emergencyWithdrawal.availableLabel')}
                  </button>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="text-sm font-medium text-white/50">{t('emergencyWithdrawal.accountLabel')}</div>
                  <div className="mt-3 font-display font-bold text-white leading-none" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>
                    {formattedAmount}
                  </div>
                  <div className="mt-4 text-sm text-white/40">{t('emergencyWithdrawal.rateLabel')} <span className="text-brand font-semibold">4.59%</span></div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/8 bg-white/3 p-4">
                  <div className="text-sm leading-relaxed text-white/50">
                    {t('emergencyWithdrawal.availableExplanation')}
                  </div>
                  <div className="mt-5 font-display font-bold text-white leading-none" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)' }}>
                    ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(1200000)}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-[0.96rem] font-medium text-[#f1e9e3]">
                      {t('emergencyWithdrawal.stepOne')}
                    </label>
                    <div className="flex items-center overflow-hidden rounded-xl border border-white/15 bg-white/5">
                      <span className="flex items-center justify-center border-r border-white/15 bg-white/5 px-4 py-3.5 text-xl font-medium text-white/70">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        className="w-full bg-transparent px-4 py-3.5 text-lg text-white outline-none placeholder:text-white/30"
                        placeholder="0"
                        aria-label={t('emergencyWithdrawal.stepOne')}
                      />
                    </div>
                    <div className="mt-3 text-sm text-white/40">{t('emergencyWithdrawal.disposable')}</div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.96rem] font-medium text-[#f1e9e3]">
                      {t('emergencyWithdrawal.stepTwo')}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedMonths}
                        onChange={(event) => setSelectedMonths(Number(event.target.value))}
                        className="w-full appearance-none rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 pr-12 text-lg text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
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
                    <div className="mt-3 text-xs text-white/40">
                      {t('emergencyWithdrawal.termDetails')}
                    </div>
                  </div>

                  <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(event) => setTermsAccepted(event.target.checked)}
                      className="mt-0.5 h-4 w-4 accent-[#e4741d]"
                      aria-label={t('emergencyWithdrawal.terms')}
                    />
                    <span className="leading-relaxed text-white/80">{t('emergencyWithdrawal.terms')}</span>
                  </label>

                  <button
                    type="submit"
                    className="mt-1 w-full rounded-xl bg-brand hover:bg-brand-dark px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:-translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!amount || !termsAccepted}
                  >
                    {t('emergencyWithdrawal.submit')}
                  </button>

                  {requestReady && (
                    <div className="rounded-xl border border-green-800/50 bg-green-950/40 px-3 py-3 text-sm text-green-300">
                      <div className="mb-1 flex items-center gap-2 font-semibold">
                        <Check size={16} />
                        {t('emergencyWithdrawal.statusLabel')}
                      </div>
                      <div className="text-green-300/70">{t('emergencyWithdrawal.statusMessage')}</div>
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer dark />
    </div>
  )
}
