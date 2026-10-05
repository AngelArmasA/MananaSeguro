import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Check, Circle, TriangleAlert } from 'lucide-react'
import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'

export function DataProfile({ onContinuar }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [form, setForm] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const requirements = [
    { id: 'length',    valid: form.password.length >= 12 },
    { id: 'uppercase', valid: /\p{Lu}/u.test(form.password) },
    { id: 'lowercase', valid: /\p{Ll}/u.test(form.password) },
    { id: 'number',    valid: /\p{N}/u.test(form.password) },
    { id: 'symbol',    valid: /[^\p{L}\p{N}]/u.test(form.password) },
  ]

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onContinuar ? onContinuar(form) : navigate('/verificacion-registro')
    }, 400)
  }

  const inputCls = 'w-full bg-card border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-sans placeholder:text-white/35 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20'

  return (
    <div className="bg-bg min-h-screen flex flex-col overflow-x-hidden">
      <LandingNavbar soloVolver onVolver={() => navigate('/login')} />

      <div className="container mx-auto px-4 pt-10 pb-16 flex-1">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Columna izquierda ── */}
          <div className="hidden lg:flex flex-col justify-start pt-4 anim-fade-up-1">
            <h1 className="font-display font-bold text-white tracking-tight leading-[1.0] mb-5"
              style={{ fontSize: 'clamp(3.5rem,7vw,5.5rem)' }}>
              Datos<br />
              <em className="text-brand not-italic">personales</em>
            </h1>
            <p className="text-white/55 text-base leading-relaxed max-w-sm mb-12">
              Para poder crear tu cuenta necesitamos algunos datos personales.
            </p>

            <div className="flex flex-col gap-8">
              <div className="border-l-2 border-brand pl-4">
                <h3 className="font-display font-bold text-white text-2xl leading-tight mb-2">
                  Tus datos, seguros
                </h3>
                <p className="text-white/55 text-sm leading-relaxed max-w-xs">
                  Toda la información que compartes está protegida bajo los más altos estándares de seguridad.
                </p>
              </div>

              <div className="border-l-2 border-brand pl-4">
                <h3 className="font-display font-bold text-white text-2xl leading-tight mb-2">
                  Proceso rápido
                </h3>
                <p className="text-white/55 text-sm leading-relaxed max-w-xs">
                  Completa tu registro en menos de 3 minutos y accede a todos los beneficios de tu cuenta.
                </p>
              </div>
            </div>
          </div>

          {/* ── Columna derecha — formulario ── */}
          <div className="anim-fade-up-2">
            <div className="bg-card border border-white/10 rounded-3xl p-8 lg:p-10">

              <h2 className="font-display font-bold text-white text-2xl mb-6">
                Regístrate en minutos
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {error && (
                  <div className="bg-red-500/8 border border-dashed border-red-400/40 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                    <TriangleAlert size={15} className="shrink-0" aria-hidden="true" />
                    {error}
                  </div>
                )}

                {/* Nombre completo */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-widest font-sans">
                    Nombre completo
                  </label>
                  <input name="nombre" type="text" placeholder="Nombre(s)*"
                    value={form.nombre} onChange={handleChange} className={inputCls} />
                  <input name="apellidoPaterno" type="text" placeholder="Apellido paterno*"
                    value={form.apellidoPaterno} onChange={handleChange} className={inputCls} />
                  <input name="apellidoMaterno" type="text" placeholder="Apellido materno*"
                    value={form.apellidoMaterno} onChange={handleChange} className={inputCls} />
                </div>

                {/* Crear acceso */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-widest font-sans">
                    Crear acceso
                  </label>

                  {/* Teléfono con prefijo */}
                  <div className="flex items-center bg-[#1c1b1a] border border-white/15 rounded-xl overflow-hidden focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20 transition">
                    <span className="px-3 py-3 text-sm text-white/60 border-r border-white/15 shrink-0 select-none">
                      +52
                    </span>
                    <input name="telefono" type="tel" placeholder="Número de teléfono*"
                      value={form.telefono} onChange={handleChange}
                      className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none" />
                  </div>

                  <input name="email" type="email" placeholder="Correo electrónico*"
                    value={form.email} onChange={handleChange} className={inputCls} />
                  <input name="password" type="password" placeholder="Contraseña*"
                    value={form.password} onChange={handleChange} className={inputCls} />

                  {form.password.length > 0 && (
                    <div className="rounded-xl border border-white/10 bg-[#1c1b1a] p-4">
                      <p className="mb-3 text-sm font-semibold text-white">{t('changePassword.requirementsTitle')}</p>
                      <ul className="space-y-2">
                        {requirements.map(({ id, valid }) => (
                          <li key={id} className={`flex items-center gap-2 text-sm ${valid ? 'text-green-400' : 'text-white/45'}`}>
                            {valid ? <Check size={14} /> : <Circle size={12} />}
                            <span>{t(`changePassword.requirements.${id}`)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <input name="confirmPassword" type="password" placeholder="Confirma tu contraseña*"
                    value={form.confirmPassword} onChange={handleChange} className={inputCls} />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3.5 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-brand/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base mt-1"
                >
                  {loading ? 'Procesando...' : 'Continuar'}
                </button>

                <p className="text-center text-xs text-white/35 leading-relaxed">
                  Puedes revisar cómo tratamos y resguardamos tus datos conforme a lo establecido en la ley{' '}
                  <a href="#" className="underline underline-offset-2 hover:text-white/60 transition-colors">
                    aquí
                  </a>
                </p>

              </form>
            </div>
          </div>

        </div>
      </div>

      <Footer dark />
    </div>
  )
}
