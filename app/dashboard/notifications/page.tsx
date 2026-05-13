"use client";

import { useState, useEffect } from "react";
import { Send, Bell, Plus, Clock, CheckCircle2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import GlassCard from "../../../components/GlassCard";
import GlowButton from "../../../components/GlowButton";
import GradientText from "../../../components/GradientText";

interface Notification { id: string; title: string; message: string; created_at: string; }

const DG = "#22C55E";
const PRO_MONTHLY_LIMIT = 5;

function FeatureLockedPage() {
  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="heading-display text-3xl"><GradientText>Notifications</GradientText></h1>
        <p className="text-text-muted mt-1">Envoyez des offres push sur le Wallet de vos clients</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 24, padding: 48, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={28} color={DG} />
        </div>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#F5F5F5", marginBottom: 8 }}>Notifications Push disponibles à partir du plan Pro</div>
          <div style={{ fontSize: 14, color: "rgba(245,245,245,0.5)", lineHeight: 1.6 }}>
            Envoyez des campagnes push directement sur les Wallets Apple et Google de vos clients fidèles.
          </div>
        </div>
        <a href="/dashboard/parametres" style={{ padding: "12px 28px", background: DG, color: "#080808", borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", marginTop: 8 }}>
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

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="heading-display text-3xl"><GradientText>Notifications</GradientText></h1>
          <p className="text-text-muted mt-1" id="nav-notifs">Envoyez des offres push sur le Wallet de vos clients</p>
        </div>
        {plan === "pro" && (
          <div style={{ padding: "8px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 13, color: "rgba(245,245,245,0.6)" }}>
            Campagnes ce mois-ci :{" "}
            <span style={{ fontWeight: 700, color: thisMonthNotifs.length >= PRO_MONTHLY_LIMIT ? "#EF4444" : DG }}>
              {thisMonthNotifs.length}/{PRO_MONTHLY_LIMIT}
            </span>
          </div>
        )}
        {plan === "business" && (
          <div style={{ padding: "8px 16px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, fontSize: 13, color: DG, fontWeight: 600 }}>
            ∞ Envois illimités
          </div>
        )}
      </div>

      {isProLimitReached && (
        <div style={{ padding: "14px 20px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, fontSize: 14, color: "#FCA5A5", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <strong>Limite mensuelle atteinte</strong> — Le plan Pro permet 5 notifications/mois.{" "}
            <a href="/dashboard/parametres" style={{ color: DG, fontWeight: 700, textDecoration: "none" }}>Passer au plan Business →</a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5" style={{ color: DG }} /> Nouvelle Notification
          </h2>

          <AnimatePresence>
            {sent && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                style={{ background: "rgba(34,197,94,0.12)", color: DG, border: "1px solid rgba(34,197,94,0.3)" }}>
                <CheckCircle2 className="w-4 h-4" /> Notification enregistrée et envoyée !
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Titre de la notification</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={40} required
                className="input-dark w-full rounded-xl py-3 px-4 text-sm" placeholder="Ex: -20% sur tout le magasin !"
                disabled={isProLimitReached} />
              <p className="text-xs text-right text-text-muted mt-1">{title.length}/40</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Message détaillé</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} required
                className="input-dark w-full rounded-xl py-3 px-4 text-sm resize-none"
                placeholder="Venez profiter de notre offre exceptionnelle valable jusqu'à ce soir."
                disabled={isProLimitReached} />
            </div>
            <GlowButton type="submit" fullWidth size="lg" disabled={sending || !title.trim() || !message.trim() || isProLimitReached}>
              <Send className="w-4 h-4" /> {sending ? "Envoi en cours…" : "Enregistrer la notification"}
            </GlowButton>
            <p className="text-xs text-center text-text-muted">
              Les notifications apparaissent sur l&apos;écran de verrouillage des clients ayant ajouté la carte à leur Wallet.
            </p>
          </form>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px]">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-sm font-medium text-text-muted">
            <Bell className="w-4 h-4" /> Aperçu iPhone
          </div>
          <div className="w-full max-w-[320px] backdrop-blur-xl rounded-[2rem] p-4 mt-8"
               style={{ background: "rgba(8,8,8,0.9)", border: "1px solid rgba(34,197,94,0.15)",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.6), 0 0 40px rgba(34,197,94,0.08)" }}>
            <div className="flex justify-between items-center mb-2 px-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-extrabold"
                     style={{ background: DG, color: "#080808" }}>F</div>
                <span className="text-xs text-text-muted uppercase tracking-wider">Fideloo</span>
              </div>
              <span className="text-xs text-text-muted">Maintenant</span>
            </div>
            <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <h4 className="text-text-main font-semibold text-sm mb-1">{title || "Titre de la notification"}</h4>
              <p className="text-text-muted text-xs leading-relaxed">{message || "Le contenu de votre message s'affichera ici…"}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5">
          <h3 className="text-lg font-bold text-text-main">Historique des envois</h3>
        </div>
        {loadingHistory ? (
          <div className="px-6 py-10 text-center text-text-muted text-sm">Chargement…</div>
        ) : history.length === 0 ? (
          <div className="px-6 py-10 text-center text-text-muted text-sm">Aucune notification envoyée pour l&apos;instant.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {history.map((item) => (
              <div key={item.id} className="p-6 hover:bg-white/[0.03] transition-colors">
                <h4 className="font-bold text-text-main">{item.title}</h4>
                <p className="text-sm text-text-muted mt-1">{item.message}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
                  <Clock className="w-3.5 h-3.5" /> {formatDate(item.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
