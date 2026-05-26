"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search } from "lucide-react";

const API   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const INK   = "#0B0F0E";
const GOLD  = "#B8873A";
const GRAY  = "#6B6B6B";
const BORD  = "#E0DDD6";
const CARD  = "#FFFFFF";
const CARD2 = "#F5F3EE";

interface LogEntry {
  id: string;
  created_at: string;
  type: string;
  route: string | null;
  method: string | null;
  status_code: number | null;
  duration_ms: number | null;
  ip: string | null;
  message: string | null;
}

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  AUTH:   { bg: "rgba(59,130,246,0.15)",  color: "#3B82F6" },
  API:    { bg: "rgba(107,107,107,0.12)", color: "#6B6B6B" },
  STRIPE: { bg: "rgba(184,135,58,0.18)",  color: "#B8873A" },
  ERREUR: { bg: "rgba(239,68,68,0.15)",   color: "#EF4444" },
};

const statusStyle = (code: number | null): React.CSSProperties => ({
  display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700,
  background: !code ? "#F0EDE8" : code < 300 ? "rgba(34,197,94,0.15)" : code < 500 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
  color: !code ? GRAY : code < 300 ? "#15803D" : code < 500 ? "#92400E" : "#EF4444",
});

const TYPES = ["Tous", "AUTH", "API", "STRIPE", "ERREUR"];

async function adminFetch<T>(path: string): Promise<T> {
  const token = localStorage.getItem("admin_token") || "";
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", "x-admin-token": token },
  });
  if (res.status === 401) { localStorage.removeItem("admin_token"); window.location.href = "/admin/login"; throw new Error("401"); }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function AdminLogsPage() {
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [search, setSearch]         = useState("");
  const [logs, setLogs]             = useState<LogEntry[]>([]);
  const [total, setTotal]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (type: string, q: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (type !== "Tous") params.set("type", type);
      if (q) params.set("search", q);
      const data = await adminFetch<{ logs: LogEntry[]; total: number }>(`/admin/logs?${params}`);
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(typeFilter, search); }, [typeFilter]); // eslint-disable-line

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(typeFilter, search), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]); // eslint-disable-line

  const thStyle: React.CSSProperties = { padding: "10px 14px", background: CARD2, fontSize: 11, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: `1px solid ${BORD}`, whiteSpace: "nowrap" };
  const tdStyle: React.CSSProperties = { padding: "12px 14px", fontSize: 12, color: INK, borderBottom: `1px solid ${BORD}`, verticalAlign: "middle" };

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

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
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: 28, height: 28, border: `3px solid ${BORD}`, borderTopColor: GOLD, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Timestamp", "Type", "Route", "Status", "Durée", "IP", "Message"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: "center", color: GRAY, padding: 40 }}>Aucun log trouvé.</td></tr>
              ) : logs.map(log => {
                const tc = TYPE_COLORS[log.type] || { bg: "#F0EDE8", color: GRAY };
                return (
                  <tr key={log.id}>
                    <td style={{ ...tdStyle, color: GRAY, fontFamily: "monospace", fontSize: 11, whiteSpace: "nowrap" }}>
                      {log.created_at ? new Date(log.created_at).toLocaleString("fr-FR") : "—"}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: tc.bg, color: tc.color }}>
                        {log.type}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 11, color: INK, whiteSpace: "nowrap" }}>
                      {log.method ? `${log.method} ` : ""}{log.route || "—"}
                    </td>
                    <td style={tdStyle}><span style={statusStyle(log.status_code)}>{log.status_code ?? "—"}</span></td>
                    <td style={{ ...tdStyle, color: GRAY, whiteSpace: "nowrap" }}>
                      {log.duration_ms != null ? `${log.duration_ms}ms` : "—"}
                    </td>
                    <td style={{ ...tdStyle, color: GRAY, fontFamily: "monospace", fontSize: 11 }}>{log.ip || "—"}</td>
                    <td style={{ ...tdStyle, color: GRAY, maxWidth: 300 }}>{log.message || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${BORD}`, fontSize: 12, color: GRAY, background: CARD2 }}>
          {total} requête{total > 1 ? "s" : ""} loguée{total > 1 ? "s" : ""}
        </div>
      </div>
    </>
  );
}
