import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'
import { useTranslation } from 'react-i18next'

export function QuickConnectScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [msId, setMsId] = useState('')

  const handleOtorgar = () => {
    navigate('/signin-registro', { state: { cuentaCreada: true } })
  }

  return (
    <div className="bg-[#0f0e0d] min-h-screen flex flex-col overflow-x-hidden">
      <LandingNavbar soloVolver onVolver={() => navigate('/datos-cuenta')} />

      <section className="flex-1 py-10 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

            {/* Izquierda */}
            <div className="hidden lg:flex flex-col justify-start items-start space-y-6 pt-2">
              <h1
                className="font-display font-bold text-white tracking-tight leading-[1.05]"
                style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
              >
                {t('quickConnect.titulo')}{' '}
                <em className="text-[#d96b00] not-italic">{t('quickConnect.tituloAccent')}</em>
              </h1>
              <p className="text-white/55 text-base leading-relaxed max-w-md">
                {t('quickConnect.descripcion')}
              </p>
            </div>

            {/* Tarjeta */}
            <div className="w-full max-w-md mx-auto">
              <div className="bg-[#1a1917] border border-white/10 shadow-2xl shadow-black/80 p-6 sm:p-10 rounded-3xl flex flex-col">

                {/* Regresar móvil */}
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="lg:hidden flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mb-6 text-sm font-medium self-start cursor-pointer group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Regresar</span>
                </button>

                {/* Encabezado móvil */}
                <div className="lg:hidden mb-6">
                  <h2 className="font-display font-bold text-white text-3xl tracking-tight mb-2">
                    {t('quickConnect.titulo')}{' '}
                    <em className="text-[#d96b00] not-italic">{t('quickConnect.tituloAccent')}</em>
                  </h2>
                </div>

                {/* Encabezado escritorio */}
                <div className="hidden lg:block mb-6 text-center">
                  <h3 className="font-display font-bold text-2xl text-white">
                    {t('quickConnect.msId')}
                  </h3>
                </div>

                <p className="text-sm font-semibold text-white mb-2">{t('quickConnect.msId')}</p>

                <input
                  type="text"
                  value={msId}
                  onChange={e => setMsId(e.target.value)}
                  placeholder="Ej. MS-0324-DR"
                  className="w-full bg-[#1c1b1a] text-white text-sm border border-white/20 rounded-xl py-3 px-4 outline-none transition-colors focus:border-[#d96b00] focus:ring-2 focus:ring-[#d96b00]/40 placeholder:text-white/35 mb-1"
                />
                <p className="mb-5 text-xs text-white/45">{t('quickConnect.ejemplo')}: MS-0324-DR</p>

                <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#1c1b1a] px-3 py-3 text-sm text-white/80 mb-5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 shrink-0 accent-[#d96b00]"
                  />
                  <span className="leading-relaxed">
                    {t('quickConnect.aceptarBeneficio')}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleOtorgar}
                  className="w-full bg-[#d96b00] hover:bg-[#c05e00] active:scale-[0.98] text-white font-semibold py-4 px-6 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-[#d96b00]/30 mb-4 text-base cursor-pointer"
                >
                  {t('quickConnect.otorgarBeneficio')}
                </button>

                <p className="text-center text-white/40 text-xs leading-relaxed max-w-xs mx-auto">
                  {t('quickConnect.aviso')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer dark />
    </div>
  )
}
