"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, CheckCircle2, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Merchant {
  id: string; business_name: string; primary_color: string;
  reward_threshold: number; reward_description: string;
  logo_url: string | null; strip_url: string | null;
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
  const [honeypot, setHoneypot] = useState(""); // anti-bots

  useEffect(() => {
    fetch(`${API_URL}/merchants/${merchantId}`)
      .then((r) => r.json())
      .then((data) => { if (data.error) throw new Error(data.error); setMerchant(data); })
      .catch(() => setMerchant(null))
      .finally(() => setLoadingMerchant(false));
  }, [merchantId]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      console.log("[Join] Création client merchant", merchantId);
      const res = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: merchantId, name, email, birthday: birthday || null,
          website: honeypot, // anti-bots
        }),
      });
      const data = await res.json();
      if (res.status === 403) {
        throw new Error(data.message || data.error || "Ce commerce a atteint sa limite de clients. Contactez le commerçant.");
      }
      if (!res.ok) throw new Error(data.error || data.message || "Erreur lors de l'inscription");
      console.log("[Join] Client créé id =", data.id);
      setCustomerId(data.id);
      setStep("success");
    } catch (err: unknown) {
      console.error("[Join] err", err);
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally { setSubmitting(false); }
  };

  const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);
  const color = merchant?.primary_color || "#7C3AED";

  if (loadingMerchant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#A78BFA" }} />
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <p className="text-text-main font-bold text-lg mb-2">Commerce introuvable</p>
          <p className="text-text-muted text-sm">Ce lien n&apos;est plus valide.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
         style={{ background: `linear-gradient(135deg, ${color} 0%, #0A0A0F 100%)` }}>
      {/* Orbes lumineux personnalisés à la couleur du commerce */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="float-orb absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full blur-3xl opacity-50"
             style={{ background: `radial-gradient(circle, ${color}80, transparent 70%)` }} />
        <div className="float-orb absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full blur-3xl opacity-40"
             style={{ background: `radial-gradient(circle, ${color}60, transparent 70%)`, animationDelay: "-7s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 text-white fade-in-up">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl font-extrabold overflow-hidden"
               style={{
                 background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
                 border: "1px solid rgba(255,255,255,0.25)",
                 boxShadow: `0 20px 50px ${color}55, 0 0 30px rgba(255,255,255,0.2) inset`
               }}>
            {merchant.logo_url ? (
              <img src={merchant.logo_url} alt={merchant.business_name} className="w-full h-full object-cover" />
            ) : (
              merchant.business_name.charAt(0)
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ letterSpacing: "-0.025em" }}>{merchant.business_name}</h1>
          <p className="opacity-90 mt-2 text-sm">Rejoignez notre programme de fidélité</p>
        </div>

        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.div key="form"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl p-8 glass-strong">
              <div className="rounded-2xl p-4 flex items-center gap-4 mb-6"
                   style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{ background: `${color}30`, color: color }}>
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-text-muted">Récompense ({merchant.reward_threshold} pts)</div>
                  <div className="font-bold text-text-main">{merchant.reward_description}</div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl text-sm border"
                     style={{ background: "rgba(239,68,68,0.1)", color: "#FCA5A5", borderColor: "rgba(239,68,68,0.3)" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot anti-bots */}
                <input
                  type="text" name="website" tabIndex={-1} autoComplete="off"
                  value={honeypot} onChange={(e) => setHoneypot(e.target.value)}
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
                />
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Prénom et nom</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="input-dark w-full rounded-xl py-3 px-4 text-sm" placeholder="Ex: Lucas Bernard" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input-dark w-full rounded-xl py-3 px-4 text-sm" placeholder="lucas@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">
                    Date d&apos;anniversaire <span className="text-text-muted font-normal">(optionnel)</span>
                  </label>
                  <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)}
                    className="input-dark w-full rounded-xl py-3 px-4 text-sm" />
                </div>

                <button type="submit" disabled={submitting}
                  className="w-full py-4 rounded-xl font-bold text-white text-base transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                    boxShadow: `0 0 24px ${color}55, 0 1px 0 rgba(255,255,255,0.2) inset`
                  }}>
                  {submitting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Création en cours…</>) : "Obtenir ma carte"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
              {/* Aperçu carte */}
              <div className="relative w-full aspect-[16/9] rounded-2xl shadow-2xl overflow-hidden mb-8"
                   style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                            boxShadow: `0 30px 60px ${color}80, 0 0 0 1px rgba(255,255,255,0.1) inset` }}>
                {merchant.strip_url && (
                  <img src={merchant.strip_url} alt="strip" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="relative p-5 flex justify-between items-start text-white">
                  <div className="font-extrabold text-xl">{merchant.business_name}</div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold">
                    {merchant.business_name.charAt(0)}
                  </div>
                </div>
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm opacity-80 mb-1">Points</div>
                      <div className="text-3xl font-extrabold">0/{merchant.reward_threshold}</div>
                    </div>
                    {customerId && (
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${customerId}`}
                           alt="QR" className="w-16 h-16 rounded bg-white p-1" />
                    )}
                  </div>
                </div>
              </div>

              {/* Bloc succès */}
              <div className="rounded-3xl p-8 w-full text-center glass-strong">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                     style={{ background: "rgba(16,185,129,0.15)", color: "#34D399" }}>
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-text-main mb-2">Carte créée !</h2>
                <p className="text-text-muted mb-8">Ajoutez-la maintenant à votre téléphone pour ne jamais l&apos;oublier.</p>

                <div className="space-y-3">
                  {customerId && (
                    <a href={`${API_URL}/passes/apple/${customerId}`}
                       onClick={() => console.log("[Join] DL Apple Wallet pass", customerId)}
                       className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-medium text-base text-white transition-colors btn-apple-wallet">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="white" aria-hidden>
                        <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
                      </svg>
                      Ajouter à Apple Wallet
                    </a>
                  )}
                  {customerId && <GoogleWalletButton customerId={customerId} apiUrl={API_URL} />}
                </div>

                {customerId && (
                  <a href={`/card/${customerId}`}
                     className="block mt-6 text-sm font-medium text-text-muted hover:text-white underline transition-colors">
                    Voir ma carte sur le web →
                  </a>
                )}
                {!isIOS && (
                  <p className="mt-4 text-xs text-text-muted">
                    💡 Astuce : ouvrez ce lien sur votre iPhone pour ajouter à Apple Wallet.
                  </p>
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
    } catch { /* silencieux */ }
    finally { setLoading(false); }
  };
  return (
    <button onClick={handleClick} disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl font-medium text-base transition-colors disabled:opacity-60"
      style={{ background: "rgba(255,255,255,0.06)", color: "#F1F5F9", border: "1px solid rgba(255,255,255,0.1)" }}>
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
          <path fill="#EA4335" d="M12 11.5v3.6h5.1c-.2 1.3-1.6 3.8-5.1 3.8-3.1 0-5.6-2.6-5.6-5.7s2.5-5.7 5.6-5.7c1.7 0 2.9.7 3.5 1.3l2.4-2.3C16.4 5.1 14.4 4 12 4 7.6 4 4 7.6 4 12s3.6 8 8 8c4.6 0 7.7-3.2 7.7-7.7 0-.5-.1-.9-.1-1.3H12z" />
        </svg>
      )}
      Ajouter à Google Wallet
    </button>
  );
}
