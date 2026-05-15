"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  BarChart2, Users, QrCode, ScanLine, Check, ArrowRight,
  TrendingUp, Gift, ChevronRight, Search, X, Bell, Smartphone,
  Star, Clock, ChevronDown, Wallet,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, LineChart, Line, BarChart, Bar,
} from "recharts";

/* ── Design tokens ── */
const BG    = "#EDEBE4";
const INK   = "#0B0F0E";
const GOLD  = "#B8873A";
const WHITE = "#FFFFFF";
const GRAY  = "#6B6B6B";
const CARD  = "#F5F3EE";
const BORD  = "#E0DDD6";
const GS    = "rgba(184,135,58,0.10)";
const GB    = "rgba(184,135,58,0.30)";
const GREEN = "#22A869";

/* ── Fake data ── */
const fakeClients = [
  { id: 1, name: "Marie Laurent",   email: "marie.l@email.fr",   points: 8,  max: 10, lastVisit: "Aujourd'hui", visits: 24, status: "proche",  joined: "12 jan 2026" },
  { id: 2, name: "Karim Benali",    email: "k.benali@email.fr",   points: 5,  max: 10, lastVisit: "Hier",         visits: 15, status: "actif",   joined: "3 fév 2026"  },
  { id: 3, name: "Sophie Tremblay", email: "sophie.t@email.fr",   points: 10, max: 10, lastVisit: "2 mai",        visits: 31, status: "proche",  joined: "8 jan 2026"  },
  { id: 4, name: "Lucas Martin",    email: "l.martin@email.fr",   points: 3,  max: 10, lastVisit: "30 avr",       visits: 9,  status: "actif",   joined: "20 mars 2026"},
  { id: 5, name: "Emma Dubois",     email: "e.dubois@email.fr",   points: 7,  max: 10, lastVisit: "29 avr",       visits: 21, status: "proche",  joined: "15 fév 2026" },
  { id: 6, name: "Thomas Petit",    email: "t.petit@email.fr",    points: 2,  max: 10, lastVisit: "27 avr",       visits: 6,  status: "actif",   joined: "2 avr 2026"  },
  { id: 7, name: "Léa Bernard",     email: "lea.b@email.fr",      points: 9,  max: 10, lastVisit: "26 avr",       visits: 28, status: "proche",  joined: "5 jan 2026"  },
  { id: 8, name: "Antoine Moreau",  email: "a.moreau@email.fr",   points: 1,  max: 10, lastVisit: "24 avr",       visits: 4,  status: "actif",   joined: "10 avr 2026" },
  { id: 9, name: "Camille Roux",    email: "c.roux@email.fr",     points: 6,  max: 10, lastVisit: "22 avr",       visits: 18, status: "actif",   joined: "28 jan 2026" },
  { id: 10, name: "Nicolas Simon",  email: "n.simon@email.fr",    points: 4,  max: 10, lastVisit: "20 avr",       visits: 11, status: "actif",   joined: "14 mars 2026"},
];

const historyMap: Record<number, { date: string; action: string; pts: number }[]> = {
  1: [
    { date: "Aujourd'hui 10:32", action: "Visite + achat", pts: 1 },
    { date: "12 mai 14:15", action: "Visite + achat", pts: 1 },
    { date: "10 mai 09:50", action: "Visite + achat", pts: 1 },
    { date: "7 mai 11:30", action: "Visite + achat", pts: 1 },
    { date: "4 mai 16:10", action: "Visite + achat", pts: 1 },
  ],
  3: [
    { date: "2 mai 11:00", action: "Visite + achat", pts: 1 },
    { date: "30 avr 09:20", action: "Récompense utilisée 🎁", pts: -10 },
    { date: "28 avr 14:40", action: "Visite + achat", pts: 1 },
  ],
  7: [
    { date: "26 avr 15:22", action: "Visite + achat", pts: 1 },
    { date: "23 avr 10:05", action: "Visite + achat", pts: 1 },
    { date: "20 avr 13:15", action: "Récompense utilisée 🎁", pts: -10 },
  ],
};

const visitData30 = [
  { j: "1 avr", v: 14 }, { j: "3 avr", v: 18 }, { j: "5 avr", v: 11 },
  { j: "7 avr", v: 22 }, { j: "9 avr", v: 16 }, { j: "11 avr", v: 28 },
  { j: "13 avr", v: 24 }, { j: "15 avr", v: 19 }, { j: "17 avr", v: 31 },
  { j: "19 avr", v: 27 }, { j: "21 avr", v: 33 }, { j: "23 avr", v: 29 },
  { j: "25 avr", v: 38 }, { j: "27 avr", v: 34 }, { j: "29 avr", v: 42 },
];
const visitData7 = [
  { j: "9 mai", v: 18 }, { j: "10 mai", v: 23 }, { j: "11 mai", v: 19 },
  { j: "12 mai", v: 27 }, { j: "13 mai", v: 31 }, { j: "14 mai", v: 25 }, { j: "15 mai", v: 38 },
];
const visitData90 = [
  { j: "Fév", v: 210 }, { j: "Mars", v: 280 }, { j: "Avr", v: 350 },
  { j: "Mai s1", v: 95 }, { j: "Mai s2", v: 110 },
];

const retentionData = [
  { m: "Janv", r: 72 }, { m: "Févr", r: 78 }, { m: "Mars", r: 82 },
  { m: "Avr", r: 87 }, { m: "Mai", r: 83 }, { m: "Juin", r: 89 },
];
const rewardData = [
  { m: "Janv", n: 4 }, { m: "Févr", n: 6 }, { m: "Mars", n: 8 },
  { m: "Avr", n: 12 }, { m: "Mai", n: 10 }, { m: "Juin", n: 15 },
];

const ACTIVITY_FEED = [
  { id: 1, name: "Marie Laurent",   action: "a scanné le QR code",          pts: "+1 pt",  time: "Il y a 2 min",  avatar: "M" },
  { id: 2, name: "Léa Bernard",     action: "est proche de sa récompense",  pts: "9/10",   time: "Il y a 8 min",  avatar: "L" },
  { id: 3, name: "Sophie Tremblay", action: "a utilisé sa récompense",      pts: "🎁",     time: "Il y a 15 min", avatar: "S" },
  { id: 4, name: "Karim Benali",    action: "a rejoint votre programme",    pts: "Nouveau", time: "Il y a 23 min", avatar: "K" },
  { id: 5, name: "Emma Dubois",     action: "a scanné le QR code",          pts: "+1 pt",  time: "Il y a 31 min", avatar: "E" },
];

/* ─────────────────────────────────────────────
   TAB 1 — DASHBOARD
───────────────────────────────────────────── */
function DashboardTab() {
  const [liveIndex, setLiveIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (liveIndex + 1) % ACTIVITY_FEED.length;
      setLiveIndex(next);
      setToastMsg(`${ACTIVITY_FEED[next].name} ${ACTIVITY_FEED[next].action}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 5000);
    return () => clearInterval(interval);
  }, [liveIndex]);

  const proche = fakeClients.filter(c => c.points >= 7);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative" }}>

      {/* Live toast */}
      {showToast && (
        <div style={{
          position: "fixed", top: 80, right: 24, zIndex: 100,
          background: INK, color: WHITE, borderRadius: 12,
          padding: "12px 18px", fontSize: 13, maxWidth: 280,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          animation: "slideInRight 0.3s ease",
          display: "flex", alignItems: "center", gap: 10,
          fontFamily: "var(--font-sora, system-ui)",
        }}>
          <Bell size={14} color={GOLD} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 12, color: GOLD, marginBottom: 2 }}>Activité en direct</div>
            <div style={{ color: "rgba(255,255,255,0.85)" }}>{toastMsg}</div>
          </div>
        </div>
      )}

      {/* Explanation banner */}
      <div style={{ background: GS, border: `1px solid ${GB}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: GB, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Star size={15} color={GOLD} />
        </div>
        <p style={{ fontSize: 13, color: INK, margin: 0, lineHeight: 1.5, fontFamily: "var(--font-sora, system-ui)" }}>
          <strong>Voici votre tableau de bord.</strong> Vous voyez en temps réel combien de clients sont actifs, combien de points sont distribués, et qui est proche de sa récompense.
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="demo-kpi-grid">
        {[
          { label: "Clients inscrits", value: "248", icon: Users, delta: "+12 ce mois", trend: "up" },
          { label: "Points distribués", value: "1 840", icon: TrendingUp, delta: "+34% vs mois dernier", trend: "up" },
          { label: "Récompenses utilisées", value: "12", icon: Gift, delta: "ce mois", trend: "up" },
        ].map(({ label, value, icon: Icon, delta }) => (
          <div key={label} style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>{label}</span>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: GS, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={16} color={GOLD} />
              </div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair, Georgia, serif)", marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 12, color: GREEN, fontFamily: "var(--font-sora, system-ui)", display: "flex", alignItems: "center", gap: 4 }}>
              ↑ {delta}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }} className="demo-dash-grid">
        {/* Chart */}
        <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, margin: 0, fontFamily: "var(--font-sora, system-ui)" }}>
              Visites — 30 derniers jours
            </h3>
            <span style={{ fontSize: 12, color: GOLD, fontWeight: 600, fontFamily: "var(--font-sora, system-ui)" }}>+28% vs mois dernier</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={visitData30} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={BORD} />
              <XAxis dataKey="j" tick={{ fontSize: 10, fill: GRAY }} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: GRAY }} />
              <Tooltip contentStyle={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="v" stroke={GOLD} fill="url(#gv)" strokeWidth={2.5} name="Visites" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Proches récompense */}
        <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: GS, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Gift size={14} color={GOLD} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: INK, margin: 0, fontFamily: "var(--font-sora, system-ui)" }}>
              Proches d&apos;une récompense
            </h3>
          </div>
          <p style={{ fontSize: 12, color: GRAY, margin: "0 0 16px", lineHeight: 1.5, fontFamily: "var(--font-sora, system-ui)" }}>
            Ces clients ont ≥ 7 points — ils reviendront bientôt.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            {proche.slice(0, 4).map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>{c.name.charAt(0)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: INK, marginBottom: 3 }}>{c.name.split(" ")[0]}</div>
                  <div style={{ height: 4, background: CARD, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(c.points / c.max) * 100}%`, background: c.points === 10 ? GREEN : GOLD, borderRadius: 999 }} />
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: c.points === 10 ? GREEN : GOLD, flexShrink: 0 }}>
                  {c.points === 10 ? "🎁" : `${c.points}/10`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, margin: 0, fontFamily: "var(--font-sora, system-ui)" }}>
            Activité récente
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: GREEN, fontFamily: "var(--font-sora, system-ui)" }}>En direct</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {ACTIVITY_FEED.map((item, idx) => (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "12px 0",
              borderBottom: idx < ACTIVITY_FEED.length - 1 ? `1px solid ${BORD}` : "none",
              opacity: idx === liveIndex ? 1 : 0.7,
              transition: "opacity 0.4s",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>{item.avatar}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{item.name}</span>
                <span style={{ fontSize: 13, color: GRAY }}> {item.action}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>{item.pts}</span>
                <span style={{ fontSize: 11, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR code block */}
      <div style={{ background: INK, borderRadius: 14, padding: 24, display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }} className="demo-qr-grid">
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: WHITE, margin: "0 0 8px", fontFamily: "var(--font-sora, system-ui)" }}>
            Votre QR code d&apos;inscription
          </h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.6, fontFamily: "var(--font-sora, system-ui)" }}>
            Imprimez-le et posez-le en caisse. Le client scanne, saisit son email en 10 secondes, et sa carte apparaît dans son Wallet.
          </p>
        </div>
        <div style={{ background: WHITE, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <QrCode size={64} color={INK} />
          <span style={{ fontSize: 11, color: GRAY, fontFamily: "var(--font-sora, system-ui)", whiteSpace: "nowrap" }}>La Boulangerie Martin</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB 2 — SCANNER (Ajouter des points)
───────────────────────────────────────────── */
function ScannerTab() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState<typeof fakeClients[0] | null>(null);
  const [pts, setPts] = useState(0);
  const [toast, setToast] = useState("");
  const [redeemed, setRedeemed] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof fakeClients>([]);

  const handleSearch = (v: string) => {
    setQuery(v);
    setToast("");
    setRedeemed(false);
    if (v.length < 2) { setSuggestions([]); setFound(null); return; }
    const matches = fakeClients.filter(c => c.name.toLowerCase().includes(v.toLowerCase()));
    setSuggestions(matches);
    if (matches.length === 1) { setFound(matches[0]); setPts(matches[0].points); setSuggestions([]); }
    else setFound(null);
  };

  const selectClient = (c: typeof fakeClients[0]) => {
    setFound(c); setPts(c.points); setSuggestions([]); setQuery(c.name); setRedeemed(false);
  };

  const addPoints = (n: number) => {
    if (redeemed) return;
    const next = Math.min(pts + n, 10);
    setPts(next);
    setToast(`+${n} point${n > 1 ? "s" : ""} ajouté${n > 1 ? "s" : ""} · Carte Wallet mise à jour ✓`);
    setTimeout(() => setToast(""), 3000);
  };

  const redeem = () => {
    setPts(0); setRedeemed(true);
    setToast("Récompense utilisée 🎁 · Client notifié automatiquement");
    setTimeout(() => setToast(""), 3500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600, margin: "0 auto" }}>

      {/* How it works */}
      <div style={{ background: GS, border: `1px solid ${GB}`, borderRadius: 12, padding: "14px 18px" }}>
        <p style={{ fontSize: 13, color: INK, margin: 0, lineHeight: 1.6, fontFamily: "var(--font-sora, system-ui)" }}>
          <strong>Comment ça fonctionne en caisse :</strong> Cherchez le client par son nom ou email → ajoutez les points de sa visite → sa carte Wallet se met à jour automatiquement sur son téléphone.
        </p>
      </div>

      {/* Search */}
      <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 6, fontFamily: "var(--font-sora, system-ui)" }}>
          Rechercher un client
        </h3>
        <p style={{ fontSize: 13, color: GRAY, margin: "0 0 16px", fontFamily: "var(--font-sora, system-ui)" }}>
          Essayez : Marie, Karim, Sophie, Lucas, Emma, Léa…
        </p>
        <div style={{ position: "relative" }}>
          <Search size={16} color={GRAY} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Nom ou email du client..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 42px", background: CARD, border: `1px solid ${BORD}`, borderRadius: 10, fontSize: 14, color: INK, outline: "none", boxSizing: "border-box", fontFamily: "var(--font-sora, system-ui)" }}
          />
          {query && (
            <button onClick={() => { setQuery(""); setFound(null); setSuggestions([]); setRedeemed(false); }}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 10, marginTop: 4, overflow: "hidden" }}>
            {suggestions.map((c, idx) => (
              <div key={c.id} onClick={() => selectClient(c)}
                style={{
                  padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                  borderBottom: idx < suggestions.length - 1 ? `1px solid ${BORD}` : "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = CARD)}
                onMouseLeave={e => (e.currentTarget.style.background = WHITE)}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>{c.name.charAt(0)}</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: GRAY }}>{c.email}</div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, color: GOLD }}>{c.points}/10</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Client found */}
      {found && (
        <div style={{ animation: "fadeIn 0.25s ease" }}>
          {/* Wallet card preview */}
          <div style={{
            background: `linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)`,
            borderRadius: 20, padding: "24px 28px", marginBottom: 16,
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(184,135,58,0.15)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -10, width: 90, height: 90, borderRadius: "50%", background: "rgba(184,135,58,0.08)" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", fontFamily: "var(--font-sora, system-ui)", marginBottom: 4 }}>CARTE DE FIDÉLITÉ</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: WHITE, fontFamily: "var(--font-playfair, Georgia, serif)" }}>La Boulangerie Martin</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: GB, border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16 }}>🥐</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: WHITE, fontFamily: "var(--font-playfair, Georgia, serif)", marginBottom: 4 }}>
                {redeemed ? "0" : pts}
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>/10 points</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 999, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${((redeemed ? 0 : pts) / 10) * 100}%`,
                  background: pts === 10 && !redeemed ? `linear-gradient(90deg, ${GOLD}, #E8A84E)` : GOLD,
                  borderRadius: 999, transition: "width 0.5s ease",
                }} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)" }}>Client</div>
                <div style={{ fontSize: 15, color: WHITE, fontWeight: 600 }}>{found.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)" }}>Récompense</div>
                <div style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>10 cafés = 1 offert ☕</div>
              </div>
            </div>
          </div>

          {/* Info + actions */}
          <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${BORD}` }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: GOLD }}>{found.name.charAt(0)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair, Georgia, serif)" }}>{found.name}</div>
                <div style={{ fontSize: 13, color: GRAY }}>{found.email} · {found.visits} visites au total</div>
              </div>
              <div style={{ fontSize: 11, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>
                <Clock size={11} style={{ display: "inline", marginRight: 4 }} />
                {found.lastVisit}
              </div>
            </div>

            {/* Add points */}
            <p style={{ fontSize: 13, color: GRAY, margin: "0 0 10px", fontFamily: "var(--font-sora, system-ui)" }}>
              Ajouter des points pour cette visite :
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[1, 2, 5].map((n) => (
                <button key={n} onClick={() => addPoints(n)} disabled={redeemed || pts >= 10}
                  style={{
                    flex: 1, padding: "12px 0", background: (redeemed || pts >= 10) ? CARD : GS,
                    border: `1px solid ${(redeemed || pts >= 10) ? BORD : GB}`,
                    borderRadius: 10, fontSize: 16, fontWeight: 700,
                    color: (redeemed || pts >= 10) ? GRAY : GOLD,
                    cursor: (redeemed || pts >= 10) ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-sora, system-ui)", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!redeemed && pts < 10) e.currentTarget.style.background = GB; }}
                  onMouseLeave={e => { if (!redeemed && pts < 10) e.currentTarget.style.background = GS; }}>
                  +{n}
                </button>
              ))}
            </div>

            {/* Redeem */}
            {pts >= 10 && !redeemed && (
              <button onClick={redeem} style={{
                width: "100%", padding: "13px", background: GOLD, color: WHITE,
                border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
                cursor: "pointer", fontFamily: "var(--font-sora, system-ui)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                animation: "pulse 1.5s infinite",
              }}>
                <Gift size={16} /> Valider la récompense — 1 café offert
              </button>
            )}

            {redeemed && (
              <div style={{ padding: "12px 16px", background: "rgba(34,168,105,0.08)", border: "1px solid rgba(34,168,105,0.25)", borderRadius: 10, fontSize: 14, color: GREEN, textAlign: "center", fontWeight: 600 }}>
                <Check size={15} style={{ display: "inline", marginRight: 6 }} />
                Récompense validée — Compteur remis à zéro !
              </div>
            )}
          </div>

          {/* Toast */}
          {toast && (
            <div style={{ marginTop: 12, padding: "12px 16px", background: INK, borderRadius: 10, fontSize: 13, color: WHITE, display: "flex", alignItems: "center", gap: 8, animation: "fadeIn 0.2s ease", fontFamily: "var(--font-sora, system-ui)" }}>
              <Check size={14} color={GREEN} />
              {toast}
            </div>
          )}
        </div>
      )}

      {!found && query.length >= 2 && suggestions.length === 0 && (
        <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24, textAlign: "center", color: GRAY, fontSize: 14 }}>
          Aucun client trouvé. Essayez &quot;Marie&quot;, &quot;Karim&quot; ou &quot;Sophie&quot;.
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB 3 — CLIENTS
───────────────────────────────────────────── */
type FilterType = "tous" | "actif" | "proche";

function ClientsTab() {
  const [filter, setFilter] = useState<FilterType>("tous");
  const [selected, setSelected] = useState<typeof fakeClients[0] | null>(null);
  const [notifSent, setNotifSent] = useState<number | null>(null);

  const filtered = fakeClients.filter(c => {
    if (filter === "tous") return true;
    if (filter === "actif") return c.status === "actif";
    if (filter === "proche") return c.points >= 7;
    return true;
  });

  const sendNotif = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifSent(id);
    setTimeout(() => setNotifSent(null), 2500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: GS, border: `1px solid ${GB}`, borderRadius: 12, padding: "12px 18px" }}>
        <p style={{ fontSize: 13, color: INK, margin: 0, fontFamily: "var(--font-sora, system-ui)" }}>
          <strong>Cliquez sur un client</strong> pour voir son profil complet et son historique de visites.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {([
          { f: "tous", label: `Tous (${fakeClients.length})` },
          { f: "proche", label: `Proches récompense (${fakeClients.filter(c => c.points >= 7).length})` },
          { f: "actif", label: `Actifs (${fakeClients.filter(c => c.status === "actif").length})` },
        ] as { f: FilterType; label: string }[]).map(({ f, label }) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "var(--font-sora, system-ui)",
              background: filter === f ? INK : WHITE,
              color: filter === f ? WHITE : GRAY,
              border: `1px solid ${filter === f ? INK : BORD}`,
              transition: "all 0.15s",
            }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 16, alignItems: "start" }} className="demo-clients-grid">
        {/* Table */}
        <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 60px 44px", padding: "12px 20px", background: CARD, borderBottom: `1px solid ${BORD}` }}>
            {["CLIENT", "PROGRESSION", "PTS", ""].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: GRAY, letterSpacing: "0.08em", fontFamily: "var(--font-sora, system-ui)" }}>{h}</span>
            ))}
          </div>
          {filtered.map((c) => (
            <div key={c.id} onClick={() => setSelected(selected?.id === c.id ? null : c)}
              style={{
                display: "grid", gridTemplateColumns: "1fr 100px 60px 44px", padding: "13px 20px",
                borderBottom: `1px solid ${BORD}`, alignItems: "center", cursor: "pointer",
                background: selected?.id === c.id ? GS : WHITE,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background = CARD; }}
              onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background = WHITE; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: GS, border: `1px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>{c.name.charAt(0)}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: GRAY }}>{c.lastVisit}</div>
                </div>
              </div>
              <div style={{ paddingRight: 12 }}>
                <div style={{ height: 5, background: CARD, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(c.points / c.max) * 100}%`, background: c.points >= 7 ? GOLD : "rgba(184,135,58,0.35)", borderRadius: 999 }} />
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.points >= 7 ? GOLD : INK }}>
                {c.points}/10
              </div>
              <button onClick={e => sendNotif(c.id, e)}
                title="Envoyer une notification push"
                style={{ width: 30, height: 30, borderRadius: 8, background: notifSent === c.id ? GS : "transparent", border: `1px solid ${notifSent === c.id ? GB : "transparent"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                {notifSent === c.id ? <Check size={13} color={GREEN} /> : <Bell size={13} color={GRAY} />}
              </button>
            </div>
          ))}
        </div>

        {/* Client profile panel */}
        {selected && (
          <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24, animation: "fadeIn 0.2s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, margin: 0, fontFamily: "var(--font-sora, system-ui)" }}>Profil client</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: GRAY }}><X size={16} /></button>
            </div>

            {/* Avatar + info */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${BORD}` }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: GS, border: `2px solid ${GB}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: GOLD }}>{selected.name.charAt(0)}</span>
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, color: INK, fontFamily: "var(--font-playfair, Georgia, serif)", marginBottom: 2 }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: GRAY }}>{selected.email}</div>
                <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>Inscrit le {selected.joined}</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Points", value: `${selected.points}/10` },
                { label: "Visites", value: String(selected.visits) },
                { label: "Statut", value: selected.points >= 7 ? "Proche 🎯" : "Actif" },
              ].map(s => (
                <div key={s.label} style={{ background: CARD, borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: GRAY, marginBottom: 4, fontFamily: "var(--font-sora, system-ui)" }}>{s.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* History */}
            <h4 style={{ fontSize: 13, fontWeight: 600, color: INK, margin: "0 0 12px", fontFamily: "var(--font-sora, system-ui)" }}>Historique des visites</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {(historyMap[selected.id] || [
                { date: `${selected.lastVisit} 11:30`, action: "Visite + achat", pts: 1 },
                { date: "Il y a 1 semaine", action: "Visite + achat", pts: 1 },
              ]).map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${BORD}` : "none" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: h.pts < 0 ? GREEN : GOLD, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: INK, fontWeight: 500 }}>{h.action}</div>
                    <div style={{ fontSize: 11, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>{h.date}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: h.pts < 0 ? GREEN : GOLD }}>
                    {h.pts > 0 ? `+${h.pts}` : h.pts} pt{Math.abs(h.pts) > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB 4 — CARTE WALLET (nouveau)
───────────────────────────────────────────── */
function WalletTab() {
  const [walletType, setWalletType] = useState<"apple" | "google">("apple");
  const [step, setStep] = useState(0);

  const STEPS = [
    { icon: "📲", title: "Le client scanne le QR code", desc: "Posé en caisse ou sur votre comptoir. Compatible avec tous les appareils photo." },
    { icon: "✍️", title: "Il saisit son email en 10 secondes", desc: "Pas d'app à télécharger. Un simple formulaire sur son navigateur." },
    { icon: "💳", title: "Sa carte apparaît dans son Wallet", desc: "Directement dans Apple Wallet ou Google Wallet. Sans aucune action supplémentaire." },
    { icon: "⭐", title: "Les points se mettent à jour en temps réel", desc: "À chaque visite, la carte se met à jour automatiquement sur son téléphone." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: GS, border: `1px solid ${GB}`, borderRadius: 12, padding: "14px 18px" }}>
        <p style={{ fontSize: 13, color: INK, margin: 0, lineHeight: 1.6, fontFamily: "var(--font-sora, system-ui)" }}>
          <strong>Ce que voit votre client sur son téléphone.</strong> La carte s'ajoute automatiquement dans Apple Wallet ou Google Wallet — sans application à télécharger.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="demo-wallet-grid">
        {/* Left: phone mockup */}
        <div>
          {/* Toggle Apple / Google */}
          <div style={{ display: "flex", background: WHITE, border: `1px solid ${BORD}`, borderRadius: 999, padding: 4, marginBottom: 24, width: "fit-content" }}>
            {(["apple", "google"] as const).map(t => (
              <button key={t} onClick={() => setWalletType(t)}
                style={{
                  padding: "8px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
                  background: walletType === t ? INK : "transparent",
                  color: walletType === t ? WHITE : GRAY,
                  fontFamily: "var(--font-sora, system-ui)", transition: "all 0.2s",
                }}>
                {t === "apple" ? "🍎 Apple Wallet" : "🤖 Google Wallet"}
              </button>
            ))}
          </div>

          {/* Phone frame */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: 260, background: "#1A1A1A", borderRadius: 36,
              padding: "16px 12px", boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
              position: "relative",
            }}>
              {/* Notch */}
              <div style={{ width: 80, height: 22, background: "#0A0A0A", borderRadius: 12, margin: "0 auto 12px", position: "relative" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2A2A2A", position: "absolute", right: 12, top: 6 }} />
              </div>

              {/* Screen */}
              <div style={{ background: walletType === "apple" ? "#1C1C1E" : "#F8F9FA", borderRadius: 24, padding: 12, minHeight: 360 }}>
                {walletType === "apple" ? (
                  <>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)", marginBottom: 8 }}>Portefeuille</div>
                    {/* Apple wallet card */}
                    <div style={{
                      background: `linear-gradient(135deg, #1A1006 0%, #3D2A0A 50%, #1A1006 100%)`,
                      borderRadius: 16, padding: "18px 20px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                      position: "relative", overflow: "hidden",
                    }}>
                      <div style={{ position: "absolute", top: -15, right: -15, width: 80, height: 80, borderRadius: "50%", background: "rgba(184,135,58,0.2)" }} />
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginBottom: 6, fontFamily: "var(--font-sora, system-ui)" }}>CARTE DE FIDÉLITÉ</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 2, fontFamily: "var(--font-playfair, Georgia, serif)" }}>La Boulangerie Martin</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>Marie Laurent</div>

                      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                        {[1,2,3,4,5,6,7,8,9,10].map(i => (
                          <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: i <= 8 ? GOLD : "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                        ))}
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)" }}>8/10 · Encore 2 visites pour votre café offert ☕</div>
                    </div>

                    <div style={{ marginTop: 12, fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-sora, system-ui)", textAlign: "center" }}>
                      Mis à jour il y a 2 min
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 11, color: "#5F6368", fontFamily: "var(--font-sora, system-ui)", marginBottom: 8 }}>Google Wallet</div>
                    {/* Google wallet card */}
                    <div style={{
                      background: `linear-gradient(135deg, #0B0F0E 0%, #2A1F0A 100%)`,
                      borderRadius: 16, padding: "18px 20px",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: GB, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 14 }}>🥐</span>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: WHITE, fontFamily: "var(--font-playfair, Georgia, serif)" }}>Boulangerie Martin</div>
                          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)" }}>Programme de fidélité</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, fontFamily: "var(--font-playfair, Georgia, serif)", marginBottom: 4 }}>8 pts</div>
                      <div style={{ height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 999, marginBottom: 8 }}>
                        <div style={{ height: "100%", width: "80%", background: GOLD, borderRadius: 999 }} />
                      </div>
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-sora, system-ui)" }}>Marie Laurent · 2 visites pour votre café offert</div>
                    </div>
                  </>
                )}
              </div>

              {/* Home bar */}
              <div style={{ width: 80, height: 4, background: "#3A3A3A", borderRadius: 999, margin: "12px auto 0" }} />
            </div>
          </div>
        </div>

        {/* Right: step by step */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: INK, margin: 0, fontFamily: "var(--font-sora, system-ui)" }}>
            Parcours client — 4 étapes
          </h3>
          {STEPS.map((s, i) => (
            <div key={i} onClick={() => setStep(i)}
              style={{
                background: step === i ? INK : WHITE,
                border: `1px solid ${step === i ? INK : BORD}`,
                borderRadius: 12, padding: "16px 18px", cursor: "pointer",
                transition: "all 0.2s",
              }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: step === i ? WHITE : INK, marginBottom: 4, fontFamily: "var(--font-sora, system-ui)" }}>{s.title}</div>
                  {step === i && (
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.5, fontFamily: "var(--font-sora, system-ui)", animation: "fadeIn 0.2s ease" }}>{s.desc}</div>
                  )}
                </div>
                <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: step === i ? GOLD : CARD, border: `1px solid ${step === i ? GOLD : BORD}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700, color: step === i ? INK : GRAY, fontFamily: "var(--font-sora, system-ui)" }}>
                  {i + 1}
                </div>
              </div>
            </div>
          ))}

          <div style={{ background: GS, border: `1px solid ${GB}`, borderRadius: 12, padding: "14px 18px", marginTop: 4 }}>
            <div style={{ fontSize: 13, color: INK, fontFamily: "var(--font-sora, system-ui)", lineHeight: 1.6 }}>
              <strong>Sans app à télécharger.</strong> Apple Wallet et Google Wallet sont préinstallés sur 100% des smartphones. Vos clients n'ont rien à faire.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TAB 5 — ANALYTICS
───────────────────────────────────────────── */
type PeriodType = "7j" | "30j" | "90j";

function AnalyticsTab() {
  const [period, setPeriod] = useState<PeriodType>("30j");

  const dataMap = { "7j": visitData7, "30j": visitData30, "90j": visitData90 };
  const kpiMap = {
    "7j":  { visits: "+18%", ret: "83%", rewards: "3",  newClients: "14" },
    "30j": { visits: "+34%", ret: "87%", rewards: "12", newClients: "48" },
    "90j": { visits: "+62%", ret: "89%", rewards: "35", newClients: "132" },
  };
  const kpi = kpiMap[period];

  const FUNNEL = [
    { label: "Clients scannent le QR", n: 248, pct: 100 },
    { label: "S'inscrivent (10 sec)", n: 210, pct: 85 },
    { label: "Visitent au moins 3×", n: 163, pct: 66 },
    { label: "Obtiennent une récompense", n: 98, pct: 40 },
  ];

  const TOP5 = fakeClients.slice(0, 5).sort((a, b) => b.visits - a.visits);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Period selector */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ background: GS, border: `1px solid ${GB}`, borderRadius: 12, padding: "10px 16px" }}>
          <p style={{ fontSize: 13, color: INK, margin: 0, fontFamily: "var(--font-sora, system-ui)" }}>
            <strong>Statistiques de La Boulangerie Martin</strong> — données fictives illustratives
          </p>
        </div>
        <div style={{ display: "flex", background: WHITE, border: `1px solid ${BORD}`, borderRadius: 999, padding: 4, gap: 2 }}>
          {(["7j", "30j", "90j"] as PeriodType[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{
                padding: "7px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none",
                background: period === p ? INK : "transparent",
                color: period === p ? WHITE : GRAY,
                fontFamily: "var(--font-sora, system-ui)", transition: "all 0.15s",
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="demo-analytics-kpi">
        {[
          { label: "Hausse des visites", value: kpi.visits, icon: TrendingUp },
          { label: "Taux de rétention", value: kpi.ret, icon: Users },
          { label: "Récompenses données", value: kpi.rewards, icon: Gift },
          { label: "Nouveaux clients", value: kpi.newClients, icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>{label}</span>
              <Icon size={14} color={GOLD} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: GOLD, fontFamily: "var(--font-playfair, Georgia, serif)" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, margin: 0, fontFamily: "var(--font-sora, system-ui)" }}>Visites</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 3, background: GOLD, borderRadius: 1 }} />
            <span style={{ fontSize: 12, color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>Visites</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={dataMap[period]} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GOLD} stopOpacity={0.3} />
                <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BORD} />
            <XAxis dataKey="j" tick={{ fontSize: 10, fill: GRAY }} />
            <YAxis tick={{ fontSize: 10, fill: GRAY }} />
            <Tooltip contentStyle={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="v" stroke={GOLD} fill="url(#ga)" strokeWidth={2.5} name="Visites" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="demo-analytics-bottom">
        {/* Funnel */}
        <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, margin: "0 0 20px", fontFamily: "var(--font-sora, system-ui)" }}>
            Entonnoir de fidélisation
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {FUNNEL.map((f, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: INK, fontFamily: "var(--font-sora, system-ui)" }}>{f.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>{f.n}</span>
                </div>
                <div style={{ height: 8, background: CARD, borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${f.pct}%`, background: `rgba(184,135,58,${0.4 + i * 0.15})`, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 */}
        <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, margin: "0 0 16px", fontFamily: "var(--font-sora, system-ui)" }}>
            Top 5 clients fidèles
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TOP5.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? `1px solid ${BORD}` : "none" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? GOLD : GRAY, width: 16, textAlign: "center", fontFamily: "var(--font-sora, system-ui)" }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: INK }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: GRAY }}>{c.visits} visites</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: GOLD }}>{c.points}/10</div>
              </div>
            ))}
          </div>
        </div>

        {/* Retention */}
        <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, margin: "0 0 20px", fontFamily: "var(--font-sora, system-ui)" }}>Taux de rétention (%)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={retentionData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORD} />
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: GRAY }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: GRAY }} />
              <Tooltip contentStyle={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="r" stroke={GOLD} strokeWidth={2.5} dot={{ fill: GOLD, r: 4 }} name="Rétention %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Rewards */}
        <div style={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: INK, margin: "0 0 20px", fontFamily: "var(--font-sora, system-ui)" }}>Récompenses distribuées</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={rewardData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BORD} />
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: GRAY }} />
              <YAxis tick={{ fontSize: 10, fill: GRAY }} />
              <Tooltip contentStyle={{ background: WHITE, border: `1px solid ${BORD}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="n" fill={GOLD} radius={[6, 6, 0, 0]} name="Récompenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const TABS = [
  { id: "dashboard", label: "Dashboard",    icon: BarChart2  },
  { id: "scanner",   label: "Ajouter points", icon: ScanLine   },
  { id: "clients",   label: "Clients",      icon: Users      },
  { id: "wallet",    label: "Carte Wallet", icon: Wallet     },
  { id: "analytics", label: "Statistiques", icon: TrendingUp },
];

export default function DemoPage() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div style={{ minHeight: "100vh", background: BG, color: INK }}>

      {/* Header */}
      <header style={{ background: INK, padding: "20px clamp(24px, 6vw, 80px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/">
              <img src="/brand/fideloo-logo-linked-onDark.svg" height="28" alt="Fideloo" />
            </Link>
            <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)" }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: WHITE, fontFamily: "var(--font-sora, system-ui)" }}>Démo interactive</span>
                <span style={{ padding: "2px 8px", background: GS, border: `1px solid ${GB}`, borderRadius: 999, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: "0.06em", fontFamily: "var(--font-sora, system-ui)" }}>
                  SANS INSCRIPTION
                </span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, fontFamily: "var(--font-sora, system-ui)" }}>
                La Boulangerie Martin · Données fictives
              </p>
            </div>
          </div>
          <Link href="/register?plan=trial" style={{ padding: "10px 24px", background: GOLD, color: INK, borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
            Essai gratuit 14 jours <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px clamp(16px, 4vw, 60px)" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: WHITE, border: `1px solid ${BORD}`, borderRadius: 14, padding: 5, marginBottom: 28, overflowX: "auto" }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              style={{
                flex: 1, minWidth: 110, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: "none", transition: "all 0.15s", whiteSpace: "nowrap",
                background: tab === id ? INK : "transparent",
                color: tab === id ? WHITE : GRAY,
                fontFamily: "var(--font-sora, system-ui)",
              }}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {tab === "dashboard"  && <DashboardTab />}
        {tab === "scanner"    && <ScannerTab />}
        {tab === "clients"    && <ClientsTab />}
        {tab === "wallet"     && <WalletTab />}
        {tab === "analytics"  && <AnalyticsTab />}
      </main>

      {/* Bottom CTA */}
      <div style={{ background: INK, padding: "48px clamp(24px, 6vw, 80px)", marginTop: 48 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }} className="demo-cta-grid">
          <div>
            <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: "clamp(22px, 2.5vw, 32px)", fontWeight: 400, color: WHITE, margin: "0 0 8px" }}>
              Prêt à lancer votre vraie carte fidélité ?
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: 0, fontFamily: "var(--font-sora, system-ui)" }}>
              Setup en 2 minutes · Sans carte bancaire · Essai gratuit 14 jours · Résiliation libre
            </p>
          </div>
          <Link href="/register?plan=trial" style={{ padding: "14px 32px", background: GOLD, color: INK, borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
            Commencer gratuitement <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        @media (max-width: 700px) {
          .demo-kpi-grid { grid-template-columns: 1fr !important; }
          .demo-dash-grid { grid-template-columns: 1fr !important; }
          .demo-cta-grid { grid-template-columns: 1fr !important; }
          .demo-qr-grid { grid-template-columns: 1fr !important; }
          .demo-wallet-grid { grid-template-columns: 1fr !important; }
          .demo-analytics-kpi { grid-template-columns: 1fr 1fr !important; }
          .demo-analytics-bottom { grid-template-columns: 1fr !important; }
          .demo-clients-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
