"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart2, Users, QrCode, ScanLine, Check, ArrowRight,
  TrendingUp, Gift, ChevronRight, Search, X,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line, BarChart, Bar,
} from "recharts";

/* ── Design tokens (match existing site) ── */
const BG   = "#EDEBE4";
const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const WHITE = "#FFFFFF";
const GRAY  = "#6B6B6B";
const CARD  = "#F5F3EE";
const BORD  = "#E0DDD6";
const GS    = "rgba(184,135,58,0.10)";
const GB    = "rgba(184,135,58,0.25)";

/* ── Fake data ── */
const visitData = [
  { j: "1 avr", v: 14, p: 52 }, { j: "3 avr", v: 18, p: 71 }, { j: "5 avr", v: 11, p: 44 },
  { j: "7 avr", v: 22, p: 88 }, { j: "9 avr", v: 16, p: 63 }, { j: "11 avr", v: 28, p: 112 },
  { j: "13 avr", v: 24, p: 96 }, { j: "15 avr", v: 19, p: 76 }, { j: "17 avr", v: 31, p: 124 },
  { j: "19 avr", v: 27, p: 108 }, { j: "21 avr", v: 33, p: 132 }, { j: "23 avr", v: 29, p: 116 },
  { j: "25 avr", v: 38, p: 152 }, { j: "27 avr", v: 34, p: 136 }, { j: "29 avr", v: 42, p: 168 },
];

const retentionData = [
  { m: "Janv", r: 72 }, { m: "Févr", r: 78 }, { m: "Mars", r: 82 }, { m: "Avr", r: 87 },
  { m: "Mai", r: 83 }, { m: "Juin", r: 89 },
];

const rewardData = [
  { m: "Janv", n: 4 }, { m: "Févr", n: 6 }, { m: "Mars", n: 8 }, { m: "Avr", n: 12 },
  { m: "Mai", n: 10 }, { m: "Juin", n: 15 },
];

const fakeClients = [
  { id: 1, name: "Marie Laurent", email: "marie.l@email.fr", points: 8, max: 10, lastVisit: "Aujourd'hui", status: "proche" },
  { id: 2, name: "Karim Benali", email: "k.benali@email.fr", points: 5, max: 10, lastVisit: "Hier", status: "actif" },
  { id: 3, name: "Sophie Tremblay", email: "sophie.t@email.fr", points: 10, max: 10, lastVisit: "2 avr", status: "proche" },
  { id: 4, name: "Lucas Martin", email: "l.martin@email.fr", points: 3, max: 10, lastVisit: "30 mars", status: "actif" },
  { id: 5, name: "Emma Dubois", email: "e.dubois@email.fr", points: 7, max: 10, lastVisit: "29 mars", status: "proche" },
  { id: 6, name: "Thomas Petit", email: "t.petit@email.fr", points: 2, max: 10, lastVisit: "27 mars", status: "actif" },
  { id: 7, name: "Léa Bernard", email: "lea.b@email.fr", points: 9, max: 10, lastVisit: "26 mars", status: "proche" },
  { id: 8, name: "Antoine Moreau", email: "a.moreau@email.fr", points: 1, max: 10, lastVisit: "24 mars", status: "actif" },
  { id: 9, name: "Camille Roux", email: "c.roux@email.fr", points: 6, max: 10, lastVisit: "22 mars", status: "actif" },
  { id: 10, name: "Nicolas Simon", email: "n.simon@email.fr", points: 4, max: 10, lastVisit: "20 mars", status: "actif" },
];

/* ── Sub-components ── */

function DashboardTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="demo-kpi-grid">
        {[
          { label: "Clients fidèles", value: "248", icon: Users, delta: "+12 ce mois" },
          { label: "Points distribués", value: "1 840", icon: TrendingUp, delta: "+34% vs mois dernier" },
          { label: "Visites ce mois", value: "34", icon: BarChart2, delta: "+8 vs mars" },
        ].map(({ label, value, icon: Icon, delta }) => (
          <div key={label} style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>{label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={GOLD} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair, Georgia, serif)", marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 12, color: GOLD, fontFamily: "var(--font-sora, system-ui)" }}>{delta}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 20, fontFamily: "var(--font-sora, system-ui)" }}>
          Visites & points — 30 derniers jours
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={visitData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.25} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BORD} />
            <XAxis dataKey="j" tick={{ fontSize: 11, fill: GRAY }} />
            <YAxis tick={{ fontSize: 11, fill: GRAY }} />
            <Tooltip contentStyle={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="v" stroke={GOLD} fill="url(#gv)" strokeWidth={2} name="Visites" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Last 3 clients */}
      <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>Derniers clients</h3>
        {fakeClients.slice(0, 3).map((c) => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${BORD}` }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>{c.name.charAt(0)}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{c.name}</div>
              <div style={{ fontSize: 12, color: GRAY }}>{c.lastVisit}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{c.points} pts</div>
              <div style={{ fontSize: 11, color: GRAY }}>{c.points}/{c.max}</div>
            </div>
          </div>
        ))}
        {/* Decorative QR */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <QrCode size={60} color={GOLD} />
            <span style={{ fontSize: 11, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>Votre QR code d&apos;inscription</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScannerTab() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<typeof fakeClients[0] | null>(null);
  const [points, setPoints] = useState(0);
  const [success, setSuccess] = useState("");

  const handleSearch = (v: string) => {
    setQuery(v);
    setSuccess("");
    if (v.toLowerCase().includes("marie")) {
      setFound(fakeClients[0]);
      setPoints(fakeClients[0].points);
    } else {
      setFound(null);
    }
  };

  const addPoints = (n: number) => {
    setPoints(p => Math.min(p + n, 10));
    setSuccess(`+${n} point${n > 1 ? "s" : ""} ajouté${n > 1 ? "s" : ""} !`);
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 520, margin: "0 auto" }}>
      <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>
          Rechercher un client
        </h3>
        <div style={{ position: "relative" }}>
          <Search size={16} color={GRAY} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder='Tapez "Marie" pour tester...'
            value={query}
            onChange={e => handleSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 16px 12px 42px", background: CARD, border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 14, color: INK, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-sora, system-ui)" }}
          />
          {query && (
            <button onClick={() => { setQuery(""); setFound(null); }} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {found && (
        <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24, animation: "fadeIn 0.25s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: GOLD }}>{found.name.charAt(0)}</span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair, Georgia, serif)" }}>{found.name}</div>
              <div style={{ fontSize: 13, color: GRAY }}>{found.email}</div>
            </div>
          </div>

          {/* Points bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>Points fidélité</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>{points}/10</span>
            </div>
            <div style={{ height: 8, background: CARD, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(points / 10) * 100}%`, background: GOLD, borderRadius: 999, transition: "width 0.4s ease" }} />
            </div>
            {points === 10 && (
              <div style={{ marginTop: 10, padding: "8px 14px", background: GS, border: `1px solid ${GB}`, borderRadius: 8, fontSize: 13, color: GOLD, display: "flex", alignItems: "center", gap: 6 }}>
                <Gift size={14} /> Récompense disponible — 1 café offert !
              </div>
            )}
          </div>

          {/* Add points buttons */}
          <div style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: GRAY, marginBottom: 10, fontFamily: "var(--font-sora, system-ui)" }}>Ajouter des points :</p>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 5].map((n) => (
                <button key={n} onClick={() => addPoints(n)}
                  style={{ flex: 1, padding: "10px 0", background: GS, border: `1px solid ${GB}`, borderRadius: 10, fontSize: 14, fontWeight: 700, color: GOLD, cursor: "pointer", fontFamily: "var(--font-sora, system-ui)", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = GB)}
                  onMouseLeave={e => (e.currentTarget.style.background = GS)}>
                  +{n}
                </button>
              ))}
            </div>
          </div>

          {success && (
            <div style={{ padding: "10px 16px", background: GS, border: `1px solid ${GB}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: GOLD, textAlign: "center", animation: "fadeIn 0.2s ease" }}>
              <Check size={14} style={{ display: "inline", marginRight: 6 }} />{success}
            </div>
          )}
        </div>
      )}

      {!found && query.length > 0 && (
        <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24, textAlign: "center", color: GRAY, fontSize: 14 }}>
          Aucun client trouvé. Essayez &quot;Marie&quot;.
        </div>
      )}
    </div>
  );
}

type FilterType = "tous" | "actif" | "proche";

function ClientsTab() {
  const [filter, setFilter] = useState<FilterType>("tous");

  const filtered = fakeClients.filter((c) => {
    if (filter === "tous") return true;
    if (filter === "actif") return c.status === "actif";
    if (filter === "proche") return c.status === "proche";
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Filters */}
      <div style={{ display: "flex", gap: 8 }}>
        {(["tous", "actif", "proche"] as FilterType[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "var(--font-sora, system-ui)",
              background: filter === f ? INK : WHITE,
              color: filter === f ? WHITE : GRAY,
              border: `1px solid ${filter === f ? INK : BORD}`,
              transition: "all 0.15s",
            }}>
            {f === "tous" ? "Tous" : f === "actif" ? "Actifs" : "Proches récompense"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px", padding: "12px 20px", borderBottom: `1px solid ${BORD}`, background: CARD }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: "0.08em", fontFamily: "var(--font-sora, system-ui)" }}>CLIENT</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: "0.08em", fontFamily: "var(--font-sora, system-ui)" }}>PROGRESSION</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: GRAY, letterSpacing: "0.08em", fontFamily: "var(--font-sora, system-ui)" }}>POINTS</span>
        </div>
        {filtered.map((c) => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 80px", padding: "14px 20px", borderBottom: `1px solid ${BORD}`, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: 2 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: GRAY }}>{c.lastVisit}</div>
            </div>
            <div style={{ paddingRight: 16 }}>
              <div style={{ height: 6, background: CARD, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(c.points / c.max) * 100}%`, background: c.points === c.max ? GOLD : "rgba(184,135,58,0.4)", borderRadius: 999 }} />
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.points === c.max ? GOLD : INK }}>
              {c.points}/{c.max}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="demo-kpi-grid">
        {[
          { label: "Hausse des visites", value: "+34%", sub: "vs mois précédent" },
          { label: "Taux de rétention", value: "87%", sub: "des clients reviennent" },
          { label: "Récompenses distribuées", value: "12", sub: "ce mois" },
        ].map(({ label, value, sub }) => (
          <div key={label} style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ fontSize: 13, color: GRAY, marginBottom: 8, fontFamily: "var(--font-sora, system-ui)" }}>{label}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: GOLD, fontFamily: "var(--font-playfair, Georgia, serif)", marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 12, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Retention chart */}
      <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 20, fontFamily: "var(--font-sora, system-ui)" }}>Taux de rétention (%)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={retentionData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORD} />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: GRAY }} />
            <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: GRAY }} />
            <Tooltip contentStyle={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="r" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 4 }} name="Rétention %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Rewards chart */}
      <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 20, fontFamily: "var(--font-sora, system-ui)" }}>Récompenses distribuées par mois</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={rewardData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORD} />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: GRAY }} />
            <YAxis tick={{ fontSize: 11, fill: GRAY }} />
            <Tooltip contentStyle={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="n" fill={GOLD} radius={[6, 6, 0, 0]} name="Récompenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ── */
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart2 },
  { id: "scanner", label: "Scanner", icon: ScanLine },
  { id: "clients", label: "Clients", icon: Users },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
];

export default function DemoPage() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div style={{ minHeight: "100vh", background: BG, color: INK }}>
      {/* Header */}
      <header style={{ background: INK, padding: "20px clamp(24px, 6vw, 80px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: WHITE, fontFamily: "var(--font-playfair, Georgia, serif)" }}>
                Démo interactive — Explorez Fideloo
              </h1>
              <span style={{ padding: "3px 10px", background: GS, border: `1px solid ${GB}`, borderRadius: 999, fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: "0.06em", fontFamily: "var(--font-sora, system-ui)", whiteSpace: "nowrap" }}>
                Aucune inscription requise
              </span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)" }}>
              Données fictives — explorez toutes les fonctionnalités sans créer de compte.
            </p>
          </div>
          <Link href="/register" style={{ padding: "10px 24px", background: GOLD, color: INK, borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
            Créer mon compte <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px clamp(24px, 6vw, 80px)" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 6, marginBottom: 32, overflowX: "auto" }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{
                flex: 1, minWidth: 100, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "10px 16px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
                border: "none", transition: "all 0.15s",
                background: tab === id ? INK : "transparent",
                color: tab === id ? WHITE : GRAY,
                fontFamily: "var(--font-sora, system-ui)",
              }}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "dashboard" && <DashboardTab />}
        {tab === "scanner" && <ScannerTab />}
        {tab === "clients" && <ClientsTab />}
        {tab === "analytics" && <AnalyticsTab />}
      </main>

      {/* Bottom CTA */}
      <div style={{ background: INK, padding: "40px clamp(24px, 6vw, 80px)", marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }} className="demo-cta-grid">
          <div>
            <h2 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 700, color: WHITE, marginBottom: 8, fontFamily: "var(--font-playfair, Georgia, serif)" }}>
              Prêt à lancer votre vraie carte fidélité ?
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)" }}>
              Setup en 2 minutes · Sans carte bancaire · Essai gratuit 14 jours
            </p>
          </div>
          <Link href="/register" style={{ padding: "14px 32px", background: GOLD, color: INK, borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
            Créer mon compte gratuitement <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @media (max-width: 640px) {
          .demo-kpi-grid { grid-template-columns: 1fr !important; }
          .demo-cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
