export function Footer({ light = false }: { light?: boolean }) {
  return (
    <footer className={`border-t ${light ? "border-white/10 bg-black/60" : "border-border bg-background"}`}>
      <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <span className={`text-sm ${light ? "text-white/35" : "text-muted-foreground"}`} style={{ fontFamily: "'Inter', sans-serif" }}>
          © 2026 Olfactura. All rights reserved.
        </span>
        <span className={`text-[0.73rem] ${light ? "text-white/35" : "text-muted-foreground"}`} style={{ fontFamily: "'DM Mono', monospace" }}>
          Email: innovation@b2bscentsimulator.com &nbsp;|&nbsp; Phone: +1-800-555-0190
        </span>
      </div>
    </footer>
  );
}
