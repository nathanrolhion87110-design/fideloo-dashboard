"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Trash2, Edit2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";
const CARD = "#FFFFFF";
const CARD2 = "#F5F3EE";
const API  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

const PLAN_LABELS: Record<string, string> = { free: "Free", pro: "Pro", business: "Business" };
const PLANS = ["free", "pro", "business"];

export default function AdminComptesPage() {
  const [merchants, setMerchants]     = useState<Merchant[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [search, setSearch]           = useState("");
  const [planFilter, setPlanFilter]   = useState("");
  const [loading, setLoading]         = useState(true);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [editMerchant, setEditMerchant] = useState<Merchant | null>(null);
  const [editPlan, setEditPlan]       = useState("");
  const [saving, setSaving]           = useState(false);

  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search)     params.set("search", search);
    if (planFilter) params.set("plan", planFilter);
    const res = await fetch(`${API}/admin/merchants?${params}`, { headers: { "x-admin-token": token || "" } });
    const data = await res.json();
    setMerchants(data.merchants || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, search, planFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem("admin_token");
    await fetch(`${API}/admin/merchants/${deleteId}`, { method: "DELETE", headers: { "x-admin-token": token || "" } });
    setDeleteId(null);
    load();
  };

  const handlePlanSave = async () => {
    if (!editMerchant) return;
    setSaving(true);
    const token = localStorage.getItem("admin_token");
    await fetch(`${API}/admin/merchants/${editMerchant.id}/plan`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-token": token || "" },
      body: JSON.stringify({ plan: editPlan }),
    });
    setSaving(false);
    setEditMerchant(null);
    load();
  };

  const totalPages = Math.ceil(total / LIMIT);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  const planBadge = (plan: string): React.CSSProperties => ({
    display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
    background: plan === "pro" ? "rgba(184,135,58,0.18)" : plan === "business" ? "rgba(11,15,14,0.08)" : "#F0EDE8",
    color: plan === "pro" ? GOLD : plan === "business" ? INK : GRAY,
  });

  const thStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px", textAlign: "left" };
  const tdStyle: React.CSSProperties = { padding: "14px 16px", fontSize: 13, color: INK, verticalAlign: "middle" };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: INK, letterSpacing: "-0.5px" }}>Comptes commerçants</h1>
        <p style={{ fontSize: 14, color: GRAY, marginTop: 4 }}>{total} compte{total > 1 ? "s" : ""} au total.</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={15} color={GRAY} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par email…"
            style={{ width: "100%", padding: "10px 14px 10px 38px", border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 13, color: INK, background: CARD, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); setPage(1); }}
          style={{ padding: "10px 16px", border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 13, color: INK, background: CARD, cursor: "pointer" }}>
          <option value="">Tous les plans</option>
          {PLANS.map(p => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: CARD2 }}>
              <th style={thStyle}>Commerce</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Plan</th>
              <th style={thStyle}>Clients</th>
              <th style={thStyle}>Transactions</th>
              <th style={thStyle}>Inscrit le</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: GRAY, padding: 40 }}>Chargement…</td></tr>
            ) : merchants.length === 0 ? (
              <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: GRAY, padding: 40 }}>Aucun résultat.</td></tr>
            ) : merchants.map((m, i) => (
              <tr key={m.id} style={{ borderTop: i === 0 ? "none" : `1px solid ${BORD}` }}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{m.business_name || "—"}</td>
                <td style={{ ...tdStyle, color: GRAY }}>{m.email}</td>
                <td style={tdStyle}><span style={planBadge(m.plan)}>{PLAN_LABELS[m.plan] || m.plan}</span></td>
                <td style={tdStyle}>{m.customer_count.toLocaleString("fr-FR")}</td>
                <td style={tdStyle}>{m.transaction_count.toLocaleString("fr-FR")}</td>
                <td style={{ ...tdStyle, color: GRAY }}>{fmtDate(m.created_at)}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button onClick={() => { setEditMerchant(m); setEditPlan(m.plan); }}
                      style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${BORD}`, background: CARD, color: INK, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <Edit2 size={13} /> Plan
                    </button>
                    <button onClick={() => setDeleteId(m.id)}
                      style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #FED7D7", background: "#FFF5F5", color: "#E53E3E", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${BORD}`, background: CARD, color: page === 1 ? GRAY : INK, cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <ChevronLeft size={15} /> Précédent
          </button>
          <span style={{ fontSize: 13, color: GRAY }}>Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${BORD}`, background: CARD, color: page === totalPages ? GRAY : INK, cursor: page === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            Suivant <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: CARD, borderRadius: 20, padding: 32, maxWidth: 400, width: "90%", textAlign: "center" }}>
            <AlertTriangle size={40} color="#E53E3E" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 8 }}>Supprimer ce compte ?</h3>
            <p style={{ fontSize: 13, color: GRAY, marginBottom: 24 }}>Cette action est irréversible. Toutes les données du commerçant seront supprimées.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "12px", borderRadius: 999, border: `1px solid ${BORD}`, background: CARD, color: INK, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Annuler</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: "12px", borderRadius: 999, border: "none", background: "#E53E3E", color: "#FFFFFF", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit plan modal */}
      {editMerchant && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: CARD, borderRadius: 20, padding: 32, maxWidth: 380, width: "90%" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 4 }}>Modifier le plan</h3>
            <p style={{ fontSize: 13, color: GRAY, marginBottom: 20 }}>{editMerchant.email}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {PLANS.map(p => (
                <button key={p} onClick={() => setEditPlan(p)} style={{
                  padding: "12px 16px", borderRadius: 10, border: `2px solid ${editPlan === p ? GOLD : BORD}`,
                  background: editPlan === p ? "rgba(184,135,58,0.10)" : CARD, color: INK, fontWeight: editPlan === p ? 700 : 500,
                  fontSize: 14, cursor: "pointer", textAlign: "left",
                }}>
                  {PLAN_LABELS[p]}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setEditMerchant(null)} style={{ flex: 1, padding: "12px", borderRadius: 999, border: `1px solid ${BORD}`, background: CARD, color: INK, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Annuler</button>
              <button onClick={handlePlanSave} disabled={saving} style={{ flex: 1, padding: "12px", borderRadius: 999, border: "none", background: INK, color: "#FFFFFF", fontWeight: 600, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Sauvegarde…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
