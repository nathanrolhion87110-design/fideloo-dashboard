"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Bell, Share2, History, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Customer {
  id: string;
  name: string;
  points: number;
  merchants: {
    business_name: string;
    primary_color: string;
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
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "À l'instant" : `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function GoogleWalletButton({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/passes/google/${customerId}`);
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
      className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 p-3 rounded-xl font-medium shadow-sm disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
      )}
      Google Wallet
    </button>
  );
}

export default function CustomerCardPage() {
  const { customerId } = useParams<{ customerId: string }>();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/customers/card/${customerId}`).then((r) => r.json()),
      fetch(`${API_URL}/transactions/customer/${customerId}`).then((r) => r.json()),
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
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <p className="font-bold text-text-main text-lg mb-2">Carte introuvable</p>
          <p className="text-text-muted text-sm">Ce lien n&apos;est plus valide.</p>
        </div>
      </div>
    );
  }

  const merchant = customer.merchants;
  const color = merchant.primary_color || "#6366F1";
  const progress = Math.min((customer.points / merchant.reward_threshold) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-6 pb-24">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="font-bold text-text-main text-lg">Bonjour, {customer.name.split(" ")[0]}</div>
          <button
            onClick={handleShare}
            className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-text-main transition-colors"
            title="Partager ma carte"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Carte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full aspect-[16/9] rounded-[2rem] shadow-xl overflow-hidden relative flex flex-col text-white"
          style={{ backgroundColor: color }}
        >
          {merchant.strip_url && (
            <img
              src={merchant.strip_url}
              alt="strip"
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="p-6 pb-2 relative z-10">
            <div className="flex justify-between items-start">
              <div className="font-bold text-2xl">{merchant.business_name}</div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl shadow-inner overflow-hidden">
                {merchant.logo_url ? (
                  <img src={merchant.logo_url} alt={merchant.business_name} className="w-full h-full object-cover" />
                ) : (
                  merchant.business_name.charAt(0)
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-white/10 backdrop-blur-sm relative z-10">
            <div className="text-sm opacity-80 font-medium">Récompense</div>
            <div className="text-lg font-bold">{merchant.reward_description}</div>
          </div>

          <div className="flex-1 px-6 py-6 flex flex-col justify-end relative z-10">
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-sm opacity-80 mb-1">Points</div>
                <div className="text-4xl font-bold">
                  {customer.points}
                  <span className="text-xl opacity-70">/{merchant.reward_threshold}</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-white rounded-lg p-1 shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${customerId}`}
                  alt="QR Code"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Boutons Wallet */}
        <div className="grid grid-cols-2 gap-4">
          <a
            href={`${API_URL}/passes/apple/${customerId}`}
            className="flex items-center justify-center gap-2 bg-black text-white p-3 rounded-xl font-medium shadow-sm hover:bg-black/90 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="fill-white">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
              <path d="M10 2c1 .5 2 2 2 5" />
            </svg>
            Apple Wallet
          </a>
          <GoogleWalletButton customerId={customerId} />
        </div>

        {/* Historique */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2 font-bold text-text-main">
              <History className="w-5 h-5 text-slate-400" />
              Historique
            </div>
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-text-main text-sm">
                      {tx.notes || (tx.type === "redeem" ? "Récompense utilisée" : "Visite")}
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">{timeAgo(tx.created_at)}</div>
                  </div>
                  <div
                    className={`font-bold px-2 py-1 rounded text-sm ${
                      tx.type === "redeem"
                        ? "text-orange-600 bg-orange-50"
                        : "text-primary bg-indigo-50"
                    }`}
                  >
                    {tx.type === "redeem" ? "−" : "+"}{Math.abs(tx.points)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {transactions.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-text-muted text-sm">Aucune visite pour l&apos;instant.</p>
            <p className="text-text-muted text-xs mt-1">Vos points s&apos;accumuleront ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}
