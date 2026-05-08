"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, Store, Tag, Loader2 } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import AnimatedBackground from "../../components/AnimatedBackground";
import GlassCard from "../../components/GlassCard";
import GlowButton from "../../components/GlowButton";
import GradientText from "../../components/GradientText";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [appleReady, setAppleReady] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const googleScriptLoadedRef = useRef(false);

  const handleGoogleCredential = useCallback(async (credential: string) => {
    console.log("[Google][register] Credential reçu");
    setError(""); setLoading(true);
    try {
      const res = await api.post("/merchants/auth/google", { token: credential, credential, mode: "register" });
      login(res.data.token, res.data.merchant);
      router.push(res.data.merchant.onboarding_complete ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string; message?: string } } };
      console.error("[Google][register] err:", e.response?.data);
      setError(e.response?.data?.error || e.response?.data?.message || "Erreur Google OAuth");
    } finally { setLoading(false); }
  }, [login, router]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    if (googleScriptLoadedRef.current) return;
    const initGsi = () => {
      if (!window.google) return;
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => handleGoogleCredential(response.credential),
          ux_mode: "popup", auto_select: false, cancel_on_tap_outside: true,
        });
        setGoogleReady(true);
      } catch (e) { console.error("[Google][register] init:", e); }
    };
    if (window.google?.accounts?.id) { googleScriptLoadedRef.current = true; initGsi(); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true; script.defer = true;
    script.onload = () => { googleScriptLoadedRef.current = true; initGsi(); };
    document.head.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
  }, [handleGoogleCredential]);

  const handleGoogleClick = () => {
    if (!window.google?.accounts?.id) { setError("SDK Google non chargé."); return; }
    window.google.accounts.id.prompt((n) => {
      console.log("[Google][register] prompt:", { notDisplayed: n.isNotDisplayed(), skipped: n.isSkippedMoment() });
      if (n.isNotDisplayed() || n.isSkippedMoment()) {
        const c = document.getElementById("google-fallback-btn-register");
        if (c && window.google) {
          c.innerHTML = ""; c.style.display = "flex";
          window.google.accounts.id.renderButton(c, { theme: "filled_black", size: "large", width: 320, text: "signup_with", locale: "fr" });
        }
      }
    });
  };

  useEffect(() => {
    const serviceId = process.env.NEXT_PUBLIC_APPLE_SERVICE_ID;
    if (!serviceId) return;
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true; script.defer = true;
    document.head.appendChild(script);
    script.onload = () => {
      if (!window.AppleID) return;
      try {
        window.AppleID.auth.init({
          clientId: serviceId, scope: "name email",
          redirectURI: process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
          usePopup: true,
        });
        setAppleReady(true);
      } catch (e) { console.error("[Apple][register] init:", e); }
    };
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  const handleAppleSignIn = async () => {
    if (!window.AppleID) { setError("SDK Apple non chargé."); return; }
    setError(""); setLoading(true);
    try {
      const data = await window.AppleID.auth.signIn();
      const res = await api.post("/merchants/auth/apple", {
        token: data.authorization.id_token, identityToken: data.authorization.id_token,
        user: data.user, mode: "register",
      });
      login(res.data.token, res.data.merchant);
      router.push(res.data.merchant.onboarding_complete ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const a = err as { error?: string };
      if (a.error === "popup_closed_by_user" || a.error === "user_trigger_new_signin_flow") { setLoading(false); return; }
      const e = err as { response?: { data?: { error?: string; message?: string } } };
      setError(e.response?.data?.error || e.response?.data?.message || "Erreur Apple Sign In");
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const r = await api.post("/merchants/register", { email, password, business_name: businessName, business_type: businessType });
      login(r.data.token, r.data.merchant);
      router.push("/onboarding");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Une erreur est survenue");
    } finally { setLoading(false); }
  };

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const appleServiceId = process.env.NEXT_PUBLIC_APPLE_SERVICE_ID;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <AnimatedBackground />

      <GlassCard variant="strong" className="w-full max-w-md p-10 my-8 fade-in-up">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl mb-6 pulse-glow"
               style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}>F</div>
          <h1 className="heading-display text-3xl mb-2"><GradientText as="span">Lancez votre fidélité</GradientText></h1>
          <p className="text-sm text-text-muted">Créez votre programme premium en 2 minutes</p>
        </div>

        <div className="space-y-3 mb-6">
          {googleClientId ? (
            <GlowButton type="button" variant="ghost" fullWidth onClick={handleGoogleClick} disabled={loading || !googleReady}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
              <span>S&apos;inscrire avec Google</span>
            </GlowButton>
          ) : (
            <GlowButton variant="ghost" fullWidth disabled><GoogleIcon /><span>Google (non configuré)</span></GlowButton>
          )}
          <div id="google-fallback-btn-register" style={{ display: "none" }} className="w-full justify-center" />

          {appleServiceId ? (
            <GlowButton type="button" variant="apple" fullWidth onClick={handleAppleSignIn} disabled={loading || !appleReady}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <AppleIcon />}
              <span>S&apos;inscrire avec Apple</span>
            </GlowButton>
          ) : (
            <GlowButton variant="apple" fullWidth disabled><AppleIcon /><span>Apple (non configuré)</span></GlowButton>
          )}
        </div>

        <div className="relative my-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-text-muted">ou avec votre email</span>
          <span className="flex-1 h-px bg-white/10" />
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm border" style={{
            color: "#FCA5A5", background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.25)"
          }}>{error}</div>
        )}

        <form className="space-y-3" onSubmit={handleRegister}>
          <FormField icon={Store}>
            <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)}
              className="input-dark pl-10 w-full rounded-xl py-3 text-sm" placeholder="Nom du commerce" />
          </FormField>
          <FormField icon={Tag}>
            <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}
              className="input-dark pl-10 w-full rounded-xl py-3 text-sm appearance-none">
              <option value="restaurant">Restaurant</option>
              <option value="boulangerie">Boulangerie</option>
              <option value="coiffeur">Coiffeur</option>
              <option value="cafe">Café</option>
              <option value="boutique">Boutique</option>
              <option value="autre">Autre</option>
            </select>
          </FormField>
          <FormField icon={Mail}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-dark pl-10 w-full rounded-xl py-3 text-sm" placeholder="vous@commerce.fr" />
          </FormField>
          <FormField icon={Lock}>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-dark pl-10 w-full rounded-xl py-3 text-sm" placeholder="••••••••" />
          </FormField>

          <GlowButton type="submit" fullWidth size="lg" disabled={loading} className="!mt-5">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Créer mon compte <ArrowRight className="w-4 h-4" /></>}
          </GlowButton>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-[#A78BFA] hover:text-white transition-colors font-semibold">Se connecter</Link>
        </p>
      </GlassCard>
    </div>
  );
}

function FormField({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
      {children}
    </div>
  );
}
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path fill="#EA4335" d="M12 11.5v3.6h5.1c-.2 1.3-1.6 3.8-5.1 3.8-3.1 0-5.6-2.6-5.6-5.7s2.5-5.7 5.6-5.7c1.7 0 2.9.7 3.5 1.3l2.4-2.3C16.4 5.1 14.4 4 12 4 7.6 4 4 7.6 4 12s3.6 8 8 8c4.6 0 7.7-3.2 7.7-7.7 0-.5-.1-.9-.1-1.3H12z" />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="white" aria-hidden>
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    </svg>
  );
}
