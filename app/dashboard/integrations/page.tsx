"use client";

import { Globe, Zap, Link as LinkIcon, Code } from "lucide-react";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";
const CARD = "#FFFFFF";

interface Integration {
  icon: React.ElementType;
  title: string;
  desc: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  cta: string;
  ctaBg: string;
  ctaColor: string;
  href?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    icon: Globe,
    title: "Google My Business",
    desc: "Synchronisez vos avis Google avec vos stats de mini-jeu.",
    badge: "Disponible",
    badgeBg: "rgba(184,135,58,0.20)",
    badgeColor: GOLD,
    cta: "Connecter",
    ctaBg: INK,
    ctaColor: "#FFFFFF",
  },
  {
    icon: Zap,
    title: "Zapier",
    desc: "Connectez Fideloo à plus de 5 000 applications via Zapier.",
    badge: "Bientôt",
    badgeBg: "#F5F3EE",
    badgeColor: GRAY,
    cta: "Être notifié",
    ctaBg: "#F5F3EE",
    ctaColor: INK,
  },
  {
    icon: LinkIcon,
    title: "Webhooks personnalisés",
    desc: "Recevez des événements en temps réel sur votre endpoint (nouveau client, points ajoutés, récompense utilisée).",
    badge: "Plan Business",
    badgeBg: "rgba(184,135,58,0.20)",
    badgeColor: GOLD,
    cta: "Configurer",
    ctaBg: INK,
    ctaColor: "#FFFFFF",
  },
  {
    icon: Code,
    title: "API REST",
    desc: "Accédez à l'API complète Fideloo pour des intégrations sur mesure.",
    badge: "Plan Business",
    badgeBg: "rgba(184,135,58,0.20)",
    badgeColor: GOLD,
    cta: "Voir la doc",
    ctaBg: INK,
    ctaColor: "#FFFFFF",
    href: "https://docs.fideloo.fr",
  },
];

export default function IntegrationsPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "clamp(22px,3vw,28px)", fontWeight: 700, color: INK, fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)" }}>
          Intégrations <em style={{ fontStyle: "italic", fontWeight: 400 }}>et connexions.</em>
        </h1>
        <p style={{ fontSize: 14, color: GRAY, marginTop: 8 }}>Connectez Fideloo à vos outils existants.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {INTEGRATIONS.map(intg => {
          const Icon = intg.icon;
          return (
            <div key={intg.title} style={{ background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(184,135,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} color={GOLD} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: INK, marginBottom: 2 }}>{intg.title}</div>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: intg.badgeBg, color: intg.badgeColor }}>
                      {intg.badge}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: GRAY, lineHeight: 1.6, margin: 0 }}>{intg.desc}</p>
              {intg.href ? (
                <a href={intg.href} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", textAlign: "center", padding: "10px 20px", background: intg.ctaBg, color: intg.ctaColor, border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: "none", cursor: "pointer" }}>
                  {intg.cta}
                </a>
              ) : (
                <button style={{ padding: "10px 20px", background: intg.ctaBg, color: intg.ctaColor, border: `1px solid ${BORD}`, borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  {intg.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
