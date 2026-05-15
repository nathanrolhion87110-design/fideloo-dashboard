"use client";

import { useState, useEffect, useCallback } from "react";
import { CreditCard, TrendingUp, Users, BarChart2, AlertTriangle, RefreshCw } from "lucide-react";

const INK   = "#0B0F0E";
const GOLD  = "#B8873A";
const GRAY  = "#6B6B6B";
const BORD  = "#E0DDD6";
const CARD  = "#FFFFFF";
const CARD2 = "#F5F3EE";
const API   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Stats {
  totalMerchants: number;
  proMerchants: number;
  standardMerchants: number;
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
const fmtDate     = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "—";
const fmtEur = (n: number) => `${n.toLocaleString("fr-FR")} €`;

const planBadge = (plan: string): React.CSSProperties => ({
  display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
  background: plan === "pro" ? "rgba(184,135,58,0.18)" : plan === "business" ? "rgba(11,15,14,0.10)" : "#F0EDE8",
  color: plan === "pro" ? GOLD : plan === "business" ? INK : GRAY,
});

async function adminFetch<T>(path: string): Promise<T> {
  const token = localStorage.getItem("admin_token") || "";
  const res = await fetch(`${API}${path}`, { headers: { "x-admin-token": token } });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Non autorisé");
  }
  if (!res.ok) throw new Error(`Erreur ${res.status} — ${res.statusText}`);
  return res.json();
}

export default function AdminAbonnementsPage() {
  const [stats, setStats]         = useState<Stats | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, m] = await Promise.all([
        adminFetch<Stats>("/admin/stats"),
        adminFetch<{ merchants: Merchant[] }>("/admin/merchants?limit=100"),
      ]);
      setStats(s);
      setMerchants((m.merchants || []).filter(x => PLAN_MRR[x.plan] > 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const standard  = merchants.filter(m => m.plan === "standard");
  const pro       = merchants.filter(m => m.plan === "pro");
  const business  = merchants.filter(m => m.plan === "business");
  const totalPaid = standard.length + pro.length + business.length;
  const mrr       = standard.length * 50 + pro.length * 80 + business.length * 150;
  const arr       = mrr * 12;
  const convRate  = stats?.conversionRate ?? 0;

  const PLAN_BARS = [
    { label: "Standard", count: standard.length, price: 50,  color: "#6B6B6B", bg: "#F0EDE8"              },
    { label: "Pro",      count: pro.length,      price: 80,  color: GOLD,      bg: "rgba(184,135,58,0.15)" },
    { label: "Business", count: business.length, price: 150, color: INK,       bg: "rgba(11,15,14,0.08)"   },
  ];

  const thStyle: React.CSSProperties = {
    padding: "12px 16px", background: CARD2, fontSize: 11, fontWeight: 700,
    color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em",
    textAlign: "left", borderBottom: `1px solid ${BORD}`,
  };
  const tdStyle: React.CSSProperties = {
    padding: "13px 16px", fontSize: 13, color: INK,
    verticalAlign: "middle", borderBottom: `1px solid ${BORD}`,
  };

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", margin: 0 }}>
            Abonnements <em style={{ fontStyle: "italic", fontWeight: 400 }}>actifs.</em>
          </h1>
          <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Comptes payants uniquement (Pro + Business).</p>
        </div>
        <button onClick={load} disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: CARD, border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 13, color: GRAY, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          <RefreshCw size={14} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
          Actualiser
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: 14, color: "#EF4444" }}>{error}</div>
          <button onClick={load} style={{ fontSize: 13, fontWeight: 600, color: "#EF4444", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Réessayer
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
          <div style={{ width: 32, height: 32, border: `3px solid ${BORD}`, borderTopColor: GOLD, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : !error && (
        <>
          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              { icon: Users,      label: "Comptes payants",            value: totalPaid.toLocaleString("fr-FR") },
              { icon: TrendingUp, label: "MRR",                        value: fmtEur(mrr)                       },
              { icon: BarChart2,  label: "Taux conversion Standard → Pro", value: `${convRate}%`                    },
              { icon: CreditCard, label: "ARR projeté",                value: fmtEur(arr)                       },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(184,135,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={GOLD} />
                  </div>
                  <span style={{ fontSize: 12, color: GRAY, fontWeight: 600 }}>{label}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: INK, letterSpacing: "-0.5px" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Répartition */}
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 20 }}>Répartition par plan</h2>
            {mrr === 0 ? (
              <p style={{ fontSize: 13, color: GRAY }}>Aucun abonnement payant pour le moment.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {PLAN_BARS.map(({ label, count, price, color, bg }) => {
                  const rev   = count * price;
                  const ratio = mrr > 0 ? Math.round((rev / mrr) * 100) : 0;
                  return (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                          <span style={{ fontWeight: 600, color: INK }}>{label}</span>
                          <span style={{ color: GRAY }}>· {count} compte{count > 1 ? "s" : ""} × {price} €</span>
                        </div>
                        <span style={{ fontWeight: 700, color: INK }}>
                          {fmtEur(rev)}{" "}
                          <span style={{ fontWeight: 400, color: GRAY, fontSize: 11 }}>({ratio}%)</span>
                        </span>
                      </div>
                      <div style={{ height: 6, background: bg, borderRadius: 999 }}>
                        <div style={{ height: "100%", width: `${ratio}%`, background: color, borderRadius: 999, transition: "width 0.5s ease" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Table */}
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORD}` }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: INK }}>
                Abonnements actifs
                {totalPaid > 0 && (
                  <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 600, color: GRAY, background: CARD2, padding: "2px 10px", borderRadius: 999 }}>
                    {totalPaid}
                  </span>
                )}
              </h2>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Commerçant", "Plan", "Clients", "Depuis", "Renouvellement", "MRR"].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {merchants.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: GRAY, padding: 56 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
                      <div style={{ fontWeight: 600, color: INK, marginBottom: 4 }}>Aucun abonnement payant</div>
                      <div style={{ fontSize: 12, color: GRAY }}>Les commerçants sur plan Pro ou Business apparaîtront ici.</div>
                    </td>
                  </tr>
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
                    <td style={tdStyle}><span style={planBadge(m.plan)}>{PLAN_LABELS[m.plan] ?? m.plan}</span></td>
                    <td style={{ ...tdStyle, color: GRAY }}>{m.customer_count.toLocaleString("fr-FR")}</td>
                    <td style={{ ...tdStyle, color: GRAY }}>{fmtDate(m.created_at)}</td>
                    <td style={{ ...tdStyle, color: GRAY }}>{fmtDate(m.plan_expires_at)}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: INK }}>{fmtEur(PLAN_MRR[m.plan] ?? 0)}</td>
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
