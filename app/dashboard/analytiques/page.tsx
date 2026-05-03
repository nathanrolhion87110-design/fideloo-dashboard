"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

export default function AnalyticsPage() {
  const { merchant } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

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
  const cutoff = new Date(now.getTime() - period * 86400000);

  const recentCustomers = customers.filter(c => new Date(c.created_at) >= cutoff);
  const recentTx = transactions.filter(tx => new Date(tx.created_at) >= cutoff);
  const positiveTx = recentTx.filter(tx => tx.points > 0);
  const negativeTx = recentTx.filter(tx => tx.points < 0);
  const totalPoints = positiveTx.reduce((sum, tx) => sum + tx.points, 0);
  const activeIds = new Set(recentTx.map(tx => tx.customer_id));
  const retention = customers.length > 0 ? Math.round((activeIds.size / customers.length) * 100) : 0;

  // Génération des données jour par jour
  const step = period > 60 ? 7 : period > 14 ? 3 : 1;
  const chartDays: { day: string; date: Date }[] = [];
  for (let i = 0; i < period; i += step) {
    const d = new Date(now.getTime() - (period - 1 - i) * 86400000);
    chartDays.push({
      day: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      date: d
    });
  }

  const clientData = chartDays.map(({ day, date }) => {
    const next = new Date(date.getTime() + step * 86400000);
    return {
      day,
      clients: customers.filter(c => {
        const d = new Date(c.created_at);
        return d >= date && d < next;
      }).length
    };
  });

  const pointsData = chartDays.map(({ day, date }) => {
    const next = new Date(date.getTime() + step * 86400000);
    return {
      day,
      points: positiveTx.filter(tx => {
        const d = new Date(tx.created_at);
        return d >= date && d < next;
      }).reduce((sum, tx) => sum + tx.points, 0)
    };
  });

  const topClients = [...customers].sort((a, b) => b.points - a.points).slice(0, 5);

  const kpis = [
    { title: "Nouveaux clients", value: recentCustomers.length.toString(), color: "text-blue-600" },
    { title: "Points distribués", value: totalPoints.toLocaleString("fr-FR"), color: "text-primary" },
    { title: "Récompenses utilisées", value: negativeTx.length.toString(), color: "text-accent" },
    { title: "Taux de rétention", value: `${retention}%`, color: "text-success" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Analytiques</h1>
          <p className="text-text-muted mt-1">Suivez les performances de votre programme</p>
        </div>
        <select
          value={period}
          onChange={e => setPeriod(Number(e.target.value))}
          className="border border-slate-200 bg-white text-text-main px-4 py-2 rounded-xl text-sm font-medium focus:ring-primary focus:border-primary outline-none"
        >
          <option value={7}>7 derniers jours</option>
          <option value={30}>30 derniers jours</option>
          <option value={90}>3 derniers mois</option>
          <option value={365}>Cette année</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="text-sm font-medium text-text-muted mb-2">{kpi.title}</div>
            <div className={`text-3xl font-bold ${loading ? "text-slate-200" : kpi.color}`}>
              {loading ? "—" : kpi.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-slate-400" />
            Acquisition Clients
          </h3>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-text-muted text-sm">Chargement...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={clientData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                    formatter={(v: any) => [`${v} client${v !== 1 ? "s" : ""}`, "Nouveaux"]}
                  />
                  <Line type="monotone" dataKey="clients" stroke="#6366F1" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            Distribution de points
          </h3>
          <div className="flex-1 min-h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center text-text-muted text-sm">Chargement...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pointsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                    formatter={(v: any) => [`${v} point${v !== 1 ? "s" : ""}`, "Distribués"]}
                  />
                  <Bar dataKey="points" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-text-main mb-6">Top 5 Clients les plus fidèles</h3>
        {loading ? (
          <div className="text-center text-text-muted text-sm py-4">Chargement...</div>
        ) : topClients.length === 0 ? (
          <div className="text-center text-text-muted text-sm py-4">Aucun client pour l'instant.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase rounded-l-lg">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase rounded-r-lg">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topClients.map((c, i) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-400">{i + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-main">{c.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{c.email || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary text-right">{c.points}</td>
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
