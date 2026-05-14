"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, Lock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

/* ── Tokens ─────────────────────────────── */
const CARD = "#FFFFFF"; const CARD2 = "#F5F3EE"; const INK = "#0B0F0E";
const GRAY = "#6B6B6B"; const BORD = "#E0DDD6";
const GOLD = "#B8873A"; const GS = "rgba(184,135,58,0.10)"; const GB = "rgba(184,135,58,0.25)";

interface Customer { id: string; name: string; email?: string | null; points: number; created_at: string; }
interface Transaction { id: string; customer_id: string; points: number; created_at: string; }

function ChartTooltipLight({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: INK, boxShadow: "0 8px 32px rgba(11,15,14,0.08)" }}>
      <p style={{ color: GRAY, marginBottom: 6, fontSize: 11 }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name} : {p.value}</p>)}
    </div>
  );
}

function FeatureLockedPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: INK, letterSpacing: "-0.03em", fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
          Analytiques
        </h1>
        <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Suivez les performances de votre programme</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 24, padding: 48, background: CARD, border: `1px solid ${BORD}`, borderRadius: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Lock size={28} color={GOLD} />
        </div>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: INK, marginBottom: 8 }}>Analytiques disponibles à partir du plan Pro</div>
          <div style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>
            Accédez aux courbes d'acquisition, de distribution de points, au taux de rétention et au classement de vos meilleurs clients.
          </div>
        </div>
        <a href="/dashboard/parametres"
          style={{ padding: "12px 28px", background: INK, color: "#FFFFFF", borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", marginTop: 8 }}>
          Passer au plan Pro →
        </a>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { merchant } = useAuth();
  const plan = (merchant as { plan?: string } | null)?.plan || "standard";

  if (plan === "standard") return <FeatureLockedPage />;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    if (!merchant) return;
    Promise.all([
      api.get<Customer[]>(`/customers/${merchant.id}`),
      api.get<Transaction[]>(`/transactions/merchant/${merchant.id}`)
    ])
      .then(([c, t]) => { setCustomers(c.data); setTransactions(t.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [merchant]);

  const now = new Date();
  const cutoff = new Date(now.getTime() - period * 86400000);
  const recentCustomers = customers.filter((c) => new Date(c.created_at) >= cutoff);
  const recentTx = transactions.filter((tx) => new Date(tx.created_at) >= cutoff);
  const positiveTx = recentTx.filter((tx) => tx.points > 0);
  const negativeTx = recentTx.filter((tx) => tx.points < 0);
  const totalPoints = positiveTx.reduce((s, tx) => s + tx.points, 0);
  const activeIds = new Set(recentTx.map((tx) => tx.customer_id));
  const retention = customers.length > 0 ? Math.round((activeIds.size / customers.length) * 100) : 0;

  const step = period > 60 ? 7 : period > 14 ? 3 : 1;
  const chartDays: { day: string; date: Date }[] = [];
  for (let i = 0; i < period; i += step) {
    const d = new Date(now.getTime() - (period - 1 - i) * 86400000);
    chartDays.push({ day: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }), date: d });
  }
  const clientData = chartDays.map(({ day, date }) => {
    const next = new Date(date.getTime() + step * 86400000);
    return { day, clients: customers.filter((c) => { const d = new Date(c.created_at); return d >= date && d < next; }).length };
  });
  const pointsData = chartDays.map(({ day, date }) => {
    const next = new Date(date.getTime() + step * 86400000);
    return { day, points: positiveTx.filter((tx) => { const d = new Date(tx.created_at); return d >= date && d < next; }).reduce((s, tx) => s + tx.points, 0) };
  });
  const topClients = [...customers].sort((a, b) => b.points - a.points).slice(0, 5);

  const kpis = [
    { title: "Nouveaux clients", value: recentCustomers.length },
    { title: "Points distribués", value: totalPoints },
    { title: "Récompenses utilisées", value: negativeTx.length },
    { title: "Taux de rétention", value: retention, suffix: "%" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: INK, letterSpacing: "-0.03em", fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
            Analytiques
          </h1>
          <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Suivez les performances de votre programme</p>
        </div>
        <select value={period} onChange={(e) => setPeriod(Number(e.target.value))}
          style={{ background: CARD2, border: `1px solid ${BORD}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: INK, outline: "none" }}>
          <option value={7}>7 derniers jours</option>
          <option value={30}>30 derniers jours</option>
          <option value={90}>3 derniers mois</option>
          <option value={365}>Cette année</option>
        </select>
      </div>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14, marginBottom: 24 }}>
        {kpis.map((k) => (
          <div key={k.title} style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: "20px 24px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{k.title}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: loading ? BORD : GOLD, letterSpacing: "-0.03em" }}>
              {loading ? "—" : `${k.value.toLocaleString("fr-FR")}${k.suffix || ""}`}
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: "20px 20px 12px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Users style={{ width: 16, height: 16, color: GOLD }} /> Acquisition Clients
          </h3>
          {loading ? (
            <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: GRAY, fontSize: 14 }}>Chargement…</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={clientData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORD} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: GRAY }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: GRAY }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipLight />} cursor={{ stroke: BORD, strokeWidth: 1 }} />
                <Line type="monotone" dataKey="clients" name="Nouveaux clients" stroke={GOLD} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: GOLD, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: "20px 20px 12px" }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp style={{ width: 16, height: 16, color: GOLD }} /> Distribution de points
          </h3>
          {loading ? (
            <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", color: GRAY, fontSize: 14 }}>Chargement…</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pointsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="barGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={1} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={BORD} vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: GRAY }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: GRAY }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipLight />} cursor={{ fill: GS }} />
                <Bar dataKey="points" name="Distribués" fill="url(#barGold)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top clients */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${BORD}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: INK }}>Top 5 Clients les plus fidèles</h3>
        </div>
        {loading ? (
          <div style={{ padding: "24px", textAlign: "center", fontSize: 14, color: GRAY }}>Chargement…</div>
        ) : topClients.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", fontSize: 14, color: GRAY }}>Aucun client pour l&apos;instant.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: CARD2 }}>
                  {["#", "Client", "Email", "Points"].map((h, i) => (
                    <th key={h} style={{ padding: "10px 24px", fontSize: 11, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: i === 3 ? "right" : "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topClients.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: `1px solid ${BORD}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = CARD2)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "14px 24px", fontSize: 13, fontWeight: 700, color: GRAY }}>#{i + 1}</td>
                    <td style={{ padding: "14px 24px", fontSize: 13, fontWeight: 500, color: INK }}>{c.name}</td>
                    <td style={{ padding: "14px 24px", fontSize: 13, color: GRAY }}>{c.email || "—"}</td>
                    <td style={{ padding: "14px 24px", textAlign: "right" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: GOLD, padding: "3px 10px", background: GS, borderRadius: 999, border: `1px solid ${GB}` }}>{c.points}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
