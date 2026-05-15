"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, X, AlertTriangle, Download } from "lucide-react";

const INK   = "#0B0F0E";
const GOLD  = "#B8873A";
const GRAY  = "#6B6B6B";
const BORD  = "#E0DDD6";
const CARD  = "#FFFFFF";
const CARD2 = "#F5F3EE";
const DANGER = "#EF4444";
const API   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Merchant {
  id: string;
  email: string;
  business_name: string;
  plan: string;
  plan_expires_at: string | null;
  created_at: string;
  stripe_customer_id: string | null;
  customer_count: number;
  transaction_count: number;
}

const PLANS = ["free", "pro", "business"];
const PLAN_LABELS: Record<string, string> = { free: "Free", pro: "Pro", business: "Business" };
const PLAN_MRR: Record<string, number>    = { free: 0, pro: 80, business: 150 };
const PLAN_LIMIT: Record<string, number>  = { free: 1500, pro: 1500, business: 5000 };

const AVATAR_COLORS = ["#B8873A", "#4B9CD3", "#6B8E23", "#9370DB", "#20B2AA", "#CD5C5C"];
const avatarColor = (s: string) => AVATAR_COLORS[(s?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials    = (s: string) => (s || "??").slice(0, 2).toUpperCase();
const fmtDate     = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
const timeAgo     = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "il y a 1j";
  return `il y a ${days}j`;
};

const planBadgeStyle = (plan: string): React.CSSProperties => ({
  display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
  background: plan === "pro" ? "rgba(184,135,58,0.18)" : plan === "business" ? "rgba(11,15,14,0.10)" : "#F0EDE8",
  color: plan === "pro" ? GOLD : plan === "business" ? INK : GRAY,
});

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("admin_token") || "";
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", "x-admin-token": token, ...options?.headers },
  });
  if (res.status === 401) { localStorage.removeItem("admin_token"); window.location.href = "/admin/login"; throw new Error("401"); }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const FILTER_PILLS = ["Tous", "Free", "Pro", "Business"];

export default function AdminComptesPage() {
  const [merchants, setMerchants]     = useState<Merchant[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [limit, setLimit]             = useState(25);
  const [search, setSearch]           = useState("");
  const [planFilter, setPlanFilter]   = useState("");
  const [loading, setLoading]         = useState(true);

  const [detailMerchant, setDetailMerchant] = useState<Merchant | null>(null);
  const [editMerchant, setEditMerchant]     = useState<Merchant | null>(null);
  const [editPlan, setEditPlan]             = useState("");
  const [deleteId, setDeleteId]             = useState<string | null>(null);
  const [saving, setSaving]                 = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search)     params.set("search", search);
      if (planFilter) params.set("plan", planFilter);
      const data = await adminFetch<{ merchants: Merchant[]; total: number }>(`/admin/merchants?${params}`);
      setMerchants(data.merchants || []);
      setTotal(data.total || 0);
    } catch { /* handled by adminFetch */ }
    finally { setLoading(false); }
  }, [page, limit, search, planFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteId) return;
    await adminFetch(`/admin/merchants/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  };

  const handlePlanSave = async () => {
    if (!editMerchant) return;
    setSaving(true);
    await adminFetch(`/admin/merchants/${editMerchant.id}/plan`, { method: "PUT", body: JSON.stringify({ plan: editPlan }) });
    setSaving(false);
    setEditMerchant(null);
    load();
  };

  const totalPages = Math.ceil(total / limit);

  const thStyle: React.CSSProperties = { padding: "12px 16px", background: CARD2, fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: `1px solid ${BORD}` };
  const tdStyle: React.CSSProperties = { padding: "14px 16px", fontSize: 13, color: INK, verticalAlign: "middle", borderBottom: `1px solid ${BORD}` };

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", margin: 0 }}>
            Tous les comptes <em style={{ fontStyle: "italic", fontWeight: 400 }}>commerçants.</em>
          </h1>
          <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>{total.toLocaleString("fr-FR")} compte{total > 1 ? "s" : ""} au total</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: CARD, border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 13, color: GOLD, fontWeight: 600, cursor: "pointer" }}>
          <Download size={14} /> Exporter CSV
        </button>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 240 }}>
          <Search size={14} color={GRAY} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par nom, email…"
            style={{ width: "100%", padding: "10px 14px 10px 38px", border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 13, color: INK, background: CARD, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {FILTER_PILLS.map(pill => {
            const val = pill === "Tous" ? "" : pill.toLowerCase();
            const active = planFilter === val;
            return (
              <button key={pill} onClick={() => { setPlanFilter(val); setPage(1); }} style={{
                padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer",
                background: active ? INK : CARD, color: active ? "#FFFFFF" : GRAY, border: `1px solid ${active ? INK : BORD}`,
              }}>{pill}</button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <div style={{ width: 32, height: 32, border: `3px solid ${BORD}`, borderTopColor: GOLD, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Commerçant</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Plan</th>
                <th style={thStyle}>Clients</th>
                <th style={thStyle}>MRR</th>
                <th style={thStyle}>Inscription</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchants.length === 0 ? (
                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: GRAY, padding: 48 }}>Aucun résultat.</td></tr>
              ) : merchants.map(m => {
                const limit_plan = PLAN_LIMIT[m.plan] || 1500;
                const progress   = Math.min(100, Math.round((m.customer_count / limit_plan) * 100));
                return (
                  <tr key={m.id} style={{ transition: "background 0.1s" }}>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarColor(m.business_name || m.email), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>
                          {initials(m.business_name || m.email)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: INK }}>{m.business_name || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: GRAY }}>{m.email}</td>
                    <td style={tdStyle}><span style={planBadgeStyle(m.plan)}>{PLAN_LABELS[m.plan] || m.plan}</span></td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: 12, color: GRAY, marginBottom: 4 }}>{m.customer_count.toLocaleString("fr-FR")} / {limit_plan.toLocaleString("fr-FR")}</div>
                      <div style={{ height: 4, background: "#F0EDE8", borderRadius: 999, width: 80 }}>
                        <div style={{ height: "100%", width: `${progress}%`, background: progress > 80 ? DANGER : GOLD, borderRadius: 999 }} />
                      </div>
                    </td>
                    <td style={{ ...tdStyle, fontWeight: 600, color: PLAN_MRR[m.plan] > 0 ? INK : GRAY }}>
                      {PLAN_MRR[m.plan] > 0 ? `${PLAN_MRR[m.plan]} €` : "—"}
                    </td>
                    <td style={{ ...tdStyle, color: GRAY }} title={fmtDate(m.created_at)}>{timeAgo(m.created_at)}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        {[
                          { icon: Eye,    fn: () => setDetailMerchant(m),                     color: GRAY  },
                          { icon: Edit2,  fn: () => { setEditMerchant(m); setEditPlan(m.plan); }, color: GRAY  },
                          { icon: Trash2, fn: () => setDeleteId(m.id),                        color: DANGER },
                        ].map(({ icon: Icon, fn, color }) => (
                          <button key={color + Icon.name} onClick={fn} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORD}`, background: CARD, color, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <Icon size={14} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: GRAY }}>
          <span>Lignes par page :</span>
          {[10, 25, 50].map(n => (
            <button key={n} onClick={() => { setLimit(n); setPage(1); }} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${BORD}`, background: limit === n ? INK : CARD, color: limit === n ? "#FFFFFF" : GRAY, fontSize: 12, cursor: "pointer" }}>{n}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: GRAY }}>
          <span>{Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} sur {total}</span>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORD}`, background: CARD, color: page === 1 ? BORD : INK, cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={15} />
          </button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORD}`, background: CARD, color: page >= totalPages ? BORD : INK, cursor: page >= totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Modal détail (slide-in) */}
      {detailMerchant && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", justifyContent: "flex-end" }} onClick={() => setDetailMerchant(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: 480, height: "100%", background: CARD, overflow: "auto", animation: "slideIn 0.22s ease", display: "flex", flexDirection: "column" }}>
            {/* Header modal */}
            <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${BORD}`, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: avatarColor(detailMerchant.business_name || detailMerchant.email), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>
                {initials(detailMerchant.business_name || detailMerchant.email)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: INK }}>{detailMerchant.business_name || "—"}</div>
                <div style={{ fontSize: 13, color: GRAY }}>{detailMerchant.email}</div>
                <span style={{ ...planBadgeStyle(detailMerchant.plan), marginTop: 4 }}>{PLAN_LABELS[detailMerchant.plan]}</span>
              </div>
              <button onClick={() => setDetailMerchant(null)} style={{ background: "none", border: "none", cursor: "pointer", color: GRAY }}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Informations */}
              <section>
                <div style={{ fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Informations</div>
                {[
                  ["Date d'inscription", fmtDate(detailMerchant.created_at)],
                  ["ID", detailMerchant.id],
                  ["Stripe customer", detailMerchant.stripe_customer_id || "—"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORD}` }}>
                    <span style={{ fontSize: 13, color: GRAY }}>{k}</span>
                    <span style={{ fontSize: 13, color: INK, fontWeight: 500, maxWidth: 240, textAlign: "right", wordBreak: "break-all" }}>{v}</span>
                  </div>
                ))}
              </section>

              {/* Abonnement */}
              <section>
                <div style={{ fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Abonnement</div>
                {[
                  ["Plan actuel", PLAN_LABELS[detailMerchant.plan]],
                  ["Expiration", detailMerchant.plan_expires_at ? fmtDate(detailMerchant.plan_expires_at) : "—"],
                  ["MRR", PLAN_MRR[detailMerchant.plan] > 0 ? `${PLAN_MRR[detailMerchant.plan]} €/mois` : "—"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORD}` }}>
                    <span style={{ fontSize: 13, color: GRAY }}>{k}</span>
                    <span style={{ fontSize: 13, color: INK, fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
                <button onClick={() => { setEditMerchant(detailMerchant); setEditPlan(detailMerchant.plan); setDetailMerchant(null); }}
                  style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, border: `1px solid ${BORD}`, background: CARD, color: INK, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Changer le plan
                </button>
              </section>

              {/* Statistiques */}
              <section>
                <div style={{ fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Statistiques</div>
                {[
                  ["Clients", detailMerchant.customer_count.toLocaleString("fr-FR")],
                  ["Transactions", detailMerchant.transaction_count.toLocaleString("fr-FR")],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${BORD}` }}>
                    <span style={{ fontSize: 13, color: GRAY }}>{k}</span>
                    <span style={{ fontSize: 13, color: INK, fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </section>
            </div>

            {/* Footer danger */}
            <div style={{ padding: "16px 24px", borderTop: `1px solid ${BORD}` }}>
              <button onClick={() => { setDeleteId(detailMerchant.id); setDetailMerchant(null); }}
                style={{ width: "100%", padding: "12px", borderRadius: 999, border: `1px solid #FCA5A5`, background: "#FEF2F2", color: DANGER, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Supprimer ce compte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal changement de plan */}
      {editMerchant && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: CARD, borderRadius: 20, padding: 32, maxWidth: 380, width: "90%" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 4 }}>Modifier le plan</h3>
            <p style={{ fontSize: 13, color: GRAY, marginBottom: 20 }}>{editMerchant.business_name || editMerchant.email}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {PLANS.map(p => (
                <button key={p} onClick={() => setEditPlan(p)} style={{
                  padding: "12px 16px", borderRadius: 10, border: `2px solid ${editPlan === p ? GOLD : BORD}`,
                  background: editPlan === p ? "rgba(184,135,58,0.10)" : CARD, color: INK,
                  fontWeight: editPlan === p ? 700 : 500, fontSize: 14, cursor: "pointer", textAlign: "left",
                }}>
                  {PLAN_LABELS[p]} {PLAN_MRR[p] > 0 ? `· ${PLAN_MRR[p]} €/mois` : "· Gratuit"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setEditMerchant(null)} style={{ flex: 1, padding: "12px", borderRadius: 999, border: `1px solid ${BORD}`, background: CARD, color: INK, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Annuler</button>
              <button onClick={handlePlanSave} disabled={saving} style={{ flex: 1, padding: "12px", borderRadius: 999, border: "none", background: INK, color: "#FFFFFF", fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal suppression */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: CARD, borderRadius: 20, padding: 32, maxWidth: 400, width: "90%", textAlign: "center" }}>
            <AlertTriangle size={40} color={DANGER} style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, color: INK, marginBottom: 8 }}>Supprimer ce compte ?</h3>
            <p style={{ fontSize: 13, color: GRAY, marginBottom: 24 }}>Action irréversible. Toutes les données seront supprimées.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "12px", borderRadius: 999, border: `1px solid ${BORD}`, background: CARD, color: INK, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Annuler</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: "12px", borderRadius: 999, border: "none", background: DANGER, color: "#FFFFFF", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
