"use client";

import { useState, useEffect } from "react";
import { Send, Bell, Plus, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

export default function NotificationsPage() {
  const { merchant } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!merchant) return;
    api.get(`/merchants/${merchant.id}/notifications`)
      .then(res => setHistory(res.data))
      .catch(console.error)
      .finally(() => setLoadingHistory(false));
  }, [merchant]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !title.trim() || !message.trim()) return;
    setSending(true);
    try {
      const res = await api.post(`/merchants/${merchant.id}/notify`, { title, message });
      setHistory(prev => [res.data, ...prev]);
      setTitle("");
      setMessage("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main">Notifications</h1>
        <p className="text-text-muted mt-1" id="nav-notifs">
          Envoyez des offres push sur le Wallet de vos clients
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Nouvelle Notification
          </h2>

          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex items-center gap-2 bg-success/10 text-success px-4 py-3 rounded-xl text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4" />
                Notification enregistrée et envoyée !
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Titre de la notification</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={40}
                required
                className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 text-text-main shadow-sm focus:border-primary focus:ring-primary focus:bg-white transition-colors"
                placeholder="Ex: -20% sur tout le magasin !"
              />
              <p className="text-xs text-right text-slate-400 mt-1">{title.length}/40</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Message détaillé</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                required
                className="block w-full rounded-xl border-slate-200 bg-slate-50 py-3 px-4 text-text-main shadow-sm focus:border-primary focus:ring-primary focus:bg-white transition-colors resize-none"
                placeholder="Venez profiter de notre offre exceptionnelle valable jusqu'à ce soir."
              />
            </div>

            <button
              type="submit"
              disabled={sending || !title.trim() || !message.trim()}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-md text-base font-medium text-white bg-primary hover:bg-primary/90 transition-all disabled:opacity-70"
            >
              <Send className="w-4 h-4" />
              {sending ? "Envoi en cours..." : "Enregistrer la notification"}
            </button>

            <p className="text-xs text-center text-text-muted">
              Les notifications apparaissent sur l'écran de verrouillage des clients ayant ajouté la carte à leur Wallet.
            </p>
          </form>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Bell className="w-4 h-4" />
            Aperçu iPhone
          </div>
          <div className="w-full max-w-[320px] bg-slate-900/40 backdrop-blur-xl rounded-[2rem] p-4 shadow-2xl mt-8">
            <div className="flex justify-between items-center mb-2 px-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-primary rounded flex items-center justify-center text-[8px] text-white font-bold">F</div>
                <span className="text-xs text-white/80 uppercase tracking-wider">Fideloo</span>
              </div>
              <span className="text-xs text-white/60">Maintenant</span>
            </div>
            <div className="bg-white/10 p-3 rounded-xl">
              <h4 className="text-white font-semibold text-sm mb-1">{title || "Titre de la notification"}</h4>
              <p className="text-white/80 text-xs leading-relaxed">{message || "Le contenu de votre message s'affichera ici..."}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-text-main">Historique des envois</h3>
        </div>
        {loadingHistory ? (
          <div className="px-6 py-8 text-center text-text-muted text-sm">Chargement...</div>
        ) : history.length === 0 ? (
          <div className="px-6 py-8 text-center text-text-muted text-sm">
            Aucune notification envoyée pour l'instant.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map(item => (
              <div
                key={item.id}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <h4 className="font-bold text-text-main">{item.title}</h4>
                <p className="text-sm text-text-muted mt-1">{item.message}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(item.created_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
