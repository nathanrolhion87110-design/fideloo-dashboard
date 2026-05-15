"use client";

import { useState } from "react";
import { Bell, Gift, Star } from "lucide-react";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";
const CARD = "#FFFFFF";

interface AutoCard {
  icon: React.ElementType;
  title: string;
  desc: string;
  hasDelay?: boolean;
}

const CARDS: AutoCard[] = [
  {
    icon: Bell,
    title: "Rappel client inactif",
    desc: "Envoie automatiquement une notification push aux clients qui n'ont pas visité depuis X jours.",
    hasDelay: true,
  },
  {
    icon: Gift,
    title: "Message d'anniversaire",
    desc: "Souhaite l'anniversaire de vos clients avec une offre personnalisée.",
  },
  {
    icon: Star,
    title: "Alerte récompense proche",
    desc: "Notifie le client quand il est à 2 points de sa récompense.",
  },
];

function AutomationCard({ card }: { card: AutoCard }) {
  const [enabled, setEnabled] = useState(false);
  const [delay, setDelay] = useState(30);
  const Icon = card.icon;

  return (
    <div style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(184,135,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon size={20} color={GOLD} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 4 }}>{card.title}</div>
            <div style={{ fontSize: 13, color: GRAY, lineHeight: 1.5 }}>{card.desc}</div>
          </div>
        </div>
        {/* Toggle */}
        <button
          onClick={() => setEnabled(v => !v)}
          style={{
            width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", flexShrink: 0,
            background: enabled ? GOLD : BORD, position: "relative", transition: "background 0.2s",
          }}>
          <span style={{
            position: "absolute", top: 3, left: enabled ? 23 : 3, width: 18, height: 18,
            borderRadius: "50%", background: "#FFFFFF", transition: "left 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }} />
        </button>
      </div>

      {enabled && card.hasDelay && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${BORD}` }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: INK, marginBottom: 8 }}>Délai en jours</label>
          <input
            type="number" min={1} max={365} value={delay}
            onChange={e => setDelay(Math.max(1, Number(e.target.value)))}
            style={{ width: 100, padding: "8px 12px", background: "#F5F3EE", border: `1px solid ${BORD}`, borderRadius: 8, fontSize: 14, color: INK, outline: "none" }}
          />
        </div>
      )}
    </div>
  );
}

export default function AutomationsPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
          Automations <em style={{ fontStyle: "italic", fontWeight: 400 }}>intelligentes.</em>
        </h1>
        <p style={{ fontSize: 14, color: GRAY, marginTop: 8 }}>
          Déclenchez des actions automatiques selon le comportement de vos clients.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
        {CARDS.map(card => <AutomationCard key={card.title} card={card} />)}
      </div>

      <button style={{ padding: "14px 32px", background: INK, color: "#FFFFFF", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sora, system-ui)" }}>
        Sauvegarder les automations
      </button>

      <p style={{ fontSize: 12, color: GRAY, marginTop: 16 }}>
        Les notifications sont envoyées via Apple Wallet et Google Wallet uniquement.
      </p>
    </div>
  );
}
