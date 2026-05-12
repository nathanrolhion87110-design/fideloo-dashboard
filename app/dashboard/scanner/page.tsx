"use client";

import { useState } from "react";
import { Search, User, Award, CheckCircle2, QrCode, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import GlassCard from "../../../components/GlassCard";
import GlowButton from "../../../components/GlowButton";
import GradientText from "../../../components/GradientText";

interface ScanEntry { time: string; name: string; points: string }
interface ApiClient { id: string; name: string; email?: string | null; points: number; }

export default function ScannerPage() {
  const { merchant } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeClient, setActiveClient] = useState<ApiClient | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [customPoints, setCustomPoints] = useState("");
  const [recentScans, setRecentScans] = useState<ScanEntry[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true); setError(""); setActiveClient(null);
    try {
      const res = await api.get<ApiClient[]>(`/customers/find/${encodeURIComponent(searchQuery.trim())}`);
      if (res.data && res.data.length > 0) setActiveClient(res.data[0]);
      else setError("Aucun client trouvé. Vérifiez le nom ou l'email.");
    } catch { setError("Erreur lors de la recherche."); }
    finally { setLoading(false); }
  };

  const addPoints = async (pts: number) => {
    if (!activeClient || adding || pts <= 0) return;
    setAdding(true);
    try {
      const res = await api.post<{ newPoints?: number }>("/transactions", {
        customer_id: activeClient.id, points: pts, note: "Scanner caisse"
      });
      const newPoints = res.data.newPoints ?? activeClient.points + pts;
      const previous = activeClient.points;
      setActiveClient({ ...activeClient, points: newPoints });
      const threshold = merchant?.reward_threshold || 10;
      if (newPoints >= threshold && previous < threshold) {
        setShowReward(true); setTimeout(() => setShowReward(false), 3500);
      }
      const now = new Date();
      setRecentScans((prev) => [{
        time: now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        name: activeClient.name.split(" ").slice(0, 2).join(" "),
        points: `+${pts}`,
      }, ...prev].slice(0, 5));
      setCustomPoints("");
    } catch { setError("Erreur lors de l'ajout de points."); }
    finally { setAdding(false); }
  };

  const handleCustomAdd = () => { const n = parseInt(customPoints, 10); if (n > 0) addPoints(n); };

  const threshold = merchant?.reward_threshold || 10;
  const progress = activeClient ? Math.min((activeClient.points / threshold) * 100, 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in-up">
      <div className="text-center">
        <h1 className="heading-display text-4xl"><GradientText>Scanner un client</GradientText></h1>
        <p className="text-text-muted mt-2">Recherchez un client pour lui ajouter des points</p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted pointer-events-none" />
        <input
          type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="input-dark pl-12 pr-36 w-full rounded-2xl py-4 text-base shadow-lg"
          placeholder="Nom, email ou ID client…"
        />
        <div className="absolute inset-y-2 right-2">
          <GlowButton type="submit" disabled={loading}>{loading ? "…" : "Rechercher"}</GlowButton>
        </div>
      </form>

      {error && <p className="text-center text-error text-sm font-medium">{error}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {activeClient ? (
              <motion.div key={activeClient.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }}>
                <GlassCard variant="strong" className="overflow-hidden relative">
                  {showReward && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10 flex items-center justify-center"
                      style={{ background: "rgba(16,185,129,0.10)", backdropFilter: "blur(8px)" }}>
                      <motion.div initial={{ scale: .8 }} animate={{ scale: 1 }}
                        className="p-8 rounded-2xl glass-strong flex flex-col items-center text-center">
                        <Award className="w-16 h-16 mb-4" style={{ color: "#F59E0B" }} />
                        <h3 className="text-2xl font-extrabold text-text-main">Récompense atteinte !</h3>
                        <p className="text-text-muted mt-2">
                          {activeClient.name} a droit à : <strong className="text-text-main">{merchant?.reward_description}</strong>
                        </p>
                      </motion.div>
                    </motion.div>
                  )}

                  <div className="p-8">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center shrink-0 pulse-glow"
                           style={{ background: "rgba(167,139,250,0.15)",
                                    border: "1px solid rgba(167,139,250,0.4)" }}>
                        <User className="w-10 h-10" style={{ color: "var(--violet)" }} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-extrabold text-text-main">{activeClient.name}</h2>
                        <p className="text-text-muted">{activeClient.email || "Pas d'email"}</p>
                      </div>
                    </div>

                    <div className="mb-10">
                      <div className="flex justify-between items-end mb-3">
                        <span className="font-medium text-text-main">Progression</span>
                        <span className="text-3xl font-extrabold"><GradientText>{activeClient.points}</GradientText>
                          <span className="text-lg text-text-muted">/{threshold}</span></span>
                      </div>
                      <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <motion.div className="h-full rounded-full"
                          animate={{ width: `${progress}%` }} transition={{ type: "spring", bounce: 0, duration: .8 }}
                          style={{ background: activeClient.points >= threshold
                              ? "linear-gradient(90deg, #10B981, #34D399)"
                              : "linear-gradient(90deg, #a78bfa, #8b6dfb)",
                            boxShadow: "0 0 20px rgba(167,139,250,0.5)" }} />
                      </div>
                      {activeClient.points >= threshold && (
                        <p className="text-sm font-semibold mt-2 flex items-center gap-1" style={{ color: "#34D399" }}>
                          <Award className="w-4 h-4" /> Récompense disponible !
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {[1, 2, 5, 10].map((pts) => (
                        <button key={pts} onClick={() => addPoints(pts)} disabled={adding}
                          className="card-lift py-4 rounded-2xl flex flex-col items-center gap-2 group disabled:opacity-50"
                          style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.2)" }}>
                          <div className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-xl group-hover:scale-110 transition-transform"
                               style={{ background: "linear-gradient(135deg, #a78bfa, #8b6dfb)", color: "#ffffff",
                                        boxShadow: "0 0 18px rgba(167,139,250,0.4)" }}>
                            +{pts}
                          </div>
                          <span className="text-xs font-medium text-text-main">{pts} point{pts > 1 ? "s" : ""}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input type="number" value={customPoints} onChange={(e) => setCustomPoints(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
                        placeholder="Montant personnalisé" min={1}
                        className="input-dark flex-1 rounded-xl py-2.5 px-4 text-sm" />
                      <GlowButton onClick={handleCustomAdd} disabled={adding || !customPoints || parseInt(customPoints) <= 0}>
                        Ajouter
                      </GlowButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <GlassCard className="min-h-[420px] flex flex-col items-center justify-center text-center p-8 gap-4">
                <QrCode className="w-16 h-16" style={{ color: "rgba(167,139,250,0.5)" }} />
                <p className="text-text-muted max-w-sm">
                  Recherchez un client par nom ou email pour afficher sa carte et ajouter des points.
                </p>
              </GlassCard>
            )}
          </AnimatePresence>
        </div>

        <GlassCard className="p-6 h-fit">
          <h3 className="font-bold text-text-main mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-text-muted" /> Scans cette session
          </h3>
          {recentScans.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">Aucun scan pour l&apos;instant</p>
          ) : (
            <div className="space-y-2">
              {recentScans.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                         style={{ background: "rgba(16,185,129,0.15)", color: "#34D399" }}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-main">{s.name}</div>
                      <div className="text-xs text-text-muted">{s.time}</div>
                    </div>
                  </div>
                  <div className="font-bold text-sm" style={{ color: "var(--violet)" }}>{s.points}</div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
