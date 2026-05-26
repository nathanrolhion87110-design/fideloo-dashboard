"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Gift, CheckCircle, Coffee, Loader } from "lucide-react";
import { AppleLogo } from "@/components/icons/AppleLogo";
import { GoogleLogo } from "@/components/icons/GoogleLogo";

const API   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const BG    = "#EDEBE4";
const INK   = "#0B0F0E";
const GOLD  = "#B8873A";
const GRAY  = "#6B6B6B";
const WHITE = "#FFFFFF";
const BORD  = "#E0DDD6";

interface Merchant {
  id: string;
  business_name: string;
  primary_color: string | null;
  reward_threshold: number;
  reward_description: string;
  logo_url: string | null;
  strip_url: string | null;
}

export default function JoinPage() {
  const { merchantId } = useParams<{ merchantId: string }>();

  const [merchant, setMerchant]   = useState<Merchant | null>(null);
  const [loading, setLoading]     = useState(true);
  const [step, setStep]           = useState<"form" | "success">("form");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [birthday, setBirthday] = useState("");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    fetch(`${API}/merchants/${merchantId}`)
      .then(r => r.json())
      .then(data => { if (!data.error) setMerchant(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [merchantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merchant_id: merchantId, name, email, birthday: birthday || null, website: honeypot }),
      });
      const data = await res.json();
      if (res.status === 403) throw new Error(data.message || "Ce commerce a atteint sa limite de clients.");
      if (!res.ok) throw new Error(data.error || data.message || "Erreur lors de l'inscription");
      setCustomerId(data.id);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const openGoogleWallet = async () => {
    if (!customerId) return;
    setWalletLoading(true);
    try {
      const res  = await fetch(`${API}/passes/google/${customerId}`);
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
    } catch {}
    finally { setWalletLoading(false); }
  };

  const isIOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: BG }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${BORD}`, borderTopColor: GOLD, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: BG, padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p style={{ fontWeight: 700, color: INK, fontSize: 17, marginBottom: 8 }}>Commerce introuvable</p>
          <p style={{ color: GRAY, fontSize: 14 }}>Ce lien n&apos;est plus valide.</p>
        </div>
      </div>
    );
  }

  const stamps = merchant.reward_threshold;

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 48px" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} .join-fade{animation:fadeUp 0.4s ease both}`}</style>

      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo Fideloo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32, marginTop: 8 }}>
          <img src="/brand/fideloo-logo-linked.svg" alt="Fideloo" style={{ height: 28 }} />
        </div>

        {step === "form" ? (
          <div className="join-fade">
            {/* Carte aperçu commerçant */}
            <div style={{
              background: INK, borderRadius: 20, padding: 24, color: WHITE, marginBottom: 24,
              boxShadow: "0 16px 48px rgba(11,15,14,0.14)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: GOLD, marginBottom: 4, fontFamily: "var(--font-sora, system-ui)" }}>
                    CARTE FIDÉLITÉ
                  </div>
                  <div style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 20, fontWeight: 600 }}>
                    {merchant.business_name}
                  </div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(184,135,58,0.18)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  {merchant.logo_url
                    ? <img src={merchant.logo_url} alt={merchant.business_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <Coffee size={20} color={GOLD} />
                  }
                </div>
              </div>

              {/* Stamps */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {Array.from({ length: Math.min(stamps, 10) }).map((_, i) => (
                  <div key={i} style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: i === 0 ? GOLD : "rgba(255,255,255,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {i === 0 && <Coffee size={13} color={INK} />}
                  </div>
                ))}
                {stamps > 10 && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", alignSelf: "center" }}>+{stamps - 10}</div>}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>0 / {stamps}</div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(184,135,58,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Gift size={13} color={GOLD} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sora, system-ui)", marginBottom: 2 }}>RÉCOMPENSE · {stamps} pts</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{merchant.reward_description}</div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div style={{ background: WHITE, borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(11,15,14,0.06)", border: `1px solid ${BORD}` }}>
              <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 22, fontWeight: 600, color: INK, marginBottom: 6 }}>
                Rejoindre le programme
              </h1>
              <p style={{ fontSize: 13, color: GRAY, marginBottom: 24, lineHeight: 1.5 }}>
                Scannez votre carte à chaque visite pour accumuler des points et débloquer votre récompense.
              </p>

              {error && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#EF4444" }}>
                  {error}
                </div>
              )}

              {/* Honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)}
                aria-hidden style={{ position: "absolute", left: -9999, opacity: 0, width: 0, height: 0, pointerEvents: "none" }} />

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>Prénom et nom</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)}
                    placeholder="Ex: Lucas Bernard"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${BORD}`, fontSize: 14, color: INK, background: BG, outline: "none", boxSizing: "border-box", fontFamily: "system-ui" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="lucas@email.com"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${BORD}`, fontSize: 14, color: INK, background: BG, outline: "none", boxSizing: "border-box", fontFamily: "system-ui" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>
                    Date d&apos;anniversaire <span style={{ fontWeight: 400, color: GRAY }}>(optionnel)</span>
                  </label>
                  <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${BORD}`, fontSize: 14, color: INK, background: BG, outline: "none", boxSizing: "border-box", fontFamily: "system-ui" }} />
                </div>

                <button type="submit" disabled={submitting}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: submitting ? "default" : "pointer",
                    background: INK, color: WHITE, fontSize: 15, fontWeight: 700,
                    fontFamily: "var(--font-sora, system-ui)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    opacity: submitting ? 0.7 : 1, marginTop: 4,
                  }}>
                  {submitting
                    ? <><Loader size={16} style={{ animation: "spin 0.8s linear infinite" }} /> Création…</>
                    : "Obtenir ma carte"}
                </button>
              </form>
            </div>

            <p style={{ textAlign: "center", fontSize: 12, color: GRAY, marginTop: 20 }}>
              En vous inscrivant, vous acceptez les{" "}
              <a href="/cgu" style={{ color: GOLD, textDecoration: "none" }}>conditions d&apos;utilisation</a>.
            </p>
          </div>

        ) : (
          <div className="join-fade" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Carte résultat */}
            <div style={{
              background: INK, borderRadius: 20, padding: 24, color: WHITE,
              boxShadow: "0 16px 48px rgba(11,15,14,0.14)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: GOLD, marginBottom: 4, fontFamily: "var(--font-sora, system-ui)" }}>
                    CARTE FIDÉLITÉ
                  </div>
                  <div style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 20, fontWeight: 600 }}>
                    {merchant.business_name}
                  </div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(184,135,58,0.18)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                  {merchant.logo_url
                    ? <img src={merchant.logo_url} alt={merchant.business_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <Coffee size={20} color={GOLD} />
                  }
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                {Array.from({ length: Math.min(stamps, 10) }).map((_, i) => (
                  <div key={i} style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "rgba(255,255,255,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>0 / {stamps}</div>

              {/* Progress bar */}
              <div style={{ height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 999, marginBottom: 16 }}>
                <div style={{ height: "100%", width: "0%", background: GOLD, borderRadius: 999 }} />
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sora, system-ui)" }}>{merchant.reward_description}</span>
                {customerId && (
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${customerId}`} alt="QR" style={{ width: 48, height: 48, borderRadius: 6, background: WHITE, padding: 3 }} />
                )}
              </div>
            </div>

            {/* Succès */}
            <div style={{ background: WHITE, borderRadius: 20, padding: 28, textAlign: "center", border: `1px solid ${BORD}`, boxShadow: "0 4px 24px rgba(11,15,14,0.06)" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <CheckCircle size={28} color="#22C55E" />
              </div>
              <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 22, fontWeight: 600, color: INK, marginBottom: 8 }}>
                Carte créée !
              </h2>
              <p style={{ fontSize: 14, color: GRAY, marginBottom: 28, lineHeight: 1.6 }}>
                Ajoutez-la à votre téléphone pour ne jamais l&apos;oublier en caisse.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {customerId && (
                  <a href={`${API}/passes/apple/${customerId}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      background: INK, color: WHITE, borderRadius: 12, padding: "14px 20px",
                      fontSize: 15, fontWeight: 600, textDecoration: "none",
                      fontFamily: "var(--font-sora, system-ui)",
                    }}>
                    <AppleLogo size={20} color="white" />
                    Ajouter à Apple Wallet
                  </a>
                )}
                {customerId && (
                  <button onClick={openGoogleWallet} disabled={walletLoading}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      background: WHITE, color: INK, borderRadius: 12, padding: "14px 20px",
                      fontSize: 15, fontWeight: 600, border: `1px solid ${BORD}`, cursor: "pointer",
                      fontFamily: "var(--font-sora, system-ui)",
                    }}>
                    {walletLoading
                      ? <Loader size={16} style={{ animation: "spin 0.8s linear infinite" }} />
                      : <GoogleLogo size={20} />
                    }
                    Ajouter à Google Wallet
                  </button>
                )}
              </div>

              {customerId && (
                <a href={`/card/${customerId}`} style={{ display: "block", marginTop: 20, fontSize: 13, color: GOLD, textDecoration: "none", fontWeight: 600 }}>
                  Voir ma carte en ligne →
                </a>
              )}

              {!isIOS && (
                <p style={{ marginTop: 12, fontSize: 12, color: GRAY }}>
                  Ouvrez ce lien sur votre iPhone pour ajouter à Apple Wallet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
