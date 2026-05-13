"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (opts: Record<string, unknown>) => void;
          prompt: (cb?: (notification: PromptMomentNotification) => void) => void;
          renderButton: (el: HTMLElement | null, opts: Record<string, unknown>) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
    AppleID?: {
      auth: {
        init: (config: { clientId: string; scope: string; redirectURI: string; usePopup: boolean }) => void;
        signIn: () => Promise<{
          authorization: { id_token: string; code: string };
          user?: { name?: { firstName?: string; lastName?: string }; email?: string };
        }>;
      };
    };
  }
  interface PromptMomentNotification {
    isNotDisplayed: () => boolean;
    isSkippedMoment: () => boolean;
    isDismissedMoment: () => boolean;
    getNotDisplayedReason: () => string;
    getSkippedReason: () => string;
    getDismissedReason: () => string;
    getMomentType: () => string;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [appleReady, setAppleReady] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const googleScriptLoadedRef = useRef(false);

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setError(""); setLoading(true);
    try {
      const res = await api.post("/merchants/auth/google", { token: credential, credential, mode: "login" });
      login(res.data.token, res.data.merchant);
      router.push(res.data.merchant.onboarding_complete ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { error?: string; message?: string } } };
      if (e.response?.status === 404) setError("Aucun compte trouvé avec ce compte Google. Créez un compte d'abord.");
      else setError(e.response?.data?.error || e.response?.data?.message || "Erreur Google OAuth");
    } finally { setLoading(false); }
  }, [login, router]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || googleScriptLoadedRef.current) return;
    const initGsi = () => {
      if (!window.google) return;
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => handleGoogleCredential(response.credential),
          ux_mode: "popup", auto_select: false, cancel_on_tap_outside: true,
        });
        setGoogleReady(true);
      } catch (e) { console.error("[Google][login] Erreur initialize:", e); }
    };
    if (window.google?.accounts?.id) { googleScriptLoadedRef.current = true; initGsi(); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true; script.defer = true;
    script.onload = () => { googleScriptLoadedRef.current = true; initGsi(); };
    script.onerror = (e) => console.error("[Google][login] Erreur SDK:", e);
    document.head.appendChild(script);
    return () => { if (script.parentNode) script.parentNode.removeChild(script); };
  }, [handleGoogleCredential]);

  const handleGoogleClick = () => {
    if (!window.google?.accounts?.id) { setError("SDK Google non chargé. Rechargez la page."); return; }
    try {
      window.google.accounts.id.prompt((n) => {
        if (n.isNotDisplayed() || n.isSkippedMoment()) {
          const c = document.getElementById("google-fallback-btn");
          if (c && window.google) {
            c.innerHTML = ""; c.style.display = "flex";
            window.google.accounts.id.renderButton(c, { theme: "filled_black", size: "large", width: 320, text: "signin_with", locale: "fr" });
          }
        }
      });
    } catch (e) { console.error("[Google][login] prompt():", e); }
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
        window.AppleID.auth.init({ clientId: serviceId, scope: "name email", redirectURI: process.env.NEXT_PUBLIC_APP_URL || window.location.origin, usePopup: true });
        setAppleReady(true);
      } catch (e) { console.error("[Apple][login] init:", e); }
    };
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  const handleAppleSignIn = async () => {
    if (!window.AppleID) { setError("SDK Apple non chargé."); return; }
    setError(""); setLoading(true);
    try {
      const data = await window.AppleID.auth.signIn();
      const res = await api.post("/merchants/auth/apple", { token: data.authorization.id_token, identityToken: data.authorization.id_token, user: data.user, mode: "login" });
      login(res.data.token, res.data.merchant);
      router.push(res.data.merchant.onboarding_complete ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const a = err as { error?: string };
      if (a.error === "popup_closed_by_user" || a.error === "user_trigger_new_signin_flow") { setLoading(false); return; }
      const e = err as { response?: { status?: number; data?: { error?: string; message?: string } } };
      if (e.response?.status === 404) setError("Aucun compte trouvé avec ce compte Apple. Créez un compte d'abord.");
      else setError(e.response?.data?.error || e.response?.data?.message || "Erreur Apple Sign In");
    } finally { setLoading(false); }
  };

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/merchants/login", { email, password });
      login(res.data.token, res.data.merchant);
      router.push(res.data.merchant.onboarding_complete ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Identifiants incorrects");
    } finally { setLoading(false); }
  };

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const appleServiceId = process.env.NEXT_PUBLIC_APPLE_SERVICE_ID;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#0a0a0b" }}>
      <div aria-hidden className="pointer-events-none absolute"
        style={{ top: -200, left: -100, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div aria-hidden className="pointer-events-none absolute"
        style={{ bottom: -150, right: -80, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="w-full max-w-[440px] relative z-10 fade-in-up"
        style={{ background: "#14141a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: 40 }}>

        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
              style={{ background: "var(--violet)", color: "#ffffff" }}>F</div>
            <span className="font-semibold" style={{ color: "var(--text)" }}>Fideloo</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 style={{ fontWeight: 500, fontSize: 26, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: 8 }}>
            Bon retour 👋
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-dim)" }}>Connectez-vous à votre dashboard</p>
        </div>

        <div className="space-y-3 mb-6">
          {googleClientId ? (
            <button type="button" onClick={handleGoogleClick} disabled={loading || !googleReady}
              className="w-full flex items-center justify-center gap-3 font-medium transition-all disabled:opacity-50"
              style={{ height: 44, background: "#f5f5f3", color: "#19181a", borderRadius: 10, fontSize: 14, border: "none", cursor: "pointer" }}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
              Continuer avec Google
            </button>
          ) : (
            <button disabled className="w-full flex items-center justify-center gap-3 font-medium opacity-40"
              style={{ height: 44, background: "#f5f5f3", color: "#19181a", borderRadius: 10, fontSize: 14, border: "none" }}>
              <GoogleIcon /> Google (non configuré)
            </button>
          )}
          <div id="google-fallback-btn" style={{ display: "none" }} className="w-full justify-center" />

          {appleServiceId ? (
            <button type="button" onClick={handleAppleSignIn} disabled={loading || !appleReady}
              className="w-full flex items-center justify-center gap-3 font-medium transition-all disabled:opacity-50"
              style={{ height: 44, background: "#19181a", color: "#f5f5f3", borderRadius: 10, fontSize: 14, border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer" }}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <AppleIcon />}
              Continuer avec Apple
            </button>
          ) : (
            <button disabled className="w-full flex items-center justify-center gap-3 font-medium opacity-40"
              style={{ height: 44, background: "#19181a", color: "#f5f5f3", borderRadius: 10, fontSize: 14, border: "1px solid rgba(255,255,255,0.12)" }}>
              <AppleIcon /> Apple (non configuré)
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: 12, color: "var(--text-dim)", letterSpacing: "0.08em" }}>OU</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm"
            style={{ background: "rgba(251,113,133,0.1)", color: "#fb7185", border: "1px solid rgba(251,113,133,0.25)" }}>
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(245,245,243,0.8)", marginBottom: 6 }}>
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-dim)" }} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors pl-10"
                placeholder="vous@commerce.fr" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label style={{ fontSize: 13, fontWeight: 500, color: "rgba(245,245,243,0.8)" }}>Mot de passe</label>
              <Link href="/forgot-password" style={{ fontSize: 13, color: "var(--violet)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--violet)")}>
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-dim)" }} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors pl-10"
                placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn btn-accent btn-lg w-full justify-center disabled:opacity-50 mt-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Se connecter <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center" style={{ fontSize: 14, color: "var(--text-dim)" }}>
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-semibold"
            style={{ color: "var(--violet)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--violet)")}>
            Créer un compte
          </Link>
        </p>
      </div>
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
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    </svg>
  );
}
