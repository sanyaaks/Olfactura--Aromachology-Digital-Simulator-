import { useState } from "react";
import { Check, Download, LayoutDashboard, ChevronDown, BookOpen, FileText, HelpCircle } from "lucide-react";

// Clean slashes utility
export const cleanLabel = (text: string) => text.replace(/\s*\/\s*/g, '/');

// Unified Options Grid for single-select questions
export function OptionGrid({
  options,
  selectedValue,
  onChange,
  clean = true
}: {
  options: string[];
  selectedValue: string;
  onChange: (v: string) => void;
  clean?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
      {options.map((opt) => {
        const cleaned = clean ? cleanLabel(opt) : opt;
        const isSelected = selectedValue === cleaned || selectedValue === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(cleaned)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-left cursor-pointer transition-all w-full ${isSelected
              ? "border-accent bg-accent/8 shadow-sm"
              : "border-border bg-[#EDE7DC]/40 hover:border-accent/40 hover:bg-accent/5"
              }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "border-accent" : "border-muted-foreground/45"
              }`}>
              {isSelected && <div className="w-2 h-2 rounded-full bg-accent" />}
            </div>
            <span className="text-sm font-medium text-foreground leading-snug">{cleaned}</span>
          </button>
        );
      })}
    </div>
  );
}

// Unified Multi-select Options Grid (specifically for Q7)
export function MultiSelectOptionGrid({
  options,
  selectedValues,
  onToggle,
  clean = true
}: {
  options: string[];
  selectedValues: string[];
  onToggle: (v: string) => void;
  clean?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {options.map((opt) => {
        const cleaned = clean ? cleanLabel(opt) : opt;
        const isSelected = selectedValues.includes(cleaned) || selectedValues.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(cleaned)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-left cursor-pointer transition-all w-full ${isSelected
              ? "border-accent bg-accent/8 shadow-sm"
              : "border-border bg-[#EDE7DC]/40 hover:border-accent/40 hover:bg-accent/5"
              }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "bg-accent border-accent" : "border-muted-foreground/45"
              }`}>
              {isSelected && <Check size={12} className="text-white" />}
            </div>
            <span className="text-sm font-medium text-foreground leading-snug">{cleaned}</span>
          </button>
        );
      })}
    </div>
  );
}

// Summary plain text generation and download
export const downloadSummaryText = (blueprint: any, responses: any, user: any) => {
  let content = `======================================================\n`;
  content += `               OLFACTURA SCENT BLUEPRINT\n`;
  content += `======================================================\n\n`;
  content += `Reference ID: ${blueprint?.refId || 'N/A'}\n`;
  content += `Generated Date: ${new Date().toLocaleString()}\n\n`;

  content += `CLIENT PROFILE\n`;
  content += `------------------------------------------------------\n`;
  content += `Client Name:  ${user?.name || 'N/A'}\n`;
  content += `Email:        ${user?.email || 'N/A'}\n`;
  content += `Company:      ${user?.company_name || 'N/A'}\n\n`;

  content += `QUESTIONNAIRE RESPONSES\n`;
  content += `------------------------------------------------------\n`;
  content += `1. Product Format:               ${responses.vehicle || 'N/A'}\n`;
  if (responses.vehicle === "Other") content += `   Custom Details:              ${responses.vehicleOther || 'N/A'}\n`;
  content += `2. Target Demographic (Age):     ${responses.demographicAge || 'N/A'}\n`;
  if (responses.demographicAge === "Other") content += `   Custom Details:              ${responses.demographicAgeOther || 'N/A'}\n`;
  content += `3. Target Demographic (Gender):  ${responses.demographicGender || 'N/A'}\n`;
  if (responses.demographicGender === "Other") content += `   Custom Details:              ${responses.demographicGenderOther || 'N/A'}\n`;
  content += `4. Target Demographic (Geo):     ${responses.demographicGeo || 'N/A'}\n`;
  if (responses.demographicGeo === "Other") content += `   Custom Details:              ${responses.demographicGeoOther || 'N/A'}\n`;
  content += `5. Retail Price Tier:            ${responses.priceTier || 'N/A'}\n`;
  if (responses.priceTier === "Other") content += `   Custom Details:              ${responses.priceTierOther || 'N/A'}\n`;
  content += `6. Primary Wellness Claim:       ${responses.claim || 'N/A'}\n`;
  if (responses.claim === "Other") content += `   Custom Details:              ${responses.claimOther || 'N/A'}\n`;
  content += `7. Emotional Dimensions:         ${(responses.emotions || []).join(', ')}\n`;
  if (responses.emotions?.includes("Other")) content += `   Custom Details:              ${responses.emotionsOther || 'N/A'}\n`;
  content += `8. Clinical Defense Required:    ${responses.clinical || 'N/A'}\n`;
  if (responses.clinical === "yes") content += `   Clinical Specifications:     ${responses.clinicalDetails || 'N/A'}\n`;
  content += `9. Application Environment:      ${responses.environment || 'N/A'}\n`;
  if (responses.environment === "Other") content += `   Custom Details:              ${responses.environmentOther || 'N/A'}\n`;
  content += `10. Desired Scent Lifecycle:     ${responses.lifecycle || 3} / 5\n`;
  content += `11. Olfactive Restrictions:      ${responses.restrictions || 'None'}\n`;
  content += `12. Base Note Preference:        ${responses.baseNotePreference || 'N/A'}\n`;
  if (responses.baseNotePreference === "Other") content += `   Custom Details:              ${responses.baseNotePreferenceOther || 'N/A'}\n`;
  content += `\n`;

  if (blueprint) {
    content += `FORMULATION BLUEPRINT SPECIFICATIONS\n`;
    content += `------------------------------------------------------\n`;
    content += `Scent Materials Recommendations:\n`;
    (blueprint.materials || []).forEach((m: any) => {
      content += `  - ${m.name}: ${m.concentration}\n`;
    });
    if (blueprint.telemetry) {
      content += `\nTelemetry Waves:\n`;
      content += `  - Calm Alpha Boost:   ${blueprint.telemetry.calmAlpha}%\n`;
      content += `  - Energy Beta Boost: ${blueprint.telemetry.energyBeta}%\n`;
      content += `  - Focus Gamma Boost:  ${blueprint.telemetry.focusGamma}%\n`;
    }
    if (blueprint.volatility) {
      content += `\nVolatility Projection:\n`;
      content += `  - Top Notes:          ${blueprint.volatility.topNotes}%\n`;
      content += `  - Base Notes:         ${blueprint.volatility.baseNotes}%\n`;
    }
  }

  content += `\n======================================================\n`;
  content += `   Confidential - For Lab Formulation Use Only\n`;
  content += `======================================================\n`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `olfactura_brief_${blueprint?.refId || 'summary'}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Technical query form page
export function TechQueryPage({ user, onBack, navBar, footer }: {
  user: any;
  onBack: () => void;
  navBar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !description) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("olfactura_token");
      const res = await fetch("http://localhost:3001/api/support/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name, email, subject, urgency, description })
      });
      const data = await res.json();
      if (data.status === "success") {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        {navBar}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-card border border-border rounded-2xl p-10 max-w-md text-center shadow-lg text-foreground">
            <div className="w-16 h-16 bg-[#8B3A5C]/10 border border-[#8B3A5C]/25 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-[#8B3A5C]" size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Inquiry Submitted
            </h2>
            <p className="text-sm text-muted-foreground mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Your technical inquiry has been recorded. Our laboratory team will review the details and follow up within 4 business hours.
            </p>
            <button
              onClick={onBack}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer border-0"
            >
              Return to Homepage
            </button>
          </div>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {navBar}
      <div className="flex-1 max-w-3xl mx-auto w-full px-8 py-12 text-foreground">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Submit Technical Inquiry
          </h1>
          <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Direct pipeline to our formulation laboratory and systems integration team.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Subject <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. API Integration, Compound LMR specifications"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Urgency Level <span className="text-red-500">*</span></label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Low">Low - General Question</option>
              <option value="Medium">Medium - System Inquiry</option>
              <option value="High">High - Development Block</option>
              <option value="Critical">Critical - Production Down</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Query Description <span className="text-red-500">*</span></label>
            <textarea
              rows={5}
              required
              placeholder="Describe your technical request in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={onBack}
              className="border border-border text-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-secondary/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-0"
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </button>
          </div>
        </form>
      </div>
      {footer}
    </div>
  );
}

// Client Feedback portal page
export function FeedbackPage({ user, onBack, navBar, footer }: {
  user: any;
  onBack: () => void;
  navBar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [experienceRating, setExperienceRating] = useState(5);
  const [accuracyRating, setAccuracyRating] = useState(5);
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !details) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("olfactura_token");
      const res = await fetch("http://localhost:3001/api/support/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name,
          email,
          experience_rating: experienceRating,
          accuracy_rating: accuracyRating,
          details
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        {navBar}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-card border border-border rounded-2xl p-10 max-w-md text-center shadow-lg text-foreground">
            <div className="w-16 h-16 bg-[#8B3A5C]/10 border border-[#8B3A5C]/25 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-[#8B3A5C]" size={28} />
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Feedback Received
            </h2>
            <p className="text-sm text-muted-foreground mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>
              Thank you for sharing your experience. Your feedback is analyzed during regular batch training of our neuro-metric compound projection models.
            </p>
            <button
              onClick={onBack}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer border-0"
            >
              Return to Homepage
            </button>
          </div>
        </div>
        {footer}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      {navBar}
      <div className="flex-1 max-w-3xl mx-auto w-full px-8 py-12 text-foreground">
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Application Feedback
          </h1>
          <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Provide structured input to refine compound recommenders and simulation accuracy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Overall Platform Experience <span className="text-red-500">*</span></label>
            <div className="bg-background border border-border rounded-xl px-5 py-4 flex items-center justify-between">
              <input
                type="range" min={1} max={10} step={1} value={experienceRating}
                onChange={(e) => setExperienceRating(Number(e.target.value))}
                className="w-full cursor-pointer mr-6"
                style={{ accentColor: "#8B3A5C" }}
              />
              <span className="text-base font-bold text-foreground px-3 py-1 bg-accent/8 rounded-lg min-w-[50px] text-center" style={{ fontFamily: "'DM Mono', monospace" }}>
                {experienceRating} / 10
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Formulation Recommendation Accuracy <span className="text-red-500">*</span></label>
            <div className="bg-background border border-border rounded-xl px-5 py-4 flex items-center justify-between">
              <input
                type="range" min={1} max={10} step={1} value={accuracyRating}
                onChange={(e) => setAccuracyRating(Number(e.target.value))}
                className="w-full cursor-pointer mr-6"
                style={{ accentColor: "#8B3A5C" }}
              />
              <span className="text-base font-bold text-foreground px-3 py-1 bg-accent/8 rounded-lg min-w-[50px] text-center" style={{ fontFamily: "'DM Mono', monospace" }}>
                {accuracyRating} / 10
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Feedback Details <span className="text-red-500">*</span></label>
            <textarea
              rows={5}
              required
              placeholder="What can we improve? Please share details on accuracy, usability, or features..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-[#EDE7DC] border border-border text-foreground text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={onBack}
              className="border border-border text-foreground text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-secondary/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-[#F0EBE1] text-sm font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-0"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
      {footer}
    </div>
  );
}

// Resources & Documentation Page
export function ResourcesPage({ user, onBack, navBar, footer }: {
  user: any;
  onBack: () => void;
  navBar: React.ReactNode;
  footer: React.ReactNode;
}) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleDownload = (filename: string, title: string, contentStr: string) => {
    const blob = new Blob([contentStr], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const docs = [
    {
      title: "API Integration Specification v2.4",
      desc: "Comprehensive REST API documentation for connecting ERP systems directly to the Olfactura simulation engine.",
      file: "olfactura_api_spec.txt",
      content: "======================================================\nOLFACTURA API INTEGRATION SPECIFICATION v2.4\n======================================================\n\nThis document outlines the programmatic endpoints for transmitting scent briefs and retrieving molecular formulation recommendations.\n\n[Endpoints]\n- POST /api/simulate : Submits a brief and returns chemical compounds.\n- GET /api/briefs   : Retrieves historical briefs for the authenticated client.\n\n[Security]\n- Bearer token authentication required for all enterprise requests.\n..."
    },
    {
      title: "Neuro-Metric Compound Formulation Guide",
      desc: "Scientific overview detailing the mapping between emotional/wellness objectives and chemical compounds.",
      file: "olfactura_neuro_formulation_guide.txt",
      content: "======================================================\nNEURO-METRIC SCENT FORMULATION GUIDE\n======================================================\n\nThis guide explains how scent molecules activate specific neuro-receptors to achieve calming or energizing outcomes.\n\n[Core Actives]\n- Linalool: Enhances parasympathetic tone, boosting alpha wave projection (+22%).\n- Tonka Bean: Solidifies grounding baseline mood vectors.\n- Sandalwood Base: Sustains long-term sensory lifecycle stabilization.\n..."
    },
    {
      title: "Lab Compounding SLA & Compliance Standards",
      desc: "Detailing the physical compounding process and compliance validation.",
      file: "olfactura_lab_sla.txt",
      content: "======================================================\nLAB COMPLIANCE & WORKFLOW STANDARDS\n======================================================\n\nDetails the physical synthesis pipeline from virtual blueprint to sample shipping.\n\n[Turnaround Time]\n- Virtual validation: Instant.\n- Technical review: 4 hours.\n- Physical compounding & bottling: 48 hours.\n- Express global shipping: 3-5 business days.\n..."
    }
  ];

  const guides = [
    { step: "01", title: "Parameter Questionnaire", desc: "Define your product medium, consumer target demographics, price target, and primary functional claims." },
    { step: "02", title: "Neuro-Mapping & Radar Preview", desc: "Select target emotions and immediately preview projected wave activations (Alpha, Beta, Gamma) via the neural radar model." },
    { step: "03", title: "Simulation & Transmission", desc: "Submit all settings. Our backend parses chemical guidelines and transmits specifications to the physical lab." },
    { step: "04", title: "Live Tracking & Dossier Delivery", desc: "Monitor compounding live via the header dropdown status. Download the final text dossier once compounding is completed." }
  ];

  const faqs = [
    {
      q: "How are the neuro-metric alpha wave predictions calculated?",
      a: "Predictions are computed by cross-referencing inputted claims and target emotions with a database of peer-reviewed clinical neuroscience studies. The scores reflect projected boosts in parasympathetic response indicators relative to standard neutral ambient baselines."
    },
    {
      q: "How long does it take for a brief to move to the 'Ready' status?",
      a: "For simulation purposes, the workflow progresses through Analysis, Formulating, Review, and Ready stages in exactly 55 seconds. In production accounts, physical laboratory compounding takes approximately 48 hours, followed by courier dispatch."
    },
    {
      q: "Are the suggested ingredients natural or synthetic?",
      a: "The engine indexes both LMR naturals (e.g., Lavandin Heart, Tonka Bean Absolute) and precise synthetic molecules (e.g., Linalool, Musk Ketone). You can restrict the catalog to natural-only ingredients in Category 3 of the questionnaire."
    },
    {
      q: "Can I connect this platform to external product management tools?",
      a: "Yes. Enterprise accounts include full access to our REST API. Download the 'API Integration Specification v2.4' above to view authorization methods, JSON schemas, and payload examples."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between">
      {navBar}
      <div className="flex-1 max-w-5xl mx-auto w-full px-8 py-12 text-foreground">

        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: "#1C0F1E" }}>
            Documentation & Resources
          </h1>
          <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            Access enterprise integration guides, Quick Start workflows, and frequently asked simulator questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column: Docs & Guides */}
          <div className="lg:col-span-2 space-y-8">

            {/* Documentation Section */}
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-[#C4758A]" />
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Downloadable Documentation
                </h2>
              </div>
              <div className="space-y-4">
                {docs.map((doc, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#EDE7DC]/30 border border-border/40 hover:border-[#C4758A]/45 transition-colors">
                    <div className="flex gap-3 items-start">
                      <FileText size={18} className="text-[#C4758A]/70 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{doc.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{doc.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(doc.file, doc.title, doc.content)}
                      className="self-start sm:self-center flex items-center gap-1.5 bg-[#C4758A] hover:bg-[#C4758A]/90 text-white transition-colors text-xs font-semibold py-2 px-3.5 rounded-lg cursor-pointer border-0"
                    >
                      <Download size={13} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick User Guide Section */}
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen size={18} className="text-[#C4758A]" />
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Quick Simulator Workflow
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guides.map((g, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-[#EDE7DC]/15 flex gap-4 items-start">
                    <span className="text-2xl font-black text-[#C4758A]/20 leading-none" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {g.step}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">{g.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{g.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: FAQs */}
          <div className="space-y-8">
            <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle size={18} className="text-[#C4758A]" />
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  FAQs
                </h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className="border border-border/50 rounded-xl overflow-hidden bg-[#EDE7DC]/10">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between gap-4 p-4 text-left font-semibold text-xs text-foreground bg-transparent border-0 hover:bg-[#EDE7DC]/20 transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={14} className="text-muted-foreground flex-shrink-0 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                      </button>
                      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[300px] border-t border-border/30 opacity-100" : "max-h-0 opacity-0"
                        }`}>
                        <p className="p-4 text-xs text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="border border-border text-foreground hover:bg-secondary/60 text-sm font-semibold px-6 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            ← Return to Dashboard
          </button>
        </div>

      </div>
      {footer}
    </div>
  );
}

