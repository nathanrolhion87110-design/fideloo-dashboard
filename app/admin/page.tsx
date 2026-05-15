"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, ShoppingBag, Zap, DollarSign, RefreshCw } from "lucide-react";
import Link from "next/link";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";
const CARD = "#FFFFFF";
const CARD2 = "#F5F3EE";
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

interface Merchant {
  id: string;
  email: string;
  business_name: string;
  plan: string;
  plan_expires_at: string | null;
  created_at: string;
  customer_count: number;
  transaction_count: number;
}

const ACTIVITY = [
  { id: 1, color: "#22C55E", dot: "●", text: "Le Bon Café a rejoint Fideloo",          time: "il y a 8 min"  },
  { id: 2, color: "#3B82F6", dot: "●", text: "Pizza Roma est passé au plan Pro",        time: "il y a 43 min" },
  { id: 3, color: "#F59E0B", dot: "●", text: "Boulangerie Martin — essai terminé",      time: "il y a 2h"     },
  { id: 4, color: "#22C55E", dot: "●", text: "Salon Élise a rejoint Fideloo",           time: "il y a 3h"     },
  { id: 5, color: "#3B82F6", dot: "●", text: "Épicerie du Coin passé au plan Standard", time: "il y a 5h"     },
  { id: 6, color: "#EF4444", dot: "●", text: "Commerce Test supprimé",                  time: "il y a 1j"     },
  { id: 7, color: "#22C55E", dot: "●", text: "Bar Le Central a rejoint Fideloo",        time: "il y a 1j"     },
  { id: 8, color: "#F59E0B", dot: "●", text: "Fromagerie Dupont — essai expiré",        time: "il y a 2j"     },
];

const AVATAR_COLORS = ["#B8873A", "#4B9CD3", "#6B8E23", "#9370DB", "#20B2AA"];
const avatarColor = (s: string) => AVATAR_COLORS[(s?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials    = (s: string) => (s || "??").slice(0, 2).toUpperCase();
const fmtDate     = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const fmtEur      = (n: number) => `${n.toLocaleString("fr-FR")} €`;

const PLAN_LABELS: Record<string, string> = { free: "Free", pro: "Pro", business: "Business" };
const planBadge = (plan: string): React.CSSProperties => ({
  display: "inline-block", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
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

export default function AdminPage() {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [recent, setRecent]     = useState<Merchant[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [lastSec, setLastSec]   = useState(0);
  const [now, setNow]           = useState(new Date());

  const load = useCallback(async () => {
    try {
      const [s, m] = await Promise.all([
        adminFetch<Stats>("/admin/stats"),
        adminFetch<{ merchants: Merchant[] }>("/admin/merchants?limit=10"),
      ]);
      setStats(s);
      setRecent(m.merchants || []);
      setLastSec(0);
    } catch { setError("Impossible de charger les données."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const timer = setInterval(() => setLastSec(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (lastSec >= 30) load();
  }, [lastSec, load]);

  const mrr = stats ? stats.proMerchants * 80 + stats.freeMerchants * 0 : 0;

  const KPIS = stats ? [
    { icon: Users,       label: "Total commerçants",  value: stats.totalMerchants.toLocaleString("fr-FR"),   sub: `+${stats.newMerchantsThisMonth} ce mois`,   subColor: "#22C55E" },
    { icon: ShoppingBag, label: "Clients fidélisés",  value: stats.totalCustomers.toLocaleString("fr-FR"),   sub: "tous commerçants",                           subColor: GRAY      },
    { icon: Zap,         label: "Transactions",        value: stats.totalTransactions.toLocaleString("fr-FR"),sub: "total cumulé",                               subColor: GRAY      },
    { icon: DollarSign,  label: "MRR estimé",          value: fmtEur(mrr),                                    sub: `ARR : ${fmtEur(mrr * 12)}`,                  subColor: GOLD      },
  ] : [];

  const planDist = stats ? [
    { label: "Pro",      count: stats.proMerchants,   total: stats.totalMerchants, barColor: GOLD,     bg: "rgba(184,135,58,0.15)" },
    { label: "Free",     count: stats.freeMerchants,  total: stats.totalMerchants, barColor: "#6B6B6B", bg: "#F0EDE8"              },
  ] : [];

  const dateStr = now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", margin: 0 }}>
            Vue d&apos;ensemble <em style={{ fontStyle: "italic", fontWeight: 400 }}>Fideloo.</em>
          </h1>
          <p style={{ fontSize: 13, color: GRAY, marginTop: 6, textTransform: "capitalize" }}>{dateStr}</p>
        </div>
        <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: CARD, border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 13, color: GRAY, cursor: "pointer" }}>
          <RefreshCw size={14} />
          {lastSec < 5 ? "Actualisé" : `il y a ${lastSec}s`}
        </button>
      </div>

      {error && <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "16px 20px", color: "#EF4444", fontSize: 14, marginBottom: 24 }}>{error}</div>}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
          <div style={{ width: 36, height: 36, border: `3px solid ${BORD}`, borderTopColor: GOLD, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : (
        <>
          {/* Rangée 1 — KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {KPIS.map(({ icon: Icon, label, value, sub, subColor }) => (
              <div key={label} style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(184,135,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color={GOLD} />
                  </div>
                  <span style={{ fontSize: 12, color: GRAY, fontWeight: 600 }}>{label}</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", letterSpacing: "-1px" }}>{value}</div>
                <div style={{ fontSize: 12, color: subColor, marginTop: 4 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Rangée 2 — Répartition + Activité */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>

            {/* Répartition des plans */}
            <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 20 }}>Répartition des abonnements</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {planDist.map(({ label, count, total, barColor, bg }) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={label}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, color: INK }}>{label}</span>
                        <span style={{ color: GRAY }}>{count.toLocaleString("fr-FR")} · {pct}%</span>
                      </div>
                      <div style={{ height: 8, background: bg, borderRadius: 999 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: barColor, borderRadius: 999 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activité récente */}
            <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: INK, marginBottom: 16 }}>Activité récente</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ACTIVITY.slice(0, 6).map(({ id, color, text, time }) => (
                  <div key={id} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ color, fontSize: 10, marginTop: 3, flexShrink: 0 }}>●</span>
                    <div>
                      <div style={{ fontSize: 13, color: INK }}>{text}</div>
                      <div style={{ fontSize: 11, color: GRAY }}>{time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/activite" style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: 13, color: GOLD, textDecoration: "none", fontWeight: 600 }}>
                Voir toute l&apos;activité →
              </Link>
            </div>
          </div>

          {/* Rangée 3 — Dernières inscriptions */}
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: INK }}>Dernières inscriptions</h2>
              <Link href="/admin/comptes" style={{ fontSize: 13, color: GOLD, textDecoration: "none", fontWeight: 600 }}>Voir tous les comptes →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr", gap: 0 }}>
              <div style={{ display: "contents" }}>
                {["Commerçant", "Email", "Plan", "Inscription"].map(h => (
                  <div key={h} style={{ padding: "12px 24px", background: CARD2, fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
                ))}
              </div>
              {recent.map((m, i) => (
                <div key={m.id} style={{ display: "contents" }}>
                  <div style={{ padding: "14px 24px", borderTop: `1px solid ${BORD}`, display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: avatarColor(m.business_name || m.email), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>
                      {initials(m.business_name || m.email)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{m.business_name || "—"}</div>
                      <div style={{ fontSize: 11, color: GRAY }}>{m.customer_count} clients</div>
                    </div>
                  </div>
                  <div style={{ padding: "14px 24px", borderTop: `1px solid ${BORD}`, fontSize: 13, color: GRAY, display: "flex", alignItems: "center" }}>{m.email}</div>
                  <div style={{ padding: "14px 24px", borderTop: `1px solid ${BORD}`, display: "flex", alignItems: "center" }}>
                    <span style={planBadge(m.plan)}>{PLAN_LABELS[m.plan] || m.plan}</span>
                  </div>
                  <div style={{ padding: "14px 24px", borderTop: `1px solid ${BORD}`, fontSize: 13, color: GRAY, display: "flex", alignItems: "center" }}>{fmtDate(m.created_at)}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
