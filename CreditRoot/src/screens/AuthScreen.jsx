import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Shield, TriangleAlert, Lock, Zap, Building2, ArrowRight, ArrowLeft } from 'lucide-react'
import Footer from './components/Footer'
import LandingNavbar from './components/LandingNavbar'
import { conectarWallet } from '../lib/wallet'
import { COUNTRY_LIST, COUNTRY_LOOKUP, getLocalizedCountryName } from '../data/countries'
import ardilla from '../assets/Ardilla_vector.png'
import pollarLogo from '../assets/polo.webp'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export function AuthScreen({ onAuth, onVolver, initialStep = 'inicio' }) {
  const { t, i18n } = useTranslation()
  const [paso, setPaso] = useState(initialStep) // 'inicio' | 'registro' | 'freighter' | 'nombre'
  const [walletAddressFreighter, setWalletAddressFreighter] = useState(null)
  const [nombre, setNombre] = useState('')
  const [formRegistro, setFormRegistro] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    password: '',
    confirmPassword: '',
    pais: 'México',
    telefono: '',
    aceptaTerminos: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [googleListo, setGoogleListo] = useState(false)
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const googleBtnRef = useRef(null)
  const selectedCountry = COUNTRY_LOOKUP[formRegistro.pais] ?? COUNTRY_LOOKUP['México']
  const selectedCountryName = getLocalizedCountryName(selectedCountry, i18n.resolvedLanguage ?? i18n.language)
  const telefonoPrefix = selectedCountry.code

  useEffect(() => {
    setPaso(initialStep)
  }, [initialStep])

  // Callback de Google , cuando el usuario selecciona su cuenta
  const handleCredentialResponse = useCallback(async (response) => {
    if (!response.credential) {
      setError(t('auth.errorSinCredencial'))
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t('auth.errorLogin'))
      localStorage.setItem('ms_usuario', JSON.stringify(data.usuario))
      onAuth(data.usuario)
    } catch (err) {
      setError(err.message || t('auth.errorLoginReintentar'))
    } finally {
      setLoading(false)
    }
  }, [onAuth, t])

  // Inicializar SDK de Google
  const inicializarGoogle = useCallback(() => {
    if (!window.google?.accounts) return
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      ux_mode: 'popup',
    })
    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: googleBtnRef.current.offsetWidth || 360,
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      })
    }
    setGoogleListo(true)
  }, [handleCredentialResponse])

  // Cargar SDK de Google
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError(t('auth.errorConfig'))
      return
    }
    if (window.google?.accounts) {
      inicializarGoogle()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = inicializarGoogle
    script.onerror = () => setError(t('auth.errorGoogleCarga'))
    document.head.appendChild(script)
  }, [inicializarGoogle, t])

  // Freighter: conectar wallet
  async function handleConectarFreighter() {
    setLoading(true)
    setError(null)
    try {
      const address = await conectarWallet()
      setWalletAddressFreighter(address)
      setPaso('nombre')
    } catch (e) {
      if (e.message.includes('Freighter no está disponible')) {
        setError(t('auth.errorFreighterNoInstalado'))
      } else if (e.message.includes('Cancelaste')) {
        setError(t('auth.errorConexionCancelada'))
      } else {
        setError(e.message ?? t('auth.errorWalletConexion'))
      }
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!nombre.trim()) {
      setError(t('auth.errorCampoRequerido', { campo: t('auth.nombreLabel') }))
      return
    }
    onAuth({ nombre: nombre.trim(), walletAddress: walletAddressFreighter })
  }

  function handleRegistroChange(e) {
    const { name, value, type, checked } = e.target
    setFormRegistro(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (error) setError(null)
  }

  async function handleSubmitRegistro(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      nombre: formRegistro.nombre.trim(),
      apellidoPaterno: formRegistro.apellidoPaterno.trim(),
      apellidoMaterno: formRegistro.apellidoMaterno.trim(),
      email: formRegistro.email.trim(),
      password: formRegistro.password,
      confirmPassword: formRegistro.confirmPassword,
      pais: formRegistro.pais.trim() || 'México',
      telefono: formRegistro.telefono.trim(),
      aceptaTerminos: formRegistro.aceptaTerminos,
    }

    if (!payload.nombre || !payload.email || !payload.password || !payload.telefono || !payload.apellidoPaterno || !payload.apellidoMaterno) {
      setError(t('auth.registro.errorCampos'))
      setLoading(false)
      return
    }

    if (payload.password !== payload.confirmPassword) {
      setError(t('auth.registro.errorPassword'))
      setLoading(false)
      return
    }

    if (!payload.aceptaTerminos) {
      setError(t('auth.registro.errorTerminos'))
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/register-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || data.message || t('auth.registro.errorCrear'))
      }

      localStorage.setItem('ms_usuario', JSON.stringify(data.usuario))
      onAuth(data.usuario)
    } catch (err) {
      setError(err.message || t('auth.registro.errorReintentar'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#12100f] min-h-screen overflow-x-hidden text-[#f5efe9]">
      {paso === 'registro' ? (
        <LandingNavbar compactRegister />
      ) : (
        <LandingNavbar soloVolver onVolver={onVolver} />
      )}

      {paso === 'registro' ? (
        <div className="min-h-screen bg-[#12100f] text-[#f0efe9]">
          <div className="mx-auto max-w-[1380px] px-4 pt-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 px-2 py-2 text-[#f2efe8]">
              <span className="text-[2.2rem] font-black tracking-[-0.04em] text-[#f3ecdf] sm:text-[2.5rem]">
                {t('nav.marca')} {t('nav.marcaAccent')}
              </span>
            </div>

            <div className="grid gap-10 pt-4 pb-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12 lg:pt-8">
              <section className="px-2 pb-2 pt-1 lg:pt-10">
                <h1 className="font-display text-[3.2rem] font-black leading-[0.9] tracking-[-0.07em] text-[#f3ecdf] sm:text-[4rem] lg:text-[6.2rem]">
                  {t('auth.registro.tituloDatos')}
                </h1>
                <h2 className="font-display text-[3.2rem] font-black leading-[0.9] tracking-[-0.07em] text-[#e4741d] sm:text-[4rem] lg:text-[6.2rem]">
                  {t('auth.registro.tituloPersonales')}
                </h2>

                <p className="mt-5 max-w-[430px] text-[1.05rem] leading-relaxed text-[#d2c9c0] sm:text-[1.35rem]">
                  {t('auth.registro.descripcion')}
                </p>

                <div className="mt-14 space-y-10">
                  <div className="border-l border-[#e4741d] pl-4">
                    <h3 className="font-display text-[2.3rem] font-black leading-none tracking-[-0.05em] text-[#f2efe8] sm:text-[2.8rem]">
                      {t('auth.registro.datosSeguros')}
                    </h3>
                    <p className="mt-3 max-w-[360px] text-[1.05rem] leading-relaxed text-[#d2c9c0] sm:text-[1.25rem]">
                      {t('auth.registro.descripcionSeguridad')}
                    </p>
                  </div>

                  <div className="border-l border-[#e4741d] pl-4">
                    <h3 className="font-display text-[2.3rem] font-black leading-none tracking-[-0.05em] text-[#f2efe8] sm:text-[2.8rem]">
                      {t('auth.registro.procesoRapido')}
                    </h3>
                    <p className="mt-3 max-w-[360px] text-[1.05rem] leading-relaxed text-[#d2c9c0] sm:text-[1.25rem]">
                      {t('auth.registro.descripcionRapido')}
                    </p>
                  </div>
                </div>
              </section>

              <section className="flex justify-center lg:justify-end lg:pr-2">
                <div className="w-full max-w-[540px] rounded-[18px] border border-[#3f3a38] bg-[#1e1c1b]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-sm sm:p-6 lg:p-7">
                  <h3 className="font-display text-[2.2rem] font-black leading-none tracking-[-0.04em] text-[#f3efe8] sm:text-[2.6rem]">
                    {t('auth.registro.tituloFormulario')}
                  </h3>

                  <form onSubmit={handleSubmitRegistro} className="mt-6 space-y-3.5">
                    {error && (
                      <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        <TriangleAlert size={16} className="mr-2 inline shrink-0" aria-hidden="true" />
                        {error}
                      </div>
                    )}

                    <input
                      name="nombre"
                      type="text"
                      placeholder={t('auth.registro.nombre')}
                      value={formRegistro.nombre}
                      onChange={handleRegistroChange}
                      className="w-full rounded-xl border border-[#4a4744] bg-[#2b2927] px-4 py-3.5 text-base text-[#f3efe8] placeholder:text-[#b6aea7] outline-none transition focus:border-[#d98a37] focus:ring-2 focus:ring-[#d98a37]/20"
                    />
                    <input
                      name="apellidoPaterno"
                      type="text"
                      placeholder={t('auth.registro.apellidoPaterno')}
                      value={formRegistro.apellidoPaterno}
                      onChange={handleRegistroChange}
                      className="w-full rounded-xl border border-[#4a4744] bg-[#2b2927] px-4 py-3.5 text-base text-[#f3efe8] placeholder:text-[#b6aea7] outline-none transition focus:border-[#d98a37] focus:ring-2 focus:ring-[#d98a37]/20"
                    />
                    <input
                      name="apellidoMaterno"
                      type="text"
                      placeholder={t('auth.registro.apellidoMaterno')}
                      value={formRegistro.apellidoMaterno}
                      onChange={handleRegistroChange}
                      className="w-full rounded-xl border border-[#4a4744] bg-[#2b2927] px-4 py-3.5 text-base text-[#f3efe8] placeholder:text-[#b6aea7] outline-none transition focus:border-[#d98a37] focus:ring-2 focus:ring-[#d98a37]/20"
                    />
                    <div className="relative">
                      <div className="flex items-center gap-2 overflow-hidden rounded-xl border border-[#4a4744] bg-[#2b2927]">
                        <button
                          type="button"
                          onClick={() => setIsCountryPickerOpen((open) => !open)}
                          className="flex h-full items-center gap-2 border-r border-[#4a4744] bg-[#292623] px-3 py-3.5 text-base font-medium text-[#efe8df] transition hover:bg-[#312e2c]"
                          aria-label={t('auth.registro.seleccionarPais')}
                        >
                          <span>{selectedCountry.flag}</span>
                          <span className="sr-only">{selectedCountryName}</span>
                          <span>{telefonoPrefix}</span>
                        </button>
                        <input
                          name="telefono"
                          type="tel"
                          placeholder={t('auth.registro.telefono')}
                          value={formRegistro.telefono}
                          onChange={handleRegistroChange}
                          className="w-full bg-transparent px-4 py-3.5 text-base text-[#f3efe8] placeholder:text-[#b6aea7] outline-none"
                        />
                      </div>

                      {isCountryPickerOpen && (
                        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-20 overflow-hidden rounded-2xl border border-[#4a4744] bg-[#1f1d1c] shadow-2xl shadow-black/40">
                          <div className="border-b border-[#4a4744] p-3">
                            <input
                              type="text"
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder={t('auth.registro.buscarPais')}
                              className="w-full rounded-lg border border-[#5a5551] bg-[#2b2927] px-3 py-2 text-sm text-[#f3efe8] placeholder:text-[#b6aea7] outline-none focus:border-[#d98a37]"
                            />
                          </div>

                          <div className="max-h-72 overflow-y-auto">
                            {COUNTRY_LIST.filter((country) => {
                              const search = countrySearch.trim().toLowerCase()
                              const localizedName = getLocalizedCountryName(country, i18n.resolvedLanguage ?? i18n.language)
                              if (!search) return true
                              return (
                                country.name.toLowerCase().includes(search) ||
                                localizedName.toLowerCase().includes(search) ||
                                country.code.replace('+', '').includes(search.replace('+', ''))
                              )
                            }).map((country) => (
                              <button
                                key={country.name}
                                type="button"
                                onClick={() => {
                                  setFormRegistro((prev) => ({ ...prev, pais: country.name }))
                                  setIsCountryPickerOpen(false)
                                  setCountrySearch('')
                                }}
                                className="flex w-full items-center justify-between gap-3 border-b border-[#363230] px-3 py-2.5 text-left text-sm text-[#f3efe8] transition hover:bg-[#2b2927] last:border-b-0"
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-lg">{country.flag}</span>
                                  <span>{getLocalizedCountryName(country, i18n.resolvedLanguage ?? i18n.language)}</span>
                                </span>
                                <span className="text-[#d8c7b4]">{country.code}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      name="email"
                      type="email"
                      placeholder={t('auth.registro.email')}
                      value={formRegistro.email}
                      onChange={handleRegistroChange}
                      className="w-full rounded-xl border border-[#4a4744] bg-[#2b2927] px-4 py-3.5 text-base text-[#f3efe8] placeholder:text-[#b6aea7] outline-none transition focus:border-[#d98a37] focus:ring-2 focus:ring-[#d98a37]/20"
                    />
                    <input
                      name="password"
                      type="password"
                      placeholder={t('auth.registro.password')}
                      value={formRegistro.password}
                      onChange={handleRegistroChange}
                      className="w-full rounded-xl border border-[#4a4744] bg-[#2b2927] px-4 py-3.5 text-base text-[#f3efe8] placeholder:text-[#b6aea7] outline-none transition focus:border-[#d98a37] focus:ring-2 focus:ring-[#d98a37]/20"
                    />
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder={t('auth.registro.confirmarPassword')}
                      value={formRegistro.confirmPassword}
                      onChange={handleRegistroChange}
                      className="w-full rounded-xl border border-[#4a4744] bg-[#2b2927] px-4 py-3.5 text-base text-[#f3efe8] placeholder:text-[#b6aea7] outline-none transition focus:border-[#d98a37] focus:ring-2 focus:ring-[#d98a37]/20"
                    />

                    <label className="flex items-start gap-3 rounded-xl border border-[#4a4744] bg-[#2b2927] px-3 py-3 text-sm text-[#f3efe8]">
                      <input
                        name="aceptaTerminos"
                        type="checkbox"
                        checked={formRegistro.aceptaTerminos}
                        onChange={handleRegistroChange}
                        className="mt-0.5 h-4 w-4 rounded border-[#7a726b] bg-[#1d1b1a] text-[#e4741d] focus:ring-[#e4741d]"
                      />
                      <span className="leading-relaxed text-[#ece2d8]">
                        {t('auth.registro.acepto')} {' '}
                        <a href="#" className="font-medium text-[#f4efe8] underline underline-offset-2">
                          {t('footer.terminos')}
                        </a>{' '}
                        {t('auth.registro.autorizacion')}
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 w-full rounded-xl bg-brand px-4 py-3.5 text-base font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {loading ? t('auth.registro.creandoCuenta') : t('auth.registro.continuar')}
                    </button>

                    <p className="pt-1 text-center text-[0.75rem] leading-relaxed text-[#b9b0a8]">
                      {t('auth.registro.politicaIntro')}{' '}
                      <a href="#" className="text-[#f2efe8] underline underline-offset-2">
                        {t('footer.privacidad')}
                      </a>
                    </p>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="hidden lg:flex flex-col justify-center anim-fade-up-1">
              <span className="inline-block bg-brand/10 text-brand-dark border border-brand/20 rounded-lg px-4 py-1.5 text-xs font-semibold tracking-wide mb-6">
                <Shield size={14} aria-hidden="true" /> {t('auth.badge')}
              </span>
              <h1 className="font-display font-black text-ink dark:text-white tracking-tight mb-4"
                style={{ fontSize: 'clamp(2.4rem,5vw,3.6rem)', lineHeight: 1.05 }}>
                {t('auth.heroTitulo')}<br />
                <em className="text-brand italic">{t('auth.heroTituloAccent')}</em>
              </h1>
              <p className="text-ink/50 dark:text-white/50 text-lg leading-relaxed max-w-md mb-8">
                {t('auth.descWallet')}
              </p>

              <div className="flex flex-col gap-3 mb-8">
                {[
                  { num: '1', text: t('auth.paso1') },
                  { num: '2', text: t('auth.paso2') },
                  { num: '3', text: t('auth.paso3') },
                  { num: '4', text: t('auth.paso4') },
                ].map(p => (
                  <div key={p.num} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-xs font-black text-brand shrink-0">
                      {p.num}
                    </span>
                    <span className="text-sm text-ink/60 dark:text-white/60">{p.text}</span>
                  </div>
                ))}
              </div>

              <img src={ardilla} alt={t('auth.mascotaAlt')} className="h-40 object-contain float-squirrel" />
            </div>

            <div className="anim-fade-up-2">
              <div className="bg-white dark:bg-white/5 rounded-3xl p-8 lg:p-10 border border-ink/8 dark:border-white/8 shadow-xl shadow-ink/5">
                {paso === 'inicio' && (
                  <div className="flex flex-col gap-5">
                    <div className="text-center mb-1">
                      <h3 className="font-display font-black text-ink dark:text-white text-2xl mb-2">
                        {t('auth.tituloWallet')} <em className="text-brand italic">{t('auth.tituloWalletAccent')}</em>
                      </h3>
                      <p className="text-ink/45 dark:text-white/45 text-sm leading-relaxed">
                        {t('auth.descNombre')}
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-500/8 border border-dashed border-red-400/40 text-red-500 text-sm text-center px-4 py-3 rounded-xl">
                        <TriangleAlert size={16} className="inline shrink-0" aria-hidden="true" /> {error}
                      </div>
                    )}

                    {loading && (
                      <div className="flex flex-col items-center gap-3 py-4">
                        <svg aria-hidden="true" className="animate-spin text-brand" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        <p className="text-sm text-ink/50 dark:text-white/50">{t('auth.conectando')}</p>
                      </div>
                    )}

                    {!loading && (
                      <>
                        <div ref={googleBtnRef} className="w-full flex justify-center" style={{ minHeight: '44px' }} />
                        {!googleListo && !error && (
                          <div className="w-full h-11 bg-ink/5 dark:bg-white/5 rounded-lg animate-pulse" />
                        )}
                      </>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: Lock, text: t('auth.trust1') },
                        { icon: Zap, text: t('auth.trust2') },
                        { icon: Building2, text: t('auth.trust3') },
                      ].map(item => {
                        const Icon = item.icon
                        return (
                          <div key={item.text} className="bg-ink/2 dark:bg-white/3 rounded-xl p-3 text-center">
                            <div className="mb-1"><Icon size={18} aria-hidden="true" className="text-ink/40 dark:text-white/40" /></div>
                            <div className="text-xs text-ink/45 dark:text-white/45 font-medium">{item.text}</div>
                          </div>
                        )
                      })}
                    </div>

                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 bg-[#111111] border border-[#2d2d2d] hover:border-[#3a3a3a] text-white font-semibold py-3 rounded-xl transition-all cursor-pointer text-sm disabled:opacity-50"
                      onClick={() => setPaso('registro')}
                      disabled={loading}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2h9a2 2 0 0 1 2 2v12.5a2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 17.5V4.5A2.5 2.5 0 0 1 6.5 2z" />
                        <path d="M8.5 8h7" />
                        <path d="M8.5 12h7" />
                      </svg>
                      Crear cuenta con correo
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-ink/8 dark:bg-white/8" />
                      <span className="text-xs text-ink/25 dark:text-white/25">{t('auth.opcionesAvanzadas')}</span>
                      <div className="flex-1 h-px bg-ink/8 dark:bg-white/8" />
                    </div>

                    <button
                      className="w-full flex items-center justify-center gap-2 border border-ink/8 dark:border-white/8 hover:border-ink/20 dark:hover:border-white/20 text-ink/35 dark:text-white/35 hover:text-ink/60 dark:hover:text-white/60 font-medium py-3 rounded-xl transition-all cursor-pointer text-sm disabled:opacity-50"
                      onClick={() => setPaso('freighter')}
                      disabled={loading}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                      </svg>
                      {t('auth.usarFreighter')}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 pt-1">
                      <span className="text-xs text-ink/25 dark:text-white/25">{t('auth.poweredBy')}</span>
                      <a href="https://pollar.xyz" target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <img src={pollarLogo} alt={t('auth.pollarAlt')} className="h-8 w-auto opacity-60 hover:opacity-90 transition-opacity dark:invert" />
                      </a>
                    </div>
                  </div>
                )}

                {paso === 'freighter' && (
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e3730d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        <line x1="12" y1="12" x2="12" y2="16" />
                        <line x1="10" y1="14" x2="14" y2="14" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-display font-black text-ink dark:text-white text-2xl mb-2">{t('auth.conectar')}</h3>
                      <p className="text-ink/45 dark:text-white/45 text-sm leading-relaxed max-w-xs mx-auto">{t('auth.descWallet')}</p>
                    </div>
                    {error && (
                      <div className="w-full bg-red-500/8 border border-dashed border-red-400/40 text-red-500 text-sm text-center px-4 py-3 rounded-xl">
                        <TriangleAlert size={16} className="inline shrink-0" aria-hidden="true" /> {error}
                        {error.includes('freighter.app') && (
                          <a href="https://freighter.app" target="_blank" rel="noopener noreferrer" className="block mt-2 text-brand underline font-medium">
                            {t('auth.instalar')} <ArrowRight size={14} className="inline" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    )}
                    <button
                      className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-4 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-brand/30 cursor-pointer disabled:opacity-50"
                      onClick={handleConectarFreighter}
                      disabled={loading}>
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg aria-hidden="true" className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                          {t('auth.conectando')}
                        </span>
                      ) : t('auth.conectar')}
                    </button>
                    <button className="text-sm text-ink/30 dark:text-white/30 hover:text-ink/60 transition-colors cursor-pointer"
                      onClick={() => { setPaso('inicio'); setError(null) }}>
                      <ArrowLeft size={14} className="inline" aria-hidden="true" /> {t('nav.volverInicio')}
                    </button>
                  </div>
                )}

                {paso === 'nombre' && (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="bg-green-500/8 border border-green-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-green-700 font-semibold mb-0.5">{t('auth.walletConectada')}</p>
                        <p className="text-xs text-ink/40 dark:text-white/40 font-mono truncate">{walletAddressFreighter}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display font-black text-ink dark:text-white text-2xl mb-1">
                        {t('auth.tituloNombre')} <em className="text-brand italic">{t('auth.tituloNombreAccent')}</em>
                      </h3>
                      <p className="text-ink/40 dark:text-white/40 text-sm">{t('auth.descNombre')}</p>
                    </div>
                    <div>
                      <label htmlFor="auth-nombre" className="block text-xs font-semibold text-ink/40 dark:text-white/40 uppercase tracking-widest mb-2">{t('auth.nombreLabel')}</label>
                      <input
                        id="auth-nombre"
                        className="w-full rounded-xl px-5 py-3.5 text-base bg-white dark:bg-white/5 outline-none transition-all duration-200 border border-ink/10 dark:border-white/10 focus:border-brand focus:ring-2 focus:ring-brand/20 text-ink dark:text-white"
                        placeholder={t('auth.nombrePlaceholder')}
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        autoFocus
                      />
                    </div>
                    {error && (
                      <div className="bg-red-500/8 border border-dashed border-red-400/40 text-red-500 text-sm text-center px-4 py-3 rounded-xl"><TriangleAlert size={16} className="inline shrink-0" aria-hidden="true" /> {error}</div>
                    )}
                    <button type="submit" className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-4 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-brand/30 cursor-pointer">
                      {t('auth.entrar')}
                    </button>
                    <button type="button" className="text-sm text-ink/30 dark:text-white/30 hover:text-ink/60 dark:hover:text-white/60 transition-colors cursor-pointer"
                      onClick={() => { setPaso('inicio'); setError(null) }}>
                      {t('auth.cambiarWallet')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
