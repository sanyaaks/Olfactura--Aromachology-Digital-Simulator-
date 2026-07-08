import { useState, useEffect } from "react";
import { TechQueryPage, FeedbackPage, ResourcesPage } from "@/app/components/SupportComponents";
import { HomePage } from "@/app/pages/HomePage";
import { WizardPage } from "@/app/pages/WizardPage";
import { ThankYouPage } from "@/app/pages/ThankYouPage";
import { LoginModal } from "@/app/components/Auth/LoginModal";
import { NavBar } from "@/app/components/Layout/NavBar";
import { Footer } from "@/app/components/Layout/Footer";

type Screen = "home" | "wizard" | "thankyou" | "tech-query" | "feedback" | "resources";
type Phase = 1 | 2 | 3;

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
        } catch (err) { }
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
      } catch (err) { }
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
        case "#/resources":
          setScreen("resources");
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
    if (anchorId === "resources") {
      navigateTo("#/resources");
      return;
    }
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
      {screen === "resources" && (
        <ResourcesPage user={user} onBack={() => navigateTo("#/")} navBar={<NavBar onLogin={() => setShowLogin(true)} user={user} onLogout={handleLogout} onNavClick={handleNavClick} />} footer={<Footer />} />
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
