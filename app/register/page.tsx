"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { GoogleLogo } from "@/components/icons/GoogleLogo";
import { AppleLogo } from "@/components/icons/AppleLogo";

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

const ADVANTAGES = [
  "Apple Wallet & Google Wallet inclus",
  "Jusqu'à 5 000 clients",
  "Analytics avancés & campagnes push",
  "Support prioritaire 48h",
];

const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café / Bar" },
  { value: "boulangerie", label: "Boulangerie" },
  { value: "coiffeur", label: "Coiffeur" },
  { value: "epicerie", label: "Épicerie" },
  { value: "boutique", label: "Boutique" },
  { value: "autre", label: "Autre" },
];

function RegisterContent() {
  const searchParams = useSearchParams();
  const isTrial = searchParams.get("plan") === "trial";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const body: Record<string, unknown> = {
        email,
        password,
        business_name: [firstName, lastName].filter(Boolean).join(" ") || email,
        business_type: businessType,
        website: honeypot,
      };
      if (isTrial) {
        body.plan = "pro";
        body.trial_ends_at = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      }
      const r = await api.post("/merchants/register", body);
      login(r.data.token, r.data.merchant);
      router.push("/onboarding");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Une erreur est survenue");
    } finally { setLoading(false); }
  };

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const appleServiceId = process.env.NEXT_PUBLIC_APPLE_SERVICE_ID;

  // ── Guard : accès uniquement via ?plan=trial ────────────────────────────────
  if (!isTrial) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <img src="/brand/fideloo-logo-linked.svg" height="32" alt="Fideloo" style={{ marginBottom: 40 }} />
          <p style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 22, color: INK, marginBottom: 12, lineHeight: 1.4 }}>
            Pour créer un compte, commencez votre essai gratuit de 14 jours.
          </p>
          <p style={{ fontSize: 14, color: GRAY, marginBottom: 32, lineHeight: 1.6 }}>
            Accès complet au plan Pro. Sans carte bancaire.
          </p>
          <Link href="/#tarifs" style={{
            display: "inline-block",
            background: INK, color: "#FFFFFF",
            borderRadius: 999, padding: "13px 28px",
            fontSize: 14, fontWeight: 600, textDecoration: "none",
            fontFamily: "var(--font-sora, system-ui)",
          }}>
            Voir nos offres →
          </Link>
        </div>
      </div>
    );
  }

  // ── Layout 50/50 ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", display: "flex" }} className="register-root">

      {/* ── Colonne gauche — fond sombre ── */}
      <div style={{
        width: "50%", background: INK, padding: "60px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }} className="register-left">

        {/* Logo */}
        <div>
          <Link href="/">
            <img src="/brand/fideloo-logo-linked-onDark.svg" height="32" alt="Fideloo" />
          </Link>

          {/* Titre */}
          <h2 style={{
            fontFamily: "var(--font-playfair, Georgia, serif)",
            fontSize: 36, fontWeight: 400, color: "#FFFFFF",
            marginTop: 48, marginBottom: 0, lineHeight: 1.25,
          }}>
            Commencez votre essai<br />
            <em style={{ fontStyle: "italic", color: GOLD }}>gratuit de 14 jours.</em>
          </h2>
          <p style={{ color: GRAY, fontSize: 15, marginTop: 16, lineHeight: 1.6 }}>
            Accès complet au plan Pro. Sans carte bancaire. Annulable à tout moment.
          </p>

          {/* Avantages */}
          <ul style={{ listStyle: "none", padding: 0, margin: "40px 0 0", display: "flex", flexDirection: "column", gap: 14 }}>
            {ADVANTAGES.map((adv) => (
              <li key={adv} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "rgba(184,135,58,0.20)", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span style={{ fontSize: 14, color: "#FFFFFF" }}>{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card basse — info prix */}
        <div style={{
          background: "#1A1A1A", border: "1px solid #2A2A2A",
          borderRadius: 12, padding: 20, marginTop: 48,
        }}>
          <span style={{
            display: "inline-block",
            background: "rgba(184,135,58,0.20)", border: "1px solid rgba(184,135,58,0.40)",
            color: GOLD, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            borderRadius: 999, padding: "3px 10px", marginBottom: 12,
            fontFamily: "var(--font-sora, system-ui)",
          }}>
            PLAN PRO — 14 JOURS OFFERTS
          </span>
          <p style={{
            fontFamily: "var(--font-playfair, Georgia, serif)",
            fontSize: 16, color: "#FFFFFF", margin: 0, lineHeight: 1.5,
          }}>
            Puis 80€/mois. Résiliez avant la fin de l&apos;essai et ne payez rien.
          </p>
        </div>
      </div>

      {/* ── Colonne droite — fond clair ── */}
      <div style={{
        width: "50%", background: BG, padding: "60px",
        display: "flex", flexDirection: "column", overflowY: "auto",
      }} className="register-right">

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
          Créer votre compte
        </h1>
        <p style={{ fontSize: 14, color: GRAY, margin: "0 0 28px" }}>
          Déjà inscrit ?{" "}
          <Link href="/login" style={{ color: GOLD, textDecoration: "none", fontWeight: 500 }}>
            Se connecter →
          </Link>
        </p>

        {/* Erreur */}
        {error && (
          <div style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 8, background: "rgba(220,38,38,0.08)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off"
            value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} />

          {/* Prénom / Nom */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Prénom</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                placeholder="Marie" style={inputBase}
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Nom</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                placeholder="Dupont" style={inputBase}
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Email professionnel</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="vous@commerce.fr" style={inputBase}
              onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
              onBlur={e => (e.currentTarget.style.borderColor = BORD)} />
          </div>

          {/* Mot de passe */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Mot de passe</label>
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

          {/* Type de commerce */}
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Type de commerce</label>
            <div style={{ position: "relative" }}>
              <select value={businessType} onChange={e => setBusinessType(e.target.value)}
                style={{ ...inputBase, paddingRight: 36, appearance: "none" }}
                onFocus={e => (e.currentTarget.style.borderColor = GOLD)}
                onBlur={e => (e.currentTarget.style.borderColor = BORD)}>
                {BUSINESS_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5l4 4 4-4" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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
              ? <><Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> Création…</>
              : "Commencer l'essai gratuit →"}
          </button>

          <p style={{ textAlign: "center", fontSize: 12, color: GRAY, margin: 0 }}>
            Sans carte bancaire · 14 jours offerts · Résiliation libre
          </p>
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
              {loading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <GoogleLogo size={18} />}
              Continuer avec Google
            </button>
          ) : (
            <button disabled style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#FFFFFF", border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 14, color: GRAY, opacity: 0.4, cursor: "not-allowed", fontFamily: "inherit" }}>
              <GoogleLogo size={18} /> Google (non configuré)
            </button>
          )}
          <div id="google-fallback-btn-register" style={{ display: "none", justifyContent: "center" }} />

          {appleServiceId ? (
            <button type="button" onClick={handleAppleSignIn} disabled={loading || !appleReady}
              style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#FFFFFF", border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 14, fontWeight: 500, color: INK, cursor: "pointer", fontFamily: "inherit", opacity: (loading || !appleReady) ? 0.5 : 1 }}>
              {loading ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <AppleLogo size={16} />}
              Continuer avec Apple
            </button>
          ) : (
            <button disabled style={{ width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#FFFFFF", border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 14, color: INK, opacity: 0.4, cursor: "not-allowed", fontFamily: "inherit" }}>
              <AppleLogo size={16} /> Apple (non configuré)
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
        select option { background: #F5F3EE; color: #0B0F0E; }

        .register-root { min-height: 100vh; }

        @media (max-width: 768px) {
          .register-root { flex-direction: column; }
          .register-left {
            width: 100% !important;
            min-height: 200px !important;
            padding: 28px 24px !important;
            justify-content: flex-start !important;
          }
          .register-left h2 { font-size: 24px !important; margin-top: 20px !important; }
          .register-left ul,
          .register-left > div:last-child { display: none !important; }
          .register-right {
            width: 100% !important;
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ background: "#EDEBE4", minHeight: "100vh" }} />}>
      <RegisterContent />
    </Suspense>
  );
}
