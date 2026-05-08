"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import GlassCard from "../../../components/GlassCard";
import GradientText from "../../../components/GradientText";

interface Customer { id: string; name: string; email?: string | null; points: number; created_at: string; }
interface Transaction { id: string; customer_id: string; points: number; created_at: string; }

const CHART_PURPLE = "#A78BFA";
const CHART_BLUE = "#60A5FA";

export default function AnalyticsPage() {
  const { merchant } = useAuth();
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
    { title: "Nouveaux clients", value: recentCustomers.length, color: "#A78BFA" },
    { title: "Points distribués", value: totalPoints, color: "#7C3AED" },
    { title: "Récompenses utilisées", value: negativeTx.length, color: "#F59E0B" },
    { title: "Taux de rétention", value: retention, suffix: "%", color: "#34D399" },
  ];

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="heading-display text-3xl"><GradientText>Analytiques</GradientText></h1>
          <p className="text-text-muted mt-1">Suivez les performances de votre programme</p>
        </div>
        <select value={period} onChange={(e) => setPeriod(Number(e.target.value))}
                className="input-dark rounded-xl px-4 py-2.5 text-sm">
          <option value={7}>7 derniers jours</option>
          <option value={30}>30 derniers jours</option>
          <option value={90}>3 derniers mois</option>
          <option value={365}>Cette année</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k, i) => (
          <div key={k.title} className="stat-card card-lift fade-in-up rounded-2xl p-6"
               style={{ animationDelay: `${i * .07}s` }}>
            <div className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">{k.title}</div>
            <div className="text-3xl font-extrabold tracking-tight" style={{ color: loading ? "rgba(255,255,255,0.2)" : k.color }}>
              {loading ? "—" : `${k.value.toLocaleString("fr-FR")}${k.suffix || ""}`}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6 flex flex-col">
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6">
            <Users className="w-5 h-5" style={{ color: CHART_PURPLE }} /> Acquisition Clients
          </h3>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-text-muted text-sm">Chargement…</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clientData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid rgba(124,58,237,0.4)", background: "rgba(22,22,31,0.95)", color: "#F1F5F9", fontSize: "13px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                    formatter={(v: number) => [`${v} client${v !== 1 ? "s" : ""}`, "Nouveaux"]}
                  />
                  <Line type="monotone" dataKey="clients" stroke="url(#lineGradient)" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "#A78BFA" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col">
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5" style={{ color: CHART_BLUE }} /> Distribution de points
          </h3>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-text-muted text-sm">Chargement…</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pointsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid rgba(124,58,237,0.4)", background: "rgba(22,22,31,0.95)", color: "#F1F5F9", fontSize: "13px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                    formatter={(v: number) => [`${v} point${v !== 1 ? "s" : ""}`, "Distribués"]}
                  />
                  <Bar dataKey="points" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h3 className="text-lg font-bold text-text-main mb-6">Top 5 Clients les plus fidèles</h3>
        {loading ? (
          <div className="text-center text-text-muted text-sm py-4">Chargement…</div>
        ) : topClients.length === 0 ? (
          <div className="text-center text-text-muted text-sm py-4">Aucun client pour l&apos;instant.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-3 rounded-l-lg" style={{ background: "rgba(255,255,255,0.02)" }}>#</th>
                  <th className="px-6 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>Client</th>
                  <th className="px-6 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>Email</th>
                  <th className="px-6 py-3 text-right rounded-r-lg" style={{ background: "rgba(255,255,255,0.02)" }}>Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topClients.map((c, i) => (
                  <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-text-muted">#{i + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-main">{c.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{c.email || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-right" style={{ color: "#A78BFA" }}>{c.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
