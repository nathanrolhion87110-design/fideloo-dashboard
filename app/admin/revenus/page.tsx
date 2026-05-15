"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, DollarSign, Users } from "lucide-react";

const INK   = "#0B0F0E";
const GOLD  = "#B8873A";
const GRAY  = "#6B6B6B";
const BORD  = "#E0DDD6";
const CARD  = "#FFFFFF";
const API   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Stats {
  totalMerchants: number;
  proMerchants: number;
  standardMerchants: number;
  totalCustomers: number;
  totalTransactions: number;
  newMerchantsThisMonth: number;
  mrr: number;
  arr: number;
  conversionRate: number;
}

interface Merchant {
  id: string;
  email: string;
  business_name: string;
  plan: string;
  plan_expires_at: string | null;
  created_at: string;
  customer_count: number;
}

const PLAN_MRR: Record<string, number>    = { standard: 50, pro: 80, business: 150 };
const PLAN_LABELS: Record<string, string> = { standard: "Standard", pro: "Pro", business: "Business" };

const AVATAR_COLORS = ["#B8873A", "#4B9CD3", "#6B8E23", "#9370DB", "#20B2AA"];
const avatarColor = (s: string) => AVATAR_COLORS[(s?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials    = (s: string) => (s || "??").slice(0, 2).toUpperCase();
const fmtEur      = (n: number) => `${n.toLocaleString("fr-FR")} €`;

const planBadge = (plan: string): React.CSSProperties => ({
  display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
  background: plan === "pro" ? "rgba(184,135,58,0.18)" : plan === "business" ? "rgba(11,15,14,0.10)" : "#F0EDE8",
  color: plan === "pro" ? GOLD : plan === "business" ? INK : GRAY,
});

async function adminFetch<T>(path: string): Promise<T> {
  const token = localStorage.getItem("admin_token") || "";
  const res = await fetch(`${API}${path}`, { headers: { "x-admin-token": token } });
  if (res.status === 401) { localStorage.removeItem("admin_token"); window.location.href = "/admin/login"; throw new Error("401"); }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function AdminRevenusPage() {
  const [stats, setStats]         = useState<Stats | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading]     = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, m] = await Promise.all([
        adminFetch<Stats>("/admin/stats"),
        adminFetch<{ merchants: Merchant[] }>("/admin/merchants?limit=100"),
      ]);
      setStats(s);
      setMerchants((m.merchants || []).filter(x => PLAN_MRR[x.plan] > 0));
    } catch { /* handled */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const standard   = merchants.filter(m => m.plan === "standard").length;
  const pro        = merchants.filter(m => m.plan === "pro").length;
  const business   = merchants.filter(m => m.plan === "business").length;
  const mrr        = standard * 50 + pro * 80 + business * 150;
  const arr        = mrr * 12;
  const arpu       = merchants.length > 0 ? Math.round(mrr / merchants.length) : 0;

  const PLAN_ROWS = [
    { label: "Standard", price: 50,  count: standard, color: "#6B6B6B", bg: "#F0EDE8"              },
    { label: "Pro",      price: 80,  count: pro,      color: GOLD,      bg: "rgba(184,135,58,0.15)" },
    { label: "Business", price: 150, count: business, color: INK,       bg: "rgba(11,15,14,0.08)"   },
  ];

  const thStyle: React.CSSProperties = { padding: "12px 16px", background: "#F5F3EE", fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: `1px solid ${BORD}` };
  const tdStyle: React.CSSProperties = { padding: "13px 16px", fontSize: 13, color: INK, verticalAlign: "middle", borderBottom: `1px solid ${BORD}` };

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", margin: 0 }}>
          MRR / ARR <em style={{ fontStyle: "italic", fontWeight: 400 }}>revenus.</em>
        </h1>
        <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Revenus récurrents Fideloo.</p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
          <div style={{ width: 32, height: 32, border: `3px solid ${BORD}`, borderTopColor: GOLD, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : (
        <>
          {/* KPIs grands */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { icon: DollarSign,  label: "MRR",   value: fmtEur(mrr),  sub: "Mensuel récurrent" },
              { icon: TrendingUp,  label: "ARR",   value: fmtEur(arr),  sub: "Annuel projeté" },
              { icon: Users,       label: "ARPU",  value: fmtEur(arpu), sub: "Revenu par compte payant" },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 32, textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(184,135,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Icon size={20} color={GOLD} />
                </div>
                <div style={{ fontSize: 48, fontWeight: 800, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", letterSpacing: "-2px", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, color: GRAY, marginTop: 8 }}>{label} · {sub}</div>
              </div>
            ))}
          </div>

          {/* Répartition par plan */}
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 28, marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 20 }}>Contribution par plan</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {PLAN_ROWS.map(({ label, price, count, color, bg }) => {
                const rev   = count * price;
                const ratio = mrr > 0 ? Math.round((rev / mrr) * 100) : 0;
                return (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                        <span style={{ fontWeight: 700, color: INK }}>{label}</span>
                        <span style={{ color: GRAY, fontSize: 13 }}>· {count} compte{count > 1 ? "s" : ""} × {price} €/mois</span>
                      </div>
                      <span style={{ fontWeight: 700, color: INK }}>
                        {fmtEur(rev)}{" "}
                        <span style={{ fontWeight: 400, color: GRAY, fontSize: 12 }}>({ratio}%)</span>
                      </span>
                    </div>
                    <div style={{ height: 8, background: bg, borderRadius: 999 }}>
                      <div style={{ height: "100%", width: `${ratio}%`, background: color, borderRadius: 999 }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${BORD}`, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>Total MRR</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: GOLD, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>{fmtEur(mrr)}</span>
              </div>
            </div>
          </div>

          {/* Projection */}
          {stats && (
            <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 8 }}>Projection annuelle</h2>
              <p style={{ fontSize: 14, color: GRAY }}>
                Si le taux de conversion actuel ({stats.conversionRate}%) se maintient,
                l&apos;ARR projeté à 12 mois est{" "}
                <strong style={{ color: INK }}>{fmtEur(arr)}</strong>.
              </p>
            </div>
          )}

          {/* Table par merchant */}
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORD}` }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: INK }}>Revenus par commerçant</h2>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Commerçant", "Plan", "MRR", "Clients", "Total estimé"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {merchants.length === 0 ? (
                  <tr><td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: GRAY, padding: 40 }}>Aucun abonnement payant.</td></tr>
                ) : merchants.map(m => (
                  <tr key={m.id}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarColor(m.business_name || m.email), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>
                          {initials(m.business_name || m.email)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{m.business_name || "—"}</div>
                          <div style={{ fontSize: 11, color: GRAY }}>{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}><span style={planBadge(m.plan)}>{PLAN_LABELS[m.plan]}</span></td>
                    <td style={{ ...tdStyle, fontWeight: 700 }}>{fmtEur(PLAN_MRR[m.plan])}</td>
                    <td style={{ ...tdStyle, color: GRAY }}>{m.customer_count.toLocaleString("fr-FR")}</td>
                    <td style={{ ...tdStyle, color: GRAY }}>
                      {fmtEur(Math.round((Date.now() - new Date(m.created_at).getTime()) / (30 * 86400000)) * PLAN_MRR[m.plan])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
