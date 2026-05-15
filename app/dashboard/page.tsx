"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users, TrendingUp, Zap, ArrowUpRight, ArrowDownRight,
  Megaphone, Download, Printer, ScanLine, ArrowRight, Info,
  BarChart3, Key, Mail,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from "recharts";
import { useAuth, Merchant } from "@/context/AuthContext";
import api from "@/utils/api";

/* ── Design tokens ───────────────────────────────────────── */
const DS   = "#FFFFFF";
const DS2  = "#F5F3EE";
const DL   = "#E0DDD6";
const DL2  = "#D8D5CE";
const DT   = "#0B0F0E";
const DTD  = "#6B6B6B";
const DTD2 = "rgba(11,15,14,0.35)";
const DG   = "#B8873A";   // gold accent (was green)
const DG2  = "#8B6020";
const DGS  = "rgba(184,135,58,0.10)";
const DGB  = "rgba(184,135,58,0.22)";
const DW   = "#B8873A";
const DR   = "#DC2626";

/* ── Types ───────────────────────────────────────────────── */
interface Customer {
  id: string; name: string; email?: string | null;
  phone?: string | null; points: number;
  last_visit?: string | null; created_at: string;
}
interface Transaction {
  id: string; customer_id: string; points: number; created_at: string;
}
type MerchantWithPlan = Merchant & { plan?: string };

interface SharedProps {
  merchant: MerchantWithPlan | null;
  customers: Customer[];
  transactions: Transaction[];
  loading: boolean;
}

/* ── Sparkline ───────────────────────────────────────────── */
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
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── KPI Card ────────────────────────────────────────────── */
interface KpiProps {
  label: string; value: string; suffix?: string; delta: number;
  sparkData: number[]; color: string; icon: React.ElementType;
  tooltip?: string; delay?: number;
}
function KpiCard({ label, value, suffix, delta, sparkData, color, icon: Icon, tooltip }: KpiProps) {
  const [hov, setHov] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const positive = delta >= 0;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: DS, border: `1px solid ${hov ? DL2 : DL}`, borderRadius: 16,
        padding: "20px 20px 16px", transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hov ? "0 8px 24px rgba(11,15,14,0.06)" : "none",
        cursor: "default", position: "relative",
      }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", background: `${color}18`, color, flexShrink: 0 }}>
          <Icon style={{ width: 16, height: 16 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 600, color: positive ? DG : DR }}>
            {positive ? <ArrowUpRight style={{ width: 13, height: 13 }} /> : <ArrowDownRight style={{ width: 13, height: 13 }} />}
            {Math.abs(delta)}%
          </span>
          {tooltip && (
            <div style={{ position: "relative" }}>
              <Info style={{ width: 13, height: 13, color: DTD2, cursor: "pointer" }}
                onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)} />
              {showTip && (
                <div style={{ position: "absolute", right: 0, bottom: "100%", marginBottom: 6, background: DS, border: `1px solid ${DL2}`, borderRadius: 8, padding: "6px 10px", fontSize: 11, color: DTD, whiteSpace: "nowrap", zIndex: 10, boxShadow: "0 8px 24px rgba(11,15,14,0.08)" }}>
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginBottom: 2 }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: DT, letterSpacing: "-0.03em" }}>{value}</span>
        {suffix && <span style={{ fontSize: 13, color: DTD, marginLeft: 4 }}>{suffix}</span>}
      </div>
      <div style={{ fontSize: 12, color: DTD, marginBottom: 12 }}>{label}</div>
      <Sparkline data={sparkData} color={color} />
      <div style={{ fontSize: 10, color: DTD2, marginTop: 4 }}>7 derniers jours</div>
    </div>
  );
}

/* ── Feature Locked ──────────────────────────────────────── */
function FeatureLocked({ name, requiredPlan }: { name: string; requiredPlan: string }) {
  return (
    <div style={{
      padding: 24, background: DS2,
      border: `1px solid ${DL}`, borderRadius: 16,
      display: "flex", alignItems: "center", gap: 12,
      opacity: 0.7,
    }}>
      <span style={{ fontSize: 20 }}>🔒</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: DT }}>{name}</div>
        <div style={{ fontSize: 12, color: DTD }}>Disponible dans le plan {requiredPlan}</div>
      </div>
      <a href="/dashboard/parametres" style={{ marginLeft: "auto", padding: "6px 12px", background: "#0B0F0E", color: "#FFFFFF", borderRadius: 999, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
        Upgrader →
      </a>
    </div>
  );
}

/* ── Chart Tooltip ───────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: DT, boxShadow: "0 8px 32px rgba(11,15,14,0.08)" }}>
      <p style={{ color: DTD, marginBottom: 6, fontSize: 11 }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name} : {p.value}</p>)}
    </div>
  );
}

/* ── Client Row ──────────────────────────────────────────── */
function ClientRow({ c, i, total, merchant, formatRel }: { c: Customer; i: number; total: number; merchant: MerchantWithPlan | null; formatRel: (s: string) => string }) {
  const initials = c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const isVip = c.points >= (merchant?.reward_threshold || 10);
  return (
    <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: i < total - 1 ? `1px solid ${DL}` : "none", transition: "background 0.15s", cursor: "default" }}
      onMouseEnter={e => (e.currentTarget.style.background = DS2)}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
      <div style={{ width: 36, height: 36, borderRadius: 18, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, background: DGS, color: DG, border: `1px solid ${DGB}` }}>
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: DT }}>{c.name}</span>
          {isVip && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4, background: "rgba(245,158,11,0.15)", color: DW, letterSpacing: "0.05em" }}>VIP</span>}
        </div>
        <span style={{ fontSize: 11, color: DTD }}>{formatRel(c.last_visit || c.created_at)} · {c.email || c.phone || "—"}</span>
      </div>
      <div style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: DGS, color: DG, border: `1px solid ${DGB}`, flexShrink: 0 }}>
        {c.points} pts
      </div>
    </div>
  );
}

/* ── Poster Modal ─────────────────────────────────────────── */
function PosterModal({ merchant, onClose }: { merchant: MerchantWithPlan | null; onClose: () => void }) {
  const [format, setFormat] = useState<"A4" | "A5">("A4");
  const [darkBg, setDarkBg] = useState(false);
  const [customMsg, setCustomMsg] = useState("Scannez et cumulez des points à chaque visite !");
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const joinUrl = `${appUrl}/join/${merchant?.id}`;
  const qrSrc = merchant ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(joinUrl)}&color=${darkBg ? "FFFFFF" : "0B0F0E"}&bgcolor=${darkBg ? "0B0F0E" : "FFFFFF"}` : null;
  const primaryColor = merchant?.primary_color || "#B8873A";
  const businessName = merchant?.business_name || "Mon Commerce";
  const initial = businessName.charAt(0).toUpperCase();

  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><style>
      @page { margin: 0; size: ${format}; }
      body { margin: 0; padding: 0; }
      .poster { width: 100%; min-height: 100vh; background: ${darkBg ? "#0B0F0E" : "#FFFFFF"}; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 40px; box-sizing: border-box; font-family: system-ui, sans-serif; }
      .logo { width: 80px; height: 80px; border-radius: 20px; background: ${primaryColor}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 800; margin-bottom: 32px; }
      h1 { font-size: 32px; font-weight: 700; color: ${darkBg ? "#FFFFFF" : "#0B0F0E"}; text-align: center; margin-bottom: 12px; }
      p { font-size: 16px; color: ${darkBg ? "rgba(255,255,255,0.6)" : "#6B6B6B"}; text-align: center; max-width: 360px; line-height: 1.6; margin-bottom: 40px; }
      .qr-wrap { padding: 20px; background: #FFFFFF; border-radius: 20px; border: 3px solid ${primaryColor}; margin-bottom: 24px; }
      .tagline { font-size: 13px; color: ${darkBg ? "rgba(255,255,255,0.4)" : "#9B9B9B"}; text-align: center; margin-bottom: 40px; }
      footer { border-top: 1px solid ${darkBg ? "rgba(255,255,255,0.1)" : "#E0DDD6"}; padding-top: 20px; font-size: 12px; color: ${darkBg ? "rgba(255,255,255,0.35)" : "#9B9B9B"}; display: flex; align-items: center; gap: 8px; }
    </style></head><body>
    <div class="poster">
      <div class="logo">${initial}</div>
      <h1>Rejoignez notre programme fidélité</h1>
      <p>${customMsg}</p>
      <div class="qr-wrap"><img src="${qrSrc}" width="220" height="220" /></div>
      <div class="tagline">Gratuit · Aucune app à télécharger</div>
      <footer>Propulsé par Fideloo · fideloo.app</footer>
    </div>
    </body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(11,15,14,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div style={{ position: "relative", zIndex: 1, background: DS, border: `1px solid ${DL}`, borderRadius: 20, padding: 28, width: "calc(100% - 48px)", maxWidth: 760, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxHeight: "90vh", overflowY: "auto" }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: DTD, fontSize: 20 }}>✕</button>

        {/* Left — options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: DT }}>Générer une affiche</h3>

          {/* Format toggle */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DTD, marginBottom: 8, display: "block" }}>Format</label>
            <div style={{ display: "flex", gap: 8 }}>
              {(["A4", "A5"] as const).map((f) => (
                <button key={f} onClick={() => setFormat(f)}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1px solid ${format === f ? DGB : DL}`, background: format === f ? DGS : DS2, color: format === f ? DG : DTD }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Background toggle */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DTD, marginBottom: 8, display: "block" }}>Fond</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[{ label: "Blanc", val: false }, { label: "Coloré", val: true }].map(({ label, val }) => (
                <button key={label} onClick={() => setDarkBg(val)}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", border: `1px solid ${darkBg === val ? DGB : DL}`, background: darkBg === val ? DGS : DS2, color: darkBg === val ? DG : DTD }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom message */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: DTD, marginBottom: 8, display: "block" }}>Message personnalisé</label>
            <textarea value={customMsg} onChange={e => setCustomMsg(e.target.value)} rows={3}
              style={{ width: "100%", padding: "10px 12px", background: DS2, border: `1px solid ${DL}`, borderRadius: 10, fontSize: 13, color: DT, outline: "none", resize: "none", boxSizing: "border-box" }} />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={handlePrint}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0", background: DT, color: DS, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <Download style={{ width: 15, height: 15 }} /> Télécharger / Imprimer
            </button>
          </div>
        </div>

        {/* Right — preview */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: DTD, marginBottom: 8, display: "block" }}>Aperçu</label>
          <div style={{ background: darkBg ? "#0B0F0E" : "#FFFFFF", border: `1px solid ${DL}`, borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minHeight: 360 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: primaryColor, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>{initial}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: darkBg ? "#FFFFFF" : "#0B0F0E", textAlign: "center" }}>
              Rejoignez notre programme fidélité
            </div>
            <div style={{ fontSize: 12, color: darkBg ? "rgba(255,255,255,0.5)" : "#6B6B6B", textAlign: "center", maxWidth: 220, lineHeight: 1.5 }}>{customMsg}</div>
            {qrSrc && (
              <div style={{ padding: 12, background: "#FFFFFF", borderRadius: 12, border: `2px solid ${primaryColor}` }}>
                <img src={qrSrc} alt="QR" width={120} height={120} />
              </div>
            )}
            <div style={{ fontSize: 11, color: darkBg ? "rgba(255,255,255,0.35)" : "#9B9B9B" }}>Gratuit · Aucune app à télécharger</div>
            <div style={{ fontSize: 10, color: darkBg ? "rgba(255,255,255,0.2)" : "#C0BDB6", marginTop: "auto" }}>Propulsé par Fideloo</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── QR Block ────────────────────────────────────────────── */
function QRBlock({ merchant, showPrint = false }: { merchant: MerchantWithPlan | null; showPrint?: boolean }) {
  const appUrl = typeof window !== "undefined" ? window.location.origin : "";
  const joinUrl = `${appUrl}/join/${merchant?.id}`;
  const qrSrc = merchant
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(joinUrl)}&color=B8873A&bgcolor=FFFFFF`
    : null;
  const [showPoster, setShowPoster] = useState(false);

  const handleDl = () => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(joinUrl)}&color=B8873A&bgcolor=FFFFFF`;
    const a = document.createElement("a"); a.href = url; a.download = "fideloo-qr.png"; a.click();
  };
  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><body style="background:#FFFFFF;display:flex;justify-content:center;align-items:center;height:100vh;margin:0"><img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(joinUrl)}&color=B8873A&bgcolor=FFFFFF"/></body></html>`);
    w.document.close(); w.print();
  };

  return (
    <>
      {showPoster && <PosterModal merchant={merchant} onClose={() => setShowPoster(false)} />}
      <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 200, width: 220 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 4, textAlign: "center" }}>Votre QR Code</h3>
        <p style={{ fontSize: 11, color: DTD, marginBottom: 16, textAlign: "center" }}>Affichez-le en caisse</p>
        <div style={{ width: 160, height: 160, borderRadius: 14, padding: 10, background: "#fff", marginBottom: 14, flexShrink: 0, boxShadow: `0 0 0 1px ${DL}, 0 8px 24px rgba(11,15,14,0.06)` }}>
          {qrSrc && <img src={qrSrc} alt="QR Code" width={140} height={140} style={{ borderRadius: 6 }} />}
        </div>
        <div style={{ display: "flex", gap: 8, width: "100%", flexWrap: "wrap" }}>
          <button onClick={handleDl}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 0", borderRadius: 10, fontSize: 11, fontWeight: 500, cursor: "pointer", background: DGS, border: `1px solid ${DGB}`, color: DG, transition: "all 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.background = DGB)}
            onMouseLeave={e => (e.currentTarget.style.background = DGS)}>
            <Download style={{ width: 12, height: 12 }} /> Télécharger
          </button>
          {showPrint && (
            <button onClick={handlePrint}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 0", borderRadius: 10, fontSize: 11, fontWeight: 500, cursor: "pointer", background: DS2, border: `1px solid ${DL2}`, color: DTD, transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = DGB; (e.currentTarget as HTMLElement).style.color = DT; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = DL2; (e.currentTarget as HTMLElement).style.color = DTD; }}>
              <Printer style={{ width: 12, height: 12 }} /> Imprimer
            </button>
          )}
        </div>
        <button onClick={() => setShowPoster(true)}
          style={{ width: "100%", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "8px 0", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: "pointer", background: DT, border: "none", color: DS, transition: "opacity 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
          🖨️ Générer une affiche
        </button>
      </div>
    </>
  );
}

/* ── Skeleton ────────────────────────────────────────────── */
const Skel = ({ h = 20, w = "100%" }: { h?: number; w?: number | string }) => (
  <div style={{ height: h, width: w, borderRadius: 8, background: "rgba(0,0,0,0.06)" }} />
);

/* ══════════════════════════════════════════════════════════
   DASHBOARD STANDARD
══════════════════════════════════════════════════════════ */
function DashboardStandard({ merchant, customers, transactions, loading }: SharedProps) {
  const now = new Date();
  const CLIENT_LIMIT = 1500;
  const txPos = transactions.filter(tx => tx.points > 0);
  const totalClients = customers.length;
  const pointsDistributed = txPos.reduce((s, tx) => s + tx.points, 0);
  const isNearLimit = totalClients >= 1350;
  const progressPct = Math.min((totalClients / CLIENT_LIMIT) * 100, 100);

  const recentCustomers = useMemo(() =>
    [...customers].sort((a, b) => new Date(b.last_visit || b.created_at).getTime() - new Date(a.last_visit || a.created_at).getTime()).slice(0, 5)
  , [customers]);

  const formatRel = (dateStr: string) => {
    const diff = (now.getTime() - new Date(dateStr).getTime()) / 1000;
    if (diff < 3600) return `${Math.round(diff / 60)}min`;
    if (diff < 86400) return `${Math.round(diff / 3600)}h`;
    if (diff < 172800) return "Hier";
    return `${Math.round(diff / 86400)}j`;
  };

  const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0); return d;
  }), []);

  const sparkClients = useMemo(() => last7.map(d => {
    const next = new Date(d); next.setDate(next.getDate() + 1);
    return customers.filter(c => { const cd = new Date(c.created_at); return cd >= d && cd < next; }).length;
  }), [customers, last7]);

  const sparkPoints = useMemo(() => last7.map(d => {
    const next = new Date(d); next.setDate(next.getDate() + 1);
    return txPos.filter(tx => { const td = new Date(tx.created_at); return td >= d && td < next; }).reduce((s, tx) => s + tx.points, 0);
  }), [txPos, last7]);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: DTD, marginBottom: 4 }}>
            {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: DT, letterSpacing: "-0.03em", fontFamily: "Playfair Display, serif" }}>
            Bonjour, {merchant?.business_name} 👋
          </h1>
        </div>
        <Link href="/dashboard/scanner"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: "#0B0F0E", color: "#FFFFFF", textDecoration: "none" }}>
          <ScanLine style={{ width: 15, height: 15 }} /> Scanner un client
        </Link>
      </div>

      {/* 2 KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginBottom: 16 }}>
        <KpiCard label="Total clients" value={loading ? "—" : totalClients.toLocaleString("fr-FR")}
          delta={5} sparkData={sparkClients} color={DG} icon={Users} tooltip="Clients inscrits via votre QR code" />
        <KpiCard label="Points distribués" value={loading ? "—" : pointsDistributed.toLocaleString("fr-FR")}
          delta={8} sparkData={sparkPoints} color="#8B5CF6" icon={Zap} tooltip="Total des points validés" />
      </div>

      {/* Barre de progression clients */}
      <div style={{ background: DS, border: `1px solid ${isNearLimit ? "rgba(220,38,38,0.3)" : DL}`, borderRadius: 14, padding: "16px 20px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: DT }}>Clients utilisés — Plan Standard</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: isNearLimit ? DR : DG }}>{totalClients} / {CLIENT_LIMIT}</span>
        </div>
        <div style={{ height: 8, background: "rgba(0,0,0,0.06)", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progressPct}%`, background: isNearLimit ? DR : DG, borderRadius: 999, transition: "width 0.5s ease" }} />
        </div>
        {isNearLimit ? (
          <p style={{ fontSize: 12, color: DR, marginTop: 8 }}>⚠️ Vous approchez de la limite. Passez au Pro pour des clients illimités.</p>
        ) : (
          <p style={{ fontSize: 11, color: DTD, marginTop: 6 }}>{CLIENT_LIMIT - totalClients} emplacements restants</p>
        )}
      </div>

      {/* Fonctionnalités verrouillées */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        <FeatureLocked name="Analytics avancés — graphiques, rétention, entonnoir de conversion" requiredPlan="Pro" />
        <FeatureLocked name="Notifications push — campagnes ciblées vers vos clients" requiredPlan="Pro" />
      </div>

      {/* Derniers clients + QR */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14, marginBottom: 14 }}>
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${DL}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: DT }}>Derniers clients</h3>
            <Link href="/dashboard/clients" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: DG, textDecoration: "none" }}>
              Voir tout <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          {loading ? (
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Skel h={36} w={36} /> <div style={{ flex: 1 }}><Skel h={12} w="60%" /></div> <Skel h={24} w={56} />
                </div>
              ))}
            </div>
          ) : recentCustomers.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 6 }}>Aucun client pour le moment</p>
              <p style={{ fontSize: 12, color: DTD }}>Partagez votre QR code pour attirer vos premiers clients.</p>
            </div>
          ) : (
            recentCustomers.map((c, i) => (
              <ClientRow key={c.id} c={c} i={i} total={recentCustomers.length} merchant={merchant} formatRel={formatRel} />
            ))
          )}
        </div>
        <QRBlock merchant={merchant} showPrint={false} />
      </div>

      {/* Bandeau d'upgrade */}
      <div style={{ padding: "18px 24px", background: DGS, border: `1px solid ${DGB}`, borderRadius: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: DT, marginBottom: 4 }}>Passez au plan Pro</div>
          <div style={{ fontSize: 13, color: DTD }}>Débloquez les analytics, les campagnes push, l&apos;export CSV, les clients illimités et bien plus →</div>
        </div>
        <a href="/dashboard/parametres"
          style={{ padding: "10px 20px", background: "#0B0F0E", color: "#FFFFFF", borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
          Voir le plan Pro
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD PRO
══════════════════════════════════════════════════════════ */
function DashboardPro({ merchant, customers, transactions, loading }: SharedProps) {
  const now = new Date();
  const startOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevM  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevM    = new Date(now.getFullYear(), now.getMonth(), 0);

  const txPos           = transactions.filter(tx => tx.points > 0);
  const totalClients    = customers.length;
  const visitsThisMonth = txPos.filter(tx => new Date(tx.created_at) >= startOfMonth).length;
  const visitsPrevMonth = txPos.filter(tx => { const d = new Date(tx.created_at); return d >= startOfPrevM && d <= endOfPrevM; }).length;
  const clientsThisMonth = customers.filter(c => new Date(c.created_at) >= startOfMonth).length;
  const clientsPrevMonth  = customers.filter(c => { const d = new Date(c.created_at); return d >= startOfPrevM && d <= endOfPrevM; }).length;
  const returnClients   = customers.filter(c => txPos.filter(tx => tx.customer_id === c.id).length >= 2).length;
  const returnRate      = totalClients > 0 ? Math.round((returnClients / totalClients) * 100) : 0;
  const rewardsUsed     = transactions.filter(tx => tx.points < 0).length;

  const deltaClients = clientsPrevMonth > 0 ? Math.round(((clientsThisMonth - clientsPrevMonth) / clientsPrevMonth) * 100) : clientsThisMonth > 0 ? 100 : 0;
  const deltaVisits  = visitsPrevMonth > 0 ? Math.round(((visitsThisMonth - visitsPrevMonth) / visitsPrevMonth) * 100) : 0;

  const formatRel = (dateStr: string) => {
    const diff = (now.getTime() - new Date(dateStr).getTime()) / 1000;
    if (diff < 3600) return `${Math.round(diff / 60)}min`;
    if (diff < 86400) return `${Math.round(diff / 3600)}h`;
    if (diff < 172800) return "Hier";
    return `${Math.round(diff / 86400)}j`;
  };

  const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0); return d;
  }), []);

  const sparkClients  = useMemo(() => last7.map(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return customers.filter(c => { const cd = new Date(c.created_at); return cd >= d && cd < n; }).length; }), [customers, last7]);
  const sparkVisits   = useMemo(() => last7.map(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return txPos.filter(tx => { const td = new Date(tx.created_at); return td >= d && td < n; }).length; }), [txPos, last7]);
  const sparkReturn   = useMemo(() => last7.map((_, i) => Math.max(0, returnRate - 8 + i * 1.5)), [returnRate, last7]);
  const sparkRewards  = useMemo(() => last7.map(() => Math.max(0, rewardsUsed * 0.12 + Math.random() * 0.5)), [rewardsUsed]);

  const chartData = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i)); d.setHours(0, 0, 0, 0);
    const next = new Date(d); next.setDate(next.getDate() + 1);
    const label = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    return {
      date: label,
      "Nouveaux clients": customers.filter(c => { const cd = new Date(c.created_at); return cd >= d && cd < next; }).length,
      "Visites": txPos.filter(tx => { const td = new Date(tx.created_at); return td >= d && td < next; }).length,
    };
  }), [customers, txPos]);

  const topClients = useMemo(() =>
    [...customers].sort((a, b) => txPos.filter(tx => tx.customer_id === b.id).length - txPos.filter(tx => tx.customer_id === a.id).length).slice(0, 10)
  , [customers, txPos]);

  const recentCustomers = useMemo(() =>
    [...customers].sort((a, b) => new Date(b.last_visit || b.created_at).getTime() - new Date(a.last_visit || a.created_at).getTime()).slice(0, 5)
  , [customers]);

  const handleExportCSV = () => {
    const rows: (string | number)[][] = [["Nom", "Email", "Points", "Téléphone", "Dernière visite"]];
    customers.forEach(c => rows.push([c.name, c.email || "", c.points, c.phone || "", c.last_visit ? new Date(c.last_visit).toLocaleDateString("fr-FR") : "Jamais"]));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "clients-fideloo.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: DTD, marginBottom: 4 }}>
            {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: DT, letterSpacing: "-0.03em", fontFamily: "Playfair Display, serif" }}>
              Bonjour, {merchant?.business_name}
            </h1>
            <span style={{ padding: "3px 10px", background: DGS, border: `1px solid ${DGB}`, borderRadius: 999, fontSize: 12, fontWeight: 700, color: DG }}>Pro ✦</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={handleExportCSV}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: DS2, border: `1px solid ${DL}`, color: DT, cursor: "pointer" }}>
            <Download style={{ width: 15, height: 15 }} /> Export CSV
          </button>
          <Link href="/dashboard/notifications"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: DS2, border: `1px solid ${DL}`, color: DT, textDecoration: "none" }}>
            <Megaphone style={{ width: 15, height: 15 }} /> Campagne push
          </Link>
          <Link href="/dashboard/scanner"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: "#0B0F0E", color: "#FFFFFF", textDecoration: "none" }}>
            <ScanLine style={{ width: 15, height: 15 }} /> Scanner
          </Link>
        </div>
      </div>

      {/* 4 KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <KpiCard label="Clients actifs" value={loading ? "—" : totalClients.toLocaleString("fr-FR")} delta={deltaClients} sparkData={sparkClients} color={DG} icon={Users} tooltip="Total clients inscrits" />
        <KpiCard label="Visites ce mois" value={loading ? "—" : visitsThisMonth.toLocaleString("fr-FR")} delta={deltaVisits} sparkData={sparkVisits} color="#8B5CF6" icon={BarChart3} tooltip="Passages en caisse avec points" />
        <KpiCard label="Récompenses" value={loading ? "—" : rewardsUsed.toLocaleString("fr-FR")} delta={4} sparkData={sparkRewards} color={DW} icon={Zap} tooltip="Récompenses débloquées" />
        <KpiCard label="Taux de retour" value={loading ? "—" : `${returnRate}`} suffix="%" delta={returnRate - Math.max(0, returnRate - 3)} sparkData={sparkReturn} color="#EC4899" icon={TrendingUp} tooltip="% clients avec 2+ visites" />
      </div>

      {/* Graphique + Top clients */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 14 }}>
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 2 }}>Évolution — 30 jours</h3>
              <p style={{ fontSize: 11, color: DTD }}>Nouveaux clients et visites</p>
            </div>
            <Link href="/dashboard/analytiques" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: DG, textDecoration: "none" }}>
              Analytiques <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            {[{ label: "Nouveaux clients", color: DG }, { label: "Visites", color: "#8B5CF6" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 24, height: 2, borderRadius: 1, background: l.color }} />
                <span style={{ fontSize: 11, color: DTD }}>{l.label}</span>
              </div>
            ))}
          </div>
          {loading ? <Skel h={200} /> : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradG2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={DG}       stopOpacity={0.25} />
                    <stop offset="95%" stopColor={DG}       stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradV2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.20} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={DL} vertical={false} />
                <XAxis dataKey="date" tick={{ fill: DTD, fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
                <YAxis tick={{ fill: DTD, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: DL2, strokeWidth: 1 }} />
                <Area type="monotone" dataKey="Nouveaux clients" stroke={DG} strokeWidth={2} fill="url(#gradG2)" dot={false} activeDot={{ r: 4, fill: DG, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="Visites" stroke="#8B5CF6" strokeWidth={2} fill="url(#gradV2)" dot={false} activeDot={{ r: 4, fill: "#8B5CF6", strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top 10 clients */}
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${DL}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: DT }}>Top clients</h3>
            <Link href="/dashboard/clients" style={{ fontSize: 12, color: DG, textDecoration: "none" }}>Voir tout</Link>
          </div>
          <div style={{ maxHeight: 280, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                {[1, 2, 3, 4, 5].map(i => <Skel key={i} h={24} />)}
              </div>
            ) : topClients.length === 0 ? (
              <div style={{ padding: "24px 20px", textAlign: "center", color: DTD, fontSize: 13 }}>Aucun client encore</div>
            ) : topClients.map((c, i) => {
              const visits = txPos.filter(tx => tx.customer_id === c.id).length;
              const initials = c.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={c.id} style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: i < topClients.length - 1 ? `1px solid ${DL}` : "none" }}>
                  <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{medals[i] || `${i + 1}`}</span>
                  <div style={{ width: 28, height: 28, borderRadius: 14, background: DGS, color: DG, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                  <span style={{ flex: 1, fontSize: 12, color: DT }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: DTD }}>{visits} visites</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: DG, padding: "2px 8px", background: DGS, borderRadius: 999 }}>{c.points} pts</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Derniers clients + QR */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14, marginBottom: 14 }}>
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${DL}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: DT }}>Derniers clients</h3>
            <Link href="/dashboard/clients" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: DG, textDecoration: "none" }}>
              Voir tout <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          {loading ? (
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Skel h={36} w={36} /> <div style={{ flex: 1 }}><Skel h={12} w="60%" /></div> <Skel h={24} w={56} />
                </div>
              ))}
            </div>
          ) : recentCustomers.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 6 }}>Aucun client pour le moment</p>
              <Link href="/dashboard/scanner" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "#0B0F0E", color: "#FFFFFF", textDecoration: "none" }}>
                <ScanLine style={{ width: 14, height: 14 }} /> Scanner maintenant
              </Link>
            </div>
          ) : recentCustomers.map((c, i) => (
            <ClientRow key={c.id} c={c} i={i} total={recentCustomers.length} merchant={merchant} formatRel={formatRel} />
          ))}
        </div>
        <QRBlock merchant={merchant} showPrint />
      </div>

      {/* Fonctionnalité verrouillée Business */}
      <FeatureLocked name="Mini-jeu avis Google — boostez vos évaluations (×3 avis)" requiredPlan="Business" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD BUSINESS
══════════════════════════════════════════════════════════ */
function DashboardBusiness({ merchant, customers, transactions, loading }: SharedProps) {
  const [selectedSite, setSelectedSite] = useState("all");
  const now = new Date();
  const startOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevM  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevM    = new Date(now.getFullYear(), now.getMonth(), 0);

  const txPos           = transactions.filter(tx => tx.points > 0);
  const totalClients    = customers.length;
  const visitsThisMonth = txPos.filter(tx => new Date(tx.created_at) >= startOfMonth).length;
  const visitsPrevMonth = txPos.filter(tx => { const d = new Date(tx.created_at); return d >= startOfPrevM && d <= endOfPrevM; }).length;
  const clientsThisMonth = customers.filter(c => new Date(c.created_at) >= startOfMonth).length;
  const clientsPrevMonth  = customers.filter(c => { const d = new Date(c.created_at); return d >= startOfPrevM && d <= endOfPrevM; }).length;
  const returnClients   = customers.filter(c => txPos.filter(tx => tx.customer_id === c.id).length >= 2).length;
  const returnRate      = totalClients > 0 ? Math.round((returnClients / totalClients) * 100) : 0;
  const rewardsUsed     = transactions.filter(tx => tx.points < 0).length;
  const pointsTotal     = txPos.reduce((s, tx) => s + tx.points, 0);

  const deltaClients = clientsPrevMonth > 0 ? Math.round(((clientsThisMonth - clientsPrevMonth) / clientsPrevMonth) * 100) : clientsThisMonth > 0 ? 100 : 0;
  const deltaVisits  = visitsPrevMonth > 0 ? Math.round(((visitsThisMonth - visitsPrevMonth) / visitsPrevMonth) * 100) : 0;

  const formatRel = (dateStr: string) => {
    const diff = (now.getTime() - new Date(dateStr).getTime()) / 1000;
    if (diff < 3600) return `${Math.round(diff / 60)}min`;
    if (diff < 86400) return `${Math.round(diff / 3600)}h`;
    if (diff < 172800) return "Hier";
    return `${Math.round(diff / 86400)}j`;
  };

  const last7 = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0); return d;
  }), []);

  const sparkClients  = useMemo(() => last7.map(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return customers.filter(c => { const cd = new Date(c.created_at); return cd >= d && cd < n; }).length; }), [customers, last7]);
  const sparkVisits   = useMemo(() => last7.map(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return txPos.filter(tx => { const td = new Date(tx.created_at); return td >= d && td < n; }).length; }), [txPos, last7]);
  const sparkReturn   = useMemo(() => last7.map((_, i) => Math.max(0, returnRate - 8 + i * 1.5)), [returnRate, last7]);
  const sparkRewards  = useMemo(() => last7.map(() => Math.max(0, rewardsUsed * 0.12 + Math.random() * 0.5)), [rewardsUsed]);

  const chartData = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i)); d.setHours(0, 0, 0, 0);
    const next = new Date(d); next.setDate(next.getDate() + 1);
    return {
      date: d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      "Nouveaux clients": customers.filter(c => { const cd = new Date(c.created_at); return cd >= d && cd < next; }).length,
      "Visites": txPos.filter(tx => { const td = new Date(tx.created_at); return td >= d && td < next; }).length,
    };
  }), [customers, txPos]);

  const recentCustomers = useMemo(() =>
    [...customers].sort((a, b) => new Date(b.last_visit || b.created_at).getTime() - new Date(a.last_visit || a.created_at).getTime()).slice(0, 5)
  , [customers]);

  const apiKey = merchant?.id ? `fideloo_${merchant.id.slice(0, 8)}_live` : "fideloo_demo_live";
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(apiKey); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleExportCSV = () => {
    const rows: (string | number)[][] = [["Nom", "Email", "Points", "Téléphone", "Dernière visite"]];
    customers.forEach(c => rows.push([c.name, c.email || "", c.points, c.phone || "", c.last_visit ? new Date(c.last_visit).toLocaleDateString("fr-FR") : "Jamais"]));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "clients-fideloo.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <p style={{ fontSize: 12, color: DTD, marginBottom: 4 }}>
            {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 700, color: DT, letterSpacing: "-0.03em", fontFamily: "Playfair Display, serif" }}>
              Bonjour, {merchant?.business_name}
            </h1>
            <span style={{ padding: "3px 10px", background: DGS, border: `1px solid ${DGB}`, borderRadius: 999, fontSize: 12, fontWeight: 700, color: DG }}>Business ★</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <select value={selectedSite} onChange={e => setSelectedSite(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 12, fontSize: 13, background: DS2, border: `1px solid ${DL}`, color: DT, cursor: "pointer" }}>
            <option value="all">Tous les commerces</option>
            <option value={merchant?.id || ""}>{merchant?.business_name}</option>
          </select>
          <button onClick={handleExportCSV}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: DS2, border: `1px solid ${DL}`, color: DT, cursor: "pointer" }}>
            <Download style={{ width: 15, height: 15 }} /> Export CSV
          </button>
          <Link href="/dashboard/notifications"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: DS2, border: `1px solid ${DL}`, color: DT, textDecoration: "none" }}>
            <Megaphone style={{ width: 15, height: 15 }} /> Campagnes
          </Link>
          <Link href="/dashboard/scanner"
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: "#0B0F0E", color: "#FFFFFF", textDecoration: "none" }}>
            <ScanLine style={{ width: 15, height: 15 }} /> Scanner
          </Link>
        </div>
      </div>

      {/* Stats consolidées */}
      <div style={{ padding: "12px 20px", background: DS2, border: `1px solid ${DL}`, borderRadius: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: DG, flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: DTD, fontFamily: "monospace" }}>CONSOLIDÉ · Tous les établissements</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: DG, fontWeight: 600 }}>{totalClients.toLocaleString("fr-FR")} clients · {pointsTotal.toLocaleString("fr-FR")} pts distribués</span>
      </div>

      {/* 4 KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <KpiCard label="Clients actifs" value={loading ? "—" : totalClients.toLocaleString("fr-FR")} delta={deltaClients} sparkData={sparkClients} color={DG} icon={Users} tooltip="Total clients — tous commerces" />
        <KpiCard label="Visites ce mois" value={loading ? "—" : visitsThisMonth.toLocaleString("fr-FR")} delta={deltaVisits} sparkData={sparkVisits} color="#8B5CF6" icon={BarChart3} tooltip="Passages en caisse avec points" />
        <KpiCard label="Récompenses" value={loading ? "—" : rewardsUsed.toLocaleString("fr-FR")} delta={4} sparkData={sparkRewards} color={DW} icon={Zap} tooltip="Récompenses débloquées" />
        <KpiCard label="Taux de retour" value={loading ? "—" : `${returnRate}`} suffix="%" delta={returnRate - Math.max(0, returnRate - 3)} sparkData={sparkReturn} color="#EC4899" icon={TrendingUp} tooltip="% clients avec 2+ visites" />
      </div>

      {/* Graphique */}
      <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, padding: "20px 20px 12px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: DT, marginBottom: 2 }}>Évolution consolidée — 30 jours</h3>
            <p style={{ fontSize: 11, color: DTD }}>Tous établissements confondus</p>
          </div>
          <Link href="/dashboard/analytiques" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: DG, textDecoration: "none" }}>
            Analytiques <ArrowRight style={{ width: 12, height: 12 }} />
          </Link>
        </div>
        {loading ? <Skel h={180} /> : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gradGB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={DG}       stopOpacity={0.25} />
                  <stop offset="95%" stopColor={DG}       stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradVB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={DL} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: DTD, fontSize: 10 }} axisLine={false} tickLine={false} interval={6} />
              <YAxis tick={{ fill: DTD, fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: DL2, strokeWidth: 1 }} />
              <Area type="monotone" dataKey="Nouveaux clients" stroke={DG} strokeWidth={2} fill="url(#gradGB)" dot={false} activeDot={{ r: 4, fill: DG, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="Visites" stroke="#8B5CF6" strokeWidth={2} fill="url(#gradVB)" dot={false} activeDot={{ r: 4, fill: "#8B5CF6", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Mini-jeu + API row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

        {/* Mini-jeu avis Google */}
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🎰</span>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: DT }}>Mini-jeu · Avis Google</h3>
              <p style={{ fontSize: 11, color: DTD }}>Boostez vos évaluations</p>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 11, padding: "3px 10px", background: DGS, color: DG, borderRadius: 999, border: `1px solid ${DGB}` }}>+3× avis</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
            {[{ label: "Parties jouées", value: "342" }, { label: "Avis déposés", value: "289" }, { label: "Taux conv.", value: "84%" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "12px 8px", background: DS2, borderRadius: 10, border: `1px solid ${DL}` }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: i === 2 ? DG : DT }}>{s.value}</div>
                <div style={{ fontSize: 11, color: DTD, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "84%", background: DG, borderRadius: 999 }} />
          </div>
          <p style={{ fontSize: 11, color: DTD, marginTop: 6 }}>84% des joueurs laissent un avis Google</p>
        </div>

        {/* API & Webhooks */}
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Key style={{ width: 16, height: 16, color: DG }} />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: DT }}>API & Webhooks</h3>
          </div>
          <p style={{ fontSize: 11, color: DTD, marginBottom: 8 }}>Votre clé API</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <code style={{ flex: 1, padding: "8px 12px", background: DS2, border: `1px solid ${DL}`, borderRadius: 8, fontSize: 11, color: DG, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {apiKey}
            </code>
            <button onClick={handleCopy}
              style={{ padding: "8px 14px", background: DGS, border: `1px solid ${DGB}`, borderRadius: 8, fontSize: 11, color: DG, cursor: "pointer", flexShrink: 0, fontWeight: 600 }}>
              {copied ? "✓ Copié" : "Copier"}
            </button>
          </div>
          <div style={{ padding: "10px 14px", background: DS2, borderRadius: 10, border: `1px solid ${DL}`, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: DG, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: DTD }}>Webhook · Actif</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: DG, fontFamily: "monospace" }}>99.9% uptime</span>
            </div>
          </div>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: DG, textDecoration: "none" }}>
            Documentation API <ArrowRight style={{ width: 12, height: 12 }} />
          </a>
        </div>
      </div>

      {/* Account manager */}
      <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, padding: 20, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: DGS, border: `1px solid ${DGB}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👤</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: DT, marginBottom: 2 }}>Votre Account Manager</p>
            <p style={{ fontSize: 12, color: DTD }}>Sophie Martin · Disponible du lun. au ven., 9h–18h</p>
          </div>
          <a href="mailto:support@fideloo.fr"
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: DGS, border: `1px solid ${DGB}`, borderRadius: 10, fontSize: 12, color: DG, textDecoration: "none", fontWeight: 600, flexShrink: 0 }}>
            <Mail style={{ width: 13, height: 13 }} /> Contacter
          </a>
        </div>
      </div>

      {/* Derniers clients + QR */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 14 }}>
        <div style={{ background: DS, border: `1px solid ${DL}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${DL}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: DT }}>Derniers clients</h3>
            <Link href="/dashboard/clients" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: DG, textDecoration: "none" }}>
              Voir tout <ArrowRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          {loading ? (
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Skel h={36} w={36} /> <div style={{ flex: 1 }}><Skel h={12} w="60%" /></div> <Skel h={24} w={56} />
                </div>
              ))}
            </div>
          ) : recentCustomers.map((c, i) => (
            <ClientRow key={c.id} c={c} i={i} total={recentCustomers.length} merchant={merchant} formatRel={formatRel} />
          ))}
        </div>
        <QRBlock merchant={merchant} showPrint />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════ */
export default function DashboardHome() {
  const { merchant } = useAuth();
  const plan = (merchant as MerchantWithPlan)?.plan || "standard";

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

  const props: SharedProps = { merchant: merchant as MerchantWithPlan, customers, transactions, loading };

  return (
    <>
      {plan === "standard" && <DashboardStandard {...props} />}
      {plan === "pro"      && <DashboardPro      {...props} />}
      {plan === "business" && <DashboardBusiness {...props} />}
      {!["standard", "pro", "business"].includes(plan) && <DashboardStandard {...props} />}
    </>
  );
}
