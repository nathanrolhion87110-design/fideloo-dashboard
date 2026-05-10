"use client";

import { useEffect, useState } from "react";
import { Users, Gift, TrendingUp, CreditCard, Download, Printer, ScanLine } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import GlassCard from "../../components/GlassCard";
import GlowButton from "../../components/GlowButton";
import GradientText from "../../components/GradientText";
import StatCard from "../../components/StatCard";

interface Customer { id: string; name: string; email?: string | null; points: number; last_visit?: string | null; created_at: string; }
interface Transaction { id: string; customer_id: string; points: number; created_at: string; }

export default function DashboardHome() {
  const { merchant } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchant) return;
    Promise.all([
      api.get<Customer[]>(`/customers/${merchant.id}`),
      api.get<Transaction[]>(`/transactions/merchant/${merchant.id}`),
    ])
      .then(([c, t]) => { setCustomers(c.data); setTransactions(t.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [merchant]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalClients = customers.length;
  const totalPoints = transactions.filter((tx) => tx.points > 0).reduce((s, tx) => s + tx.points, 0);
  const visitsThisMonth = transactions.filter((tx) => tx.points > 0 && new Date(tx.created_at) >= startOfMonth).length;
  const rewardsUsed = transactions.filter((tx) => tx.points < 0).length;

  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.last_visit || b.created_at).getTime() - new Date(a.last_visit || a.created_at).getTime())
    .slice(0, 5);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
    || (typeof window !== "undefined" ? window.location.origin : "https://fideloo-dashboard-njfq.vercel.app");
  const joinUrl = `${appUrl}/join/${merchant?.id}`;
  const qrData = joinUrl;
  if (typeof window !== "undefined" && merchant?.id) {
    console.log("[QR] URL générée:", joinUrl);
  }

  const handleDownloadQR = () => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qrData)}&color=ffffff&bgcolor=0a0a0f`;
    const a = document.createElement("a");
    a.href = url; a.download = "fideloo-qr.png"; a.click();
  };
  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<html><body style="background:#0A0A0F;display:flex;justify-content:center;align-items:center;height:100vh;margin:0">` +
      `<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}" /></body></html>`
    );
    w.document.close(); w.print();
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
    <div className="space-y-8 fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="heading-display text-3xl">
            <GradientText>Bonjour, {merchant?.business_name || ""} 👋</GradientText>
          </h1>
          <p className="text-text-muted mt-1">Voici le résumé de votre activité aujourd&apos;hui.</p>
        </div>
        <Link href="/dashboard/scanner">
          <GlowButton size="lg" id="scan-btn">
            <ScanLine className="w-5 h-5" /> Scanner un client
          </GlowButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total clients" value={loading ? "—" : totalClients.toLocaleString("fr-FR")} icon={Users} delay={0} />
        <StatCard label="Points distribués" value={loading ? "—" : totalPoints.toLocaleString("fr-FR")} icon={Gift} delay={0.06} />
        <StatCard label="Visites ce mois" value={loading ? "—" : visitsThisMonth.toLocaleString("fr-FR")} icon={TrendingUp} delay={0.12} />
        <StatCard label="Récompenses utilisées" value={loading ? "—" : rewardsUsed.toLocaleString("fr-FR")} icon={CreditCard} delay={0.18} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6 flex flex-col" lift>
          <h3 className="text-lg font-bold text-text-main mb-2">Visites (30 derniers jours)</h3>
          <p className="text-sm text-text-muted mb-6">Une vue détaillée est disponible dans Analytiques.</p>
          <div className="flex-1 min-h-[260px] rounded-xl flex flex-col items-center justify-center gap-3 text-text-muted"
               style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(37,99,235,0.04))", border: "1px solid rgba(124,58,237,0.18)" }}>
            <TrendingUp className="w-12 h-12" style={{ color: "#A78BFA", opacity: 0.6 }} />
            <Link href="/dashboard/analytiques" className="text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors">
              Voir les analytiques complètes →
            </Link>
          </div>
        </GlassCard>

        <GlassCard id="qr-section" className="p-6 flex flex-col items-center text-center" lift>
          <h3 className="text-lg font-bold text-text-main mb-2">Votre QR Code</h3>
          <p className="text-sm text-text-muted mb-5">Affichez-le en caisse pour vos clients.</p>
          <div className="w-48 h-48 rounded-2xl p-3 flex items-center justify-center mb-5 pulse-glow"
               style={{ background: "white", border: "1px solid rgba(124,58,237,0.4)" }}>
            {merchant && (
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}`} alt="QR Code" />
            )}
          </div>
          <div className="flex gap-2 w-full">
            <GlowButton variant="ghost" fullWidth onClick={handleDownloadQR}>
              <Download className="w-4 h-4" /> Télécharger
            </GlowButton>
            <GlowButton variant="ghost" fullWidth onClick={handlePrint}>
              <Printer className="w-4 h-4" /> Imprimer
            </GlowButton>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-text-main">Derniers clients</h3>
          <Link href="/dashboard/clients" className="text-sm font-semibold text-[#A78BFA] hover:text-white transition-colors">Voir tout</Link>
        </div>
        <div className="divide-y divide-white/5">
          {loading ? (
            <div className="px-6 py-10 text-center text-text-muted text-sm">Chargement…</div>
          ) : recentCustomers.length === 0 ? (
            <div className="px-6 py-10 text-center text-text-muted text-sm">
              Aucun client pour l&apos;instant. Partagez votre QR code !
            </div>
          ) : (
            recentCustomers.map((c) => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                       style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(37,99,235,0.6))" }}>
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium text-text-main">{c.name}</div>
                    <div className="text-xs text-text-muted">{formatRelativeTime(c.last_visit || c.created_at)}</div>
                  </div>
                </div>
                <div className="text-sm font-bold px-3 py-1 rounded-full"
                     style={{ color: "#A78BFA", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                  {c.points} pts
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
}
