"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, DollarSign, Zap, Activity, Star, UserPlus, BarChart2, AlertTriangle } from "lucide-react";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";
const CARD = "#FFFFFF";
const API  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Stats {
  totalMerchants: number;
  proMerchants: number;
  freeMerchants: number;
  totalCustomers: number;
  totalTransactions: number;
  newMerchantsThisMonth: number;
  mrr: number;
  arr: number;
  conversionRate: number;
}

function fmt(n: number) { return n.toLocaleString("fr-FR"); }
function fmtEur(n: number) { return `${n.toLocaleString("fr-FR")} €`; }

function KpiCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string; sub?: string }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(184,135,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color={GOLD} />
        </div>
        <span style={{ fontSize: 13, color: GRAY, fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: INK, letterSpacing: "-0.5px" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    fetch(`${API}/admin/stats`, { headers: { "x-admin-token": token || "" } })
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => { setError("Impossible de charger les statistiques."); setLoading(false); });
  }, []);

  const proRatio  = stats ? Math.round((stats.proMerchants / Math.max(stats.totalMerchants, 1)) * 100) : 0;
  const freeRatio = 100 - proRatio;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: INK, letterSpacing: "-0.5px" }}>Vue globale</h1>
        <p style={{ fontSize: 14, color: GRAY, marginTop: 4 }}>Tableau de bord interne Fideloo.</p>
      </div>

      {error && (
        <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 12, padding: "16px 20px", color: "#E53E3E", fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: GRAY, fontSize: 14 }}>Chargement…</div>
      ) : stats && (
        <>
          {/* KPI grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            <KpiCard icon={Users}      label="Commerçants total"     value={fmt(stats.totalMerchants)} />
            <KpiCard icon={Star}       label="Comptes Pro"           value={fmt(stats.proMerchants)}   sub={`${proRatio}% du total`} />
            <KpiCard icon={TrendingUp} label="MRR"                   value={fmtEur(stats.mrr)}         sub="Mensuel récurrent" />
            <KpiCard icon={DollarSign} label="ARR"                   value={fmtEur(stats.arr)}         sub="Annuel projeté" />
            <KpiCard icon={Activity}   label="Clients fidélisés"     value={fmt(stats.totalCustomers)} />
            <KpiCard icon={Zap}        label="Transactions"          value={fmt(stats.totalTransactions)} />
            <KpiCard icon={UserPlus}   label="Nouveaux ce mois"      value={fmt(stats.newMerchantsThisMonth)} />
            <KpiCard icon={BarChart2}  label="Taux de conversion"    value={`${stats.conversionRate}%`} sub="Free → Pro" />
          </div>

          {/* Plan distribution */}
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 28, marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 20 }}>Répartition des plans</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { label: "Pro", count: stats.proMerchants,   ratio: proRatio,  color: GOLD },
                { label: "Free", count: stats.freeMerchants, ratio: freeRatio, color: BORD },
              ].map(({ label, count, ratio, color }) => (
                <div key={label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: GRAY, marginBottom: 6 }}>
                    <span>{label}</span>
                    <span style={{ fontWeight: 700, color: INK }}>{fmt(count)} commerçants · {ratio}%</span>
                  </div>
                  <div style={{ height: 8, background: "#F0EDE8", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${ratio}%`, background: color, borderRadius: 999, transition: "width 0.6s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
