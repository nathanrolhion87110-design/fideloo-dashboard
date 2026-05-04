"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, CheckCircle2, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Merchant {
  id: string;
  business_name: string;
  primary_color: string;
  reward_threshold: number;
  reward_description: string;
  logo_url: string | null;
  strip_url: string | null;
}

export default function JoinPage() {
  const { merchantId } = useParams<{ merchantId: string }>();

  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loadingMerchant, setLoadingMerchant] = useState(true);
  const [step, setStep] = useState<"form" | "success">("form");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/merchants/${merchantId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setMerchant(data);
      })
      .catch(() => setMerchant(null))
      .finally(() => setLoadingMerchant(false));
  }, [merchantId]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchant_id: merchantId, name, email, birthday: birthday || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'inscription");
      setCustomerId(data.id);
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const color = merchant?.primary_color || "#6366F1";

  if (loadingMerchant) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: color }}>
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <p className="text-text-main font-bold text-lg mb-2">Commerce introuvable</p>
          <p className="text-text-muted text-sm">Ce lien n&apos;est plus valide.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6" style={{ backgroundColor: color }}>
      <div className="w-full max-w-md relative z-10">

        <div className="text-center mb-8 text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-sm border border-white/20 overflow-hidden">
            {merchant.logo_url ? (
              <img src={merchant.logo_url} alt={merchant.business_name} className="w-full h-full object-cover" />
            ) : (
              merchant.business_name.charAt(0)
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{merchant.business_name}</h1>
          <p className="opacity-90 mt-2">Rejoignez notre programme de fidélité</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-primary">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-text-muted">Récompense ({merchant.reward_threshold} points)</div>
                  <div className="font-bold text-text-main">{merchant.reward_description}</div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Prénom et nom</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-text-main focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none"
                    placeholder="Ex: Lucas Bernard"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-text-main focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none"
                    placeholder="lucas@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">
                    Date d&apos;anniversaire <span className="text-text-muted font-normal">(optionnel)</span>
                  </label>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-4 text-text-main focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 text-white rounded-xl font-bold shadow-md transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{ backgroundColor: color }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    "Obtenir ma carte"
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-full aspect-[16/9] rounded-2xl shadow-2xl overflow-hidden mb-8" style={{ backgroundColor: color }}>
                {merchant.strip_url && (
                  <img src={merchant.strip_url} alt="strip" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="relative p-5 flex justify-between items-start text-white">
                  <div className="font-bold text-xl">{merchant.business_name}</div>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    {merchant.business_name.charAt(0)}
                  </div>
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm opacity-80 mb-1">Points</div>
                      <div className="text-3xl font-bold">0/{merchant.reward_threshold}</div>
                    </div>
                    {customerId && (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${customerId}`}
                        alt="QR"
                        className="w-16 h-16 rounded bg-white p-1"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 w-full text-center shadow-xl">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-text-main mb-2">Carte créée !</h2>
                <p className="text-text-muted mb-8">
                  Ajoutez-la maintenant à votre téléphone pour ne jamais l&apos;oublier.
                </p>

                <div className="space-y-3">
                  {customerId && (
                    <a
                      href={`${API_URL}/passes/apple/${customerId}`}
                      className="w-full flex items-center justify-center gap-3 bg-black text-white px-4 py-4 rounded-xl hover:bg-black/90 transition-colors font-medium text-lg shadow-md"
                    >
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="fill-white">
                        <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                        <path d="M10 2c1 .5 2 2 2 5" />
                      </svg>
                      Ajouter à Apple Wallet
                    </a>
                  )}
                  {customerId && (
                    <GoogleWalletButton customerId={customerId} apiUrl={API_URL} />
                  )}
                </div>

                {customerId && (
                  <a
                    href={`/card/${customerId}`}
                    className="block mt-6 text-sm font-medium text-text-muted hover:text-text-main underline"
                  >
                    Voir ma carte sur le web →
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GoogleWalletButton({ customerId, apiUrl }: { customerId: string; apiUrl: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/passes/google/${customerId}`);
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 border-2 border-slate-200 px-4 py-4 rounded-xl hover:bg-slate-50 transition-colors font-medium text-lg shadow-sm disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
      )}
      Ajouter à Google Wallet
    </button>
  );
}
