"use client";

import { useState, useEffect } from "react";
import { Download, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

/* ── Tokens ─────────────────────────────── */
const CARD = "#FFFFFF"; const CARD2 = "#F5F3EE"; const INK = "#0B0F0E";
const GRAY = "#6B6B6B"; const BORD = "#E0DDD6";
const GOLD = "#B8873A"; const GS = "rgba(184,135,58,0.10)"; const GB = "rgba(184,135,58,0.25)";

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

  const inputStyle = {
    background: CARD2, border: `1px solid ${BORD}`, borderRadius: 10,
    padding: "10px 14px", fontSize: 14, color: INK, outline: "none", fontFamily: "inherit",
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: INK, letterSpacing: "-0.03em", fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
            Historique des transactions
          </h1>
          <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>
            {loading ? "Chargement…" : `${filtered.length} transaction${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button onClick={exportCSV}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: CARD2, border: `1px solid ${BORD}`, color: INK, cursor: "pointer" }}>
          <Download style={{ width: 15, height: 15 }} /> Export CSV
        </button>
      </div>

      {/* Card */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>

        {/* Filters */}
        <div style={{ padding: 16, borderBottom: `1px solid ${BORD}`, display: "flex", flexWrap: "wrap", gap: 12 }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: GRAY, pointerEvents: "none" }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom de client…"
              style={{ ...inputStyle, width: "100%", paddingLeft: 40 }}
            />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as "all" | "add" | "redeem")}
            style={{ ...inputStyle, minWidth: 180 }}>
            <option value="all">Tous les types</option>
            <option value="add">Ajouts de points</option>
            <option value="redeem">Récompenses</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: CARD2 }}>
                {["Date", "Client", "Mouvement", "Note"].map((h) => (
                  <th key={h} style={{ padding: "10px 24px", fontSize: 11, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: "40px 24px", textAlign: "center", fontSize: 14, color: GRAY }}>Chargement…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "40px 24px", textAlign: "center", fontSize: 14, color: GRAY }}>Aucune transaction trouvée.</td></tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} style={{ borderTop: `1px solid ${BORD}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = CARD2)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "14px 24px", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: INK }}>{formatDate(tx.created_at)}</div>
                      <div style={{ fontSize: 11, color: GRAY, fontFamily: "monospace" }}>{tx.id.slice(0, 8)}…</div>
                    </td>
                    <td style={{ padding: "14px 24px", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: INK }}>{tx.customers?.name || "Inconnu"}</div>
                      <div style={{ fontSize: 12, color: GRAY }}>{tx.customers?.email || ""}</div>
                    </td>
                    <td style={{ padding: "14px 24px", whiteSpace: "nowrap" }}>
                      {tx.points > 0 ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: GS, color: GOLD, border: `1px solid ${GB}` }}>
                          <ArrowUpRight style={{ width: 14, height: 14 }} /> +{tx.points} pts
                        </span>
                      ) : (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: "rgba(220,38,38,0.08)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)" }}>
                          <ArrowDownRight style={{ width: 14, height: 14 }} /> {tx.points} pts
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 24px", whiteSpace: "nowrap", fontSize: 13, color: GRAY }}>{tx.note || "—"}</td>
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
