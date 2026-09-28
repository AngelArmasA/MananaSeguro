import { useTranslation } from 'react-i18next'
import { ArrowUpRight, ArrowDownLeft, Flame } from 'lucide-react'
import logoPng from '/src/assets/LogoPng.png'
import { BrandLogo } from '../components/ui/BrandLogo'

const pillCls = 'text-xs font-bold px-3 py-1.5 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all cursor-pointer'

function Navbar({ onLogout }) {
  const { i18n } = useTranslation()
  function toggleLang() { i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es') }

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0e0d] border-b border-white/8 px-4 py-1.5">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={logoPng} alt="Logo" className="h-7 w-7 object-contain rounded-lg shrink-0" />
          <span className="font-display font-bold text-lg text-white tracking-tight">
            Mañana <span className="text-brand">Seguro</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className={pillCls} onClick={toggleLang}>
            {i18n.language === 'es' ? 'EN' : 'ES'}
          </button>
          <button
            onClick={onLogout}
            className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-all cursor-pointer"
            aria-label="Perfil"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

const mxnFmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })

export function MainScreen({ usuario, onLogout }) {
  const u = usuario

  return (
    <div className="bg-[#0f0e0d] min-h-screen text-white">
      <Navbar onLogout={onLogout} />

      <div className="container mx-auto px-4 py-5 max-w-4xl">

        {/* ── Fila 1: Hero izq + Balance der ── */}
        <div className="grid lg:grid-cols-2 gap-3 mb-3">

          {/* Hero */}
          <div className="flex flex-col justify-center gap-4">
            <div className="flex items-center gap-4">
              <BrandLogo size="lg" />
              <div>
                <p className="text-white/60 text-base font-medium leading-tight">Somos</p>
                <p className="text-white font-display font-bold text-2xl leading-tight">MañanaSeguro.</p>
              </div>
            </div>
            <h1
              className="font-display font-bold text-white tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(2rem,4.5vw,2.8rem)' }}
            >
              Tu <em className="text-brand not-italic">retiro,</em> ya está<br />
              en tus <em className="text-brand not-italic">manos.</em>
            </h1>
          </div>

          {/* Balance card */}
          <div className="bg-[#1a1814] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
            <p className="text-white/50 text-xs">Cuenta principal</p>
            <p
              className="font-display font-bold text-white leading-none"
              style={{ fontSize: 'clamp(2.2rem,5vw,3.2rem)', letterSpacing: '-1px' }}
            >
              {mxnFmt.format(u.saldoMXN)}
            </p>
            <p className="text-white/50 text-xs">
              Activo CETES <span className="text-brand font-semibold">{u.tasaCetes}%</span>
            </p>
            {/* Botones horizontales — igual que Figma */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button className="flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark rounded-xl py-2.5 px-4 transition-all cursor-pointer">
                <ArrowUpRight size={16} />
                <span className="text-xs font-semibold">Depositar</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 rounded-xl py-2.5 px-4 transition-all cursor-pointer text-white/60">
                <ArrowDownLeft size={16} />
                <span className="text-xs font-semibold">Retirar</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Fila 2: Meta (2fr) + Historial (3fr) ── */}
        <div className="grid lg:grid-cols-[2fr_3fr] gap-3 mb-3">

          {/* Meta + Meses — dos sub-cards apiladas */}
          <div className="flex flex-col gap-3">
            {/* Meta */}
            <div className="bg-[#1a1814] border border-white/10 rounded-2xl p-4 flex flex-col gap-2">
              <p className="text-white/70 text-sm font-medium">
                Meta a <span className="text-white font-bold">{u.metaAnios} años</span>
              </p>
              <svg viewBox="0 0 120 40" className="w-full h-8" preserveAspectRatio="none">
                <polyline
                  points="0,38 20,32 40,28 60,22 80,16 100,10 120,4"
                  fill="none" stroke="#e37310" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" opacity="0.7"
                />
              </svg>
              <p className="text-white/40 text-xs">
                Total estimado:{' '}
                <span className="text-brand font-semibold">{mxnFmt.format(u.totalEstimadoMXN)} MXN</span>
              </p>
            </div>

            {/* Meses activo */}
            <div className="bg-[#1a1814] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
              <Flame size={40} className="text-brand" />
              <p className="font-display font-bold text-brand leading-none" style={{ fontSize: '2.8rem' }}>
                {u.mesesActivo}
              </p>
              <p className="text-white/60 text-sm">meses</p>
            </div>
          </div>

          {/* Historial */}
          <div className="bg-[#1a1814] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
            <p className="text-white/50 text-xs font-medium">Historial de transferencias</p>
            {u.historial.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center shrink-0">
                  {item.monto > 0
                    ? <ArrowUpRight size={15} className="text-white/60" />
                    : <ArrowDownLeft size={15} className="text-white/60" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-tight">
                    {item.tipo === 'deposito' ? 'Depósito' : 'Retiro de emergencia'}
                  </p>
                  <p className="text-white/40 text-xs">{item.fecha}&nbsp;&nbsp;{item.hora} hr.</p>
                </div>
                <span className={`text-sm font-semibold shrink-0 ${item.monto > 0 ? 'text-brand' : 'text-white/70'}`}>
                  {item.monto > 0 ? '+ ' : '- '}{mxnFmt.format(Math.abs(item.monto))} MXN
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Fila 3: Promo cards ── */}
        <div className="grid lg:grid-cols-2 gap-3">

          {/* Rendimiento */}
          <div className="bg-[#1a1814] border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center gap-1.5">
            <p className="text-white/60 text-sm">Recibe hasta el</p>
            <p className="font-display font-bold text-brand leading-none" style={{ fontSize: '2.8rem' }}>5%</p>
            <p className="text-white/60 text-sm leading-relaxed">
              de <span className="text-white font-semibold">rendimiento total</span><br />
              generado por tu ahorro constante.
            </p>
            <button className="mt-2 flex items-center gap-1.5 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white/60 hover:text-white hover:border-white/40 transition-all cursor-pointer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
              Conoce más
            </button>
          </div>

          {/* Emergencia */}
          <div className="bg-[#1a1814] border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center gap-1.5">
            <p className="text-white/60 text-sm">¿Tienes una emergencia?</p>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e37310" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p className="text-brand font-semibold text-sm">Te entendemos</p>
            <p className="text-white/50 text-xs leading-relaxed">
              Conoce cómo tomar prestado hasta el 30% de tu ahorro.
            </p>
            <button className="mt-2 flex items-center gap-1.5 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white/60 hover:text-white hover:border-white/40 transition-all cursor-pointer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
              Conoce más
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
