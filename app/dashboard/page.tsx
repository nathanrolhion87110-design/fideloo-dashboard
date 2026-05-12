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

  const handleDownloadQR = () => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(qrData)}&color=a78bfa&bgcolor=0a0a0b`;
    const a = document.createElement("a");
    a.href = url; a.download = "fideloo-qr.png"; a.click();
  };
  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<html><body style="background:#080808;display:flex;justify-content:center;align-items:center;height:100vh;margin:0">` +
      `<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrData)}&color=a78bfa&bgcolor=0a0a0b" /></body></html>`
    );
    w.document.close(); w.print();
  };

  const formatRelativeTime = (dateStr: string) => {
    const diff = (now.getTime() - new Date(dateStr).getTime()) / 1000;
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
          <p className="mt-1" style={{ color: "#8A8070" }}>Voici le résumé de votre activité aujourd&apos;hui.</p>
        </div>
        <Link href="/dashboard/scanner">
          <GlowButton size="lg" id="scan-btn">
            <ScanLine className="w-5 h-5" /> Scanner un client
          </GlowButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total clients"          value={loading ? "—" : totalClients.toLocaleString("fr-FR")}   icon={Users}      delay={0} />
        <StatCard label="Points distribués"      value={loading ? "—" : totalPoints.toLocaleString("fr-FR")}    icon={Gift}       delay={0.06} />
        <StatCard label="Visites ce mois"        value={loading ? "—" : visitsThisMonth.toLocaleString("fr-FR")} icon={TrendingUp} delay={0.12} />
        <StatCard label="Récompenses utilisées"  value={loading ? "—" : rewardsUsed.toLocaleString("fr-FR")}    icon={CreditCard} delay={0.18} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6 flex flex-col" lift>
          <h3 className="text-lg font-bold mb-2" style={{ color: "#F5F0E8" }}>Visites (30 derniers jours)</h3>
          <p className="text-sm mb-6" style={{ color: "#8A8070" }}>Une vue détaillée est disponible dans Analytiques.</p>
          <div className="flex-1 min-h-[260px] rounded-xl flex flex-col items-center justify-center gap-3"
            style={{
              background: "var(--violet-soft)",
              border: "1px solid rgba(167,139,250,0.2)",
              color: "var(--text-dim)",
            }}>
            <TrendingUp className="w-12 h-12 opacity-50" style={{ color: "var(--violet)" }} />
            <Link href="/dashboard/analytiques" className="text-sm font-semibold transition-colors"
              style={{ color: "var(--violet)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--violet)")}>
              Voir les analytiques complètes →
            </Link>
          </div>
        </GlassCard>

        <GlassCard id="qr-section" className="p-6 flex flex-col items-center text-center" lift>
          <h3 className="text-lg font-bold mb-2" style={{ color: "#F5F0E8" }}>Votre QR Code</h3>
          <p className="text-sm mb-5" style={{ color: "#8A8070" }}>Affichez-le en caisse pour vos clients.</p>
          <div className="w-48 h-48 rounded-2xl p-3 flex items-center justify-center mb-5"
            style={{ background: "white", border: "1px solid rgba(167,139,250,0.4)", boxShadow: "0 0 0 1px rgba(167,139,250,0.1), 0 8px 32px rgba(167,139,250,0.15)" }}>
            {merchant && (
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}&color=0a0a0b`} alt="QR Code" />
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
        <div className="px-6 py-5 flex justify-between items-center"
          style={{ borderBottom: "1px solid var(--line)" }}>
          <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>Derniers clients</h3>
          <Link href="/dashboard/clients" className="text-sm font-semibold transition-colors"
            style={{ color: "var(--violet)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--violet)")}>
            Voir tout
          </Link>
        </div>
        <div>
          {loading ? (
            <div className="px-6 py-10 text-center text-sm" style={{ color: "#8A8070" }}>Chargement…</div>
          ) : recentCustomers.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm" style={{ color: "#8A8070" }}>
              Aucun client pour l&apos;instant. Partagez votre QR code !
            </div>
          ) : (
            recentCustomers.map((c) => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between transition-colors"
                style={{ borderBottom: "1px solid var(--line)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: "var(--violet-soft)", color: "var(--violet)" }}>
                    {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: "var(--text)" }}>{c.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-dim)" }}>{formatRelativeTime(c.last_visit || c.created_at)}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold px-3 py-1 rounded-full"
                  style={{ color: "var(--violet)", background: "var(--violet-soft)", border: "1px solid rgba(167,139,250,0.25)" }}>
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
