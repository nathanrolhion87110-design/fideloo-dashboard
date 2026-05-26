"use client";

import { useState, useEffect, useCallback } from "react";

const API  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";
const CARD = "#FFFFFF";

interface ApiEvent {
  id: string;
  type: string;
  merchant_id: string | null;
  metadata: Record<string, string>;
  created_at: string;
  merchants?: { business_name?: string; email?: string } | null;
}

interface EventStats {
  inscription: number;
  upgrade: number;
  downgrade: number;
  trial_expired: number;
  suppression: number;
  contact: number;
}

const TYPE_META: Record<string, { color: string; bg: string; label: string }> = {
  inscription:   { color: "#15803D", bg: "#DCFCE7", label: "Inscription" },
  upgrade:       { color: "#1D4ED8", bg: "#DBEAFE", label: "Upgrade"      },
  downgrade:     { color: "#92400E", bg: "#FEF3C7", label: "Downgrade"   },
  trial_expired: { color: "#92400E", bg: "#FEF3C7", label: "Essai expiré" },
  suppression:   { color: "#EF4444", bg: "#FEE2E2", label: "Suppression"  },
  contact:       { color: "#6B6B6B", bg: "#F5F3EE", label: "Contact"      },
};

function eventText(e: ApiEvent): string {
  const name = e.merchants?.business_name || e.metadata?.email || e.metadata?.name || "Un commerçant";
  switch (e.type) {
    case "inscription":   return `${name} a rejoint Fideloo`;
    case "upgrade":       return `${name} passé au plan ${e.metadata?.new_plan || "Pro"}`;
    case "downgrade":     return `${name} rétrogradé en ${e.metadata?.new_plan || "Standard"}`;
    case "trial_expired": return `${name} — essai terminé`;
    case "suppression":   return `${e.metadata?.email || name} a été supprimé`;
    case "contact":       return `Message de contact — ${e.metadata?.email || ""}`;
    default:              return `Événement ${e.type}`;
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hier";
  return `il y a ${days}j`;
}

async function adminFetch<T>(path: string): Promise<T> {
  const token = localStorage.getItem("admin_token") || "";
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", "x-admin-token": token },
  });
  if (res.status === 401) { localStorage.removeItem("admin_token"); window.location.href = "/admin/login"; throw new Error("401"); }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function AdminActivitePage() {
  const [events, setEvents]   = useState<ApiEvent[]>([]);
  const [stats, setStats]     = useState<Partial<EventStats>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [eventsData, statsData] = await Promise.all([
        adminFetch<{ events: ApiEvent[] }>("/admin/events?limit=20"),
        adminFetch<EventStats>("/admin/events/stats"),
      ]);
      setEvents(eventsData.events || []);
      setStats(statsData || {});
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const counters = [
    { label: "Inscriptions",   count: stats.inscription  || 0, color: "#15803D", bg: "#DCFCE7" },
    { label: "Upgrades",       count: stats.upgrade      || 0, color: "#1D4ED8", bg: "#DBEAFE" },
    { label: "Essais expirés", count: (stats.trial_expired || 0) + (stats.downgrade || 0), color: "#92400E", bg: "#FEF3C7" },
    { label: "Suppressions",   count: stats.suppression  || 0, color: "#EF4444", bg: "#FEE2E2" },
  ];

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", margin: 0 }}>
          Activité <em style={{ fontStyle: "italic", fontWeight: 400 }}>temps réel.</em>
        </h1>
        <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Les 20 derniers événements sur la plateforme.</p>
      </div>

      {/* Résumé */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {counters.map(({ label, count, color, bg }) => (
          <div key={label} style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color, fontSize: 16, fontWeight: 800 }}>{count}</span>
            </div>
            <div style={{ fontSize: 12, color: GRAY, fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <div style={{ width: 28, height: 28, border: `3px solid ${BORD}`, borderTopColor: GOLD, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : (
        <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>
          {events.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center", color: GRAY, fontSize: 13 }}>
              Aucun événement pour l'instant.
            </div>
          ) : events.map((item, i) => {
            const meta = TYPE_META[item.type] || { color: GRAY, bg: "#F5F3EE", label: item.type };
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < events.length - 1 ? `1px solid ${BORD}` : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: INK, fontWeight: 500 }}>{eventText(item)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: meta.bg, color: meta.color }}>
                    {meta.label}
                  </span>
                  <span style={{ fontSize: 12, color: GRAY, whiteSpace: "nowrap" }}>{timeAgo(item.created_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
