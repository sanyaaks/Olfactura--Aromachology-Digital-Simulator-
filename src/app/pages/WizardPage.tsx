import { useState } from "react";
import { Check } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { NavBar } from "@/app/components/Layout/NavBar";
import { Footer } from "@/app/components/Layout/Footer";
import { OptionGrid, MultiSelectOptionGrid } from "@/app/components/SupportComponents";
import { NeuroRadarChart } from "@/app/components/Charts/NeuroRadarChart";

import orangeImg from "@/imports/Orangenbl_te___die_sinnliche_Seele_von_YSL_Libre-1.jpg";
import vanillaImg from "@/imports/Vanilla________Unraveling_the_essence_of_-1.jpg";
import honeyImg from "@/imports/POCARANO_Rahat_Lokum_perfume_mist_NOTES__________________________________________-1.jpg";
import bемhausImg from "@/imports/8092474327694818.jpg";

type Phase = 1 | 2 | 3;

export function WizardPage({
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
      <NavBar onLogin={() => { }} user={user} onLogout={onLogout} onNavClick={(anchor) => navigateTo(`#/${anchor}`)} />

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
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all shadow-sm ${done ? "bg-accent border-accent text-white"
                        : active ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-border text-muted-foreground"
                        }`}
                      style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                      {done ? <Check size={15} /> : p.num}
                    </div>
                    <span
                      className={`text-xs text-center leading-snug max-w-[120px] font-medium ${active ? "text-black font-semibold" : done ? "text-neutral-700" : "text-neutral-400"
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
