import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { OlfacturaLogo } from "@/app/components/Layout/OlfacturaLogo";
import lilyImg from "@/imports/Dark_Pink_Lily_Desktop_Wallpaper_-_Floral_Photography_Art-1.jpg";

export function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
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
