import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Download, FlaskConical } from "lucide-react";
import { OlfacturaLogo } from "./OlfacturaLogo";
import { downloadSummaryText } from "@/app/components/SupportComponents";

export function NavBar({ onLogin, user, onLogout, onNavClick, light = false }: {
  onLogin: () => void;
  user: any;
  onLogout: () => void;
  onNavClick: (anchor: string) => void;
  light?: boolean;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const [briefs, setBriefs] = useState<any[]>([]);
  const labDropdownRef = useRef<HTMLDivElement>(null);

  const fetchBriefs = async () => {
    const token = localStorage.getItem("olfactura_token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:3001/api/briefs", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.status === "success") {
        setBriefs(data.briefs || []);
      }
    } catch (e) {
      console.error("Failed to fetch briefs:", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBriefs();
    }
  }, [user]);

  useEffect(() => {
    if (showLabDropdown && user) {
      fetchBriefs();
    }
  }, [showLabDropdown, user]);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (labDropdownRef.current && !labDropdownRef.current.contains(event.target as Node)) {
        setShowLabDropdown(false);
      }
    }
    if (showLabDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLabDropdown]);

  // Poll briefs every 5 seconds if there is at least one active brief (status !== 'Ready') or if dropdown is open
  useEffect(() => {
    if (!user) return;

    const hasActive = briefs.some(b => b.status !== 'Ready');
    if (!hasActive && !showLabDropdown) return;

    const interval = setInterval(() => {
      fetchBriefs();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, briefs, showLabDropdown]);

  const stages = [
    { key: "Analysis", num: 1, percent: 12.5, label: "Analysis", desc: "Neuro-mapping engine processing questionnaire goals" },
    { key: "Formulating", num: 2, percent: 45, label: "Formulating", desc: "Scent compound profiling" },
    { key: "Review", num: 3, percent: 75, label: "Review", desc: "Technical query validation/regulatory check" },
    { key: "Ready", num: 4, percent: 100, label: "Ready", desc: "Final formulation dossier available for sample download" }
  ];

  return (
    <header
      className={`w-full border-b sticky top-0 z-40 backdrop-blur-sm ${light
        ? "border-white/10 bg-black/50"
        : "border-border bg-background/85"
        }`}
    >
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        <button onClick={() => onNavClick("home")} className="flex flex-col leading-none text-left bg-transparent border-0 cursor-pointer p-0">
          <OlfacturaLogo light={light} />
        </button>
        <nav className="hidden md:flex items-center gap-8">
          {["About", "Support", "Resources"].map((link) => (
            <button
              key={link}
              onClick={() => onNavClick(link.toLowerCase().replace(" ", "-"))}
              className={`text-sm cursor-pointer transition-colors font-medium bg-transparent border-0 outline-none ${light ? "text-white/55 hover:text-white" : "text-foreground/60 hover:text-foreground"
                }`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link}
            </button>
          ))}
        </nav>
        {user ? (
          <div className="flex items-center gap-3">
            {/* Lab Status Trigger & Dropdown */}
            <div className="relative" ref={labDropdownRef}>
              <button
                onClick={() => setShowLabDropdown(!showLabDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all cursor-pointer relative ${light
                  ? "bg-white/10 border-white/20 text-white hover:bg-white/25"
                  : "bg-card border-border text-foreground hover:bg-secondary/80"
                  }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <FlaskConical size={15} className={briefs.some(b => b.status !== 'Ready') ? "animate-pulse text-[#C4758A]" : ""} />
                <span>Lab Status</span>
                {briefs.some(b => b.status !== 'Ready') && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4758A] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C4758A]"></span>
                  </span>
                )}
              </button>

              {showLabDropdown && (
                <div className={`absolute right-0 mt-2 w-96 rounded-xl shadow-xl z-50 p-4 border animate-in fade-in slide-in-from-top-2 duration-150 ${light
                  ? "bg-black/95 border-white/10 text-white backdrop-blur-md"
                  : "bg-[#FAF7F2] border-border text-foreground"
                  }`}>
                  <div className={`pb-2 mb-3 border-b font-semibold text-xs tracking-wider uppercase ${light ? "border-white/10 text-white/55" : "border-border text-muted-foreground"
                    }`}>
                    Scent Lab Submissions
                  </div>
                  {briefs.length === 0 ? (
                    <div className="text-center py-6">
                      <p className={`text-xs ${light ? "text-white/40" : "text-muted-foreground"}`}>No recent submissions found.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                      {briefs.slice(0, 3).map((brief) => {
                        const currentStage = stages.find(s => s.key === brief.status) || stages[0];
                        const displayRef = brief.technical_spec_summary?.refId || `REF-${String(brief.brief_id).padStart(4, '0')}`;
                        const displayClaim = brief.responses?.claim || "General Wellness";
                        const isReady = brief.status === 'Ready';

                        return (
                          <div key={brief.brief_id} className={`pb-3 last:pb-0 last:border-0 border-b ${light ? "border-white/10" : "border-border"
                            }`}>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className={`text-[0.67rem] font-bold tracking-widest uppercase ${light ? "text-[#E8A0B8]" : "text-accent font-semibold"
                                  }`}>
                                  {displayRef}
                                </span>
                                <div className={`text-[0.72rem] font-medium max-w-[200px] truncate ${light ? "text-white/80" : "text-neutral-700"
                                  }`}>
                                  {displayClaim}
                                </div>
                              </div>
                              <span className={`text-[0.62rem] font-mono ${light ? "text-white/40" : "text-muted-foreground"
                                }`}>
                                {new Date(brief.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {/* Progress bar line */}
                            <div className="relative w-full my-5 px-0.5">
                              <div className={`absolute top-2 left-0 right-0 h-0.5 rounded-full ${light ? "bg-white/10" : "bg-neutral-200"
                                }`}>
                                <div
                                  className="h-full bg-[#C4758A] transition-all duration-700 rounded-full"
                                  style={{ width: `${(currentStage.num - 1) * 33.33}%` }}
                                />
                              </div>
                              <div className="flex justify-between relative z-10">
                                {stages.map((st) => {
                                  const isCompleted = currentStage.num >= st.num;
                                  const isActive = currentStage.num === st.num;
                                  return (
                                    <div key={st.key} className="flex flex-col items-center">
                                      <div
                                        className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all ${isCompleted
                                          ? "bg-[#C4758A] text-white scale-105"
                                          : light ? "bg-zinc-900 border border-white/25" : "bg-[#EDE7DC] border border-border"
                                          } ${isActive ? "ring-[5px] ring-[#C4758A]/25 animate-pulse" : ""}`}
                                      >
                                        {isCompleted ? (
                                          <Check size={10} strokeWidth={3.5} className="text-white" />
                                        ) : (
                                          <span className={`text-[0.55rem] font-bold ${light ? "text-white/40" : "text-neutral-400"}`}>
                                            {st.num}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Step labels */}
                            <div className={`flex justify-between text-[0.56rem] font-bold tracking-tight mt-1.5 px-0.5 mb-2.5 ${light ? "text-white/40" : "text-neutral-500"
                              }`}>
                              <span className={currentStage.num >= 1 ? (light ? "text-[#E8A0B8]" : "text-[#C4758A]") : ""}>ANALYSIS</span>
                              <span className={currentStage.num >= 2 ? (light ? "text-[#E8A0B8]" : "text-[#C4758A]") : ""}>FORMULATING</span>
                              <span className={currentStage.num >= 3 ? (light ? "text-[#E8A0B8]" : "text-[#C4758A]") : ""}>REVIEW</span>
                              <span className={currentStage.num >= 4 ? (light ? "text-[#E8A0B8]" : "text-[#C4758A]") : ""}>READY</span>
                            </div>

                            {/* Active description */}
                            <div className={`p-2.5 rounded-lg text-left ${light ? "bg-white/5 border border-white/5" : "bg-[#EDE7DC]/30 border border-border/30"
                              }`}>
                              <div className="flex justify-between text-[0.67rem] font-bold uppercase tracking-wider mb-0.5">
                                <span style={{ color: "#C4758A" }}>{currentStage.label}</span>
                                <span className={light ? "text-white/60" : "text-neutral-500"}>Stage {currentStage.num} of 4</span>
                              </div>
                              <p className={`text-[0.72rem] leading-snug font-medium italic ${light ? "text-white/70" : "text-neutral-600"
                                }`}>
                                {currentStage.desc}
                              </p>
                            </div>

                            {/* Action Button */}
                            {isReady ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadSummaryText(brief.technical_spec_summary, brief.responses, user);
                                }}
                                className="mt-2.5 w-full flex items-center justify-center gap-2 bg-[#C4758A] hover:bg-[#C4758A]/90 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer border-0"
                              >
                                <Download size={13} />
                                Download Scent Dossier
                              </button>
                            ) : (
                              <div className={`mt-2.5 flex items-center justify-center gap-1.5 text-[0.7rem] font-semibold py-1.5 px-3 rounded-lg border ${light ? "bg-white/5 border-white/10 text-amber-400" : "bg-amber-50 border-amber-100 text-amber-600"
                                }`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                <span>Compound Profiling in progress...</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all cursor-pointer ${light
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
          </div>
        ) : (
          <button
            onClick={onLogin}
            className={`text-sm font-medium px-5 py-2 rounded-lg transition-opacity hover:opacity-80 cursor-pointer ${light
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
