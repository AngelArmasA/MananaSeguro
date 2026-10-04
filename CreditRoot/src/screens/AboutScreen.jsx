import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Camera, Mail } from 'lucide-react'
import brandLogo from '../assets/LOGO_MS.png'
import whiteLogo from '../assets/LOGO_MS_white.png'
import stellarLogo from '../assets/LOGO_Stellar.png'
import bafLogo from '../assets/LOGO_BAF.png'
import etherfuseLogo from '../assets/LOGO_Etherfuse.png'

const teamMembers = ['member1', 'member2', 'member3', 'member4', 'member5']

const socialLinks = [
  { id: 'instagram', href: 'https://www.instagram.com/mananaseguro_mx', mark: <Camera size={19} aria-hidden="true" /> },
  { id: 'facebook', href: 'https://www.facebook.com/61573338863765/', mark: <span aria-hidden="true">f</span> },
  { id: 'linkedin', href: 'https://linkedin.com/company/mananaseguro', mark: <span aria-hidden="true" className="text-[0.72rem] font-black">in</span> },
  { id: 'x', href: 'https://x.com/mananaseguro_mx', mark: <span aria-hidden="true" className="text-lg">X</span> },
  { id: 'correo', href: 'mailto:contactomananaseguro@gmail.com', mark: <Mail size={18} aria-hidden="true" /> },
]

export function AboutScreen() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  function toggleLanguage() {
    i18n.changeLanguage(i18n.resolvedLanguage?.startsWith('es') ? 'en' : 'es')
  }

  return (
    <div className="min-h-screen bg-[#100f0e] text-[#f4f0ec]">
      <header className="flex h-[60px] items-center justify-between border-b border-white/10 px-4 sm:px-8">
        <div className="flex items-center gap-2 sm:gap-5">
          <button
            type="button"
            onClick={() => navigate(location.state?.from || '/')}
            className="flex h-9 items-center gap-1 rounded-lg px-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white"
            aria-label={t('about.back')}
          >
            <ArrowLeft size={17} aria-hidden="true" />
            <span className="hidden sm:inline">{t('about.back')}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-left"
            aria-label={t('about.goHome')}
          >
            <img src={whiteLogo} alt="" className="h-8 w-8 object-contain" />
            <span className="text-lg font-bold text-white sm:text-xl">Mañana Seguro</span>
          </button>
        </div>
        <button
          type="button"
          onClick={toggleLanguage}
          className="h-9 min-w-10 rounded-lg border border-white/25 px-2 text-xs font-semibold transition hover:border-white/60 hover:bg-white/5"
          aria-label={t('nav.cambiarIdioma')}
        >
          {i18n.resolvedLanguage?.startsWith('es') ? 'EN' : 'ES'}
        </button>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-60px)] w-full max-w-[1240px] items-center gap-10 px-5 py-10 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12">
        <section className="flex flex-col justify-center" aria-labelledby="about-promise">
          <div className="mb-9 flex items-center gap-4">
            <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[24px] bg-[#e97816] shadow-[0_12px_28px_rgba(233,120,22,0.22)]">
              <img src={brandLogo} alt="" className="h-12 w-12 object-contain" />
            </span>
            <span className="text-[1.55rem] font-black leading-none sm:text-[1.9rem]">MañanaSeguro.</span>
          </div>
          <h1 id="about-promise" className="max-w-[540px] text-[2.8rem] font-black leading-[1.12] sm:text-[3.8rem] lg:text-[4.3rem]">
            <span className="block">{t('about.promise1')} <span className="text-[#e97816]">{t('about.promiseAccent1')}</span></span>
            <span className="block">{t('about.promise2')} <span className="text-[#e97816]">{t('about.promiseAccent2')}</span></span>
            <span className="block">{t('about.promise3')} <span className="text-[#e97816]">{t('about.promiseAccent3')}</span></span>
          </h1>
        </section>

        <section className="w-full rounded-[24px] bg-white/[0.035] px-5 py-7 sm:px-8 sm:py-9" aria-labelledby="about-title">
          <h2 id="about-title" className="text-center text-[2rem] font-bold leading-tight sm:text-[2.4rem]">
            {t('about.title')}
          </h2>

          <div className="mt-5 flex flex-col items-center text-center">
            <span className="flex h-[76px] w-[76px] items-center justify-center rounded-[22px] bg-[#e97816]">
              <img src={brandLogo} alt={t('nav.logoAlt')} className="h-12 w-12 object-contain" />
            </span>
            <p className="mt-3 text-sm font-semibold">{t('about.company')}</p>
            <p className="mt-5 text-xs text-white/45">{t('about.developedBy')}</p>
          </div>

          <ul className="mx-auto mt-3 grid max-w-[600px] grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3" aria-label={t('about.teamTitle')}>
            {teamMembers.map((member) => (
              <li key={member} className="min-w-0 border-l border-[#e97816]/60 pl-2.5">
                <p className="break-words text-[0.78rem] leading-snug text-white/55">{t(`about.team.${member}`)}</p>
                <p className="mt-1 break-words text-xs font-semibold text-white/85">{t('about.teamRole')}</p>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-white/10 pt-5">
            <h3 className="text-center text-sm font-medium text-white/70">{t('about.partners')}</h3>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              <div className="flex flex-col items-center gap-2 text-xs font-semibold text-white/80">
                <span className="flex h-12 w-24 items-center justify-center rounded-md border border-dashed border-white/20 bg-black/20">
                  <img src={stellarLogo} alt="" aria-hidden="true" className="h-8 w-20 object-contain" />
                </span>
                <span>Stellar</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-xs font-semibold text-white/80">
                <span className="flex h-12 w-24 items-center justify-center rounded-md border border-dashed border-white/20 bg-black/20">
                  <img src={bafLogo} alt="" aria-hidden="true" className="h-8 w-20 object-contain" />
                </span>
                <span>BAF</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-xs font-semibold text-white/80">
                <span className="flex h-12 w-24 items-center justify-center rounded-md border border-dashed border-white/20 bg-black/20">
                  <img src={etherfuseLogo} alt="" aria-hidden="true" className="h-8 w-20 object-contain" />
                </span>
                <span>Etherfuse</span>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <h3 className="text-center text-sm font-medium text-white/70">{t('about.socialTitle')}</h3>
            <ul className="mt-3 flex flex-wrap justify-center gap-2.5">
              {socialLinks.map(({ id, href, mark }) => (
                <li key={id}>
                  <a
                    href={href}
                    target={id === 'correo' ? undefined : '_blank'}
                    rel={id === 'correo' ? undefined : 'noopener noreferrer'}
                    aria-label={t(`footer.social.${id}`)}
                    title={t(`footer.social.${id}`)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e97816] text-white transition hover:bg-[#f08727] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {mark}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}