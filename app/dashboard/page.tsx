"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Gift, TrendingUp, CreditCard, Download, Printer } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

export default function DashboardHome() {
  const { merchant } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchant) return;
    Promise.all([
      api.get(`/customers/${merchant.id}`),
      api.get(`/transactions/merchant/${merchant.id}`)
    ]).then(([custRes, txRes]) => {
      setCustomers(custRes.data);
      setTransactions(txRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [merchant]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalClients = customers.length;
  const totalPoints = transactions
    .filter(tx => tx.points > 0)
    .reduce((sum, tx) => sum + tx.points, 0);
  const visitsThisMonth = transactions.filter(
    tx => tx.points > 0 && new Date(tx.created_at) >= startOfMonth
  ).length;
  const rewardsUsed = transactions.filter(tx => tx.points < 0).length;

  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.last_visit || b.created_at).getTime() - new Date(a.last_visit || a.created_at).getTime())
    .slice(0, 5);

  const stats = [
    { name: "Total clients", value: loading ? "..." : totalClients.toString(), icon: Users },
    { name: "Points distribués", value: loading ? "..." : totalPoints.toLocaleString("fr-FR"), icon: Gift },
    { name: "Visites ce mois", value: loading ? "..." : visitsThisMonth.toString(), icon: TrendingUp },
    { name: "Récompenses utilisées", value: loading ? "..." : rewardsUsed.toString(), icon: CreditCard },
  ];

  // URL d'inscription publique (jamais codée en dur — toujours via NEXT_PUBLIC_APP_URL)
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const qrData = `${appUrl}/join/${merchant?.id}`;

  const handleDownloadQR = () => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = "fideloo-qr.png";
    a.click();
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0">` +
      `<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}" /></body></html>`
    );
    win.document.close();
    win.print();
  };

  const formatRelativeTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 3600) return `Il y a ${Math.round(diff / 60)}min`;
    if (diff < 86400) return `Il y a ${Math.round(diff / 3600)}h`;
    if (diff < 172800) return "Hier";
    return `Il y a ${Math.round(diff / 86400)} jours`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">
            Bonjour, {merchant?.business_name} 👋
          </h1>
          <p className="text-text-muted mt-1">Voici le résumé de votre activité d'aujourd'hui.</p>
        </div>
        <Link
          href="/dashboard/scanner"
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2"
          id="scan-btn"
        >
          <ScanLine className="w-5 h-5" />
          Scanner un client
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-text-muted">{stat.name}</p>
                <h3 className="text-3xl font-bold text-text-main mt-2">{stat.value}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-primary">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-text-main mb-6">Visites (30 derniers jours)</h3>
          <div className="flex-1 min-h-[250px] bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-3 text-text-muted">
            <TrendingUp className="w-10 h-10 text-slate-200" />
            <Link href="/dashboard/analytiques" className="text-sm text-primary hover:underline font-medium">
              Voir les analytiques complètes →
            </Link>
          </div>
        </div>

        <div
          id="qr-section"
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center"
        >
          <h3 className="text-lg font-bold text-text-main mb-2">Votre QR Code</h3>
          <p className="text-sm text-text-muted mb-6">Affichez-le en caisse pour vos clients.</p>
          <div className="w-48 h-48 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center shadow-inner mb-6">
            {merchant && (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`}
                alt="QR Code"
              />
            )}
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={handleDownloadQR}
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-slate-200 rounded-xl text-sm font-medium text-text-main hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2 border border-slate-200 rounded-xl text-sm font-medium text-text-main hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-text-main">Derniers clients</h3>
          <Link href="/dashboard/clients" className="text-sm font-medium text-primary hover:text-primary/80">
            Voir tout
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="px-6 py-8 text-center text-text-muted text-sm">Chargement...</div>
          ) : recentCustomers.length === 0 ? (
            <div className="px-6 py-8 text-center text-text-muted text-sm">
              Aucun client pour l'instant. Partagez votre QR code !
            </div>
          ) : (
            recentCustomers.map((client) => (
              <div
                key={client.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600">
                    {client.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-medium text-text-main">{client.name}</div>
                    <div className="text-sm text-text-muted">
                      {formatRelativeTime(client.last_visit || client.created_at)}
                    </div>
                  </div>
                </div>
                <div className="bg-indigo-50 text-primary font-bold text-sm px-3 py-1 rounded-full">
                  {client.points} pts
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ScanLine(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M7 12h10" />
    </svg>
  );
}
