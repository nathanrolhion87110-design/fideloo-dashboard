"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import GlassCard from "../../../components/GlassCard";
import GlowButton from "../../../components/GlowButton";
import GradientText from "../../../components/GradientText";

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
    <div className="space-y-6 fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="heading-display text-3xl"><GradientText>Mes Clients</GradientText></h1>
          <p className="text-text-muted mt-1" id="nav-clients">
            Gérez votre base de clientèle ({loading ? "…" : clients.length} au total)
          </p>
        </div>
        <GlowButton variant="ghost" onClick={exportCSV}>
          <Download className="w-4 h-4" /> Export CSV
        </GlowButton>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
            <input
              type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-dark pl-10 w-full rounded-xl py-2.5 text-sm"
              placeholder="Rechercher par nom ou email…"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>Client</th>
                <th className="px-6 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>Progression</th>
                <th className="px-6 py-3" style={{ background: "rgba(255,255,255,0.02)" }}>Dernière visite</th>
                <th className="px-6 py-3 text-right" style={{ background: "rgba(255,255,255,0.02)" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-text-muted text-sm">Chargement…</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-text-muted text-sm">
                  {search ? "Aucun client trouvé pour cette recherche." : "Aucun client pour l'instant."}
                </td></tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
                             style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.5), rgba(154,122,46,0.5))" }}>
                          {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-main">{c.name}</div>
                          <div className="text-sm text-text-muted">{c.email || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-text-main w-16">{c.points}/{threshold}</div>
                        <div className="w-28 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full"
                               style={{
                                 width: `${Math.min((c.points / threshold) * 100, 100)}%`,
                                 background: c.points >= threshold
                                   ? "linear-gradient(90deg, #10B981, #34D399)"
                                   : "linear-gradient(90deg, #C9A84C, #E8C87A)",
                               }} />
                        </div>
                        {c.points >= threshold && <span className="text-xs font-semibold text-success">🎁</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-muted">{formatDate(c.last_visit)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-white/5 flex items-center justify-between text-sm text-text-muted">
          <span>
            {filtered.length === 0
              ? "0 client"
              : `Affichage ${(page - 1) * perPage + 1}–${Math.min(page * perPage, filtered.length)} sur ${filtered.length}`}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg btn-ghost text-xs disabled:opacity-40">Précédent</button>
            <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page >= totalPages}
                    className="px-3 py-1.5 rounded-lg btn-ghost text-xs disabled:opacity-40">Suivant</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
