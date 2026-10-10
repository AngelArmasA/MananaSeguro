import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FileText,
  Info,
  LogOut,
  MessageSquare,
  Shield,
  Star,
  UserRound,
  Zap,
} from 'lucide-react'
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'

const settingsActions = [
  { id: 'profile', icon: <UserRound size={19} strokeWidth={2} aria-hidden="true" /> },
  { id: 'privacy', icon: <Shield size={19} strokeWidth={2} aria-hidden="true" /> },
  { id: 'help', icon: <MessageSquare size={19} strokeWidth={2} aria-hidden="true" /> },
  { id: 'history', icon: <FileText size={19} strokeWidth={2} aria-hidden="true" /> },
  { id: 'msid', icon: <Star size={19} strokeWidth={2} aria-hidden="true" /> },
  { id: 'wallet', icon: <Zap size={19} strokeWidth={2} aria-hidden="true" /> },
  { id: 'about', icon: <Info size={19} strokeWidth={2} aria-hidden="true" /> },
]

export function SettingsScreen({ usuario, onLogout, onAction }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const firstName = usuario?.nombre?.trim() || t('settings.namePlaceholder')
  const lastNames = [usuario?.apellidoPaterno, usuario?.apellidoMaterno].filter(Boolean).join(' ')
  const displayName = lastNames ? `${firstName} ${lastNames}` : firstName

  function handleAction(actionId) {
    onAction?.(actionId)
    if (actionId === 'profile') { navigate('/profile-info'); return }
    if (actionId === 'privacy') { navigate('/change-password', { state: { from: '/settings' } }); return }
    if (actionId === 'about') { navigate('/about', { state: { from: location.pathname } }) }
  }

  return (
    <div className="bg-[#0f0e0d] min-h-screen flex flex-col text-white">
      <LandingNavbar soloVolver onVolver={() => navigate('/main')} />

      <section className="flex-1 py-10 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

            {/* IZQUIERDA */}
            <div className="flex flex-col gap-6">

              {/* Avatar + nombre */}
              <div className="flex items-center gap-5">
                <div className="w-[76px] h-[76px] rounded-full bg-[#1c1b1a] border border-white/10 flex items-center justify-center shrink-0">
                  {usuario?.foto
                    ? <img src={usuario.foto} alt={displayName} className="w-full h-full rounded-full object-cover" />
                    : <UserRound size={36} className="text-white/30" strokeWidth={1.5} />
                  }
                </div>
                <h2 className="font-display font-bold text-white text-2xl leading-tight">{displayName}</h2>
              </div>

              {/* Título */}
              <h1
                className="font-display font-bold text-white tracking-tight leading-[1.05]"
                style={{ fontSize: 'clamp(3rem,6vw,5rem)' }}
              >
                {t('settings.title')}
                <em className="text-brand not-italic block">{t('settings.titleAccent')}</em>
              </h1>

              {/* Botón cerrar sesión */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full max-w-xs flex items-center justify-center gap-3 bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-semibold py-4 px-6 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-brand/30 cursor-pointer text-base"
                >
                  <LogOut size={18} aria-hidden="true" />
                  {t('settings.signOut')}
                </button>
              </div>
            </div>

            {/* CARD DERECHA */}
            <div className="bg-[#1a1917] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
              <p className="text-white/45 text-sm font-medium mb-4">{t('settings.menuTitle')}</p>
              <div className="flex flex-col gap-1">
                {settingsActions.map(({ id, icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleAction(id)}
                    className="flex items-center gap-4 w-full px-3 py-3 rounded-xl text-sm text-white/80 hover:bg-white/8 hover:text-white transition-all cursor-pointer text-left"
                  >
                    <span className="text-white/50">{icon}</span>
                    <span>{t(`settings.actions.${id}`)}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer dark />
    </div>
  )
}