"use client";

import { useState, useEffect } from "react";
import { Download, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import GlassCard from "../../../components/GlassCard";
import GlowButton from "../../../components/GlowButton";
import GradientText from "../../../components/GradientText";

interface Transaction {
  id: string; customer_id: string; points: number; note?: string | null;
  created_at: string; customers?: { name: string; email?: string | null } | null;
}

export default function TransactionsPage() {
  const { merchant } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "add" | "redeem">("all");

  useEffect(() => {
    if (!merchant) return;
    api.get<Transaction[]>(`/transactions/merchant/${merchant.id}`)
      .then((res) => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [merchant]);

  const filtered = transactions.filter((tx) => {
    const name = tx.customers?.name || "";
    if (search && !name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter === "add" && tx.points <= 0) return false;
    if (typeFilter === "redeem" && tx.points > 0) return false;
    return true;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = (Date.now() - d.getTime()) / 1000;
    const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    if (diff < 86400) return `Aujourd'hui, ${time}`;
    if (diff < 172800) return `Hier, ${time}`;
    return `${d.toLocaleDateString("fr-FR")}, ${time}`;
  };

  const exportCSV = () => {
    const rows: (string | number)[][] = [["Date", "Client", "Points", "Note"]];
    filtered.forEach((tx) =>
      rows.push([formatDate(tx.created_at), tx.customers?.name || "Inconnu", tx.points > 0 ? `+${tx.points}` : `${tx.points}`, tx.note || ""])
    );
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "transactions-fideloo.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="heading-display text-3xl"><GradientText>Historique des transactions</GradientText></h1>
          <p className="text-text-muted mt-1">
            {loading ? "Chargement…" : `${filtered.length} transaction${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <GlowButton variant="ghost" onClick={exportCSV}><Download className="w-4 h-4" /> Export CSV</GlowButton>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-10 w-full rounded-xl py-2.5 text-sm" placeholder="Rechercher par nom de client…"
            />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "all" | "add" | "redeem")}
                  className="input-dark rounded-xl px-3 py-2.5 text-sm">
            <option value="all">Tous les types</option>
            <option value="add">Ajouts de points</option>
            <option value="redeem">Récompenses</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>Date</th>
                <th className="px-6 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>Client</th>
                <th className="px-6 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>Mouvement</th>
                <th className="px-6 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-text-muted text-sm">Chargement…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-text-muted text-sm">Aucune transaction trouvée.</td></tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-main">{formatDate(tx.created_at)}</div>
                      <div className="text-xs text-text-muted font-mono">{tx.id.slice(0, 8)}…</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-main">{tx.customers?.name || "Inconnu"}</div>
                      <div className="text-xs text-text-muted">{tx.customers?.email || ""}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tx.points > 0 ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                              style={{ background: "rgba(201,168,76,0.18)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}>
                          <ArrowUpRight className="w-4 h-4" /> +{tx.points} pts
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
                              style={{ background: "rgba(245,158,11,0.15)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.3)" }}>
                          <ArrowDownRight className="w-4 h-4" /> {tx.points} pts
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{tx.note || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
