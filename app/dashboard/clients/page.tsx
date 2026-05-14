"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

/* ── Tokens ─────────────────────────────── */
const CARD = "#FFFFFF"; const CARD2 = "#F5F3EE"; const INK = "#0B0F0E";
const GRAY = "#6B6B6B"; const BORD = "#E0DDD6";
const GOLD = "#B8873A"; const GS = "rgba(184,135,58,0.10)"; const GB = "rgba(184,135,58,0.25)";

interface Client { id: string; name: string; email?: string | null; phone?: string | null; points: number; last_visit?: string | null; }

export default function ClientsPage() {
  const { merchant } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    if (!merchant) return;
    api.get<Client[]>(`/customers/${merchant.id}`)
      .then((res) => setClients(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [merchant]);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const threshold = merchant?.reward_threshold || 10;

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Jamais";
    const d = new Date(dateStr);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 86400) return "Aujourd'hui";
    if (diff < 172800) return "Hier";
    if (diff < 604800) return `Il y a ${Math.round(diff / 86400)} jours`;
    return d.toLocaleDateString("fr-FR");
  };

  const exportCSV = () => {
    const rows: (string | number)[][] = [["Nom", "Email", "Points", "Téléphone", "Dernière visite"]];
    clients.forEach((c) => rows.push([c.name, c.email || "", c.points, c.phone || "", formatDate(c.last_visit)]));
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "clients-fideloo.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: INK, letterSpacing: "-0.03em", fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
            Mes Clients
          </h1>
          <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>
            Gérez votre base de clientèle ({loading ? "…" : clients.length} au total)
          </p>
        </div>
        <button onClick={exportCSV}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: CARD2, border: `1px solid ${BORD}`, color: INK, cursor: "pointer" }}>
          <Download style={{ width: 15, height: 15 }} /> Export CSV
        </button>
      </div>

      {/* Card */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>

        {/* Search */}
        <div style={{ padding: 16, borderBottom: `1px solid ${BORD}` }}>
          <div style={{ position: "relative", maxWidth: 400 }}>
            <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: GRAY, pointerEvents: "none" }} />
            <input
              type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher par nom ou email…"
              style={{ width: "100%", paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, background: CARD2, border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 14, color: INK, outline: "none", fontFamily: "inherit" }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: CARD2, textAlign: "left" }}>
                {["Client", "Progression", "Dernière visite", "Actions"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 24px", fontSize: 11, fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: i === 3 ? "right" : "left" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: "40px 24px", textAlign: "center", fontSize: 14, color: GRAY }}>Chargement…</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "40px 24px", textAlign: "center", fontSize: 14, color: GRAY }}>
                  {search ? "Aucun client trouvé pour cette recherche." : "Aucun client pour l'instant."}
                </td></tr>
              ) : (
                paginated.map((c, idx) => {
                  const initials = c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                  const pct = Math.min((c.points / threshold) * 100, 100);
                  const isVip = c.points >= threshold;
                  return (
                    <tr key={c.id} style={{ borderTop: `1px solid ${BORD}` }}
                      onMouseEnter={e => (e.currentTarget.style.background = CARD2)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "14px 24px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, background: GS, color: GOLD, border: `1px solid ${GB}` }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: INK, display: "flex", alignItems: "center", gap: 6 }}>
                              {c.name}
                              {isVip && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: GS, color: GOLD, letterSpacing: "0.05em", border: `1px solid ${GB}` }}>VIP</span>}
                            </div>
                            <div style={{ fontSize: 12, color: GRAY }}>{c.email || c.phone || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 24px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: INK, width: 56 }}>{c.points}/{threshold}</span>
                          <div style={{ width: 100, height: 6, borderRadius: 999, overflow: "hidden", background: CARD2, border: `1px solid ${BORD}` }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: isVip ? GOLD : `linear-gradient(90deg,${GOLD}88,${GOLD})`, borderRadius: 999 }} />
                          </div>
                          {isVip && <span style={{ fontSize: 13 }}>🎁</span>}
                        </div>
                      </td>
                      <td style={{ padding: "14px 24px", whiteSpace: "nowrap", fontSize: 13, color: GRAY }}>{formatDate(c.last_visit)}</td>
                      <td style={{ padding: "14px 24px", whiteSpace: "nowrap", textAlign: "right" }}>
                        <button style={{ padding: 8, borderRadius: 8, color: GRAY, background: "transparent", border: "none", cursor: "pointer" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = CARD2; (e.currentTarget as HTMLElement).style.color = INK; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = GRAY; }}>
                          <MoreVertical style={{ width: 18, height: 18 }} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: "12px 24px", borderTop: `1px solid ${BORD}`, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: GRAY }}>
          <span>
            {filtered.length === 0
              ? "0 client"
              : `Affichage ${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} sur ${filtered.length}`}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
              style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, background: CARD2, border: `1px solid ${BORD}`, color: INK, cursor: "pointer", opacity: page === 1 ? 0.4 : 1 }}>
              Précédent
            </button>
            <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page >= totalPages}
              style={{ padding: "6px 14px", borderRadius: 8, fontSize: 13, background: CARD2, border: `1px solid ${BORD}`, color: INK, cursor: "pointer", opacity: page >= totalPages ? 0.4 : 1 }}>
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
