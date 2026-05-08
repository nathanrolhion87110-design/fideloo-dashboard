"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
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
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup: boolean;
        }) => void;
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

  // ─── Google OAuth ────────────────────────────────────────────────────────────

  const handleGoogleCredential = useCallback(async (credential: string) => {
    console.log("[Google][login] Credential reçu (longueur:", credential.length, "), envoi au backend...");
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/merchants/auth/google", { token: credential, credential, mode: "login" });
      console.log("[Google][login] Backend OK, merchant =", res.data.merchant?.email);
      login(res.data.token, res.data.merchant);
      router.push(res.data.merchant.onboarding_complete ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { error?: string } } };
      console.error("[Google][login] Erreur backend:", e.response?.status, e.response?.data?.error || err);
      if (e.response?.status === 404) {
        setError("Aucun compte trouvé avec ce compte Google. Créez un compte d'abord.");
      } else {
        setError(e.response?.data?.error || "Erreur Google OAuth");
      }
    } finally {
      setLoading(false);
    }
  }, [login, router]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("[Google][login] NEXT_PUBLIC_GOOGLE_CLIENT_ID non défini — bouton Google désactivé");
      return;
    }
    if (googleScriptLoadedRef.current) return;

    const initGsi = () => {
      if (!window.google) {
        console.error("[Google][login] window.google introuvable après chargement du SDK");
        return;
      }
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => {
            console.log("[Google][login] Callback déclenché");
            handleGoogleCredential(response.credential);
          },
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        setGoogleReady(true);
        console.log("[Google][login] SDK initialisé, prêt à recevoir un clic. clientId=", clientId);
      } catch (e) {
        console.error("[Google][login] Erreur initialize:", e);
      }
    };

    if (window.google?.accounts?.id) {
      googleScriptLoadedRef.current = true;
      initGsi();
      return;
    }

    console.log("[Google][login] Chargement SDK GSI...");
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("[Google][login] SDK GSI chargé");
      googleScriptLoadedRef.current = true;
      initGsi();
    };
    script.onerror = (e) => console.error("[Google][login] Erreur chargement SDK:", e);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [handleGoogleCredential]);

  const handleGoogleClick = () => {
    console.log("[Google][login] Clic sur le bouton Google");
    if (!window.google?.accounts?.id) {
      console.error("[Google][login] SDK Google non chargé au moment du clic");
      setError("SDK Google non chargé. Rechargez la page.");
      return;
    }
    try {
      window.google.accounts.id.prompt((notification: PromptMomentNotification) => {
        console.log("[Google][login] Prompt notification:", {
          notDisplayed: notification.isNotDisplayed(),
          notDisplayedReason: notification.isNotDisplayed() ? notification.getNotDisplayedReason() : null,
          skipped: notification.isSkippedMoment(),
          skippedReason: notification.isSkippedMoment() ? notification.getSkippedReason() : null,
          dismissed: notification.isDismissedMoment(),
          dismissedReason: notification.isDismissedMoment() ? notification.getDismissedReason() : null,
        });
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback : rendre un bouton officiel et déclencher son clic
          console.warn("[Google][login] Prompt non affiché, fallback renderButton");
          const container = document.getElementById("google-fallback-btn");
          if (container && window.google) {
            container.innerHTML = "";
            window.google.accounts.id.renderButton(container, {
              theme: "outline",
              size: "large",
              width: 320,
              text: "signin_with",
              locale: "fr",
            });
            container.style.display = "flex";
          }
        }
      });
    } catch (e) {
      console.error("[Google][login] Erreur prompt():", e);
    }
  };

  // ─── Apple Sign In ───────────────────────────────────────────────────────────

  useEffect(() => {
    const serviceId = process.env.NEXT_PUBLIC_APPLE_SERVICE_ID;
    if (!serviceId) {
      console.warn("[Apple][login] NEXT_PUBLIC_APPLE_SERVICE_ID non défini — bouton Apple désactivé");
      return;
    }
    console.log("[Apple][login] Chargement SDK Apple Sign In...");
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = () => {
      console.log("[Apple][login] SDK chargé");
      if (!window.AppleID) {
        console.error("[Apple][login] window.AppleID introuvable après chargement du SDK");
        return;
      }
      try {
        window.AppleID.auth.init({
          clientId: serviceId,
          scope: "name email",
          redirectURI: process.env.NEXT_PUBLIC_APP_URL || window.location.origin,
          usePopup: true,
        });
        setAppleReady(true);
        console.log("[Apple][login] init() OK, serviceId:", serviceId);
      } catch (e) {
        console.error("[Apple][login] Erreur init():", e);
      }
    };
    script.onerror = (e) => console.error("[Apple][login] Erreur chargement SDK:", e);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []);

  const handleAppleSignIn = async () => {
    console.log("[Apple][login] Clic sur le bouton Apple");
    if (!window.AppleID) {
      console.error("[Apple][login] window.AppleID non disponible au moment du clic");
      setError("SDK Apple non chargé. Rechargez la page.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      console.log("[Apple][login] Déclenchement signIn()...");
      const data = await window.AppleID.auth.signIn();
      console.log("[Apple][login] signIn() réussi, identityToken length:", data.authorization?.id_token?.length);
      const res = await api.post("/merchants/auth/apple", {
        token: data.authorization.id_token,
        identityToken: data.authorization.id_token,
        user: data.user,
        mode: "login",
      });
      console.log("[Apple][login] Backend OK, merchant =", res.data.merchant?.email);
      login(res.data.token, res.data.merchant);
      router.push(res.data.merchant.onboarding_complete ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const appleErr = err as { error?: string };
      if (appleErr.error === "popup_closed_by_user" || appleErr.error === "user_trigger_new_signin_flow") {
        console.log("[Apple][login] Popup fermée par l'utilisateur");
        setLoading(false);
        return;
      }
      console.error("[Apple][login] Erreur signIn:", err);
      const axiosErr = err as { response?: { status?: number; data?: { error?: string } } };
      if (axiosErr.response?.status === 404) {
        setError("Aucun compte trouvé avec ce compte Apple. Créez un compte d'abord.");
      } else {
        setError(axiosErr.response?.data?.error || "Erreur Apple Sign In");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Email/Password ──────────────────────────────────────────────────────────

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/merchants/login", { email, password });
      login(res.data.token, res.data.merchant);
      router.push(res.data.merchant.onboarding_complete ? "/dashboard" : "/onboarding");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const appleServiceId = process.env.NEXT_PUBLIC_APPLE_SERVICE_ID;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100"
      >
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl mb-6">
            F
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-text-main">Bienvenue sur Fideloo</h2>
          <p className="mt-2 text-sm text-text-muted">La carte de fidélité digitale pour votre commerce</p>
        </div>

        <div className="mt-8 space-y-3">
          {/* Google Sign-In — bouton custom qui déclenche prompt() */}
          {googleClientId ? (
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={loading || !googleReady}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors font-medium text-text-main disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              )}
              Continuer avec Google
            </button>
          ) : (
            <button disabled className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl text-text-muted font-medium cursor-not-allowed opacity-60">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continuer avec Google (non configuré)
            </button>
          )}
          {/* Conteneur de fallback pour le bouton GSI officiel si prompt() bloqué */}
          <div id="google-fallback-btn" style={{ display: "none" }} className="w-full justify-center" />

          {/* Apple Sign-In */}
          {appleServiceId ? (
            <button
              type="button"
              onClick={handleAppleSignIn}
              disabled={loading || !appleReady}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black text-white rounded-xl hover:bg-black/90 transition-colors font-medium disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                </svg>
              )}
              Continuer avec Apple
            </button>
          ) : (
            <button disabled className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black/40 text-white rounded-xl font-medium cursor-not-allowed opacity-60">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
              </svg>
              Continuer avec Apple (non configuré)
            </button>
          )}
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-text-muted">ou</span>
          </div>
        </div>

        {error && (
          <div className="p-4 text-sm text-error bg-error/10 rounded-xl border border-error/20">{error}</div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-text-main shadow-sm focus:border-primary focus:ring-primary focus:bg-white transition-colors"
                placeholder="vous@commerce.fr"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-10 block w-full rounded-xl border-slate-200 bg-slate-50 py-3 text-text-main shadow-sm focus:border-primary focus:ring-primary focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="text-sm text-right">
            <Link href="/forgot-password" className="font-medium text-primary hover:text-primary/80">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Se connecter <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-medium text-primary hover:text-primary/80">
            Créer un compte
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
