"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Store, Tag, Loader2, ChevronDown } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { FideloLogoStamp } from "../../components/FideloLogoStamp";

const BG   = "#EDEBE4";
const CARD = "#FFFFFF";
const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY  = "#6B6B6B";
const BORD  = "#E0DDD6";
const INPUT = "#F5F3EE";

const inputStyle = {
  width: "100%", padding: "12px 16px 12px 40px",
  background: INPUT, border: `1px solid ${BORD}`, borderRadius: 8,
  fontSize: 14, color: INK, outline: "none", fontFamily: "inherit",
  transition: "border-color 0.15s",
};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");
  const [honeypot, setHoneypot] = useState("");
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
      const res = await api.post("/merchants/auth/google", { token: credential, credential, mode: "register" });
      login(res.data.token, res.data.merchant);
      router.push(res.data.merchant.onboarding_complete ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string; message?: string } } };
      setError(e.response?.data?.error || e.response?.data?.message || "Erreur Google OAuth");
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
      if (n.isNotDisplayed() || n.isSkippedMoment()) {
        const c = document.getElementById("google-fallback-btn-register");
        if (c && window.google) {
          c.innerHTML = ""; c.style.display = "flex";
          window.google.accounts.id.renderButton(c, { theme: "outline", size: "large", width: 320, text: "signup_with", locale: "fr" });
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
        window.AppleID.auth.init({ clientId: serviceId, scope: "name email", redirectURI: process.env.NEXT_PUBLIC_APP_URL || window.location.origin, usePopup: true });
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
      const r = await api.post("/merchants/register", {
        email, password,
        business_name: businessName, business_type: businessType,
        website: honeypot,
      });
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
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth: 480, background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 48, margin: "24px 0" }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <Link href="/">
            <FideloLogoStamp variant="default" size={36} />
          </Link>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: 32, color: INK, lineHeight: 1.2, marginBottom: 6 }}>
            Créez votre compte,<br /><em style={{ fontStyle: "italic" }}>c&apos;est gratuit.</em>
          </h1>
        </div>

        {/* Social buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {googleClientId ? (
            <button type="button" onClick={handleGoogleClick} disabled={loading || !googleReady}
              style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: CARD, border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 14, fontWeight: 500, color: INK, cursor: "pointer", fontFamily: "inherit", opacity: (loading || !googleReady) ? 0.5 : 1 }}>
              {loading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <GoogleIcon />}
              S&apos;inscrire avec Google
            </button>
          ) : (
            <button disabled style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: CARD, border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 14, color: GRAY, opacity: 0.4, cursor: "not-allowed", fontFamily: "inherit" }}>
              <GoogleIcon /> Google (non configuré)
            </button>
          )}
          <div id="google-fallback-btn-register" style={{ display: "none", justifyContent: "center" }} />

          {appleServiceId ? (
            <button type="button" onClick={handleAppleSignIn} disabled={loading || !appleReady}
              style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: INK, border: "none", borderRadius: 999, fontSize: 14, fontWeight: 500, color: "#FFFFFF", cursor: "pointer", fontFamily: "inherit", opacity: (loading || !appleReady) ? 0.5 : 1 }}>
              {loading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <AppleIcon />}
              S&apos;inscrire avec Apple
            </button>
          ) : (
            <button disabled style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: INK, border: "none", borderRadius: 999, fontSize: 14, color: "#fff", opacity: 0.4, cursor: "not-allowed", fontFamily: "inherit" }}>
              <AppleIcon /> Apple (non configuré)
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: BORD }} />
          <span style={{ fontSize: 12, color: GRAY, letterSpacing: "0.08em" }}>OU</span>
          <div style={{ flex: 1, height: 1, background: BORD }} />
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: "rgba(220,38,38,0.08)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)", fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off"
            value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 0, height: 0, opacity: 0, pointerEvents: "none" }} />

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: INK, marginBottom: 6 }}>Nom du commerce</label>
            <div style={{ position: "relative" }}>
              <Store style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: GRAY, pointerEvents: "none" }} />
              <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                style={inputStyle} placeholder="Ma Boulangerie"
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: INK, marginBottom: 6 }}>Type de commerce</label>
            <div style={{ position: "relative" }}>
              <Tag style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: GRAY, pointerEvents: "none", zIndex: 1 }} />
              <ChevronDown style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: GOLD, pointerEvents: "none", zIndex: 1 }} />
              <select value={businessType} onChange={(e) => setBusinessType(e.target.value)}
                style={{ ...inputStyle, paddingRight: 36, appearance: "none" }}
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = BORD)}>
                <option value="restaurant">Restaurant</option>
                <option value="boulangerie">Boulangerie</option>
                <option value="coiffeur">Coiffeur</option>
                <option value="cafe">Café</option>
                <option value="boutique">Boutique</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: INK, marginBottom: 6 }}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: GRAY, pointerEvents: "none" }} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                style={inputStyle} placeholder="vous@commerce.fr"
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: INK, marginBottom: 6 }}>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: GRAY, pointerEvents: "none" }} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                style={inputStyle} placeholder="••••••••"
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "14px", background: loading ? GRAY : INK, color: "#FFFFFF", borderRadius: 999, fontSize: 15, fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
            {loading ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Création…</> : "Créer mon compte — c'est gratuit"}
          </button>
        </form>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, color: GRAY }}>
          Déjà un compte ?{" "}
          <Link href="/login" style={{ color: GOLD, fontWeight: 600, textDecoration: "none" }}>Se connecter</Link>
        </p>
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
        select option { background: #F5F3EE; color: #0B0F0E; }
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
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    </svg>
  );
}
