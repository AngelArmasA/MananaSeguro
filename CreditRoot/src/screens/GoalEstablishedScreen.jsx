import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logoMS from '../assets/LOGO_MS.png'

// TODO: reemplazar por catálogo real (API / constantes)
const GOALS = ['5 años', '10 años', '15 años', '20 años']

const formatMXN = (amount) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount)

/*  Logo oficial  */
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

/* Gráfica (placeholder)  */
// TODO: reemplazar por la gráfica real con datos de proyección
function GrowthChart({ label }) {
  return (
    <svg
      viewBox="0 0 300 120"
      preserveAspectRatio="none"
      className="w-full h-28 sm:h-36 lg:h-44"
      role="img"
      aria-label={label}
    >
      <path
        d="M0 95 C 40 80, 70 78, 110 88 S 180 102, 215 80 S 270 30, 300 5"
        fill="none"
        stroke="#4d7a35"
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/*  Select reutilizable con flecha  */
function SelectField({ id, name, value, onChange, options = [], placeholder }) {
  return (
    <div className="relative w-full">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-[#1c1b1a] text-white text-sm border border-white/20 rounded-xl py-3 pl-4 pr-10 outline-none transition-colors focus:border-[#d96b00] focus:ring-2 focus:ring-[#d96b00]/40 cursor-pointer"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#1c1b1a]">{opt}</option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white"
        viewBox="0 0 12 8"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0 0h12L6 8z" />
      </svg>
    </div>
  )
}

export function GoalEstablishedScreen({
  meta = '15 años',          // TODO: vendrá del perfil del usuario
  totalEstimado = 1000000,   // TODO: vendrá del cálculo de proyección
  onCambiarMeta,
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [nuevaMeta, setNuevaMeta] = useState('10 años')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  const puedeCambiar = nuevaMeta !== '' && aceptaTerminos

  const handleCambiarMeta = () => {
    if (!puedeCambiar) return
    // TODO: enviar cambio de meta al backend
    onCambiarMeta?.(nuevaMeta)
  }

  return (
    <section className="bg-[#0f0e0d] min-h-[calc(100dvh-57px)] flex items-start justify-center p-4 sm:p-6 lg:p-12 text-white font-sans antialiased">
      <div className="w-full max-w-md lg:max-w-6xl mx-auto">

        {/* ENCABEZADO MÓVIL  */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mb-4 text-sm font-medium cursor-pointer group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('metaEstablecida.regresar', 'Regresar')}</span>
          </button>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {t('metaEstablecida.titulo', 'Meta establecida')}
          </h1>
        </div>

        {/*
          Escritorio: dos columnas independientes.
            - Izquierda (fija y centrada): marca + título / cambiar meta
            - Derecha (hace scroll):       gráfica / botón
          Móvil: las columnas usan `contents` (desaparecen como caja) y
          `order-*` acomoda: gráfica  cambiar meta  botón.
        */}
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start">

          {/*  COLUMNA IZQUIERDA  */}
          <div className="contents lg:flex lg:flex-col lg:justify-center lg:gap-8 lg:sticky lg:top-[calc(57px+3rem)] lg:min-h-[calc(100dvh-57px-6rem)]">

            {/* Marca + título (solo escritorio) */}
            <div className="hidden lg:flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <BrandMark />
                <p className="text-3xl xl:text-4xl font-medium leading-tight">
                  {t('metaEstablecida.somos', 'Somos')}
                  <br />
                  MañanaSeguro.
                </p>
              </div>
              <h2 className="font-display font-black text-6xl xl:text-7xl tracking-tight leading-[1.05]">
                <span className="block text-[#d96b00]">{t('metaEstablecida.tituloParte1', 'Meta')}</span>
                <span className="block">{t('metaEstablecida.tituloParte2', 'establecida')}</span>
              </h2>
            </div>

            {/* Tarjeta cambiar meta */}
            <div className="order-2 lg:order-none lg:max-w-md w-full bg-[#181716] border border-white/10 rounded-2xl p-5 sm:p-6">
              <label htmlFor="nuevaMeta" className="block text-sm font-semibold text-white mb-3">
                {t('metaEstablecida.cambiarMeta', 'Cambiar meta')}
              </label>
              <SelectField
                id="nuevaMeta"
                name="nuevaMeta"
                value={nuevaMeta}
                onChange={(e) => setNuevaMeta(e.target.value)}
                options={GOALS}
              />

              <p className="text-xs text-white/60 mt-3 leading-relaxed">
                {t('metaEstablecida.aviso', 'Recuerda que solo se puede cambiar la meta 1 vez al año*')}
              </p>

              {/* Checkbox términos */}
              <label className="flex items-center gap-3 mt-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                  className="peer sr-only"
                />
                <span className="w-6 h-6 shrink-0 rounded-md border-2 border-white/30 peer-checked:border-[#d96b00] peer-focus-visible:ring-2 peer-focus-visible:ring-[#d96b00]/40 flex items-center justify-center transition-colors">
                  {aceptaTerminos && (
                    <svg className="w-4 h-4 text-[#d96b00]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="text-xs text-white/80">
                  {t('metaEstablecida.acepto', 'Acepto los')}{' '}
                  {/* TODO: ruta real de términos y condiciones */}
                  <a href="#" className="underline underline-offset-2 hover:text-white">
                    {t('metaEstablecida.terminos', 'términos y condiciones de uso')}
                  </a>
                </span>
              </label>
            </div>
          </div>

          {/* COLUMNA DERECHA  */}
          <div className="contents lg:flex lg:flex-col lg:justify-center lg:gap-8 lg:min-h-[calc(100dvh-57px-6rem)]">

            {/* Tarjeta gráfica */}
            <div className="order-1 lg:order-none bg-[#181716] border border-white/10 rounded-3xl p-5 sm:p-8 flex flex-col">
              <p className="text-xs sm:text-sm text-white/60">
                {t('metaEstablecida.tuMeta', 'Tu meta es a:')}
              </p>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mt-1">
                {meta}
              </p>
              <p className="text-xs sm:text-sm text-white/80 mt-2">
                {t('metaEstablecida.totalFinal', 'Total estimado al final de la meta')}
              </p>

              <div className="flex-1 flex items-end my-4 lg:my-6">
                <GrowthChart label={t('metaEstablecida.graficaLabel', 'Proyección de crecimiento de tu ahorro')} />
              </div>

              <p className="text-[#d96b00] text-xs sm:text-sm">
                {t('metaEstablecida.totalEstimado', 'Total estimado:')}{' '}
                <span className="block lg:inline font-bold text-sm sm:text-base">
                  {formatMXN(totalEstimado)} MXN
                </span>
              </p>
            </div>

            {/* Botón cambiar meta */}
            <div className="order-3 lg:order-none mt-3 lg:mt-0">
              <button
                type="button"
                disabled={!puedeCambiar}
                onClick={handleCambiarMeta}
                className="w-full bg-[#d96b00] hover:bg-[#c45f00] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#d96b00]/20 text-base cursor-pointer"
              >
                {t('metaEstablecida.botonCambiar', 'Cambiar meta')}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}