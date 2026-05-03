"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Download } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

export default function ClientsPage() {
  const { merchant } = useAuth();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  useEffect(() => {
    if (!merchant) return;
    api.get(`/customers/${merchant.id}`)
      .then(res => setClients(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [merchant]);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const threshold = merchant?.reward_threshold || 10;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Jamais";
    const d = new Date(dateStr);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 86400) return "Aujourd'hui";
    if (diff < 172800) return "Hier";
    if (diff < 604800) return `Il y a ${Math.round(diff / 86400)} jours`;
    return d.toLocaleDateString("fr-FR");
  };

  const exportCSV = () => {
    const rows = [["Nom", "Email", "Points", "Téléphone", "Dernière visite"]];
    clients.forEach(c =>
      rows.push([c.name, c.email || "", c.points, c.phone || "", formatDate(c.last_visit)])
    );
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients-fideloo.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Mes Clients</h1>
          <p className="text-text-muted mt-1" id="nav-clients">
            Gérez votre base de clientèle ({loading ? "..." : clients.length} au total)
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
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 block w-full rounded-xl border-slate-200 bg-slate-50 py-2 text-sm text-text-main focus:border-primary focus:ring-primary focus:bg-white"
              placeholder="Rechercher par nom ou email..."
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Progression</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Dernière visite</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted text-sm">Chargement...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted text-sm">
                    {search ? "Aucun client trouvé pour cette recherche." : "Aucun client pour l'instant."}
                  </td>
                </tr>
              ) : (
                paginated.map(client => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                          {client.name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-main">{client.name}</div>
                          <div className="text-sm text-text-muted">{client.email || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold text-text-main w-16">
                          {client.points}/{threshold}
                        </div>
                        <div className="w-24 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${client.points >= threshold ? "bg-success" : "bg-primary"}`}
                            style={{ width: `${Math.min((client.points / threshold) * 100, 100)}%` }}
                          />
                        </div>
                        {client.points >= threshold && (
                          <span className="text-xs font-medium text-success">🎁 Récompense</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-muted">{formatDate(client.last_visit)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-text-muted hover:text-primary transition-colors p-2">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-text-muted">
          <span>
            {filtered.length === 0
              ? "0 client"
              : `Affichage de ${(page - 1) * perPage + 1} à ${Math.min(page * perPage, filtered.length)} sur ${filtered.length} clients`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50"
            >
              Précédent
            </button>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
