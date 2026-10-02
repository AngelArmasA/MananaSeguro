import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoMS from '../assets/LOGO_MS.png'

// TODO: estos datos pueden venir del backend
const INCENTIVES = [
  {
    id: 'fidelidad',
    titleKey: 'incentivos.fidelidad.titulo',
    titleFallback: 'Incentivo por fidelidad.',
    descKey: 'incentivos.fidelidad.descripcion',
    descFallback:
      'Opción 1: Tu reto es con tu futuro. Todos los 12 meses del año aporta a tu cuenta un mínimo de 5 dólares. Con tu constancia, tu incentivo pasará de 5% a 7%.',
    buttonKey: 'incentivos.fidelidad.boton',
    buttonFallback: 'Seleccionar opción 1',
  },
  {
    id: 'confianza',
    titleKey: 'incentivos.confianza.titulo',
    titleFallback: 'Incentivo por confianza.',
    descKey: 'incentivos.confianza.descripcion',
    descFallback:
      'Opción 2: Tus seres queridos también necesitan un Mañana Seguro. Con unos cuantos clics haz que dos personas comiencen a ahorrar y pasa del 5% al 7% de incentivos.',
    buttonKey: 'incentivos.confianza.boton',
    buttonFallback: 'Seleccionar opción 2',
  },
]

/* ---------- Logo oficial ---------- */
// alt vacío: el texto "Somos MañanaSeguro." ya va a un lado
function BrandMark() {
  return (
    <img
      src={logoMS}
      alt=""
      aria-hidden="true"
      className="w-20 h-20 xl:w-24 xl:h-24 rounded-2xl object-contain shrink-0"
    />
  )
}

/* ---------- Tarjeta de incentivo ---------- */
function IncentiveCard({ title, description, buttonLabel, selectedLabel, note, isSelected, onSelect }) {
  return (
    <article
      className={`bg-[#181716] rounded-3xl p-6 sm:p-8 flex flex-col border transition-colors ${
        isSelected ? 'border-[#d96b00]' : 'border-white/10'
      }`}
    >
      <h3 className="font-display font-black text-2xl sm:text-3xl xl:text-4xl text-white tracking-tight leading-tight mb-4">
        {title}
      </h3>
      <p className="text-sm text-white/80 leading-relaxed mb-6 max-w-prose">
        {description}
      </p>

      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isSelected}
        className={`w-full font-semibold py-3.5 px-6 rounded-xl transition-all text-sm sm:text-base cursor-pointer active:scale-[0.98] ${
          isSelected
            ? 'bg-transparent border border-[#d96b00] text-[#d96b00]'
            : 'bg-[#d96b00] hover:bg-[#c45f00] text-white shadow-lg shadow-[#d96b00]/20'
        }`}
      >
        {isSelected ? selectedLabel : buttonLabel}
      </button>

      <p className="text-center text-white/50 text-[11px] leading-relaxed mt-3 max-w-sm mx-auto">
        {note}
      </p>
    </article>
  )
}

export function IncentivesScreen({ initialSelected = null, onSelect }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [selected, setSelected] = useState(initialSelected)

  const handleSelect = (id) => {
    setSelected(id)
    // TODO: guardar selección en el backend
    onSelect?.(id)
  }

  return (
    <section className="bg-[#0f0e0d] min-h-screen flex items-start lg:items-center justify-center p-4 sm:p-6 lg:p-12 text-white font-sans antialiased">
      <div className="w-full max-w-md sm:max-w-xl lg:max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* ================= SECCIÓN IZQUIERDA (Intro) ================= */}
          <div className="flex flex-col gap-5 lg:gap-8 lg:sticky lg:top-28">

            {/* Botón "Regresar" (solo móvil) */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="lg:hidden flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm font-medium self-start cursor-pointer group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span>{t('incentivos.regresar', 'Regresar')}</span>
            </button>

            {/* Marca (solo escritorio) */}
            <div className="hidden lg:flex items-center gap-5">
              <BrandMark />
              <p className="text-3xl xl:text-4xl font-medium leading-tight">
                {t('incentivos.somos', 'Somos')}
                <br />
                MañanaSeguro.
              </p>
            </div>

            {/* Título */}
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.05]">
              {t('incentivos.tituloParte1', 'Programa de')}{' '}
              <span className="lg:block">
                <span className="text-[#d96b00]">{t('incentivos.tituloParte2', 'incentivos')}</span>.
              </span>
            </h1>

            {/* Subtítulo + descripción */}
            <div>
              <p className="border-l-2 border-white/40 pl-3 text-lg sm:text-xl lg:text-3xl font-medium leading-snug mb-3 max-w-md">
                {t('incentivos.subtitulo', 'Recibe una parte de todo tu esfuerzo.')}
              </p>
              <p className="text-sm lg:text-base text-white/70 leading-relaxed max-w-md">
                {t(
                  'incentivos.descripcion',
                  'Mañana Seguro te recompensa con un 5% de tu esfuerzo. Porque ahorrar no tiene que ser aburrido, cada 5 años te damos ese empujón que necesitas.'
                )}
              </p>
            </div>
          </div>

          {/* ================= TARJETAS DE INCENTIVOS ================= */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {INCENTIVES.map((incentive) => (
              <IncentiveCard
                key={incentive.id}
                title={t(incentive.titleKey, incentive.titleFallback)}
                description={t(incentive.descKey, incentive.descFallback)}
                buttonLabel={t(incentive.buttonKey, incentive.buttonFallback)}
                selectedLabel={t('incentivos.seleccionada', 'Opción seleccionada')}
                note={t(
                  'incentivos.nota',
                  'Una vez seleccionada, tendrás solo 1 mes para modificar la selección. Pasado ese tiempo no se podrá hacer ningún cambio.'
                )}
                isSelected={selected === incentive.id}
                onSelect={() => handleSelect(incentive.id)}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}