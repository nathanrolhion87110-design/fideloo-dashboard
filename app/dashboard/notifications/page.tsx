"use client";

import { useState, useEffect } from "react";
import { Send, Bell, Plus, Clock, CheckCircle2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

/* ── Tokens ─────────────────────────────── */
const CARD = "#FFFFFF"; const CARD2 = "#F5F3EE"; const INK = "#0B0F0E";
const GRAY = "#6B6B6B"; const BORD = "#E0DDD6";
const GOLD = "#B8873A"; const GS = "rgba(184,135,58,0.10)"; const GB = "rgba(184,135,58,0.25)";

interface Notification { id: string; title: string; message: string; created_at: string; }

const PRO_MONTHLY_LIMIT = 5;

function FeatureLockedPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: INK, letterSpacing: "-0.03em", fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
          Notifications
        </h1>
        <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Envoyez des offres push sur le Wallet de vos clients</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 24, padding: 48, background: CARD, border: `1px solid ${BORD}`, borderRadius: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={28} color={GOLD} />
        </div>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: INK, marginBottom: 8 }}>Notifications Push disponibles à partir du plan Pro</div>
          <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>
            Envoyez des campagnes push directement sur les Wallets Apple et Google de vos clients fidèles.
          </div>
        </div>
        <a href="/dashboard/parametres"
          style={{ padding: "12px 28px", background: INK, color: "#FFFFFF", borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", marginTop: 8 }}>
          Passer au plan Pro →
        </a>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { merchant } = useAuth();
  const plan = (merchant as { plan?: string } | null)?.plan || "standard";
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<Notification[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!merchant) return;
    api.get<Notification[]>(`/merchants/${merchant.id}/notifications`)
      .then((res) => setHistory(res.data))
      .catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, [merchant]);

  if (plan === "standard") return <FeatureLockedPage />;

  const now = new Date();
  const thisMonthNotifs = history.filter((n) => {
    const d = new Date(n.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  });
  const isProLimitReached = plan === "pro" && thisMonthNotifs.length >= PRO_MONTHLY_LIMIT;

  const handleSend = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!merchant || !title.trim() || !message.trim() || isProLimitReached) return;
    setSending(true);
    try {
      const res = await api.post<Notification>(`/merchants/${merchant.id}/notify`, { title, message });
      setHistory((prev) => [res.data, ...prev]);
      setTitle(""); setMessage("");
      setSent(true); setTimeout(() => setSent(false), 3000);
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const inputStyle = {
    width: "100%", padding: "12px 16px", background: CARD2, border: `1px solid ${BORD}`,
    borderRadius: 10, fontSize: 14, color: INK, outline: "none", fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: INK, letterSpacing: "-0.03em", fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
            Notifications
          </h1>
          <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Envoyez des offres push sur le Wallet de vos clients</p>
        </div>
        {plan === "pro" && (
          <div style={{ padding: "8px 16px", background: CARD, border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 13, color: GRAY }}>
            Campagnes ce mois-ci :{" "}
            <span style={{ fontWeight: 700, color: thisMonthNotifs.length >= PRO_MONTHLY_LIMIT ? "#DC2626" : GOLD }}>
              {thisMonthNotifs.length}/{PRO_MONTHLY_LIMIT}
            </span>
          </div>
        )}
        {plan === "business" && (
          <div style={{ padding: "8px 16px", background: GS, border: `1px solid ${GB}`, borderRadius: 10, fontSize: 13, color: GOLD, fontWeight: 600 }}>
            ∞ Envois illimités
          </div>
        )}
      </div>

      {isProLimitReached && (
        <div style={{ padding: "14px 20px", background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 12, fontSize: 14, color: "#DC2626", display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <strong>Limite mensuelle atteinte</strong> — Le plan Pro permet 5 notifications/mois.{" "}
            <a href="/dashboard/parametres" style={{ color: GOLD, fontWeight: 700, textDecoration: "none" }}>Passer au plan Business →</a>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Form */}
        <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Plus style={{ width: 16, height: 16, color: GOLD }} /> Nouvelle Notification
          </h2>

          <AnimatePresence>
            {sent && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 10, fontSize: 14, fontWeight: 500, background: GS, color: GOLD, border: `1px solid ${GB}` }}>
                <CheckCircle2 style={{ width: 16, height: 16 }} /> Notification enregistrée et envoyée !
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Titre de la notification</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={40} required
                placeholder="Ex: -20% sur tout le magasin !"
                disabled={isProLimitReached}
                style={{ ...inputStyle, opacity: isProLimitReached ? 0.5 : 1 }}
              />
              <p style={{ fontSize: 11, textAlign: "right", color: GRAY, marginTop: 4 }}>{title.length}/40</p>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 6 }}>Message détaillé</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} required
                placeholder="Venez profiter de notre offre exceptionnelle valable jusqu'à ce soir."
                disabled={isProLimitReached}
                style={{ ...inputStyle, resize: "none", opacity: isProLimitReached ? 0.5 : 1 }}
              />
            </div>
            <button type="submit" disabled={sending || !title.trim() || !message.trim() || isProLimitReached}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 24px", background: INK, color: "#FFFFFF", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: (sending || !title.trim() || !message.trim() || isProLimitReached) ? 0.5 : 1, transition: "opacity 0.15s" }}>
              <Send style={{ width: 15, height: 15 }} /> {sending ? "Envoi en cours…" : "Enregistrer la notification"}
            </button>
            <p style={{ fontSize: 12, textAlign: "center", color: GRAY }}>
              Les notifications apparaissent sur l&apos;écran de verrouillage des clients ayant ajouté la carte à leur Wallet.
            </p>
          </form>
        </div>

        {/* Preview */}
        <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", minHeight: 300 }}>
          <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: GRAY }}>
            <Bell style={{ width: 14, height: 14 }} /> Aperçu iPhone
          </div>
          <div style={{ width: "100%", maxWidth: 300, marginTop: 24, background: "#1C1C1E", borderRadius: 20, padding: 16, boxShadow: "0 20px 60px rgba(11,15,14,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "0 4px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, background: GOLD, color: "#FFFFFF" }}>F</div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Fideloo</span>
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Maintenant</span>
            </div>
            <div style={{ borderRadius: 12, padding: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <h4 style={{ color: "#FFFFFF", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{title || "Titre de la notification"}</h4>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.5 }}>{message || "Le contenu de votre message s'affichera ici…"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORD}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: INK }}>Historique des envois</h3>
        </div>
        {loadingHistory ? (
          <div style={{ padding: "40px 24px", textAlign: "center", fontSize: 14, color: GRAY }}>Chargement…</div>
        ) : history.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center", fontSize: 14, color: GRAY }}>Aucune notification envoyée pour l&apos;instant.</div>
        ) : (
          <div>
            {history.map((item, i) => (
              <div key={item.id} style={{ padding: "20px 24px", borderTop: i > 0 ? `1px solid ${BORD}` : "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = CARD2)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <h4 style={{ fontWeight: 600, color: INK, fontSize: 14 }}>{item.title}</h4>
                <p style={{ fontSize: 13, color: GRAY, marginTop: 4, lineHeight: 1.5 }}>{item.message}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 12, color: GRAY }}>
                  <Clock style={{ width: 12, height: 12 }} /> {formatDate(item.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
