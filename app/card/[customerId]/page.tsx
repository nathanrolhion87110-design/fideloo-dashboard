"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Gift, Share2, Coffee, Loader, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const API   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const BG    = "#EDEBE4";
const INK   = "#0B0F0E";
const GOLD  = "#B8873A";
const GRAY  = "#6B6B6B";
const WHITE = "#FFFFFF";
const BORD  = "#E0DDD6";
const CARD2 = "#F5F3EE";

interface Customer {
  id: string;
  name: string;
  points: number;
  merchants: {
    business_name: string;
    primary_color: string | null;
    reward_threshold: number;
    reward_description: string;
    logo_url: string | null;
    strip_url: string | null;
  };
}

interface Transaction {
  id: string;
  type: string;
  points: number;
  created_at: string;
  notes: string | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7)  return `Il y a ${days} jours`;
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function CustomerCardPage() {
  const { customerId } = useParams<{ customerId: string }>();

  const [customer, setCustomer]         = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading]           = useState(true);
  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/customers/card/${customerId}`).then(r => r.json()),
      fetch(`${API}/transactions/customer/${customerId}`).then(r => r.json()),
    ])
      .then(([customerData, txData]) => {
        if (!customerData.error) setCustomer(customerData);
        if (Array.isArray(txData)) setTransactions(txData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customerId]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Ma carte fidélité", url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const openGoogleWallet = async () => {
    setWalletLoading(true);
    try {
      const res  = await fetch(`${API}/passes/google/${customerId}`);
      const data = await res.json();
      if (data.url) window.open(data.url, "_blank");
    } catch {}
    finally { setWalletLoading(false); }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: BG }}>
        <div style={{ width: 32, height: 32, border: `3px solid ${BORD}`, borderTopColor: GOLD, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: BG, padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p style={{ fontWeight: 700, color: INK, fontSize: 17, marginBottom: 8 }}>Carte introuvable</p>
          <p style={{ color: GRAY, fontSize: 14 }}>Ce lien n&apos;est plus valide.</p>
        </div>
      </div>
    );
  }

  const merchant  = customer.merchants;
  const progress  = Math.min((customer.points / merchant.reward_threshold) * 100, 100);
  const stamps    = merchant.reward_threshold;
  const earned    = Math.min(customer.points, stamps);
  const firstName = customer.name.split(" ")[0];

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 48px" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes barFill{from{width:0}to{width:${progress}%}} .bar-fill{animation:barFill 0.8s ease both}`}</style>

      <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img src="/brand/fideloo-logo-linked.svg" alt="Fideloo" style={{ height: 24 }} />
          <button onClick={handleShare}
            style={{ width: 36, height: 36, borderRadius: "50%", background: WHITE, border: `1px solid ${BORD}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Share2 size={15} color={GRAY} />
          </button>
        </div>

        {/* Salutation */}
        <div>
          <p style={{ fontSize: 13, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>Bonjour,</p>
          <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 26, fontWeight: 600, color: INK, marginTop: 2 }}>
            {firstName} <em style={{ fontStyle: "italic", fontWeight: 400 }}>.</em>
          </h1>
        </div>

        {/* Carte fidélité */}
        <div style={{
          background: INK, borderRadius: 24, padding: 24, color: WHITE,
          boxShadow: "0 24px 64px rgba(11,15,14,0.18)",
          position: "relative", overflow: "hidden",
        }}>
          {merchant.strip_url && (
            <img src={merchant.strip_url} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.08 }} />
          )}

          {/* Haut de la carte */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, position: "relative" }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: GOLD, marginBottom: 5, fontFamily: "var(--font-sora, system-ui)" }}>
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
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8, position: "relative" }}>
            {Array.from({ length: Math.min(stamps, 10) }).map((_, i) => (
              <div key={i} style={{
                width: 30, height: 30, borderRadius: "50%",
                background: i < earned ? GOLD : "rgba(255,255,255,0.10)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {i < earned && <Coffee size={14} color={INK} />}
              </div>
            ))}
            {stamps > 10 && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", alignSelf: "center" }}>+{stamps - 10}</div>
            )}
          </div>

          {/* Points count */}
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 16, fontFamily: "var(--font-sora, system-ui)", position: "relative" }}>
            {customer.points} / {stamps} points
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: "rgba(255,255,255,0.10)", borderRadius: 999, marginBottom: 20, position: "relative" }}>
            <div className="bar-fill" style={{ height: "100%", background: GOLD, borderRadius: 999, width: `${progress}%` }} />
          </div>

          {/* Pied de carte */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Gift size={13} color={GOLD} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sora, system-ui)" }}>
                {merchant.reward_description}
              </span>
            </div>
            {customerId && (
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${customerId}`} alt="QR Code"
                style={{ width: 48, height: 48, borderRadius: 8, background: WHITE, padding: 3 }} />
            )}
          </div>
        </div>

        {/* Boutons Wallet */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a href={`${API}/passes/apple/${customerId}`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: INK, color: WHITE, borderRadius: 12, padding: "13px 20px",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
              fontFamily: "var(--font-sora, system-ui)",
            }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white" aria-hidden>
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
            </svg>
            Ajouter à Apple Wallet
          </a>
          <button onClick={openGoogleWallet} disabled={walletLoading}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: WHITE, color: INK, borderRadius: 12, padding: "13px 20px",
              fontSize: 14, fontWeight: 600, border: `1px solid ${BORD}`, cursor: "pointer",
              fontFamily: "var(--font-sora, system-ui)",
            }}>
            {walletLoading
              ? <Loader size={16} style={{ animation: "spin 0.8s linear infinite" }} />
              : (
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )
            }
            Ajouter à Google Wallet
          </button>
        </div>

        {/* Récompense en cours */}
        <div style={{ background: WHITE, borderRadius: 16, padding: 20, border: `1px solid ${BORD}`, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(184,135,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Gift size={20} color={GOLD} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 3, fontFamily: "var(--font-sora, system-ui)" }}>
              RÉCOMPENSE · {stamps} pts
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{merchant.reward_description}</div>
            <div style={{ marginTop: 8, height: 4, background: CARD2, borderRadius: 999 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: GOLD, borderRadius: 999, transition: "width 0.8s ease" }} />
            </div>
            <div style={{ fontSize: 11, color: GRAY, marginTop: 4 }}>{customer.points} / {stamps} points</div>
          </div>
        </div>

        {/* Historique */}
        <div style={{ background: WHITE, borderRadius: 16, border: `1px solid ${BORD}`, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORD}`, display: "flex", alignItems: "center", gap: 8 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: INK }}>Historique</h2>
            {transactions.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 600, color: GRAY, background: CARD2, padding: "2px 8px", borderRadius: 999 }}>
                {transactions.length}
              </span>
            )}
          </div>

          {transactions.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>☕</div>
              <p style={{ fontSize: 13, color: GRAY }}>Votre première visite apparaîtra ici.</p>
            </div>
          ) : (
            <div>
              {transactions.map((tx, i) => {
                const isRedeem = tx.type === "redeem";
                return (
                  <div key={tx.id} style={{
                    padding: "14px 20px",
                    borderTop: i === 0 ? "none" : `1px solid ${BORD}`,
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: isRedeem ? "rgba(239,68,68,0.08)" : "rgba(184,135,58,0.10)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {isRedeem
                        ? <ArrowDownLeft size={16} color="#EF4444" />
                        : <ArrowUpRight size={16} color={GOLD} />
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>
                        {tx.notes || (isRedeem ? "Récompense utilisée" : "Visite")}
                      </div>
                      <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{timeAgo(tx.created_at)}</div>
                    </div>
                    <div style={{
                      fontSize: 14, fontWeight: 700,
                      color: isRedeem ? "#EF4444" : GOLD,
                    }}>
                      {isRedeem ? "−" : "+"}{Math.abs(tx.points)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: GRAY }}>
          Propulsé par{" "}
          <a href="/" style={{ color: GOLD, textDecoration: "none", fontWeight: 600 }}>Fideloo</a>
        </p>
      </div>
    </div>
  );
}
