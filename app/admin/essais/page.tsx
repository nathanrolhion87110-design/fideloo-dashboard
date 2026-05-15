"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";

const INK   = "#0B0F0E";
const GOLD  = "#B8873A";
const GRAY  = "#6B6B6B";
const BORD  = "#E0DDD6";
const CARD  = "#FFFFFF";
const API   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Merchant {
  id: string;
  email: string;
  business_name: string;
  plan: string;
  plan_expires_at: string | null;
  created_at: string;
  customer_count: number;
}

const AVATAR_COLORS = ["#B8873A", "#4B9CD3", "#6B8E23", "#9370DB", "#20B2AA"];
const avatarColor = (s: string) => AVATAR_COLORS[(s?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials    = (s: string) => (s || "??").slice(0, 2).toUpperCase();

function daysLeft(dateStr: string | null): number {
  if (!dateStr) return 999;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

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

interface Column {
  key: string;
  label: string;
  sub: string;
  bg: string;
  border: string;
  tagColor: string;
  tagBg: string;
  filter: (m: Merchant) => boolean;
}

const COLUMNS: Column[] = [
  {
    key: "active",
    label: "Actifs > 7j",
    sub: "Essais bien engagés",
    bg: "#F0FDF4", border: "#86EFAC", tagColor: "#15803D", tagBg: "#DCFCE7",
    filter: m => m.plan === "pro" && daysLeft(m.plan_expires_at) > 7,
  },
  {
    key: "soon",
    label: "Expirent dans 7j",
    sub: "À relancer en priorité",
    bg: "#FEF9C3", border: "#FDE047", tagColor: "#92400E", tagBg: "#FEF3C7",
    filter: m => m.plan === "pro" && daysLeft(m.plan_expires_at) >= 0 && daysLeft(m.plan_expires_at) <= 7,
  },
  {
    key: "expired",
    label: "Expirés",
    sub: "Non convertis",
    bg: "#FEF2F2", border: "#FCA5A5", tagColor: "#EF4444", tagBg: "#FEE2E2",
    filter: m => m.plan === "pro" && daysLeft(m.plan_expires_at) < 0,
  },
];

export default function AdminEssaisPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading]     = useState(true);
  const [extending, setExtending] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<{ merchants: Merchant[] }>("/admin/merchants?plan=pro&limit=100");
      setMerchants(data.merchants || []);
    } catch { /* handled */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleExtend = async (id: string) => {
    setExtending(id);
    const newExpires = new Date(Date.now() + 7 * 86400000).toISOString();
    await adminFetch(`/admin/merchants/${id}/plan`, { method: "PUT", body: JSON.stringify({ plan: "pro" }) });
    setExtending(null);
    load();
  };

  const active  = merchants.filter(COLUMNS[0].filter);
  const soon    = merchants.filter(COLUMNS[1].filter);
  const expired = merchants.filter(COLUMNS[2].filter);
  const counts  = [active.length, soon.length, expired.length];
  const groups  = [active, soon, expired];

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", margin: 0 }}>
          Essais Pro <em style={{ fontStyle: "italic", fontWeight: 400 }}>en cours.</em>
        </h1>
        <p style={{ fontSize: 13, color: GRAY, marginTop: 6 }}>
          {active.length} essai{active.length > 1 ? "s" : ""} actif{active.length > 1 ? "s" : ""} &nbsp;·&nbsp;
          {soon.length} expir{soon.length > 1 ? "ent" : "e"} dans 7j &nbsp;·&nbsp;
          {expired.length} expiré{expired.length > 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
          <div style={{ width: 32, height: 32, border: `3px solid ${BORD}`, borderTopColor: GOLD, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {COLUMNS.map((col, ci) => (
            <div key={col.key}>
              <div style={{ background: col.bg, border: `1px solid ${col.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: INK }}>{col.label}</div>
                <div style={{ fontSize: 12, color: GRAY }}>{col.sub} · {counts[ci]} compte{counts[ci] > 1 ? "s" : ""}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {groups[ci].length === 0 ? (
                  <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 12, padding: 20, textAlign: "center", color: GRAY, fontSize: 13 }}>Aucun</div>
                ) : groups[ci].map(m => {
                  const dl = daysLeft(m.plan_expires_at);
                  return (
                    <div key={m.id} style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 12, padding: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarColor(m.business_name || m.email), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>
                          {initials(m.business_name || m.email)}
                        </div>
                        <div style={{ flex: 1, overflow: "hidden" }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.business_name || "—"}</div>
                          <div style={{ fontSize: 11, color: GRAY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.email}</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Clock size={12} color={col.tagColor} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: col.tagColor, background: col.tagBg, padding: "2px 8px", borderRadius: 999 }}>
                            {col.key === "expired" ? "Expiré" : `${dl}j restant${dl > 1 ? "s" : ""}`}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: GRAY }}>{m.customer_count} clients</span>
                      </div>

                      {col.key === "soon" && (
                        <button style={{ marginTop: 10, width: "100%", padding: "8px", borderRadius: 8, border: `1px solid ${BORD}`, background: "#FFFBEB", color: "#92400E", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          Envoyer un rappel
                        </button>
                      )}

                      {col.key === "expired" && (
                        <button onClick={() => handleExtend(m.id)} disabled={extending === m.id}
                          style={{ marginTop: 10, width: "100%", padding: "8px", borderRadius: 8, border: "none", background: INK, color: "#FFFFFF", fontSize: 12, fontWeight: 600, cursor: extending === m.id ? "not-allowed" : "pointer", opacity: extending === m.id ? 0.7 : 1 }}>
                          {extending === m.id ? "…" : "Offrir 7j d'extension"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
