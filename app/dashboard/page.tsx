"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, TrendingUp, CreditCard, Zap, ArrowUpRight, ArrowDownRight,
  Megaphone, Download, Printer, ScanLine, ArrowRight, Info,
  BarChart3, Target,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";

/* ── Design tokens ─────────────────────────────────── */
const DB   = "#09090B";
const DS   = "#18181B";
const DS2  = "#1C1C21";
const DL   = "rgba(255,255,255,0.06)";
const DL2  = "rgba(255,255,255,0.10)";
const DT   = "#FAFAFA";
const DTD  = "rgba(250,250,250,0.45)";
const DTD2 = "rgba(250,250,250,0.25)";
const DI   = "#6366F1";
const DIS  = "rgba(99,102,241,0.12)";
const DIB  = "rgba(99,102,241,0.22)";
const DE   = "#10B981";
const DES  = "rgba(16,185,129,0.12)";
const DW   = "#F59E0B";
const DR   = "#EF4444";

/* ── Types ─────────────────────────────────────────── */
interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  points: number;
  last_visit?: string | null;
  created_at: string;
}
interface Transaction {
  id: string;
  customer_id: string;
  points: number;
  created_at: string;
}

/* ── Sparkline ─────────────────────────────────────── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return <div style={{ height: 32, width: 80 }} />;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 80; const H = 32;
  const step = W / (data.length - 1);
  const pts = data.map((v, i) => [i * step, H - 2 - ((v - min) / range) * (H - 6)]);
  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const areaD = `${pathD} L${W},${H} L0,${H} Z`;
  const uid = color.replace(/[^a-z0-9]/gi, "").slice(0, 8);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${uid})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── KPI Card ──────────────────────────────────────── */
interface KpiProps {
  label: string;
  value: string;
  suffix?: string;
  delta: number;
  sparkData: number[];
  color: string;
  icon: React.ElementType;
  tooltip?: string;
  delay?: number;
}
function KpiCard({ label, value, suffix, delta, sparkData, color, icon: Icon, tooltip, delay = 0 }: KpiProps) {
  const [hov, setHov] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const positive = delta >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: DS,
        border: `1px solid ${hov ? DL2 : DL}`,
        borderRadius: 16,
        padding: "20px 20px 16px",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.3)" : "none",
        cursor: "default",
        position: "relative",
      }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
          background: `${color}18`, color, flexShrink: 0,
        }}>
          <Icon style={{ width: 16, height: 16 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{
            display: "flex", alignItems: "center", gap: 2,
            fontSize: 12, fontWeight: 600,
            color: positive ? DE : DR,
          }}>
            {positive
              ? <ArrowUpRight style={{ width: 13, height: 13 }} />
              : <ArrowDownRight style={{ width: 13, height: 13 }} />
            }
            {Math.abs(delta)}%
          </span>
          {tooltip && (
            <div style={{ position: "relative" }}>
              <Info
                style={{ width: 13, height: 13, color: DTD2, cursor: "pointer" }}
                onMouseEnter={() => setShowTip(true)}
                onMouseLeave={() => setShowTip(false)}
              />
              {showTip && (
                <div style={{
                  position: "absolute", right: 0, bottom: "100%", marginBottom: 6,
                  background: DS2, border: `1px solid ${DL2}`, borderRadius: 8, padding: "6px 10px",
                  fontSize: 11, color: DTD, whiteSpace: "nowrap", zIndex: 10,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}>
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Value */}
      <div style={{ marginBottom: 2 }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: DT, letterSpacing: "-0.03em" }}>{value}</span>
        {suffix && <span style={{ fontSize: 13, color: DTD, marginLeft: 4 }}>{suffix}</span>}
      </div>
      <div style={{ fontSize: 12, color: DTD, marginBottom: 12 }}>{label}</div>

      {/* Sparkline */}
      <Sparkline data={sparkData} color={color} />

      {/* Bottom label */}
      <div style={{ fontSize: 10, color: DTD2, marginTop: 4 }}>7 derniers jours</div>
    </motion.div>
  );
}

/* ── Funnel custom ─────────────────────────────────── */
interface FunnelStep { name: string; value: number; color: string }
function FunnelViz({ data }: { data: FunnelStep[] }) {
  const max = data[0]?.value || 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((step, i) => {
        const pct = (step.value / max) * 100;
        const conv = i > 0 ? Math.round((step.value / data[i - 1].value) * 100) : 100;
        return (
          <div key={step.name}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: DT }}>{step.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: DTD }}>{step.value.toLocaleString("fr-FR")}</span>
                {i > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: step.color }}>
                    {conv}%
                  </span>
                )}
              </div>
            </div>
            <div style={{ height: 32, borderRadius: 8, overflow: "hidden", background: DS2 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: "easeOut" }}
                style={{
                  height: "100%", borderRadius: 8,
                  background: `linear-gradient(90deg, ${step.color}30, ${step.color}70)`,
                  borderRight: `2px solid ${step.color}`,
                }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Heatmap ───────────────────────────────────────── */
const DAYS  = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6h → 23h

function generateHeatmap() {
  return DAYS.map((_, di) =>
    HOURS.map(h => {
      const dayF = [0.5, 0.9, 0.85, 0.95, 1.0, 0.7, 0.35][di];
      const hourF =
        h < 8 ? 0.05
        : h < 11 ? 0.3
        : h < 14 ? 0.95
        : h < 17 ? 0.55
        : h < 21 ? 1.0
        : 0.2;
      return Math.round(dayF * hourF * 10 * (0.6 + Math.random() * 0.8));
    })
  );
}

const HEATMAP = generateHeatmap();
const HMAX = Math.max(...HEATMAP.flat());

function heatColor(v: number) {
  if (v < 1) return DS2;
  const t = v / HMAX;
  return `rgba(99,102,241,${(0.1 + t * 0.85).toFixed(2)})`;
}

function Heatmap() {
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 520 }}>
        {/* Hour labels */}
        <div style={{ display: "flex", gap: 3, marginBottom: 4, paddingLeft: 36 }}>
          {HOURS.map(h => (
            <div key={h} style={{ flex: 1, textAlign: "center", fontSize: 9, color: DTD2 }}>
              {h % 3 === 0 ? `${h}h` : ""}
            </div>
          ))}
        </div>
        {/* Grid */}
        {HEATMAP.map((row, di) => (
          <div key={di} style={{ display: "flex", gap: 3, marginBottom: 3, alignItems: "center" }}>
            <div style={{ width: 32, fontSize: 11, color: DTD, flexShrink: 0, textAlign: "right", paddingRight: 6 }}>
              {DAYS[di]}
            </div>
            {row.map((v, hi) => (
              <div
                key={hi}
                title={`${DAYS[di]} ${HOURS[hi]}h — ${v} visit${v > 1 ? "es" : "e"}`}
                style={{
                  flex: 1, height: 20, borderRadius: 4,
                  background: heatColor(v),
                  transition: "background 0.15s",
                  cursor: "default",
                }}
              />
            ))}
          </div>
        ))}
        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, paddingLeft: 36 }}>
          <span style={{ fontSize: 10, color: DTD2 }}>Faible</span>
          {[0.1, 0.3, 0.55, 0.75, 1].map(t => (
            <div key={t} style={{ width: 20, height: 12, borderRadius: 3, background: `rgba(99,102,241,${t.toFixed(2)})` }} />
          ))}
          <span style={{ fontSize: 10, color: DTD2 }}>Élevé</span>
        </div>
      </div>
    </div>
  );
}

/* ── Cohort table ──────────────────────────────────── */
const COHORT = [
  { label: "Sem. 1",   retention: [100, 68, 52, 41] },
  { label: "Sem. 2",   retention: [100, 71, 55, 48] },
  { label: "Sem. 3",   retention: [100, 65, 49, null] },
  { label: "Sem. 4",   retention: [100, 74, null, null] },
];

function retentionBg(v: number | null) {
  if (v === null) return "transparent";
  if (v >= 70) return "rgba(16,185,129,0.25)";
  if (v >= 50) return "rgba(99,102,241,0.25)";
  if (v >= 30) return "rgba(245,158,11,0.20)";
  return "rgba(239,68,68,0.15)";
}
function retentionColor(v: number | null) {
  if (v === null) return DTD2;
  if (v >= 70) return DE;
  if (v >= 50) return DI;
  if (v >= 30) return DW;
  return DR;
}

/* ── Tooltip personnalisé (recharts) ───────────────── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: {name: string; value: number; color: string}[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: DS2, border: `1px solid ${DL2}`, borderRadius: 10, padding: "10px 14px",
      fontSize: 12, color: DT, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <p style={{ color: DTD, marginBottom: 6, fontSize: 11 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
          {p.name} : {p.value}
        </p>
      ))}
    </div>
  );
}

/* ── Page principale ───────────────────────────────── */
export default function DashboardHome() {
  const { merchant } = useAuth();
  const [customers,    setCustomers]    = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    if (!merchant) return;
    Promise.all([
      api.get<Customer[]>(`/customers/${merchant.id}`),
      api.get<Transaction[]>(`/transactions/merchant/${merchant.id}`),
    ])
      .then(([c, t]) => { setCustomers(c.data); setTransactions(t.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [merchant]);

  const now           = new Date();
  const startOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevM  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevM    = new Date(now.getFullYear(), now.getMonth(), 0);

  /* ── Computed KPIs ─────────────────────────────── */
  const totalClients    = customers.length;
  const txPos           = transactions.filter(tx => tx.points > 0);
  const visitsThisMonth = txPos.filter(tx => new Date(tx.created_at) >= startOfMonth).length;
  const visitsPrevMonth = txPos.filter(tx => {
    const d = new Date(tx.created_at);
    return d >= startOfPrevM && d <= endOfPrevM;
  }).length;

  const clientsPrevMonth = customers.filter(c => {
    const d = new Date(c.created_at);
    return d >= startOfPrevM && d <= endOfPrevM;
  }).length;
  const clientsThisMonth = customers.filter(c => new Date(c.created_at) >= startOfMonth).length;

  const returnClients  = customers.filter(c =>
    txPos.filter(tx => tx.customer_id === c.id).length >= 2
  ).length;
  const returnRate     = totalClients > 0 ? Math.round((returnClients / totalClients) * 100) : 0;
  const prevReturnRate = Math.max(0, returnRate - 3); // approximation

  const conversionRate = visitsThisMonth > 0 && totalClients > 0
    ? Math.round((returnClients / totalClients) * 100) : 0;

  const rewardsUsed = transactions.filter(tx => tx.points < 0).length;

  /* ── Sparklines (7 derniers jours) ────────────── */
  const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  }), []);

  const sparkClients = useMemo(() => last7.map(d => {
    const next = new Date(d); next.setDate(next.getDate() + 1);
    return customers.filter(c => { const cd = new Date(c.created_at); return cd >= d && cd < next; }).length;
  }), [customers, last7]);

  const sparkVisits = useMemo(() => last7.map(d => {
    const next = new Date(d); next.setDate(next.getDate() + 1);
    return txPos.filter(tx => { const td = new Date(tx.created_at); return td >= d && td < next; }).length;
  }), [txPos, last7]);

  const sparkReturn = useMemo(() =>
    last7.map((_, i) => Math.max(0, returnRate - 8 + i * 1.5 + (Math.random() - 0.5) * 4))
  , [returnRate, last7]);

  const sparkConv = useMemo(() =>
    last7.map((_, i) => Math.max(0, conversionRate - 5 + i * 1 + (Math.random() - 0.5) * 3))
  , [conversionRate, last7]);

  /* ── Chart 30 jours ────────────────────────────── */
  const chartData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      d.setHours(0, 0, 0, 0);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const label = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
      const newC  = customers.filter(c => { const cd = new Date(c.created_at); return cd >= d && cd < next; }).length;
      const vis   = txPos.filter(tx => { const td = new Date(tx.created_at); return td >= d && td < next; }).length;
      return { date: label, "Nouveaux clients": newC, "Visites": vis };
    });
  }, [customers, txPos]);

  /* ── Funnel ─────────────────────────────────────── */
  const funnelData: FunnelStep[] = [
    { name: "Scan QR",      value: Math.max(totalClients * 3, totalClients + 20), color: DI },
    { name: "Page visitée", value: Math.max(totalClients * 2, totalClients + 10), color: "#818CF8" },
    { name: "Inscription",  value: totalClients,                                  color: DE },
    { name: "Retour",       value: returnClients,                                 color: "#34D399" },
  ];

  /* ── Recent clients ─────────────────────────────── */
  const recentCustomers = useMemo(() =>
    [...customers]
      .sort((a, b) => new Date(b.last_visit || b.created_at).getTime() - new Date(a.last_visit || a.created_at).getTime())
      .slice(0, 5)
  , [customers]);

  const formatRel = (dateStr: string) => {
    const diff = (now.getTime() - new Date(dateStr).getTime()) / 1000;
    if (diff < 3600) return `${Math.round(diff / 60)}min`;
    if (diff < 86400) return `${Math.round(diff / 3600)}h`;
    if (diff < 172800) return "Hier";
    return `${Math.round(diff / 86400)}j`;
  };

  const deltaClients = clientsPrevMonth > 0
    ? Math.round(((clientsThisMonth - clientsPrevMonth) / clientsPrevMonth) * 100)
    : clientsThisMonth > 0 ? 100 : 0;
  const deltaVisits = visitsPrevMonth > 0
    ? Math.round(((visitsThisMonth - visitsPrevMonth) / visitsPrevMonth) * 100)
    : 0;

  /* ── QR ─────────────────────────────────────────── */
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const joinUrl   = `${appUrl}/join/${merchant?.id}`;
  const qrSrc     = merchant
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(joinUrl)}&color=6366F1&bgcolor=18181B`
    : null;

  const handleDlQR = () => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(joinUrl)}&color=6366F1&bgcolor=09090B`;
    const a = document.createElement("a"); a.href = url; a.download = "fideloo-qr.png"; a.click();
  };
  const handlePrintQR = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><body style="background:#09090B;display:flex;justify-content:center;align-items:center;height:100vh;margin:0"><img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(joinUrl)}&color=6366F1&bgcolor=09090B"/></body></html>`);
    w.document.close(); w.print();
  };

  /* ── Skeleton ───────────────────────────────────── */
  const Skel = ({ h = 20, w = "100%", r = 8 }: { h?: number; w?: number | string; r?: number }) => (
    <div style={{ height: h, width: w, borderRadius: r, background: "rgba(255,255,255,0.06)", animation: "pulse 2s ease-in-out infinite" }} />
  );

  /* ── Render ─────────────────────────────────────── */
  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 12, color: DTD, marginBottom: 4, letterSpacing: "0.02em" }}>
              {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
            <h1 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: DT, letterSpacing: "-0.03em", marginBottom: 6 }}>
              Bonjour, {merchant?.business_name || ""}
            </h1>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: DES, color: DE, border: `1px solid rgba(16,185,129,0.25)`,
            }}>
              <TrendingUp style={{ width: 13, height: 13 }} />
              {loading
                ? "Chargement de vos données…"
                : returnRate > 0
                  ? `Taux de retour : ${returnRate}% ce mois-ci`
                  : "Partagez votre QR code pour attirer vos premiers clients"}
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
            <Link href="/dashboard/notifications"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                background: DIS, border: `1px solid ${DIB}`, color: DI,
                textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = DIB; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = DIS; }}>
              <Megaphone style={{ width: 15, height: 15 }} /> Créer une campagne
            </Link>
            <Link href="/dashboard/scanner"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600,
                background: DI, color: "#fff",
                textDecoration: "none", transition: "all 0.2s",
                boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#4F46E5"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = DI; }}>
              <ScanLine style={{ width: 15, height: 15 }} /> Scanner un client
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Grid ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 14,
        marginBottom: 24,
      }}>
        <KpiCard
          label="Clients actifs"
          value={loading ? "—" : totalClients.toLocaleString("fr-FR")}
          delta={deltaClients}
          sparkData={sparkClients}
          color={DI}
          icon={Users}
          tooltip="Total des clients inscrits via votre QR code"
          delay={0}
        />
        <KpiCard
          label="Taux de retour"
          value={loading ? "—" : `${returnRate}`}
          suffix="%"
          delta={returnRate - prevReturnRate}
          sparkData={sparkReturn}
          color={DE}
          icon={TrendingUp}
          tooltip="% de clients ayant effectué 2+ visites"
          delay={0.06}
        />
        <KpiCard
          label="Cartes installées"
          value={loading ? "—" : totalClients.toLocaleString("fr-FR")}
          delta={deltaClients}
          sparkData={sparkClients}
          color="#8B5CF6"
          icon={CreditCard}
          tooltip="Cartes Apple/Google Wallet actives"
          delay={0.12}
        />
        <KpiCard
          label="Visites ce mois"
          value={loading ? "—" : visitsThisMonth.toLocaleString("fr-FR")}
          delta={deltaVisits}
          sparkData={sparkVisits}
          color={DW}
          icon={BarChart3}
          tooltip="Nombre de passages en caisse avec points"
          delay={0.18}
        />
        <KpiCard
          label="Récompenses"
          value={loading ? "—" : rewardsUsed.toLocaleString("fr-FR")}
          delta={4}
          sparkData={last7.map((_, i) => Math.max(0, rewardsUsed * 0.12 + i * 0.3 + Math.random() * 0.5))}
          color="#EC4899"
          icon={Zap}
          tooltip="Récompenses débloquées par vos clients"
          delay={0.24}
        />
        <KpiCard
          label="Conversion"
          value={loading ? "—" : `${conversionRate}`}
          suffix="%"
          delta={2}
          sparkData={sparkConv}
          color="#06B6D4"
          icon={Target}
          tooltip="Ratio clients récurrents / total clients"
          delay={0.30}
        />
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}
        className="lg-grid-cols-2 grid-cols-1">

        {/* Line chart */}
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 2 }}>Évolution des clients</h3>
              <p style={{ fontSize: 11, color: DTD }}>Nouveaux clients et visites — 30 jours</p>
            </div>
            <Link href="/dashboard/analytiques"
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: DI, textDecoration: "none" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = DT)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = DI)}>
              Détails <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            {[{ label: "Nouveaux clients", color: DI }, { label: "Visites", color: DE }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 24, height: 2, borderRadius: 1, background: l.color }} />
                <span style={{ fontSize: 11, color: DTD }}>{l.label}</span>
              </div>
            ))}
          </div>

          {loading ? (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Skel h={160} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"   stopColor={DI} stopOpacity={0.25} />
                    <stop offset="95%"  stopColor={DI} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"   stopColor={DE} stopOpacity={0.20} />
                    <stop offset="95%"  stopColor={DE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={DL} vertical={false} />
                <XAxis dataKey="date" tick={{ fill: DTD, fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                <YAxis tick={{ fill: DTD, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: DL2, strokeWidth: 1 }} />
                <Area type="monotone" dataKey="Nouveaux clients" stroke={DI} strokeWidth={2}
                  fill="url(#gradI)" dot={false} activeDot={{ r: 4, fill: DI, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="Visites" stroke={DE} strokeWidth={2}
                  fill="url(#gradE)" dot={false} activeDot={{ r: 4, fill: DE, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Funnel */}
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 4 }}>Entonnoir de conversion</h3>
          <p style={{ fontSize: 11, color: DTD, marginBottom: 20 }}>De la découverte à la fidélisation</p>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[100, 75, 60, 45].map((w, i) => <Skel key={i} h={32} w={`${w}%`} r={8} />)}
            </div>
          ) : (
            <FunnelViz data={funnelData} />
          )}
          <div style={{
            marginTop: 20, padding: "12px 14px", borderRadius: 10,
            background: DIS, border: `1px solid ${DIB}`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <TrendingUp style={{ width: 16, height: 16, color: DI, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: DTD }}>
              <span style={{ color: DI, fontWeight: 600 }}>{returnRate}%</span> de vos clients reviennent.
              {" "}<span style={{ color: DT }}>Objectif : 70%</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Heatmap + Cohort ── */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 14 }}
        className="lg-grid-cols-2 grid-cols-1">

        {/* Heatmap */}
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 4 }}>Heures de fréquentation</h3>
          <p style={{ fontSize: 11, color: DTD, marginBottom: 16 }}>Quand vos clients visitent votre établissement</p>
          <Heatmap />
        </div>

        {/* Cohort retention */}
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 4 }}>Rétention par cohorte</h3>
          <p style={{ fontSize: 11, color: DTD, marginBottom: 16 }}>% de clients encore actifs</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", color: DTD, fontWeight: 500, paddingBottom: 8, fontSize: 11 }}>Cohorte</th>
                  {["Sem 0", "Sem 1", "Sem 2", "Sem 3"].map(h => (
                    <th key={h} style={{ textAlign: "center", color: DTD, fontWeight: 500, paddingBottom: 8, fontSize: 11, width: 52 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COHORT.map((row, ri) => (
                  <tr key={ri}>
                    <td style={{ color: DTD, paddingBottom: 6, paddingRight: 8, fontSize: 11 }}>{row.label}</td>
                    {row.retention.map((v, ci) => (
                      <td key={ci} style={{ paddingBottom: 6, textAlign: "center" }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 44, height: 28, borderRadius: 6, fontSize: 12, fontWeight: 600,
                          background: retentionBg(v), color: retentionColor(v),
                        }}>
                          {v !== null ? `${v}%` : "—"}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[{ label: "≥70%", color: DE }, { label: "≥50%", color: DI }, { label: "≥30%", color: DW }, { label: "<30%", color: DR }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 10, color: DTD }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row : clients + QR ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14 }}
        className="lg-grid-cols-2 grid-cols-1">

        {/* Recent clients */}
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{
            padding: "16px 20px", display: "flex", justifyContent: "space-between",
            alignItems: "center", borderBottom: `1px solid ${DL}`,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: DT }}>Derniers clients</h3>
            <Link href="/dashboard/clients"
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: DI, textDecoration: "none" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = DT)}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = DI)}>
              Voir tout <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Skel h={36} w={36} r={18} />
                  <div style={{ flex: 1 }}><Skel h={12} w="60%" r={4} /></div>
                  <Skel h={24} w={56} r={12} />
                </div>
              ))}
            </div>
          ) : recentCustomers.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 6 }}>Aucun client pour le moment</p>
              <p style={{ fontSize: 12, color: DTD, marginBottom: 16 }}>Partagez votre QR code pour attirer vos premiers clients fidèles.</p>
              <Link href="/dashboard/scanner"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  background: DI, color: "#fff", textDecoration: "none",
                }}>
                <ScanLine style={{ width: 14, height: 14 }} /> Scanner maintenant
              </Link>
            </div>
          ) : (
            recentCustomers.map((c, i) => {
              const initials = c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
              const isVip = c.points >= (merchant?.reward_threshold || 10);
              return (
                <div key={c.id}
                  style={{
                    padding: "12px 20px", display: "flex", alignItems: "center", gap: 12,
                    borderBottom: i < recentCustomers.length - 1 ? `1px solid ${DL}` : "none",
                    transition: "background 0.15s", cursor: "default",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 18, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13,
                    background: DIS, color: DI, border: `1px solid ${DIB}`,
                  }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: DT }}>{c.name}</span>
                      {isVip && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                          background: "rgba(245,158,11,0.15)", color: DW, letterSpacing: "0.05em",
                        }}>VIP</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: DTD }}>
                      {formatRel(c.last_visit || c.created_at)} · {c.email || c.phone || "—"}
                    </span>
                  </div>
                  <div style={{
                    padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: DIS, color: DI, border: `1px solid ${DIB}`, flexShrink: 0,
                  }}>
                    {c.points} pts
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* QR Code */}
        <div style={{
          background: DS, border: `1px solid ${DL}`, borderRadius: 16,
          padding: 20, display: "flex", flexDirection: "column", alignItems: "center",
          minWidth: 200, width: 220,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 4, textAlign: "center" }}>Votre QR Code</h3>
          <p style={{ fontSize: 11, color: DTD, marginBottom: 16, textAlign: "center" }}>Affichez-le en caisse</p>
          <div style={{
            width: 160, height: 160, borderRadius: 14, padding: 10,
            background: "#fff", marginBottom: 14, flexShrink: 0,
            boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 8px 24px rgba(99,102,241,0.15)",
          }}>
            {qrSrc && <img src={qrSrc} alt="QR Code" width={140} height={140} style={{ borderRadius: 6 }} />}
          </div>
          <div style={{ display: "flex", gap: 8, width: "100%" }}>
            <button onClick={handleDlQR}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                padding: "8px 0", borderRadius: 10, fontSize: 11, fontWeight: 500, cursor: "pointer",
                background: DIS, border: `1px solid ${DIB}`, color: DI, transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = DIB)}
              onMouseLeave={e => (e.currentTarget.style.background = DIS)}>
              <Download style={{ width: 12, height: 12 }} /> Télécharger
            </button>
            <button onClick={handlePrintQR}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                padding: "8px 0", borderRadius: 10, fontSize: 11, fontWeight: 500, cursor: "pointer",
                background: DS2, border: `1px solid ${DL2}`, color: DTD, transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = DIB; (e.currentTarget as HTMLElement).style.color = DT; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = DL2; (e.currentTarget as HTMLElement).style.color = DTD; }}>
              <Printer style={{ width: 12, height: 12 }} /> Imprimer
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
