import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { NavBar } from "@/app/components/Layout/NavBar";
import { Footer } from "@/app/components/Layout/Footer";
import landscapeGif from "@/imports/Paisajes Idílicos.gif";
import figImg from "@/imports/European_Fig__Fragrance_Oil_for_candle_soap_making_Free_Shipping.jpg";
import parfumImg from "@/imports/PARFUM_DE_MAISON-_No__1.jpg";
import smudgeImg from "@/imports/985231164684048.jpg";
import { CompoundTickerStrip } from "@/app/components/Shared/CompoundTickerStrip";

export function HomePage({ onLogin, onStartWizard, onNavClick, user, onLogout, navigateTo }: {
  onLogin: () => void;
  onStartWizard: () => void;
  onNavClick: (anchor: string) => void;
  user: any;
  onLogout: () => void;
  navigateTo: (hash: string) => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Nav fixed to viewport */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar onLogin={onLogin} user={user} onLogout={onLogout} onNavClick={onNavClick} light />
      </div>

      {/* ── Hero: Idyllic landscape GIF full bleed ── */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={landscapeGif}
            alt="Idyllic landscape — the dark sensory universe of Olfactura"
            className="w-full h-full object-cover object-center"
          />
          {/* Layered overlays for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full py-16">
            <div className="max-w-2xl">

              <h1
                className="font-bold text-white leading-[1.08] mb-7"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", letterSpacing: "-0.02em" }}
              >
                Digitizing<br />
                Functional<br />
                <em className="italic" style={{ color: "#C4758A" }}>Scent Design</em>
              </h1>
              <p
                className="text-[0.95rem] leading-relaxed mb-9 max-w-md"
                style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.6)" }}
              >
                Align your product wellness claims with quantitative neuroscience data. Bridge the gap between creative briefs and verified chemical compound profiles.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={user ? onStartWizard : onLogin}
                  className="bg-white text-[#0a0a0a] px-7 py-3 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Access Questionnaire
                </button>
                <button
                  onClick={onStartWizard}
                  className="border border-white/30 text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors backdrop-blur-sm cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  View Demo Workflow
                </button>
              </div>
              <div className="mt-14 pt-8 border-t border-white/10 flex gap-10">
                {[["42+", "Enterprise Clients"], ["10K+", "Compounds Indexed"], ["ISO 9001", "Certified Lab"]].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{v}</div>
                    <div className="text-xs text-white/40 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8">
          <div className="flex flex-col items-center gap-1.5 opacity-30">
            <div className="w-px h-8 bg-white" />
            <span className="text-[0.6rem] text-white tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>SCROLL</span>
          </div>
        </div>
      </div>

      {/* ── About: dark, fig image right ── */}
      <section id="about" className="relative bg-[#100A14] scroll-mt-16">
        <div className="grid md:grid-cols-2 min-h-[65vh]">
          <div className="flex flex-col justify-center px-10 lg:px-16 py-16 z-10">
            <div className="text-[0.68rem] font-medium tracking-[0.18em] text-white/60 uppercase mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>
              About the Platform
            </div>
            <h2
              className="text-4xl font-bold text-white leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              From project brief to<br />
              <em className="italic" style={{ color: "#E8A0B8" }}>verified compound profile</em>
            </h2>
            <p className="text-sm leading-relaxed mb-4 max-w-sm" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.82)" }}>
              The Olfactura platform transforms raw client briefs — brand constraints, market demographics, neuro-wellness claims — into machine-readable scent specifications.
            </p>
            <p className="text-sm leading-relaxed max-w-sm" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.82)" }}>
              Each output is cross-referenced against a curated library of clinical neuroscience literature, ensuring every compound recommendation is grounded in quantitative evidence.
            </p>
            <div className="mt-8 bg-white/8 border border-white/15 rounded-xl p-5 max-w-xs">
              <div className="text-[0.68rem] text-white/55 mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>SAMPLE — REF #2406-UNL-009</div>
              {[{ name: "Linalool", score: 87 }, { name: "β-Caryophyllene", score: 74 }, { name: "Citronellol", score: 61 }].map((c) => (
                <div key={c.name} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/85" style={{ fontFamily: "'Inter', sans-serif" }}>{c.name}</span>
                    <span className="text-xs text-white/55" style={{ fontFamily: "'DM Mono', monospace" }}>{c.score}%</span>
                  </div>
                  <div className="h-px bg-white/15 rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: "#E8A0B8" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative hidden md:block">
            <ImageWithFallback
              src={figImg}
              alt="European figs on deep purple linen — richness of the fig accord"
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#100A14]/70" />
          </div>
        </div>
      </section>

      {/* ── Dynamic Compound Ticker Strip ── */}
      <CompoundTickerStrip onStartWizard={onStartWizard} />

      {/* ── Support Cards ── */}
      <section id="support" className="bg-[#0a0a0a] px-8 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">

          {/* Card A — Parfum de Maison diffuser (dark/minimal) */}
          <div className="relative rounded-2xl overflow-hidden group border border-white/8">
            <div className="absolute inset-0">
              <ImageWithFallback
                src={parfumImg}
                alt="Black ceramic incense diffuser emitting a thread of smoke — Technical Support"
                className="w-full h-full object-cover object-center opacity-40 group-hover:opacity-55 transition-opacity duration-700 scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
            </div>
            <div className="relative z-10 p-8 flex flex-col gap-4 min-h-[260px]">
              <div className="text-[0.65rem] tracking-widest text-white/30 uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>Support A</div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Technical Support & Inquiries
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)" }}>
                Reach our technical team for platform configuration, API access, and data integration queries. Response SLA: 4 business hours.
              </p>
              <button
                onClick={() => navigateTo("#/tech-query")}
                className="self-start border border-white/25 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Submit Technical Inquiry
              </button>
            </div>
          </div>

          {/* Card B — Smudge stick (lighter, airy) */}
          <div className="relative rounded-2xl overflow-hidden group border border-white/8">
            <div className="absolute inset-0">
              <ImageWithFallback
                src={smudgeImg}
                alt="Burning sage and rose bud smudge stick with rising smoke — Client Feedback"
                className="w-full h-full object-cover object-[center_30%] opacity-35 group-hover:opacity-50 transition-opacity duration-700 scale-105 group-hover:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/85 to-[#0a0a0a]/50" />
            </div>
            <div className="relative z-10 p-8 flex flex-col gap-4 min-h-[260px]">
              <div className="text-[0.65rem] tracking-widest text-white/30 uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>Support B</div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Application Feedback
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)" }}>
                Share structured feedback on compound recommendations, simulation outputs, and platform UX. Your input drives model refinements.
              </p>
              <button
                onClick={() => navigateTo("#/feedback")}
                className="self-start border border-white/25 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Give Feedback
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer light />
    </div>
  );
}
