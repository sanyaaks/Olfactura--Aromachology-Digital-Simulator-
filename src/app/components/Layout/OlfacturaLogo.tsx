export function OlfacturaLogo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex flex-col leading-none">
      <span
        className={`font-bold tracking-tight ${light ? "text-white" : "text-foreground"}`}
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.45rem" }}
      >
        Olfactura
      </span>
      <span
        className={`italic font-normal ${light ? "text-white/50" : "text-muted-foreground"}`}
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.78rem", letterSpacing: "0.03em", marginTop: "2px" }}
      >
        the art of smelling
      </span>
    </div>
  );
}
