"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const INK   = "#0B0F0E";
const GOLD  = "#B8873A";
const GRAY  = "#6B6B6B";
const BORD  = "#E0DDD6";
const CARD  = "#FFFFFF";
const CARD2 = "#F5F3EE";

interface LogEntry {
  id: number;
  timestamp: string;
  type: string;
  route: string;
  status: number;
  duration: string;
  ip: string;
  message: string;
}

const MOCK_LOGS: LogEntry[] = [
  { id:  1, timestamp: "2026-05-15 16:42:11", type: "AUTH",   route: "POST /auth/login",                   status: 200, duration: "42ms",  ip: "82.65.12.34",   message: "Login réussi — merchant@cafe.fr"          },
  { id:  2, timestamp: "2026-05-15 16:38:04", type: "API",    route: "GET /transactions/customer/1234",    status: 200, duration: "18ms",  ip: "176.31.5.99",   message: "200 transactions retournées"              },
  { id:  3, timestamp: "2026-05-15 16:35:22", type: "STRIPE", route: "POST /stripe/checkout",              status: 200, duration: "654ms", ip: "92.14.8.55",    message: "Session checkout créée"                   },
  { id:  4, timestamp: "2026-05-15 16:30:48", type: "ERREUR", route: "POST /customers/points",             status: 500, duration: "12ms",  ip: "31.39.22.11",   message: "RLS violation — customer non autorisé"   },
  { id:  5, timestamp: "2026-05-15 16:28:33", type: "AUTH",   route: "POST /auth/register",                status: 201, duration: "88ms",  ip: "109.14.5.200",  message: "Nouveau compte créé — pizza@roma.fr"      },
  { id:  6, timestamp: "2026-05-15 16:22:17", type: "API",    route: "GET /stripe/status/merchant-abc",   status: 200, duration: "23ms",  ip: "82.65.12.34",   message: "Plan Pro actif, expire 2026-06-15"       },
  { id:  7, timestamp: "2026-05-15 16:18:01", type: "STRIPE", route: "POST /stripe/webhook",              status: 200, duration: "122ms", ip: "54.187.174.169", message: "checkout.session.completed — upgrade Pro" },
  { id:  8, timestamp: "2026-05-15 16:12:44", type: "API",    route: "GET /merchants/profile",            status: 401, duration: "5ms",   ip: "185.93.4.7",    message: "Token manquant ou invalide"               },
  { id:  9, timestamp: "2026-05-15 16:08:29", type: "AUTH",   route: "POST /auth/login",                   status: 401, duration: "310ms", ip: "45.33.32.156",  message: "Mot de passe incorrect — 3e tentative"   },
  { id: 10, timestamp: "2026-05-15 16:02:13", type: "API",    route: "PUT /merchants/profile",            status: 200, duration: "34ms",  ip: "176.31.5.99",   message: "Profil mis à jour — adresse modifiée"    },
  { id: 11, timestamp: "2026-05-15 15:58:55", type: "ERREUR", route: "POST /stripe/portal",              status: 400, duration: "88ms",  ip: "82.65.12.34",   message: "Stripe customer_id manquant"              },
  { id: 12, timestamp: "2026-05-15 15:52:34", type: "API",    route: "GET /customers?merchantId=xyz",    status: 200, duration: "27ms",  ip: "31.39.22.11",   message: "47 clients retournés"                     },
  { id: 13, timestamp: "2026-05-15 15:44:17", type: "AUTH",   route: "POST /auth/google",                status: 200, duration: "201ms", ip: "92.14.8.55",    message: "Google OAuth réussi"                      },
  { id: 14, timestamp: "2026-05-15 15:38:02", type: "API",    route: "POST /customers/points",           status: 200, duration: "21ms",  ip: "109.14.5.200",  message: "+15 points ajoutés — client #892"         },
  { id: 15, timestamp: "2026-05-15 15:30:44", type: "STRIPE", route: "POST /stripe/webhook",            status: 200, duration: "98ms",  ip: "54.187.174.169", message: "invoice.payment_succeeded"                },
  { id: 16, timestamp: "2026-05-15 15:22:19", type: "ERREUR", route: "GET /admin/stats",               status: 500, duration: "3ms",   ip: "185.93.4.7",    message: "x-admin-token invalide"                   },
  { id: 17, timestamp: "2026-05-15 15:18:07", type: "API",    route: "GET /passes/apple/:id",          status: 200, duration: "156ms", ip: "17.58.102.4",   message: "Apple Wallet pass servi"                  },
  { id: 18, timestamp: "2026-05-15 15:10:34", type: "AUTH",   route: "POST /auth/login",               status: 200, duration: "65ms",  ip: "82.65.12.34",   message: "Login réussi — admin session"             },
  { id: 19, timestamp: "2026-05-15 15:02:21", type: "API",    route: "DELETE /customers/123",          status: 200, duration: "14ms",  ip: "176.31.5.99",   message: "Client supprimé par merchant"             },
  { id: 20, timestamp: "2026-05-15 14:55:48", type: "STRIPE", route: "POST /stripe/checkout",          status: 200, duration: "701ms", ip: "92.14.8.55",    message: "Checkout Pro initié — merchant-456"       },
];

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  AUTH:   { bg: "rgba(59,130,246,0.15)",  color: "#3B82F6" },
  API:    { bg: "rgba(107,107,107,0.12)", color: "#6B6B6B" },
  STRIPE: { bg: "rgba(184,135,58,0.18)",  color: "#B8873A" },
  ERREUR: { bg: "rgba(239,68,68,0.15)",   color: "#EF4444" },
};

const statusStyle = (code: number): React.CSSProperties => ({
  display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
  background: code < 300 ? "rgba(34,197,94,0.15)" : code < 500 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
  color: code < 300 ? "#15803D" : code < 500 ? "#92400E" : "#EF4444",
});

const TYPES = ["Tous", "AUTH", "API", "STRIPE", "ERREUR"];

export default function AdminLogsPage() {
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [search, setSearch]         = useState("");

  const filtered = MOCK_LOGS.filter(l => {
    const matchType = typeFilter === "Tous" || l.type === typeFilter;
    const matchSearch = !search || l.route.toLowerCase().includes(search.toLowerCase()) || l.message.toLowerCase().includes(search.toLowerCase()) || l.ip.includes(search);
    return matchType && matchSearch;
  });

  const thStyle: React.CSSProperties = { padding: "10px 14px", background: CARD2, fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: `1px solid ${BORD}`, whiteSpace: "nowrap" };
  const tdStyle: React.CSSProperties = { padding: "12px 14px", fontSize: 12, color: INK, borderBottom: `1px solid ${BORD}`, verticalAlign: "middle" };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", margin: 0 }}>
          Logs <em style={{ fontStyle: "italic", fontWeight: 400 }}>système.</em>
        </h1>
        <p style={{ fontSize: 13, color: GRAY, marginTop: 4 }}>Journal des requêtes et événements backend.</p>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} color={GRAY} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher route, message, IP…"
            style={{ padding: "10px 14px 10px 36px", border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 13, color: INK, background: CARD, outline: "none", width: 280 }} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {TYPES.map(t => {
            const active = typeFilter === t;
            const style = t !== "Tous" ? TYPE_COLORS[t] : null;
            return (
              <button key={t} onClick={() => setTypeFilter(t)} style={{
                padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: active ? 700 : 500,
                background: active ? (style?.bg || INK) : CARD,
                color: active ? (style?.color || "#FFFFFF") : GRAY,
                border: `1px solid ${active ? (style?.color || INK) : BORD}`, cursor: "pointer",
              }}>{t}</button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Timestamp", "Type", "Route", "Status", "Durée", "IP", "Message"].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: GRAY, padding: 40 }}>Aucun log trouvé.</td></tr>
            ) : filtered.map(log => {
              const tc = TYPE_COLORS[log.type] || { bg: "#F0EDE8", color: GRAY };
              return (
                <tr key={log.id}>
                  <td style={{ ...tdStyle, color: GRAY, fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap" }}>{log.timestamp}</td>
                  <td style={tdStyle}>
                    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: tc.bg, color: tc.color }}>
                      {log.type}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 11, color: INK, whiteSpace: "nowrap" }}>{log.route}</td>
                  <td style={tdStyle}><span style={statusStyle(log.status)}>{log.status}</span></td>
                  <td style={{ ...tdStyle, color: GRAY, whiteSpace: "nowrap" }}>{log.duration}</td>
                  <td style={{ ...tdStyle, color: GRAY, fontFamily: "monospace", fontSize: 11 }}>{log.ip}</td>
                  <td style={{ ...tdStyle, color: GRAY, maxWidth: 300 }}>{log.message}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORD}`, fontSize: 12, color: GRAY, background: CARD2 }}>
          Affichage de {filtered.length} enregistrement{filtered.length > 1 ? "s" : ""} · Données simulées
        </div>
      </div>
    </>
  );
}
