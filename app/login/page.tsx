"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY  = "#6B6B6B";
const BORD  = "#E0DDD6";
const INPUT = "#F5F3EE";
const BG    = "#EDEBE4";

const inputBase: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: INPUT,
  border: `1px solid ${BORD}`,
  borderRadius: 8,
  fontSize: 14,
  color: INK,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
            window.google.accounts.id.renderButton(c, { theme: "outline", size: "large", width: 320, text: "signin_with", locale: "fr" });
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
    <div style={{ minHeight: "100vh", display: "flex" }} className="login-root">

      {/* ── Colonne gauche — fond sombre ── */}
      <div style={{
        width: "50%", background: INK, padding: "60px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }} className="login-left">

        <div>
          {/* Logo */}
          <Link href="/">
            <img src="/brand/fideloo-logo-linked-onDark.svg" height="32" alt="Fideloo" />
          </Link>

          {/* Titre */}
          <h2 style={{
            fontFamily: "var(--font-playfair, Georgia, serif)",
            fontSize: 36, fontWeight: 400, color: "#FFFFFF",
            marginTop: 48, marginBottom: 0, lineHeight: 1.25,
          }}>
            Bon retour<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>chez vous.</em>
          </h2>
          <p style={{ color: GRAY, fontSize: 15, marginTop: 16, lineHeight: 1.6 }}>
            Accédez à votre tableau de bord et gérez votre programme de fidélité.
          </p>
        </div>

        {/* Témoignage */}
        <div style={{
          background: "#1A1A1A", border: "1px solid #2A2A2A",
          borderRadius: 12, padding: 20,
        }}>
          {/* Étoiles */}
          <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
            {[0,1,2,3,4].map(i => (
              <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={GOLD}>
                <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.3 3.3 12.3 4 8.2 1 5.3l4.2-.7L7 1z" />
              </svg>
            ))}
          </div>
          <p style={{
            fontFamily: "var(--font-playfair, Georgia, serif)",
            fontSize: 15, fontStyle: "italic", color: "#FFFFFF",
            margin: "0 0 10px", lineHeight: 1.6,
          }}>
            &ldquo;Fideloo a multiplié par 3 notre taux de clients fidèles en 2 mois.&rdquo;
          </p>
          <p style={{ fontSize: 13, color: GRAY, margin: 0 }}>
            — Marie L., Le Bon Café, Lyon
          </p>
        </div>
      </div>

      {/* ── Colonne droite — fond clair ── */}
      <div style={{
        width: "50%", background: BG, padding: "60px",
        display: "flex", flexDirection: "column", overflowY: "auto",
      }} className="login-right">

        {/* Retour */}
        <div>
          <Link href="/" style={{ fontSize: 13, color: GRAY, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = INK)}
            onMouseLeave={e => (e.currentTarget.style.color = GRAY)}>
            ← Retour au site
          </Link>
        </div>

        {/* Titre */}
        <h1 style={{
          fontFamily: "var(--font-playfair, Georgia, serif)",
          fontSize: 28, fontWeight: 400, color: INK,
          marginTop: 32, marginBottom: 4,
        }}>
          Se connecter
        </h1>
        <p style={{ fontSize: 14, color: GRAY, margin: "0 0 28px" }}>
          Pas encore de compte ?{" "}
          <Link href="/register?plan=trial" style={{ color: GOLD, textDecoration: "none", fontWeight: 500 }}>
            Essai gratuit 14 jours →
          </Link>
        </p>

        {/* Erreur */}
        {error && (
          <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: "rgba(220,38,38,0.08)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="vous@commerce.fr" style={inputBase}
              onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
              onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
          </div>

          {/* Mot de passe */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: INK }}>Mot de passe</label>
              <Link href="/forgot-password" style={{ fontSize: 13, color: GOLD, textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Mot de passe oublié ?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputBase, paddingRight: 44 }}
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY, padding: 0, display: "flex" }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{
              width: "100%", padding: "14px",
              background: loading ? GRAY : INK, color: "#FFFFFF",
              borderRadius: 999, fontSize: 15, fontWeight: 600,
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8, marginTop: 4,
            }}>
            {loading
              ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Connexion…</>
              : "Se connecter →"}
          </button>
        </form>

        {/* Séparateur */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: BORD }} />
          <span style={{ fontSize: 12, color: GRAY, letterSpacing: "0.08em" }}>ou</span>
          <div style={{ flex: 1, height: 1, background: BORD }} />
        </div>

        {/* OAuth */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {googleClientId ? (
            <button type="button" onClick={handleGoogleClick} disabled={loading || !googleReady}
              style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#FFFFFF", border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 14, fontWeight: 500, color: INK, cursor: "pointer", fontFamily: "inherit", opacity: (loading || !googleReady) ? 0.5 : 1 }}>
              {loading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <GoogleIcon />}
              Continuer avec Google
            </button>
          ) : (
            <button disabled style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#FFFFFF", border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 14, color: GRAY, opacity: 0.4, cursor: "not-allowed", fontFamily: "inherit" }}>
              <GoogleIcon /> Google (non configuré)
            </button>
          )}
          <div id="google-fallback-btn" style={{ display: "none", justifyContent: "center" }} />

          {appleServiceId ? (
            <button type="button" onClick={handleAppleSignIn} disabled={loading || !appleReady}
              style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#FFFFFF", border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 14, fontWeight: 500, color: INK, cursor: "pointer", fontFamily: "inherit", opacity: (loading || !appleReady) ? 0.5 : 1 }}>
              {loading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <AppleIcon />}
              Continuer avec Apple
            </button>
          ) : (
            <button disabled style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#FFFFFF", border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 14, color: INK, opacity: 0.4, cursor: "not-allowed", fontFamily: "inherit" }}>
              <AppleIcon /> Apple (non configuré)
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #F5F3EE inset !important;
          -webkit-text-fill-color: #0B0F0E !important;
          caret-color: #0B0F0E !important;
        }

        .login-root { min-height: 100vh; }

        @media (max-width: 768px) {
          .login-root { flex-direction: column; }
          .login-left {
            width: 100% !important;
            min-height: 200px !important;
            padding: 28px 24px !important;
            justify-content: flex-start !important;
          }
          .login-left h2 { font-size: 24px !important; margin-top: 20px !important; }
          .login-left > div:last-child { display: none !important; }
          .login-right {
            width: 100% !important;
            padding: 32px 24px !important;
          }
        }
      `}</style>
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
    <svg viewBox="0 0 814.6 1000" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 411.6 0 279.6 0 154.8 0 71.5 26.5 .88 72.8-27.1c44.3-26.3 99.8-35.1 149.4-35.1 73.4 0 133.8 47.1 178.6 47.1 42.8 0 109.8-50.1 194.8-50.1 31.5 0 108.1 6.4 160 60.9zm-134.2-66.4c-27.3 32.4-69.4 57.8-120.3 57.8-5.1 0-10.3-.4-15.4-1.1-3.4-48.8 16.4-101.6 47.4-135.9 25.9-29.2 70.5-53.7 115.2-57.8 3.8 52.6-14.4 104.3-26.9 137z"/>
    </svg>
  );
}
