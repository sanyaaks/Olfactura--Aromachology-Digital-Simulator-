import React from "react";

const COMPOUNDS = [
  "Linalool · CAS 78-70-6",
  "Geraniol · CAS 106-24-1",
  "β-Caryophyllene · CAS 87-44-5",
  "Citronellol · CAS 106-22-9",
  "Eugenol · CAS 97-53-0",
  "Linalool · CAS 78-70-6",
  "Geraniol · CAS 106-24-1"
];

// Duplicate to ensure the track seamlessly spans across all viewport widths
const ITEMS = [...COMPOUNDS, ...COMPOUNDS];

export function CompoundTickerStrip({ onStartWizard }: { onStartWizard?: () => void } = {}) {
  return (
    <div className="relative bg-[#0d0d0d] border-y border-white/5 py-3 overflow-hidden ticker-strip-wrap select-none">
      {/* Edge gradient fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10" />

      {/* Continuously moving marquee track */}
      <div className="animate-ticker-marquee flex shrink-0 items-center">
        {/* Track 1 */}
        <div
          className="flex shrink-0 items-center gap-12 pr-12"
          style={{
            color: "#ffffff",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.15em"
          }}
        >
          {ITEMS.map((t, i) => (
            <span key={`t1-${i}`} className="whitespace-nowrap uppercase">
              {t}
            </span>
          ))}
        </div>

        {/* Track 2 (Cloned for seamless 100% infinite loop) */}
        <div
          className="flex shrink-0 items-center gap-12 pr-12"
          aria-hidden="true"
          style={{
            color: "#ffffff",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "0.15em"
          }}
        >
          {ITEMS.map((t, i) => (
            <span key={`t2-${i}`} className="whitespace-nowrap uppercase">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
