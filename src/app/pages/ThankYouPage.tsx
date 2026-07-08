import { Check, Lock, LayoutDashboard, Download } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { NavBar } from "@/app/components/Layout/NavBar";
import { Footer } from "@/app/components/Layout/Footer";
import { downloadSummaryText } from "@/app/components/SupportComponents";
import crimsonBgImg from "@/imports/download__2_.jpg";

export function ThankYouPage({
  onReturn,
  blueprint,
  user,
  onLogout,
  responses
}: {
  onReturn: () => void;
  blueprint?: any;
  user: any;
  onLogout: () => void;
  responses: any;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar onLogin={() => { }} user={user} onLogout={onLogout} onNavClick={() => onReturn()} />

      <div className="flex-1 flex items-center justify-center py-12 px-8">
        <div className="w-full max-w-2xl">

          {/* Crimson background card */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-white/10">
            {/* Background image */}
            <div className="absolute inset-0">
              <ImageWithFallback
                src={crimsonBgImg}
                alt="Deep crimson background for confirmation card"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25" />
            </div>

            {/* Content */}
            <div className="relative z-10 px-10 pt-10 pb-10 flex flex-col items-center text-center">
              {/* Ref tag */}
              <div
                className="tracking-widest uppercase mb-5"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,220,220,0.55)" }}
              >
                {blueprint?.refId ? `${blueprint.refId} · ` : 'REF #2406 · '} {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
              </div>

              {/* Success icon */}
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                style={{ background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)", backdropFilter: "blur(6px)" }}>
                <Check size={24} className="text-white" strokeWidth={2.5} />
              </div>

              <h1
                className="font-bold leading-tight mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#FAF0F0" }}
              >
                Brief Successfully Transmitted
              </h1>
              <p
                className="text-sm leading-relaxed max-w-lg mb-4"
                style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,220,220,0.72)" }}
              >
                Thank you for compiling your parameters. Your application constraints have been parsed into a machine-readable specification blueprint and successfully dispatched to the laboratory team for physical compounding.
              </p>

              {blueprint && blueprint.materials.length > 0 && (
                <div className="bg-black/30 border border-white/10 rounded-lg p-4 mb-6 w-full max-w-md text-left">
                  <div className="text-[0.65rem] text-white/50 uppercase tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>Formulation Highlights</div>
                  {blueprint.materials.map((m: any, i: number) => (
                    <div key={i} className="flex justify-between items-center mb-1 text-sm text-white">
                      <span className="text-white/90" style={{ fontFamily: "'Inter', sans-serif" }}>{m.name}</span>
                      <span className="text-white/60 text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>{m.concentration}</span>
                    </div>
                  ))}
                  <div className="mt-3 text-xs text-white/50" style={{ fontFamily: "'DM Mono', monospace" }}>
                    CALM: {blueprint.telemetry.calmAlpha} | ENERGY: {blueprint.telemetry.energyBeta}
                  </div>
                </div>
              )}

              {/* Security callout */}
              <div className="w-full rounded-xl px-6 py-4 mb-8 flex items-center justify-center gap-3"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)" }}>
                <Lock size={14} style={{ color: "rgba(255,220,220,0.55)", flexShrink: 0 }} />
                <p
                  className="font-bold italic tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", color: "#FAF0F0" }}
                >
                  Your data is safe with us
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                <button
                  onClick={onReturn}
                  className="px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-85 transition-opacity flex items-center gap-2 justify-center cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif", background: "rgba(255,255,255,0.15)", color: "#FAF0F0", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(4px)" }}
                >
                  <LayoutDashboard size={15} />
                  Return to Client Dashboard
                </button>
                <button
                  onClick={() => downloadSummaryText(blueprint, responses, user)}
                  className="px-6 py-3 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-2 justify-center cursor-pointer text-white"
                  style={{ fontFamily: "'Inter', sans-serif", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.05)" }}
                >
                  <Download size={15} />
                  Download Summary Specification Brief
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
