"use client";

import { useState, useEffect } from "react";
import { Download, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

export default function TransactionsPage() {
  const { merchant } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (!merchant) return;
    api.get(`/transactions/merchant/${merchant.id}`)
      .then(res => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [merchant]);

  const filtered = transactions.filter(tx => {
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
    const rows = [["Date", "Client", "Points", "Note"]];
    filtered.forEach(tx =>
      rows.push([
        formatDate(tx.created_at),
        tx.customers?.name || "Inconnu",
        tx.points > 0 ? `+${tx.points}` : `${tx.points}`,
        tx.note || ""
      ])
    );
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions-fideloo.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Historique des transactions</h1>
          <p className="text-text-muted mt-1">
            {loading ? "Chargement..." : `${filtered.length} transaction${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 border border-slate-200 bg-white text-text-main px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 block w-full rounded-xl border-slate-200 bg-slate-50 py-2 text-sm text-text-main focus:border-primary focus:ring-primary focus:bg-white"
              placeholder="Rechercher par nom de client..."
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border border-slate-200 bg-white text-text-main px-3 py-2 rounded-xl text-sm font-medium focus:ring-primary focus:border-primary outline-none"
          >
            <option value="all">Tous les types</option>
            <option value="add">Ajouts de points</option>
            <option value="redeem">Récompenses</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Mouvement</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Note</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted text-sm">Chargement...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted text-sm">Aucune transaction trouvée.</td>
                </tr>
              ) : (
                filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-50 text-primary">
                          <ArrowUpRight className="w-4 h-4" />
                          +{tx.points} pts
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium bg-amber-50 text-accent">
                          <ArrowDownRight className="w-4 h-4" />
                          {tx.points} pts
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-muted">{tx.note || "—"}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
