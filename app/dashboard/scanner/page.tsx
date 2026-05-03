"use client";

import { useState } from "react";
import { Search, User, Award, CheckCircle2, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

interface ScanEntry { time: string; name: string; points: string }

export default function ScannerPage() {
  const { merchant } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeClient, setActiveClient] = useState<any>(null);
  const [showReward, setShowReward] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [customPoints, setCustomPoints] = useState("");
  const [recentScans, setRecentScans] = useState<ScanEntry[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    setActiveClient(null);
    try {
      const res = await api.get(`/customers/find/${encodeURIComponent(searchQuery.trim())}`);
      if (res.data && res.data.length > 0) {
        setActiveClient(res.data[0]);
      } else {
        setError("Aucun client trouvé. Vérifiez le nom ou l'email.");
      }
    } catch {
      setError("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (pts: number) => {
    if (!activeClient || adding || pts <= 0) return;
    setAdding(true);
    try {
      const res = await api.post("/transactions", {
        customer_id: activeClient.id,
        points: pts,
        note: "Scanner caisse"
      });

      const newPoints = res.data.newPoints ?? activeClient.points + pts;
      setActiveClient({ ...activeClient, points: newPoints });

      const threshold = merchant?.reward_threshold || 10;
      if (newPoints >= threshold && activeClient.points < threshold) {
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3500);
      }

      const now = new Date();
      const entry: ScanEntry = {
        time: now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        name: activeClient.name.split(" ").slice(0, 2).join(" "),
        points: `+${pts}`
      };
      setRecentScans(prev => [entry, ...prev.slice(0, 4)]);
      setCustomPoints("");
    } catch {
      setError("Erreur lors de l'ajout de points.");
    } finally {
      setAdding(false);
    }
  };

  const handleCustomAdd = () => {
    const pts = parseInt(customPoints, 10);
    if (pts > 0) addPoints(pts);
  };

  const threshold = merchant?.reward_threshold || 10;
  const progress = activeClient ? Math.min((activeClient.points / threshold) * 100, 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-main">Scanner un client</h1>
        <p className="text-text-muted mt-2">Recherchez un client pour lui ajouter des points</p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="block w-full pl-12 pr-36 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          placeholder="Nom, email ou ID client..."
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute inset-y-2 right-2 px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {loading ? "..." : "Rechercher"}
        </button>
      </form>

      {error && (
        <p className="text-center text-error text-sm font-medium">{error}</p>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {activeClient ? (
              <motion.div
                key={activeClient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-100 rounded-3xl shadow-lg overflow-hidden relative"
              >
                {showReward && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-success/10 z-10 flex items-center justify-center backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center"
                    >
                      <Award className="w-16 h-16 text-accent mb-4" />
                      <h3 className="text-2xl font-bold text-text-main">Récompense atteinte !</h3>
                      <p className="text-text-muted mt-2">
                        {activeClient.name} a droit à : <strong>{merchant?.reward_description}</strong>
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                <div className="p-8">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-text-main">{activeClient.name}</h2>
                      <p className="text-text-muted">{activeClient.email || "Pas d'email"}</p>
                    </div>
                  </div>

                  <div className="mb-10">
                    <div className="flex justify-between items-end mb-3">
                      <span className="font-medium text-text-main">Progression</span>
                      <span className="text-3xl font-bold text-primary">
                        {activeClient.points}
                        <span className="text-lg text-slate-400">/{threshold}</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${activeClient.points >= threshold ? "bg-success" : "bg-primary"}`}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                      />
                    </div>
                    {activeClient.points >= threshold && (
                      <p className="text-sm text-success font-medium mt-2 flex items-center gap-1">
                        <Award className="w-4 h-4" /> Récompense disponible !
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[1, 2, 5, 10].map(pts => (
                      <button
                        key={pts}
                        onClick={() => addPoints(pts)}
                        disabled={adding}
                        className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-indigo-50 hover:border-primary/40 transition-all group disabled:opacity-50"
                      >
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary font-bold text-xl group-hover:scale-110 transition-transform">
                          +{pts}
                        </div>
                        <span className="text-xs font-medium text-text-main">
                          {pts} point{pts > 1 ? "s" : ""}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={customPoints}
                      onChange={e => setCustomPoints(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleCustomAdd()}
                      placeholder="Montant personnalisé"
                      min="1"
                      className="flex-1 rounded-xl border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-text-main focus:border-primary focus:ring-primary focus:bg-white"
                    />
                    <button
                      onClick={handleCustomAdd}
                      disabled={adding || !customPoints || parseInt(customPoints) <= 0}
                      className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl min-h-[420px] flex flex-col items-center justify-center text-text-muted p-8 text-center gap-4">
                <QrCode className="w-16 h-16 text-slate-300" />
                <p>Recherchez un client par nom ou email pour afficher sa carte et ajouter des points.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 h-fit">
          <h3 className="font-bold text-text-main mb-6 flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-slate-400" />
            Scans cette session
          </h3>
          {recentScans.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">Aucun scan pour l'instant</p>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-main">{scan.name}</div>
                      <div className="text-xs text-text-muted">{scan.time}</div>
                    </div>
                  </div>
                  <div className="font-bold text-primary text-sm">{scan.points}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
