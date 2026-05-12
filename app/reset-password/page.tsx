"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../../utils/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="font-medium" style={{ color: "#fb7185" }}>Lien invalide ou expiré.</p>
        <Link href="/forgot-password"
          className="text-sm"
          style={{ color: "var(--violet)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--violet)")}>
          Faire une nouvelle demande
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setLoading(true);
    try {
      await api.post("/merchants/reset-password", { token, password });
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Lien invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>Mot de passe mis à jour !</h3>
        <p className="text-sm" style={{ color: "var(--text-dim)" }}>Vous allez être redirigé vers la connexion...</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm"
          style={{ background: "rgba(251,113,133,0.1)", color: "#fb7185", border: "1px solid rgba(251,113,133,0.25)" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(245,245,243,0.8)", marginBottom: 6 }}>
            Nouveau mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-dim)" }} />
            <input type={showPwd ? "text" : "password"} required value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field pl-10 pr-10" placeholder="Minimum 8 caractères" />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
              style={{ color: "var(--text-dim)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}>
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(245,245,243,0.8)", marginBottom: 6 }}>
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--text-dim)" }} />
            <input type={showPwd ? "text" : "password"} required value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="input-field pl-10" placeholder="Répétez le mot de passe" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="btn btn-accent btn-lg w-full justify-center disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mettre à jour le mot de passe"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--text-dim)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}>
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
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
            Nouveau mot de passe
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-dim)" }}>Choisissez un mot de passe sécurisé.</p>
        </div>

        <Suspense fallback={<div className="text-center text-sm" style={{ color: "var(--text-dim)" }}>Chargement...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
