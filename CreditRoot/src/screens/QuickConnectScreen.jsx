import LandingNavbar from './components/LandingNavbar'
import Footer from './components/Footer'

export function QuickConnectScreen() {
  return (
    <div className="min-h-screen bg-[#12100f] text-[#f5efe9]">
      <LandingNavbar compactRegister />

      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <section className="px-1 pt-6 lg:pt-10">
            <h1 className="font-display text-[3.1rem] font-black leading-[0.9] tracking-[-0.07em] text-[#f5efe8] sm:text-[4.2rem] lg:text-[6rem]">
              Conexión
            </h1>
            <h2 className="font-display text-[3.1rem] font-black leading-[0.9] tracking-[-0.07em] text-[#e4741d] sm:text-[4.2rem] lg:text-[6rem]">
              rápida
            </h2>

            <p className="mt-5 max-w-[470px] text-[1.1rem] leading-relaxed text-[#d2c7bd] sm:text-[1.35rem]">
              Conecta una cuenta para ser beneficiaria en caso de<br className="hidden sm:block" />
              descenso con tu MsID.
            </p>
          </section>

          <section className="flex justify-center">
            <div className="w-full max-w-[440px] rounded-[22px] border border-[#2f2a29] bg-[#171513]/90 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm sm:p-6">
              <div className="mb-4 text-[1.75rem] font-black tracking-[-0.04em] text-[#f3efe8]">
                MsID
              </div>

              <div className="mb-2 rounded-xl border border-[#4a4541] bg-[#2a2725] px-4 py-3.5 text-[1.05rem] font-medium text-[#f3efe8] opacity-90">
                MS-0324-DR
              </div>

              <p className="mb-4 text-xs text-[#b6aba2]">Ejemplo: MS-0324-DR</p>

              <div className="flex items-start gap-3 rounded-xl border border-[#483f39] bg-[#1d1a19] px-3 py-3 text-sm text-[#f0e7de]">
                <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded border border-[#d9d1c7] bg-[#1d1a19]" />
                <span className="leading-relaxed text-[#f0e7de] opacity-80">
                  Acepto otorgar mi beneficio como beneficiario generado a la persona del MsID.
                </span>
              </div>

              <div className="mt-5 w-full rounded-xl bg-[#e4741d] px-4 py-3.5 text-center text-base font-semibold text-white opacity-80">
                Otorgar beneficio
              </div>

              <p className="mt-4 text-center text-[0.72rem] leading-relaxed text-[#b6aba2]">
                Puedes cambiar tu beneficiario más adelante en la configuración, recuerda que los cambios<br className="hidden sm:block" />
                están sujetos a revisión de seguridad.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
