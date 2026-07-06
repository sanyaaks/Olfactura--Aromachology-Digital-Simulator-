import { useState } from "react";
import { Check, Download, LayoutDashboard } from "lucide-react";

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
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-left cursor-pointer transition-all w-full ${
              isSelected
                ? "border-accent bg-accent/8 shadow-sm"
                : "border-border bg-[#EDE7DC]/40 hover:border-accent/40 hover:bg-accent/5"
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              isSelected ? "border-accent" : "border-muted-foreground/45"
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
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-left cursor-pointer transition-all w-full ${
              isSelected
                ? "border-accent bg-accent/8 shadow-sm"
                : "border-border bg-[#EDE7DC]/40 hover:border-accent/40 hover:bg-accent/5"
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              isSelected ? "bg-accent border-accent" : "border-muted-foreground/45"
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
            Client Feedback Portal
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
