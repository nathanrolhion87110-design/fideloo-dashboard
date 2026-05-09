"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../utils/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/merchants/forgot-password", { email });
      setSent(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setError(e.response?.data?.error || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-main py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-2xl mb-6">
            F
          </div>
          <h2 className="text-2xl font-bold text-text-main">Mot de passe oublié ?</h2>
          <p className="mt-2 text-sm text-text-muted">
            Entrez votre email et nous vous enverrons un lien de réinitialisation.
          </p>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-bold text-text-main">Email envoyé !</h3>
            <p className="text-sm text-text-muted">
              Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien de réinitialisation valable 15 minutes.
            </p>
            <p className="text-xs text-text-muted">Vérifiez aussi vos spams.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline mt-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </motion.div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-4 text-sm text-error bg-error/10 rounded-xl border border-error/20">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
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
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-main transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
