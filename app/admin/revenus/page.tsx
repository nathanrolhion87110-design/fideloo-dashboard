"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Users, Star, AlertTriangle } from "lucide-react";

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
  mrr: number;
  arr: number;
  conversionRate: number;
  newMerchantsThisMonth: number;
}

function fmt(n: number) { return n.toLocaleString("fr-FR"); }
function fmtEur(n: number) { return `${n.toLocaleString("fr-FR")} €`; }

const PLAN_PRICES: { label: string; price: number; color: string }[] = [
  { label: "Pro",      price: 80,  color: GOLD     },
  { label: "Standard", price: 50,  color: "#6B9CCC" },
  { label: "Business", price: 150, color: INK      },
];

export default function AdminRevenusPage() {
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    fetch(`${API}/admin/stats`, { headers: { "x-admin-token": token || "" } })
      .then(r => r.json())
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => { setError("Impossible de charger les revenus."); setLoading(false); });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: INK, letterSpacing: "-0.5px" }}>Revenus</h1>
        <p style={{ fontSize: 14, color: GRAY, marginTop: 4 }}>MRR, ARR et répartition des plans.</p>
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
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            {[
              { icon: DollarSign,  label: "MRR",                  value: fmtEur(stats.mrr),          sub: "Mensuel récurrent" },
              { icon: TrendingUp,  label: "ARR",                  value: fmtEur(stats.arr),          sub: "Annuel projeté" },
              { icon: Star,        label: "Comptes payants",      value: fmt(stats.proMerchants),    sub: `${stats.conversionRate}% de conversion` },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(184,135,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={GOLD} />
                  </div>
                  <span style={{ fontSize: 13, color: GRAY, fontWeight: 600 }}>{label}</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: INK, letterSpacing: "-1px" }}>{value}</div>
                <div style={{ fontSize: 12, color: GRAY, marginTop: 4 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Plan breakdown */}
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 28, marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 20 }}>Contribution par plan</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {PLAN_PRICES.map(({ label, price, color }) => {
                const count = label === "Pro" ? stats.proMerchants : 0;
                const revenue = count * price;
                const ratio = stats.mrr > 0 ? Math.round((revenue / stats.mrr) * 100) : 0;
                return (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                        <span style={{ fontWeight: 600, color: INK }}>{label}</span>
                        <span style={{ color: GRAY }}>· {fmt(count)} compte{count > 1 ? "s" : ""} × {price} €/mois</span>
                      </div>
                      <span style={{ fontWeight: 700, color: INK }}>{fmtEur(revenue)} <span style={{ fontWeight: 400, color: GRAY, fontSize: 12 }}>({ratio}%)</span></span>
                    </div>
                    <div style={{ height: 6, background: "#F0EDE8", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${ratio}%`, background: color, borderRadius: 999, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Growth metrics */}
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: INK, marginBottom: 20 }}>Croissance</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: GRAY, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Nouveaux commerçants ce mois</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>{fmt(stats.newMerchantsThisMonth)}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: GRAY, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Taux de conversion Free → Pro</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>{stats.conversionRate}%</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: GRAY, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>ARPU (payant)</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>
                  {stats.proMerchants > 0 ? fmtEur(Math.round(stats.mrr / stats.proMerchants)) : "—"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: GRAY, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Comptes total</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Users size={20} color={GOLD} />
                  <span style={{ fontSize: 28, fontWeight: 800, color: INK }}>{fmt(stats.totalMerchants)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
