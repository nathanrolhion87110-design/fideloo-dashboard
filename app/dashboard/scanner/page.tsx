"use client";

import { useState } from "react";
import { Search, User, Award, CheckCircle2, QrCode, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

/* ── Tokens ─────────────────────────────── */
const CARD = "#FFFFFF"; const CARD2 = "#F5F3EE"; const INK = "#0B0F0E";
const GRAY = "#6B6B6B"; const BORD = "#E0DDD6"; const BORD2 = "#D0CDC6";
const GOLD = "#B8873A"; const GS = "rgba(184,135,58,0.10)"; const GB = "rgba(184,135,58,0.25)";

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

  const inputStyle = {
    width: "100%", padding: "12px 16px", background: CARD2, border: `1px solid ${BORD}`,
    borderRadius: 10, fontSize: 14, color: INK, outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: "clamp(24px,4vw,32px)", fontWeight: 700, color: INK, letterSpacing: "-0.03em", fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
          Scanner un client
        </h1>
        <p style={{ fontSize: 14, color: GRAY, marginTop: 8 }}>Recherchez un client pour lui ajouter des points</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ position: "relative", maxWidth: 600, margin: "0 auto 32px" }}>
        <Search style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: GRAY, pointerEvents: "none" }} />
        <input
          type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nom, email ou ID client…"
          style={{ ...inputStyle, paddingLeft: 48, paddingRight: 140, fontSize: 15, borderRadius: 14, boxShadow: "0 4px 16px rgba(11,15,14,0.06)" }}
        />
        <button type="submit" disabled={loading}
          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", padding: "8px 20px", background: INK, color: "#FFFFFF", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {loading ? "…" : "Rechercher"}
        </button>
      </form>

      {error && <p style={{ textAlign: "center", color: "#DC2626", fontSize: 14, fontWeight: 500, marginBottom: 16 }}>{error}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>

        {/* Client card */}
        <div>
          <AnimatePresence mode="wait">
            {activeClient ? (
              <motion.div key={activeClient.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
                <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 20, overflow: "hidden", position: "relative" }}>
                  {showReward && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(237,235,228,0.85)", backdropFilter: "blur(8px)" }}>
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        style={{ padding: 36, borderRadius: 20, background: CARD, border: `1px solid ${BORD}`, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", boxShadow: "0 20px 60px rgba(11,15,14,0.1)" }}>
                        <Award style={{ width: 56, height: 56, color: GOLD, marginBottom: 16 }} />
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: INK, marginBottom: 8 }}>Récompense atteinte !</h3>
                        <p style={{ fontSize: 14, color: GRAY }}>
                          {activeClient.name} a droit à : <strong style={{ color: INK }}>{merchant?.reward_description}</strong>
                        </p>
                      </motion.div>
                    </motion.div>
                  )}

                  <div style={{ padding: 32 }}>
                    {/* Client info */}
                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
                      <div style={{ width: 72, height: 72, borderRadius: 36, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: GS, border: `1px solid ${GB}` }}>
                        <User style={{ width: 36, height: 36, color: GOLD }} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, color: INK }}>{activeClient.name}</h2>
                        <p style={{ fontSize: 14, color: GRAY }}>{activeClient.email || "Pas d'email"}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: INK }}>Progression</span>
                        <span style={{ fontSize: 28, fontWeight: 700, color: GOLD }}>{activeClient.points}<span style={{ fontSize: 16, color: GRAY }}>/{threshold}</span></span>
                      </div>
                      <div style={{ height: 10, background: CARD2, borderRadius: 999, overflow: "hidden", border: `1px solid ${BORD}` }}>
                        <motion.div
                          animate={{ width: `${progress}%` }} transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                          style={{ height: "100%", background: activeClient.points >= threshold ? GOLD : `linear-gradient(90deg,${GOLD}88,${GOLD})`, borderRadius: 999 }} />
                      </div>
                      {activeClient.points >= threshold && (
                        <p style={{ fontSize: 13, fontWeight: 600, marginTop: 8, color: GOLD, display: "flex", alignItems: "center", gap: 4 }}>
                          <Award style={{ width: 14, height: 14 }} /> Récompense disponible !
                        </p>
                      )}
                    </div>

                    {/* Point buttons */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                      {[1, 2, 5, 10].map((pts) => (
                        <button key={pts} onClick={() => addPoints(pts)} disabled={adding}
                          style={{ padding: "16px 8px", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: GS, border: `1px solid ${GB}`, cursor: "pointer", transition: "all 0.15s", opacity: adding ? 0.5 : 1 }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GB; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GS; }}>
                          <div style={{ width: 44, height: 44, borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, background: GOLD, color: "#FFFFFF" }}>
                            +{pts}
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 500, color: INK }}>{pts} point{pts > 1 ? "s" : ""}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom points */}
                    <div style={{ display: "flex", gap: 10 }}>
                      <input type="number" value={customPoints} onChange={(e) => setCustomPoints(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
                        placeholder="Montant personnalisé" min={1}
                        style={{ ...inputStyle, flex: 1 }}
                      />
                      <button onClick={handleCustomAdd} disabled={adding || !customPoints || parseInt(customPoints) <= 0}
                        style={{ padding: "12px 20px", background: INK, color: "#FFFFFF", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: (adding || !customPoints || parseInt(customPoints) <= 0) ? 0.5 : 1, whiteSpace: "nowrap" }}>
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div style={{ minHeight: 400, background: CARD, border: `1px solid ${BORD}`, borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
                <QrCode style={{ width: 56, height: 56, color: BORD2 }} />
                <p style={{ fontSize: 14, color: GRAY, maxWidth: 280, textAlign: "center", lineHeight: 1.6 }}>
                  Recherchez un client par nom ou email pour afficher sa carte et ajouter des points.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent scans */}
        <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 20, padding: 20, height: "fit-content" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Clock style={{ width: 16, height: 16, color: GRAY }} /> Scans cette session
          </h3>
          {recentScans.length === 0 ? (
            <p style={{ fontSize: 13, color: GRAY, textAlign: "center", padding: "16px 0" }}>Aucun scan pour l&apos;instant</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {recentScans.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: 12 }}
                  onMouseEnter={e => (e.currentTarget.style.background = CARD2)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", background: GS, flexShrink: 0 }}>
                      <CheckCircle2 style={{ width: 14, height: 14, color: GOLD }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: INK }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: GRAY }}>{s.time}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>{s.points}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
