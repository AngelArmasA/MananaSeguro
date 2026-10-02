import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// TODO: reemplazar por catálogos reales (API / constantes)
const YEARS = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i))
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1))
const GOALS = ['5 años', '10 años', '15 años', '20 años']

const SEGMENT_FIELDS = [
  { name: 'ocupacion', key: 'perfilMeta.ocupacion', fallback: 'Selecciona tu ocupación*', options: [] },
  { name: 'estudios', key: 'perfilMeta.estudios', fallback: 'Selecciona tu último grado de estudios*', options: [] },
  { name: 'ingreso', key: 'perfilMeta.ingreso', fallback: 'Selecciona tu ingreso mensual*', options: [] },
  { name: 'genero', key: 'perfilMeta.genero', fallback: 'Selecciona tu género*', options: [] },
  { name: 'estadoCivil', key: 'perfilMeta.estadoCivil', fallback: 'Selecciona tu estado civil*', options: [] },
  { name: 'residencia', key: 'perfilMeta.residencia', fallback: 'Selecciona tu estado de residencia*', options: [] },
]

const INITIAL_FORM = {
  anio: '',
  mes: '',
  dia: '',
  ocupacion: '',
  estudios: '',
  ingreso: '',
  genero: '',
  estadoCivil: '',
  residencia: '',
  meta: '10 años',
}

/*  Select reutilizable con flecha  */
function SelectField({ name, value, onChange, placeholder, options = [], ariaLabel }) {
  return (
    <div className="relative w-full">
      <select
        name={name}
        value={value}
        onChange={onChange}
        aria-label={ariaLabel || placeholder}
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

export function PerfilMetaScreen({ onSubmit }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [form, setForm] = useState(INITIAL_FORM)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // TODO: validación real
  const isComplete = Object.values(form).every((v) => v !== '')

  const handleSubmit = () => {
    // TODO: enviar datos al backend
    onSubmit ? onSubmit(form) : navigate('/goal-established')
  }

  return (
    <section className="bg-[#0f0e0d] min-h-[calc(100dvh-57px)] flex items-center justify-center p-4 sm:p-6 lg:p-12 text-white font-sans antialiased">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">

          {/* SECCIÓN IZQUIERDA (Escritorio / lg) */}
          <div className="hidden lg:flex flex-col justify-center items-start space-y-6 lg:sticky lg:top-[calc(57px+3rem)] lg:h-[calc(100dvh-57px-6rem)]">
            <h1 className="font-display font-black text-white text-5xl xl:text-6xl tracking-tight leading-[1.05]">
              {t('perfilMeta.tituloParte1', 'Perfil y')}{' '}
              <span className="text-[#d96b00]">{t('perfilMeta.tituloParte2', 'meta')}</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">
              {t('perfilMeta.descripcion', 'Cuéntanos algunas cosas sobre ti para poder personalizar tu cuenta')}
            </p>
          </div>

          {/* TARJETA PRINCIPAL (Móvil & Escritorio) */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-[#141312] sm:bg-[#181716] p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl shadow-black/80 flex flex-col">

              {/* Botón "Regresar" (solo móvil) */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="lg:hidden flex items-center gap-1.5 text-white/70 hover:text-white transition-colors mb-6 text-sm font-medium self-start cursor-pointer group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span>{t('perfilMeta.regresar', 'Regresar')}</span>
              </button>

              {/* Encabezado Móvil */}
              <div className="lg:hidden mb-6 text-left">
                <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                  {t('perfilMeta.titulo', 'Perfil y meta')}
                </h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  {t('perfilMeta.descripcion', 'Cuéntanos algunas cosas sobre ti para poder personalizar tu cuenta.')}
                </p>
              </div>

              {/* Encabezado Escritorio */}
              <div className="hidden lg:block mb-8 text-center">
                <h3 className="font-display font-black text-2xl text-white">
                  {t('perfilMeta.cardTitulo', 'Proyecta tu meta')}
                </h3>
              </div>

              {/*Fecha de nacimiento */}
              <fieldset className="mb-5">
                <legend className="text-sm font-semibold text-white mb-2">
                  {t('perfilMeta.fechaNacimiento', 'Fecha de nacimiento')}
                </legend>
                <div className="grid grid-cols-[1fr_1.4fr_1fr] gap-2">
                  <SelectField name="anio" value={form.anio} onChange={handleChange} placeholder={t('perfilMeta.anio', 'Año')} options={YEARS} />
                  <SelectField name="mes" value={form.mes} onChange={handleChange} placeholder={t('perfilMeta.mes', 'Mes')} options={MONTHS} />
                  <SelectField name="dia" value={form.dia} onChange={handleChange} placeholder={t('perfilMeta.dia', 'Día')} options={DAYS} />
                </div>
              </fieldset>

              {/* Actividades y segmentación */}
              <fieldset className="mb-5">
                <legend className="text-sm font-semibold text-white">
                  {t('perfilMeta.segmentacion', 'Actividades y segmentación')}
                </legend>
                <p className="text-xs text-white/60 mb-2">
                  {t('perfilMeta.segmentacionNota', 'Estos datos no afectan tu perfil.')}
                </p>
                <div className="flex flex-col gap-2.5">
                  {SEGMENT_FIELDS.map((field) => (
                    <SelectField
                      key={field.name}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={t(field.key, field.fallback)}
                      options={field.options}
                    />
                  ))}
                </div>
              </fieldset>

              {/* Elige tu meta */}
              <fieldset className="mb-6">
                <legend className="text-sm font-semibold text-white mb-2">
                  {t('perfilMeta.eligeMeta', 'Elige tu meta')}
                </legend>
                <SelectField
                  name="meta"
                  value={form.meta}
                  onChange={handleChange}
                  options={GOALS}
                  ariaLabel={t('perfilMeta.eligeMeta', 'Elige tu meta')}
                />
              </fieldset>

              {/* Botón Principal "Continuar" */}
              <button
                type="button"
                disabled={!isComplete}
                onClick={handleSubmit}
                className="w-full bg-[#d96b00] hover:bg-[#c45f00] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-[#d96b00]/20 mb-5 text-base cursor-pointer"
              >
                {t('perfilMeta.continuar', 'Continuar')}
              </button>

              {/* Nota al pie */}
              <p className="text-center text-white/60 text-xs leading-relaxed max-w-xs mx-auto">
                {t('perfilMeta.nota', 'Puedes revisar cómo tratamos y resguardamos tus datos conforme a lo establecido en la ley')}{' '}
                {/* TODO: ruta real del aviso de privacidad */}
                <a href="#" className="underline underline-offset-2 hover:text-white">
                  {t('perfilMeta.aqui', 'aquí')}
                </a>
              </p>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}