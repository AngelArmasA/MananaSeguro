import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDarkMode } from '../../hooks/useDarkMode'
import { ArrowLeft } from 'lucide-react'
import logoCompleto from '../../assets/LOGO_MS_orange.png'

function LandingNavbar({ onLogin, onRegister, onVolver, soloVolver, compactRegister = false }) {
    const [scrolled, setScrolled] = useState(false)
    const { t, i18n } = useTranslation()
    const { dark, toggle } = useDarkMode()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    function toggleLang() {
        i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')
    }

    if (compactRegister) {
        return (
            <nav className={`sticky top-0 z-50 px-4 py-3 transition-shadow duration-300 bg-surface/90 dark:bg-[#0f0e0d]/90 backdrop-blur-md border-b border-ink/8 dark:border-white/8 ${scrolled ? 'shadow-md' : ''}`}>
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <img src={logoCompleto} alt={t('nav.logoAlt')} className="h-8 w-auto rounded-lg" />
                        <span className="font-display font-bold text-xl text-white tracking-tight">
                            {t('nav.marca')} <span className="text-brand">{t('nav.marcaAccent')}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {onVolver && (
                            <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-ink/60 transition hover:bg-ink/5 hover:text-ink dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
                                onClick={onVolver}
                            >
                                <ArrowLeft size={14} aria-hidden="true" />
                                {t('settings.back')}
                            </button>
                        )}
                        {onLogin && (
                            <button
                                type="button"
                                className="inline-flex min-h-10 items-center justify-center rounded-[10px] bg-[#1b1917] px-4 text-sm font-semibold text-[#f5efe9] transition hover:bg-[#282522] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e97816]"
                                onClick={onLogin}
                            >
                                {t('nav.iniciarSesion')}
                            </button>
                        )}
                        <button
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-ink/10 dark:border-white/10 text-ink/50 dark:text-white/50 hover:text-ink dark:hover:text-white hover:border-ink/20 dark:hover:border-white/20 transition-all cursor-pointer"
                            onClick={toggleLang}
                            aria-label={t('nav.cambiarIdioma')}>
                            {i18n.language === 'es' ? 'EN' : 'ES'}
                        </button>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className={`sticky top-0 z-50 px-4 py-3 transition-shadow duration-300 bg-surface/90 dark:bg-[#0f0e0d]/90 backdrop-blur-md border-b border-ink/8 dark:border-white/8 ${scrolled ? 'shadow-md' : ''}`}>
            <div className="container mx-auto flex justify-between items-center">

                <div className="flex items-center gap-2">
                    <img src={logoCompleto} alt={t('nav.logoAlt')} className="h-8 w-auto rounded-lg" />
                    <span className="font-display font-bold text-xl text-white tracking-tight">
                        {t('nav.marca')} <span className="text-brand">{t('nav.marcaAccent')}</span>
                    </span>
                </div>

                {soloVolver ? (
                    <div className="flex items-center gap-2">
                        <button
                            className="text-gray hover:text-ink dark:hover:text-white text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-ink/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                            onClick={onVolver}>
                            {t('nav.volverInicio')}
                        </button>
                        <button
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-ink/10 dark:border-white/10 text-ink/50 dark:text-white/50 hover:text-ink dark:hover:text-white hover:border-ink/20 dark:hover:border-white/20 transition-all cursor-pointer"
                            onClick={toggleLang}
                            aria-label={t('nav.cambiarIdioma')}>
                            {i18n.language === 'es' ? 'EN' : 'ES'}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-ink/10 dark:border-white/10 text-ink/50 dark:text-white/50 hover:text-ink dark:hover:text-white hover:border-ink/20 dark:hover:border-white/20 transition-all cursor-pointer"
                            onClick={toggleLang}
                            aria-label={t('nav.cambiarIdioma')}>
                            {i18n.language === 'es' ? 'EN' : 'ES'}
                        </button>

                        <button
                            className="text-xs font-bold px-3 py-1.5 rounded-lg border border-ink/10 dark:border-white/10 text-ink/50 dark:text-white/50 hover:text-ink dark:hover:text-white hover:border-ink/20 transition-all cursor-pointer"
                            onClick={toggle}
                            aria-label={dark ? t('nav.activarModoClaro') : t('nav.activarModoOscuro')}>
                            {dark ? '☀️' : '🌙'}
                        </button>

                        <button
                            className="hidden md:block text-gray hover:text-ink dark:hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-ink/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                            onClick={onLogin}>
                            {t('nav.iniciarSesion')}
                        </button>
                        <button
                            className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-brand/30 cursor-pointer"
                            onClick={onRegister}>
                            {t('nav.comenzarGratis')}
                        </button>
                    </div>
                )}

            </div>
        </nav>
    )
}
export default LandingNavbar