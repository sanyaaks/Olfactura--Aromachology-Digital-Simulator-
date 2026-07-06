import { useState, useEffect, useRef } from "react";
import { Check, X, Lock, Eye, EyeOff, ChevronDown, Download, LayoutDashboard } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { NeuroRadarChart } from "@/app/components/Charts/NeuroRadarChart";
import { OptionGrid, MultiSelectOptionGrid, downloadSummaryText, TechQueryPage, FeedbackPage } from "@/app/components/SupportComponents";

// Image imports — each used exactly once across all 4 screens
import kilianImg from "@/imports/Smoking_Hot_-_Smoky_Perfume_-_The_Smokes___KILIAN_PARIS-2.jpg";          // Hero BG (HD)
import landscapeGif from "@/imports/Paisajes Idílicos.gif";                                                // Idyllic Landscape GIF
import figImg from "@/imports/European_Fig__Fragrance_Oil_for_candle_soap_making_Free_Shipping.jpg";       // About section
import parfumImg from "@/imports/PARFUM_DE_MAISON-_No__1.jpg";                                             // Support Card A
import smudgeImg from "@/imports/985231164684048.jpg";                                                     // Support Card B
import lilyImg from "@/imports/Dark_Pink_Lily_Desktop_Wallpaper_-_Floral_Photography_Art-1.jpg";           // Login modal
import orangeImg from "@/imports/Orangenbl_te___die_sinnliche_Seele_von_YSL_Libre-1.jpg";                  // Wizard banner
import vanillaImg from "@/imports/Vanilla________Unraveling_the_essence_of_-1.jpg";                        // Wizard sidebar P1
import honeyImg from "@/imports/POCARANO_Rahat_Lokum_perfume_mist_NOTES__________________________________________-1.jpg"; // Wizard sidebar P2
import bемhausImg from "@/imports/8092474327694818.jpg";                                                   // Wizard sidebar P3
import orchidImg from "@/imports/Produtos_Importados_Originais_Victoria_s_Secret____.jpg";                 // Thank You header
import crimsonBgImg from "@/imports/download__2_.jpg";                                                     // Thank You card background

type Screen = "home" | "wizard" | "thankyou" | "tech-query" | "feedback";
type Phase = 1 | 2 | 3;

// ─── Brand logo component ─────────────────────────────────────────────────────
function OlfacturaLogo({ light = false }: { light?: boolean }) {
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

// ─── Nav ─────────────────────────────────────────────────────────────────────
function NavBar({ onLogin, user, onLogout, onNavClick, light = false }: {
  onLogin: () => void;
  user: any;
  onLogout: () => void;
  onNavClick: (anchor: string) => void;
  light?: boolean;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);
  
  return (
    <header
      className={`w-full border-b sticky top-0 z-40 backdrop-blur-sm ${
        light
          ? "border-white/10 bg-black/50"
          : "border-border bg-background/85"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <button onClick={() => onNavClick("home")} className="flex flex-col leading-none text-left bg-transparent border-0 cursor-pointer p-0">
          <OlfacturaLogo light={light} />
        </button>
        <nav className="hidden md:flex items-center gap-8">
          {["About", "Support"].map((link) => (
            <button
              key={link}
              onClick={() => onNavClick(link.toLowerCase().replace(" ", "-"))}
              className={`text-sm cursor-pointer transition-colors font-medium bg-transparent border-0 outline-none ${
                light ? "text-white/55 hover:text-white" : "text-foreground/60 hover:text-foreground"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link}
            </button>
          ))}
        </nav>
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                light
                  ? "bg-white/10 border-white/20 text-white hover:bg-white/25"
                  : "bg-card border-border text-foreground hover:bg-secondary/80"
              }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="max-w-[120px] truncate">{user.name}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#FAF7F2] border border-border rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150 text-foreground">
                <div className="flex flex-col gap-1 pb-3 border-b border-border">
                  <span className="text-sm font-bold truncate">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  <span className="text-xs text-accent font-semibold mt-1 bg-accent/10 px-2 py-0.5 rounded self-start">
                    {user.company_name || "Independent Client"}
                  </span>
                </div>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDropdown(false);
                      onLogout();
                    }}
                    className="w-full text-left text-sm font-medium text-red-500 hover:text-red-700 transition-colors py-1.5 cursor-pointer bg-transparent border-0 block"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLogin}
            className={`text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80 cursor-pointer ${
              light
                ? "bg-white/15 text-white border border-white/25 backdrop-blur-sm"
                : "bg-primary text-primary-foreground"
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Client Login / Sign In
          </button>
        )}
      </div>
    </header>
  );
}

function Footer({ light = false }: { light?: boolean }) {
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

// ─── Select primitive ─────────────────────────────────────────────────────────
function Select({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-card border border-border text-foreground text-sm px-4 py-2.5 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-ring transition"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <option value="">— Select —</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

// ─── SCREEN 1: Homepage ───────────────────────────────────────────────────────
function HomePage({ onLogin, onStartWizard, onNavClick, user, onLogout, navigateTo }: {
  onLogin: () => void;
  onStartWizard: () => void;
  onNavClick: (anchor: string) => void;
  user: any;
  onLogout: () => void;
  navigateTo: (hash: string) => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">

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

        {/* Nav on top of hero */}
        <div className="relative z-10">
          <NavBar onLogin={onLogin} user={user} onLogout={onLogout} onNavClick={onNavClick} light />
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-8 w-full py-16">
            <div className="max-w-2xl">
              <div
                className="text-[0.68rem] font-medium tracking-[0.2em] text-white/40 uppercase mb-7"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                B2B Enterprise Scientific Platform
              </div>
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
                  Access Client Portal
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

      {/* ── Compound ticker strip ── */}
      <div className="bg-[#0d0d0d] border-y border-white/5 py-3 overflow-hidden">
        <div className="flex gap-12 items-center" style={{ color: "#ffffff", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.15em" }}>
          {["Linalool · CAS 78-70-6", "Geraniol · CAS 106-24-1", "β-Caryophyllene · CAS 87-44-5", "Citronellol · CAS 106-22-9", "Eugenol · CAS 97-53-0", "Linalool · CAS 78-70-6", "Geraniol · CAS 106-24-1"].map((t, i) => (
            <span key={i} className="whitespace-nowrap uppercase">{t}</span>
          ))}
        </div>
      </div>

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
                Client Feedback Portal
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)" }}>
                Share structured feedback on compound recommendations, simulation outputs, and platform UX. Your input drives model refinements.
              </p>
              <button
                onClick={() => navigateTo("#/feedback")}
                className="self-start border border-white/25 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Open Feedback Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer light />
    </div>
  );
}

// ─── SCREEN 2: Login Modal ────────────────────────────────────────────────────
function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [showPw, setShowPw] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setErrorMsg("");
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (isSignUp) {
      const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;
      if (!pw.match(pwRegex)) {
        setErrorMsg("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character, with a minimum length of 6 characters.");
        return;
      }
    }

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const body = isSignUp ? { email, password: pw, name, company_name: companyName } : { email, password: pw };
      
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (data.status === 'success') {
        localStorage.setItem('olfactura_token', data.token);
        onSuccess();
      } else {
        setErrorMsg(data.error || "Authentication failed");
      }
    } catch (e) {
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#FAF7F2] rounded-2xl shadow-2xl w-full max-w-[560px] mx-4 overflow-hidden flex z-50">

        {/* Left: dark pink lily strip */}
        <div className="hidden sm:block w-44 flex-shrink-0 relative">
          <ImageWithFallback
            src={lilyImg}
            alt="Dark pink lilies on black — atmospheric side panel"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-6 left-4 right-4">
            <OlfacturaLogo light />
          </div>
        </div>

        {/* Right: form */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[90vh] text-foreground">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                {isSignUp ? "Register Account" : "Corporate Client Access"}
              </h2>
              <p className="text-xs text-muted-foreground mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Secure enterprise portal authentication
              </p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 mt-1 cursor-pointer bg-transparent border-0">
              <X size={18} />
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 text-xs font-semibold text-red-600 bg-red-100 p-3 rounded-lg border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Company Name</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition" />
                </div>
              </>
            )}
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                Corporate Client ID / Email
              </label>
              <input
                type="email"
                placeholder="e.g., developer@unilever.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">
                Secure Access Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-2.5 rounded-lg pr-16 focus:outline-none focus:ring-2 focus:ring-ring transition"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {isSignUp && (
                <span className="text-[0.7rem] text-muted-foreground leading-snug">
                  Must be at least 6 characters, with 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol.
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleSubmit}
              className="w-full bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-lg hover:opacity-85 transition-opacity cursor-pointer border-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {isSignUp ? "Register Account" : "Authenticate & Open Workspace"}
            </button>
            <div className="text-center">
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors cursor-pointer bg-transparent border-0" style={{ fontFamily: "'Inter', sans-serif" }}>
                {isSignUp ? "Already have an account? Login" : "Request Enterprise Portal Access"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 3: Wizard ────────────────────────────────────────────────────────
// ─── SCREEN 3: Wizard ────────────────────────────────────────────────────────
function WizardPage({
  onSubmit,
  user,
  onLogout,
  phase,
  setPhase,
  vehicle, setVehicle,
  vehicleOther, setVehicleOther,
  demographicAge, setDemographicAge,
  demographicAgeOther, setDemographicAgeOther,
  demographicGender, setDemographicGender,
  demographicGenderOther, setDemographicGenderOther,
  demographicGeo, setDemographicGeo,
  demographicGeoOther, setDemographicGeoOther,
  priceTier, setPriceTier,
  priceTierOther, setPriceTierOther,
  claim, setClaim,
  claimOther, setClaimOther,
  emotions, setEmotions,
  emotionsOther, setEmotionsOther,
  clinical, setClinical,
  clinicalDetails, setClinicalDetails,
  environment, setEnvironment,
  environmentOther, setEnvironmentOther,
  lifecycle, setLifecycle,
  restrictions, setRestrictions,
  baseNotePreference, setBaseNotePreference,
  baseNotePreferenceOther, setBaseNotePreferenceOther,
  navigateTo
}: {
  onSubmit: (blueprint: any) => void;
  user: any;
  onLogout: () => void;
  phase: Phase;
  setPhase: React.Dispatch<React.SetStateAction<Phase>>;
  vehicle: string; setVehicle: (v: string) => void;
  vehicleOther: string; setVehicleOther: (v: string) => void;
  demographicAge: string; setDemographicAge: (v: string) => void;
  demographicAgeOther: string; setDemographicAgeOther: (v: string) => void;
  demographicGender: string; setDemographicGender: (v: string) => void;
  demographicGenderOther: string; setDemographicGenderOther: (v: string) => void;
  demographicGeo: string; setDemographicGeo: (v: string) => void;
  demographicGeoOther: string; setDemographicGeoOther: (v: string) => void;
  priceTier: string; setPriceTier: (v: string) => void;
  priceTierOther: string; setPriceTierOther: (v: string) => void;
  claim: string; setClaim: (v: string) => void;
  claimOther: string; setClaimOther: (v: string) => void;
  emotions: string[]; setEmotions: React.Dispatch<React.SetStateAction<string[]>>;
  emotionsOther: string; setEmotionsOther: (v: string) => void;
  clinical: string; setClinical: (v: string) => void;
  clinicalDetails: string; setClinicalDetails: (v: string) => void;
  environment: string; setEnvironment: (v: string) => void;
  environmentOther: string; setEnvironmentOther: (v: string) => void;
  lifecycle: number; setLifecycle: (v: number) => void;
  restrictions: string; setRestrictions: (v: string) => void;
  baseNotePreference: string; setBaseNotePreference: (v: string) => void;
  baseNotePreferenceOther: string; setBaseNotePreferenceOther: (v: string) => void;
  navigateTo: (hash: string) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('olfactura_token');
      const res = await fetch("http://localhost:3001/api/simulate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          phase1: {
            vehicle: vehicle === "Other" ? vehicleOther : vehicle,
            demographicAge: demographicAge === "Other" ? demographicAgeOther : demographicAge,
            demographicGender: demographicGender === "Other" ? demographicGenderOther : demographicGender,
            demographicGeo: demographicGeo === "Other" ? demographicGeoOther : demographicGeo,
            priceTier: priceTier === "Other" ? priceTierOther : priceTier,
          },
          phase2: {
            claim: claim === "Other" ? claimOther : claim,
            emotions: emotions.map(e => e === "Other" ? emotionsOther : e),
            clinical: clinical,
            clinicalDetails: clinical === "yes" ? clinicalDetails : ""
          },
          phase3: {
            environment: environment === "Other" ? environmentOther : environment,
            lifecycle,
            restrictions,
            baseNotePreference: baseNotePreference === "Other" ? baseNotePreferenceOther : baseNotePreference
          }
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        onSubmit(data.blueprint);
      } else {
        onSubmit(null);
      }
    } catch (e) {
      console.error(e);
      onSubmit(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEmotion = (e: string) =>
    setEmotions((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);

  const phases = [
    { num: 1, label: "Brand & Market Constraints" },
    { num: 2, label: "Neuro-Metric & Wellness Objectives" },
    { num: 3, label: "Volatility & Sensory Environment" },
  ];

  const sidebarImg = phase === 1 ? vanillaImg : phase === 2 ? honeyImg : bемhausImg;
  const sidebarAlt = phase === 1
    ? "Vanilla beans in cream milk — brand and market category"
    : phase === 2
    ? "Honey, rose petals and Turkish delight — neuro-metric objectives"
    : "Ingredient flat lay with fragrance sprays — sensory environment category";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar onLogin={() => {}} user={user} onLogout={onLogout} onNavClick={(anchor) => navigateTo(`#/${anchor}`)} />

      {/* Banner + stepper — plain background */}
      <div className="border-b border-border">
        {/* Banner text — above stepper */}
        <div className="px-8 pt-8 pb-4 max-w-7xl mx-auto text-foreground">
          <div className="text-[0.65rem] tracking-widest text-muted-foreground uppercase mb-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>
            Configuration Wizard
          </div>
          <h2 className="text-2xl font-bold text-black" style={{ fontFamily: "'Playfair Display', serif" }}>
            Build Your Scent Specification
          </h2>
        </div>

        {/* Stepper — transparent bg */}
        <div className="py-5 px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start justify-between relative">
              <div className="absolute left-5 right-5 top-5 h-px bg-border z-0" />
              {phases.map((p) => {
                const done = phase > p.num;
                const active = phase === p.num;
                return (
                  <button
                    key={p.num}
                    onClick={() => {
                      if (p.num < phase || (p.num === 2 && vehicle) || (p.num === 3 && claim && emotions.length > 0)) {
                        navigateTo(`#/wizard/phase-${p.num}`);
                      }
                    }}
                    className="relative z-10 flex flex-col items-center gap-2 flex-1 bg-transparent border-none outline-none cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all shadow-sm ${
                        done ? "bg-accent border-accent text-white"
                        : active ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-muted-foreground"
                      }`}
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {done ? <Check size={15} /> : p.num}
                    </div>
                    <span
                      className={`text-xs text-center leading-snug max-w-[120px] font-medium ${
                        active ? "text-black font-semibold" : done ? "text-neutral-700" : "text-neutral-400"
                      }`}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Form + sidebar */}
      <div className="flex-1 py-10 px-8">
        <div className="max-w-5xl mx-auto flex gap-8 items-start">

          {/* Sticky sidebar with swapping image */}
          <div className="hidden lg:block w-52 flex-shrink-0 sticky top-24 text-foreground">
            <div className="rounded-2xl overflow-hidden h-72 relative border border-border/50 shadow-sm">
              <ImageWithFallback
                src={sidebarImg}
                alt={sidebarAlt}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C0F1E]/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[0.6rem] text-white/45 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {phase === 1 ? "CATEGORY 01" : phase === 2 ? "CATEGORY 02" : "CATEGORY 03"}
                </div>
                <div className="text-sm font-semibold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {phase === 1 ? "Brand & Market" : phase === 2 ? "Neuro-Metric" : "Sensory Env."}
                </div>
              </div>
            </div>
            <div className="mt-4 bg-card border border-border rounded-xl p-4">
              <div className="text-[0.63rem] text-muted-foreground mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>COMPLETION</div>
              <div className="flex gap-1">
                {[1, 2, 3].map((n) => (
                  <div key={n} className={`flex-1 h-1.5 rounded-full transition-colors ${n < phase ? "bg-accent" : n === phase ? "bg-primary" : "bg-secondary"}`} />
                ))}
              </div>
              <div className="text-xs text-muted-foreground mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>Category {phase} of 3</div>
            </div>
          </div>

          {/* Main form card */}
          <div className="flex-1 bg-card border border-border rounded-2xl p-10 shadow-sm text-foreground">

            {phase === 1 && (
              <div className="space-y-8">
                <div>
                  <div className="text-[0.67rem] font-medium text-muted-foreground uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Category 1</div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Brand & Market Constraints</h2>
                </div>

                {/* Q1: Product Vehicle */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    1. What is the final consumer product format/medium?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <OptionGrid
                    options={[
                      "Roll-On/Pulse-Point Oil", "Cleansing Gel/Body Wash", "Emulsion (Lotion/Cream/Balm)", 
                      "Candle/Wax Melt", "Room Spray/Mist (Ambient Aersol)", "Reed Diffuser/Passive Aroma Plugin", 
                      "Solid Perfume/Wax Cologne", "Bath Salts/Bath Bomb/Shower Steamer", 
                      "Essential Oil Blend/Concentrate (For Ultrasonic Diffusers)", "Scented Body/Face Wipe", "Other"
                    ]}
                    selectedValue={vehicle}
                    onChange={setVehicle}
                  />
                  {vehicle === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      required
                      value={vehicleOther}
                      onChange={(e) => setVehicleOther(e.target.value)}
                      className="mt-2 w-full max-w-sm bg-background border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>

                {/* Q2: Target Demographic (Age) */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    2. Who is the target demographic by age group?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <OptionGrid
                    options={[
                      "Children & Toddlers (Ages 0–12)", "Teens & Adolescents (Ages 13–17)", "Young Adults (Ages 18–24)",
                      "Early-Career Professionals (Ages 25–34)", "Mid-Career Professionals (Ages 35–44)",
                      "Mature Adults (Ages 45–54)", "Older Adults/Pre-Retirees (Ages 55–64)",
                      "Senior Demographics (Ages 65+)", "Other"
                    ]}
                    selectedValue={demographicAge}
                    onChange={setDemographicAge}
                  />
                  {demographicAge === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      required
                      value={demographicAgeOther}
                      onChange={(e) => setDemographicAgeOther(e.target.value)}
                      className="mt-2 w-full max-w-sm bg-background border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>

                {/* Q3: Target Demographic (Gender) */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    3. Who is the target demographic by gender positioning?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <OptionGrid
                    options={[
                      "Feminine-Marketed", "Masculine-Marketed", "Unisex/Gender-Neutral", "Other"
                    ]}
                    selectedValue={demographicGender}
                    onChange={setDemographicGender}
                  />
                  {demographicGender === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      required
                      value={demographicGenderOther}
                      onChange={(e) => setDemographicGenderOther(e.target.value)}
                      className="mt-2 w-full max-w-sm bg-background border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>

                {/* Q4: Target Demographic (Geo) */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    4. Who is the target demographic by geographic lifestyle?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <OptionGrid
                    options={[
                      "Urban (High-Density/Metro Areas)", "Suburban (Residential/Family Communities)",
                      "Rural/Countryside", "Coastal/Beachfront Environments",
                      "Extreme Climate/Alpine Environments", "Nomadic/Frequent Traveler Segment", "Other"
                    ]}
                    selectedValue={demographicGeo}
                    onChange={setDemographicGeo}
                  />
                  {demographicGeo === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      required
                      value={demographicGeoOther}
                      onChange={(e) => setDemographicGeoOther(e.target.value)}
                      className="mt-2 w-full max-w-sm bg-background border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>

                {/* Q5: Retail Price Tier */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    5. What is the intended retail price tier?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <OptionGrid
                    options={[
                      "Mass Market (Value/Budget-Friendly)", "Masstige (Mass Prestige/Affordable Premium)",
                      "Prestige (Department Store Standard)", "Luxury (High-End Designer)",
                      "Ultra-Luxury/Niche (Exclusive/Haute Parfumerie)",
                      "Direct-to-Consumer Refillable (Value-Loop Pricing)", "Other"
                    ]}
                    selectedValue={priceTier}
                    onChange={setPriceTier}
                  />
                  {priceTier === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      required
                      value={priceTierOther}
                      onChange={(e) => setPriceTierOther(e.target.value)}
                      className="mt-2 w-full max-w-sm bg-background border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>
              </div>
            )}

            {phase === 2 && (
              <div className="space-y-8">
                <div>
                  <div className="text-[0.67rem] font-medium text-muted-foreground uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Category 2</div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Neuro-Metric & Wellness Objectives</h2>
                </div>

                {/* Q6: Primary Functional Claim */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    6. What is the primary functional wellness claim?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <OptionGrid
                    options={[
                      "Anxiety & Stress Reduction", "Sleep, Rest & Relaxation Optimization",
                      "Focus, Cognitive Clarity & Performance", "Energy, Alertness & Vitality Induction",
                      "Mood Elevation & Happiness Enhancement", "Appetite Regulation/Mindfulness Support",
                      "Sensual Arousal & Intimacy Enhancement", "Respiratory Comfort/Clear Breathing",
                      "Jet Lag/Circadian Rhythm Reset", "Other"
                    ]}
                    selectedValue={claim}
                    onChange={setClaim}
                  />
                  {claim === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      required
                      value={claimOther}
                      onChange={(e) => setClaimOther(e.target.value)}
                      className="mt-2 w-full max-w-sm bg-background border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>

                {/* Q7: Emotional Dimension */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    7. Which emotional dimensions should the scent address?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <MultiSelectOptionGrid
                    options={[
                      "Reassurance & Comfort", "Sustained Grounding & Calm", "Vitality & Energy Induction",
                      "Nostalgia & Familiarity", "Confidence & Empowerment", "Sensuality & Allure",
                      "Joy, Euphoria & Playfulness", "Serenity & Spiritual Connection",
                      "Security & Shielding/Protection", "Other"
                    ]}
                    selectedValues={emotions}
                    onToggle={toggleEmotion}
                  />
                  {emotions.includes("Other") && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      required
                      value={emotionsOther}
                      onChange={(e) => setEmotionsOther(e.target.value)}
                      className="mt-2 w-full max-w-sm bg-background border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>

                {/* Q8: Clinical Defense */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    8. Does this formulation require clinical defense documentation?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <OptionGrid
                    options={["yes", "no"]}
                    selectedValue={clinical}
                    onChange={setClinical}
                    clean={false}
                  />
                  {clinical === "yes" && (
                    <textarea
                      rows={3}
                      required
                      placeholder="Please specify your specific clinical documentation requirements..."
                      value={clinicalDetails}
                      onChange={(e) => setClinicalDetails(e.target.value)}
                      className="mt-2 w-full bg-background border border-border text-foreground text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-ring resize-none transition"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  )}
                </div>

                {/* Live Neuro-Metric Radar */}
                {(emotions.length > 0 || claim) && (
                  <NeuroRadarChart emotions={emotions} claim={claim} />
                )}
              </div>
            )}

            {phase === 3 && (
              <div className="space-y-8">
                <div>
                  <div className="text-[0.67rem] font-medium text-muted-foreground uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>Category 3</div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Volatility & Sensory Environment</h2>
                </div>

                {/* Q9: Application Environment */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    9. Where and how will the product be applied to release the aroma?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <OptionGrid
                    options={[
                      "Passive Ambient Air (Natural Room Evaporation)",
                      "Topical Friction/Body Heat (Skin Pulse Points)",
                      "Thermal/Burning Wick Release (Direct Flame Heat)",
                      "Thermal-Steam/Vapor Release (Hot Water Activation)",
                      "Ultrasonic Mist/Mechanical Diffusion",
                      "Textile/Fabric Friction (Micro-encapsulated Scent)",
                      "Rinse-off Agitation (Lathering with Water)",
                      "Internal Inhalation (Direct Nasal Inhaler/Stick)",
                      "Other"
                    ]}
                    selectedValue={environment}
                    onChange={setEnvironment}
                  />
                  {environment === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      required
                      value={environmentOther}
                      onChange={(e) => setEnvironmentOther(e.target.value)}
                      className="mt-2 w-full max-w-sm bg-background border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>

                {/* Q10: Sensory Lifecycle */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    10. What is the desired scent lifecycle behaviour?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <div className="bg-background border border-border rounded-xl px-5 py-5">
                    <input
                      type="range" min={1} max={5} step={1} value={lifecycle}
                      onChange={(e) => setLifecycle(Number(e.target.value))}
                      className="w-full cursor-pointer"
                      style={{ accentColor: "#2A1A35" }}
                    />
                    <div className="flex justify-between items-start mt-3">
                      <span className="text-xs text-muted-foreground max-w-[42%]" style={{ fontFamily: "'Inter', sans-serif" }}>Immediate, high-intensity spike</span>
                      <span className="text-base font-bold text-foreground px-3 py-1 bg-primary/8 rounded-lg" style={{ fontFamily: "'DM Mono', monospace" }}>{lifecycle} / 5</span>
                      <span className="text-xs text-muted-foreground max-w-[42%] text-right" style={{ fontFamily: "'Inter', sans-serif" }}>Subdued, persistent skin-retention anchor</span>
                    </div>
                  </div>
                </div>

                {/* Q11: Olfactive Restrictions */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    11. Are there any olfactive or compliance restrictions?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g., ECOCERT, 100% Biodegradable, Specific Floral/Woody exclusions…"
                    value={restrictions}
                    onChange={(e) => setRestrictions(e.target.value)}
                    className="w-full bg-background border border-border text-foreground text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-ring resize-none transition"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </div>

                {/* Q12: Base Note Preference */}
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    12. What is your base note preference?
                    <span className="text-red-500 ml-1 font-bold">*</span>
                  </p>
                  <OptionGrid
                    options={["Woody", "Musky", "Resinous", "Floral", "No Preference", "Other"]}
                    selectedValue={baseNotePreference}
                    onChange={setBaseNotePreference}
                  />
                  {baseNotePreference === "Other" && (
                    <input
                      type="text"
                      placeholder="Please specify..."
                      required
                      value={baseNotePreferenceOther}
                      onChange={(e) => setBaseNotePreferenceOther(e.target.value)}
                      className="mt-2 w-full max-w-sm bg-background border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
              <button
                onClick={() => phase > 1 && navigateTo(`#/wizard/phase-${phase - 1}`)}
                disabled={phase === 1}
                className="border border-border text-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-secondary/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Back to Previous Category
              </button>
              {(() => {
                const isPhaseValid = () => {
                  if (phase === 1) {
                    return vehicle && (vehicle !== "Other" || vehicleOther) &&
                           demographicAge && (demographicAge !== "Other" || demographicAgeOther) &&
                           demographicGender && (demographicGender !== "Other" || demographicGenderOther) &&
                           demographicGeo && (demographicGeo !== "Other" || demographicGeoOther) &&
                           priceTier && (priceTier !== "Other" || priceTierOther);
                  }
                  if (phase === 2) {
                    return claim && (claim !== "Other" || claimOther) &&
                           emotions.length > 0 && (!emotions.includes("Other") || emotionsOther) &&
                           clinical && (clinical !== "yes" || clinicalDetails);
                  }
                  if (phase === 3) {
                    return environment && (environment !== "Other" || environmentOther) &&
                           lifecycle && restrictions.trim() !== "" &&
                           baseNotePreference && (baseNotePreference !== "Other" || baseNotePreferenceOther);
                  }
                  return false;
                };
                
                return phase < 3 ? (
                  <button
                    onClick={() => navigateTo(`#/wizard/phase-${phase + 1}`)}
                    disabled={!isPhaseValid()}
                    className="bg-primary text-primary-foreground text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Proceed to Category {phase + 1} →
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting || !isPhaseValid()}
                    className="bg-accent text-white text-sm font-semibold px-7 py-2.5 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {isSubmitting ? "Simulating..." : "Submit All Configurations"}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ─── SCREEN 4: Thank You ──────────────────────────────────────────────────────
function ThankYouPage({
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
      <NavBar onLogin={() => {}} user={user} onLogout={onLogout} onNavClick={() => onReturn()} />

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

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [showLogin, setShowLogin] = useState(false);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Lifted Questionnaire states
  const [phase, setPhase] = useState<Phase>(1);
  const [vehicle, setVehicle] = useState("");
  const [vehicleOther, setVehicleOther] = useState("");
  const [demographicAge, setDemographicAge] = useState("");
  const [demographicAgeOther, setDemographicAgeOther] = useState("");
  const [demographicGender, setDemographicGender] = useState("");
  const [demographicGenderOther, setDemographicGenderOther] = useState("");
  const [demographicGeo, setDemographicGeo] = useState("");
  const [demographicGeoOther, setDemographicGeoOther] = useState("");
  const [priceTier, setPriceTier] = useState("");
  const [priceTierOther, setPriceTierOther] = useState("");
  const [claim, setClaim] = useState("");
  const [claimOther, setClaimOther] = useState("");
  const [emotions, setEmotions] = useState<string[]>([]);
  const [emotionsOther, setEmotionsOther] = useState("");
  const [clinical, setClinical] = useState("");
  const [clinicalDetails, setClinicalDetails] = useState("");
  const [environment, setEnvironment] = useState("");
  const [environmentOther, setEnvironmentOther] = useState("");
  const [lifecycle, setLifecycle] = useState(3);
  const [restrictions, setRestrictions] = useState("");
  const [baseNotePreference, setBaseNotePreference] = useState("");
  const [baseNotePreferenceOther, setBaseNotePreferenceOther] = useState("");

  // Fetch logged-in user info if token is present
  const fetchUser = async () => {
    let token = null;
    try {
      token = localStorage.getItem("olfactura_token");
    } catch (e) {
      console.warn("localStorage.getItem blocked:", e);
    }
    if (!token) return;
    
    try {
      const res = await fetch("http://localhost:3001/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.status === "success") {
        setUser(data.user);
      } else {
        try {
          localStorage.removeItem("olfactura_token");
        } catch (err) {}
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to fetch user:", e);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn("localStorage.clear blocked:", e);
      try {
        localStorage.removeItem("olfactura_token");
      } catch (err) {}
    }
    
    try {
      sessionStorage.clear();
    } catch (e) {
      console.warn("sessionStorage.clear blocked:", e);
    }

    try {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        if (!cookie) continue;
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    } catch (e) {
      console.warn("Cookie clearing blocked:", e);
    }
    
    setUser(null);
    navigateTo("#/");
  };

  const handleAuthSuccess = async () => {
    await fetchUser();
    setShowLogin(false);
    navigateTo("#/wizard/phase-1");
  };

  // Sync state with hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#/";
      
      if (hash.startsWith("#/wizard/phase-")) {
        const p = parseInt(hash.replace("#/wizard/phase-", ""), 10);
        if (p === 1 || p === 2 || p === 3) {
          setScreen("wizard");
          setPhase(p as Phase);
          return;
        }
      }
      
      switch (hash) {
        case "#/tech-query":
          setScreen("tech-query");
          break;
        case "#/feedback":
          setScreen("feedback");
          break;
        case "#/thankyou":
          setScreen("thankyou");
          break;
        case "#/":
        default:
          setScreen("home");
          break;
      }
    };
    
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Sync initial load
    
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
  };

  const handleNavClick = (anchorId: string) => {
    const performScroll = () => {
      const el = document.getElementById(anchorId);
      if (el) {
        if (anchorId === "about") {
          const ticker = el.nextElementSibling as HTMLElement;
          const elTop = el.getBoundingClientRect().top + window.scrollY - 64;
          if (ticker) {
            const tickerBottom = ticker.getBoundingClientRect().bottom + window.scrollY;
            const targetPos = tickerBottom - window.innerHeight;
            window.scrollTo({ top: Math.max(elTop, targetPos), behavior: "smooth" });
          } else {
            window.scrollTo({ top: elTop, behavior: "smooth" });
          }
        } else {
          const offset = 64;
          const pos = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: pos - offset, behavior: "smooth" });
        }
      }
    };

    if (window.location.hash !== "#/" && window.location.hash !== "") {
      window.location.hash = "#/";
      setTimeout(performScroll, 150);
    } else {
      performScroll();
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      {screen === "home" && (
        <HomePage 
          onLogin={() => setShowLogin(true)} 
          onStartWizard={() => navigateTo("#/wizard/phase-1")} 
          onNavClick={handleNavClick} 
          user={user} 
          onLogout={handleLogout}
          navigateTo={navigateTo}
        />
      )}
      {screen === "wizard" && (
        <WizardPage 
          onSubmit={(data) => {
            setBlueprint(data);
            navigateTo("#/thankyou");
          }}
          user={user}
          onLogout={handleLogout}
          phase={phase}
          setPhase={setPhase}
          vehicle={vehicle} setVehicle={setVehicle}
          vehicleOther={vehicleOther} setVehicleOther={setVehicleOther}
          demographicAge={demographicAge} setDemographicAge={setDemographicAge}
          demographicAgeOther={demographicAgeOther} setDemographicAgeOther={setDemographicAgeOther}
          demographicGender={demographicGender} setDemographicGender={setDemographicGender}
          demographicGenderOther={demographicGenderOther} setDemographicGenderOther={setDemographicGenderOther}
          demographicGeo={demographicGeo} setDemographicGeo={setDemographicGeo}
          demographicGeoOther={demographicGeoOther} setDemographicGeoOther={setDemographicGeoOther}
          priceTier={priceTier} setPriceTier={setPriceTier}
          priceTierOther={priceTierOther} setPriceTierOther={setPriceTierOther}
          claim={claim} setClaim={setClaim}
          claimOther={claimOther} setClaimOther={setClaimOther}
          emotions={emotions} setEmotions={setEmotions}
          emotionsOther={emotionsOther} setEmotionsOther={setEmotionsOther}
          clinical={clinical} setClinical={setClinical}
          clinicalDetails={clinicalDetails} setClinicalDetails={setClinicalDetails}
          environment={environment} setEnvironment={setEnvironment}
          environmentOther={environmentOther} setEnvironmentOther={setEnvironmentOther}
          lifecycle={lifecycle} setLifecycle={setLifecycle}
          restrictions={restrictions} setRestrictions={setRestrictions}
          baseNotePreference={baseNotePreference} setBaseNotePreference={setBaseNotePreference}
          baseNotePreferenceOther={baseNotePreferenceOther} setBaseNotePreferenceOther={setBaseNotePreferenceOther}
          navigateTo={navigateTo}
        />
      )}
      {screen === "thankyou" && (
        <ThankYouPage 
          onReturn={() => navigateTo("#/")} 
          blueprint={blueprint} 
          user={user} 
          onLogout={handleLogout}
          responses={{
            vehicle, vehicleOther, demographicAge, demographicAgeOther, demographicGender, demographicGenderOther,
            demographicGeo, demographicGeoOther, priceTier, priceTierOther, claim, claimOther, emotions, emotionsOther,
            clinical, clinicalDetails, environment, environmentOther, lifecycle, restrictions, baseNotePreference, baseNotePreferenceOther
          }}
        />
      )}
      {screen === "tech-query" && (
        <TechQueryPage user={user} onBack={() => navigateTo("#/")} navBar={<NavBar onLogin={() => setShowLogin(true)} user={user} onLogout={handleLogout} onNavClick={handleNavClick} />} footer={<Footer />} />
      )}
      {screen === "feedback" && (
        <FeedbackPage user={user} onBack={() => navigateTo("#/")} navBar={<NavBar onLogin={() => setShowLogin(true)} user={user} onLogout={handleLogout} onNavClick={handleNavClick} />} footer={<Footer />} />
      )}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
