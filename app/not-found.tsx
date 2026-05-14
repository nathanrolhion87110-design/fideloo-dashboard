"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const GOLD = "#B8873A";
const BG   = "#0B0F0E";

function DieFace() {
  const [val, setVal] = useState(4);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setRolling(true);
      let count = 0;
      const iv = setInterval(() => {
        setVal(Math.ceil(Math.random() * 6));
        count++;
        if (count >= 10) { clearInterval(iv); setRolling(false); }
      }, 120);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  const dotMap: Record<number, [number, number][]> = {
    1: [[40, 40]],
    2: [[22, 22], [58, 58]],
    3: [[22, 22], [40, 40], [58, 58]],
    4: [[22, 22], [58, 22], [22, 58], [58, 58]],
    5: [[22, 22], [58, 22], [40, 40], [22, 58], [58, 58]],
    6: [[22, 18], [58, 18], [22, 40], [58, 40], [22, 62], [58, 62]],
  };
  const dots = dotMap[val] ?? [];

  return (
    <svg
      width="72" height="72" viewBox="0 0 80 80" fill="none"
      style={{
        animation: rolling ? "dieSpin 0.12s infinite" : "dieBounce 2.4s ease-in-out infinite",
        filter: "drop-shadow(0 4px 20px rgba(184,135,58,0.35))",
      }}>
      <rect width="80" height="80" rx="14" fill="#1A1A1A" stroke={GOLD} strokeWidth="1.5" />
      {dots.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="6" fill={GOLD} />)}
    </svg>
  );
}

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", background: BG,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", position: "relative", overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "10%", left: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,135,58,0.08) 0%, transparent 70%)", animation: "orb1 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,135,58,0.06) 0%, transparent 70%)", animation: "orb2 10s ease-in-out infinite" }} />
      </div>

      <div style={{ marginBottom: 32, position: "relative", zIndex: 1 }}>
        <DieFace />
      </div>

      <div style={{
        fontSize: "clamp(80px, 15vw, 160px)", fontWeight: 800, lineHeight: 1,
        background: `linear-gradient(135deg, ${GOLD} 0%, #E8A84E 50%, ${GOLD} 100%)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text", letterSpacing: "-4px", marginBottom: 24,
        fontFamily: "var(--font-sora, Geist, system-ui)",
        position: "relative", zIndex: 1,
      }}>
        404
      </div>

      <h1 style={{
        fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "#FFFFFF",
        marginBottom: 12, textAlign: "center",
        fontFamily: "var(--font-playfair, Georgia, serif)",
        position: "relative", zIndex: 1,
      }}>
        Cette page n&apos;existe pas
      </h1>
      <p style={{
        fontSize: 16, color: "#6B6B6B", marginBottom: 48, textAlign: "center",
        maxWidth: 400, lineHeight: 1.6, position: "relative", zIndex: 1,
      }}>
        Vous vous êtes perdu ? Pas de panique.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <Link href="/" style={{
          padding: "12px 28px", background: GOLD, color: BG, borderRadius: 999,
          fontSize: 15, fontWeight: 700, textDecoration: "none",
          fontFamily: "var(--font-sora, system-ui)",
        }}>
          ← Retour à l&apos;accueil
        </Link>
        <Link href="/dashboard" style={{
          padding: "12px 28px", background: "transparent", color: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999,
          fontSize: 15, fontWeight: 600, textDecoration: "none",
          fontFamily: "var(--font-sora, system-ui)",
        }}>
          Accéder au dashboard
        </Link>
      </div>

      <style>{`
        @keyframes dieSpin {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes dieBounce {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, 30px) scale(1.1); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -40px) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
