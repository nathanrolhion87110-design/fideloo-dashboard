"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FideloLogoStamp } from "../components/FideloLogoStamp";
import {
  ChevronDown, Coffee, Nfc, Wifi, BarChart2, Palette, Bell, QrCode,
} from "lucide-react";

/* ─── PALETTE ───────────────────────────────────────────────────────────── */
const BG   = "#EDEBE4";
const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const WHITE = "#FFFFFF";
const GRAY  = "#6B6B6B";
const CARD  = "#F5F3EE";
const BORD  = "#E0DDD6";
const BORD2 = "#D8D5CE";

/* ─── TRANSLATIONS ──────────────────────────────────────────────────────── */
const translations = {
  fr: {
    nav: { features: "Fonctionnalités", pricing: "Tarifs", faq: "FAQ", login: "Se connecter", cta: "Démarrer ↗" },
    hero: {
      badge: "B2B · CARTES APPLE WALLET & GOOGLE WALLET",
      h1a: "La fidélité de vos commerces,",
      h1b: "dans le portefeuille natif.",
      sub: "Fideloo équipe les enseignes B2B d'une carte de fidélité digitale qui s'ajoute directement à Apple Wallet et Google Wallet. Pas d'app à télécharger. Pas de friction.",
      cta1: "Démarrer ↗",
      cta2: "Voir la démo",
    },
    card: {
      label: "FIDÉLITÉ",
      name: "Le Bon Café",
      reward: "Récompense : Un café offert",
      stat: "+34%",
      statLabel: "de visites ce mois",
    },
    features: {
      label: "— FONCTIONNALITÉS",
      h2a: "Un outil pensé",
      h2b: "pour les enseignes.",
      items: [
        { n: "01", title: "Dans le Wallet natif", desc: "La carte s'ajoute en un tap dans Apple Wallet ou Google Wallet. Aucun téléchargement pour vos clients." },
        { n: "02", title: "Inscription en 30 secondes", desc: "Le client scanne votre QR code en caisse, saisit son email et reçoit sa carte instantanément." },
        { n: "03", title: "Synchronisation temps réel", desc: "Ajoutez des points en un clic. La carte se met à jour sur le téléphone du client immédiatement." },
        { n: "04", title: "Analytics actionnables", desc: "Fréquence de visite, top clients, récompenses utilisées. Des chiffres qui parlent business." },
        { n: "05", title: "Aux couleurs de votre enseigne", desc: "Logo, couleurs, seuil de points — chaque détail reflète votre marque." },
        { n: "06", title: "Notifications push natives", desc: "Une offre directement sur l'écran de verrouillage. Taux d'ouverture 4× supérieur au SMS." },
      ],
    },
    pricing: {
      label: "— TARIFS",
      h2a: "Simple,",
      h2b: "transparent,",
      h2c: "B2B.",
      monthly: "Mensuel",
      annual: "Annuel",
      annualSave: "-20%",
      plans: [
        {
          name: "Standard",
          price: 50,
          annualPrice: 40,
          sub: "Pour un commerce indépendant qui démarre",
          cta: "Démarrer ↗",
          href: "/register",
          features: ["1 commerce", "Jusqu'à 200 clients", "Apple Wallet & Google Wallet", "QR code personnalisé", "Analytics de base", "Support email (72h)"],
        },
        {
          name: "Pro",
          price: 80,
          annualPrice: 64,
          sub: "Pour les enseignes qui veulent scaler",
          badge: "LE PLUS POPULAIRE",
          cta: "Essai gratuit 14 jours ↗",
          href: "/register",
          dark: true,
          features: ["Jusqu'à 3 commerces", "Jusqu'à 5 000 clients", "Analytics avancés", "5 campagnes push/mois", "Gestion staff", "Support prioritaire (48h)"],
        },
        {
          name: "Business",
          price: 150,
          annualPrice: 120,
          sub: "Pour les réseaux et franchises",
          cta: "Nous contacter ↗",
          href: "/contact",
          features: ["Commerces illimités", "Clients illimités", "Analytics multi-sites", "Campagnes push illimitées", "API & webhooks", "Mini-jeu avis Google", "Account manager", "Support (24h)"],
        },
      ],
      perMonth: "/mois",
    },
    faq: {
      label: "— FAQ",
      h2a: "Vos questions,",
      h2b: "nos réponses.",
      items: [
        { q: "Est-ce que mes clients ont besoin d'une app ?", a: "Non. Apple Wallet et Google Wallet sont préinstallés sur tous les iPhones et Android. Vos clients n'ont rien à télécharger." },
        { q: "Comment les clients s'inscrivent-ils ?", a: "Ils scannent le QR code affiché en caisse, saisissent leur email en 10 secondes et reçoivent leur carte dans leur Wallet. C'est tout." },
        { q: "Puis-je personnaliser ma carte ?", a: "Oui : logo, couleurs, nom, seuil de récompense — tout est configurable depuis votre tableau de bord Fideloo." },
        { q: "Comment fonctionne la mise à jour des points ?", a: "Vous scannez un QR code ou saisissez le code client sur votre tableau de bord. La carte se met à jour en temps réel sur le téléphone du client, sans manipulation de sa part." },
        { q: "Y a-t-il un engagement ?", a: "Non. Vous pouvez résilier à tout moment sans frais. Nous proposons également un essai gratuit de 14 jours sur le plan Pro." },
        { q: "Mes données sont-elles sécurisées ?", a: "Oui. Toutes les données sont hébergées en Europe (Supabase EU), chiffrées en transit et au repos, conformes au RGPD." },
      ],
    },
    finalCta: {
      h2a: "Prêt à moderniser",
      h2b: "votre programme de fidélité ?",
      cta: "Démarrer gratuitement ↗",
      sub: "Sans carte bancaire · Setup en 2 minutes",
    },
    footer: {
      legal: "Mentions légales",
      tos: "CGU",
      contact: "Contact",
      copy: `© ${new Date().getFullYear()} Fideloo. Tous droits réservés.`,
    },
  },
  en: {
    nav: { features: "Features", pricing: "Pricing", faq: "FAQ", login: "Log in", cta: "Get started ↗" },
    hero: {
      badge: "B2B · APPLE WALLET & GOOGLE WALLET CARDS",
      h1a: "Loyalty for your stores,",
      h1b: "in the native wallet.",
      sub: "Fideloo gives B2B merchants a digital loyalty card that plugs directly into Apple Wallet and Google Wallet. No app to download. No friction.",
      cta1: "Get started ↗",
      cta2: "See demo",
    },
    card: {
      label: "LOYALTY",
      name: "The Good Café",
      reward: "Reward: Free coffee",
      stat: "+34%",
      statLabel: "visits this month",
    },
    features: {
      label: "— FEATURES",
      h2a: "A tool built",
      h2b: "for merchants.",
      items: [
        { n: "01", title: "In the native Wallet", desc: "The card is added in one tap to Apple Wallet or Google Wallet. No download required for your customers." },
        { n: "02", title: "Sign up in 30 seconds", desc: "The customer scans your QR code at checkout, enters their email and receives their card instantly." },
        { n: "03", title: "Real-time sync", desc: "Add points in one click. The card updates on the customer's phone immediately." },
        { n: "04", title: "Actionable analytics", desc: "Visit frequency, top customers, used rewards. Numbers that speak to your business." },
        { n: "05", title: "Your brand, your card", desc: "Logo, colors, point threshold — every detail reflects your brand." },
        { n: "06", title: "Native push notifications", desc: "An offer straight to the lock screen. 4× higher open rate than SMS." },
      ],
    },
    pricing: {
      label: "— PRICING",
      h2a: "Simple,",
      h2b: "transparent,",
      h2c: "B2B.",
      monthly: "Monthly",
      annual: "Annual",
      annualSave: "-20%",
      plans: [
        {
          name: "Standard",
          price: 50,
          annualPrice: 40,
          sub: "For independent merchants starting out",
          cta: "Get started ↗",
          href: "/register",
          features: ["1 store", "Up to 200 customers", "Apple Wallet & Google Wallet", "Custom QR code", "Basic analytics", "Email support (72h)"],
        },
        {
          name: "Pro",
          price: 80,
          annualPrice: 64,
          sub: "For merchants ready to scale",
          badge: "MOST POPULAR",
          cta: "Free 14-day trial ↗",
          href: "/register",
          dark: true,
          features: ["Up to 3 stores", "Up to 5,000 customers", "Advanced analytics", "5 push campaigns/month", "Staff management", "Priority support (48h)"],
        },
        {
          name: "Business",
          price: 150,
          annualPrice: 120,
          sub: "For networks and franchises",
          cta: "Contact us ↗",
          href: "/contact",
          features: ["Unlimited stores", "Unlimited customers", "Multi-site analytics", "Unlimited push campaigns", "API & webhooks", "Google review mini-game", "Account manager", "Support (24h)"],
        },
      ],
      perMonth: "/mo",
    },
    faq: {
      label: "— FAQ",
      h2a: "Your questions,",
      h2b: "our answers.",
      items: [
        { q: "Do my customers need an app?", a: "No. Apple Wallet and Google Wallet come pre-installed on all iPhones and Android devices. Your customers have nothing to download." },
        { q: "How do customers sign up?", a: "They scan the QR code at checkout, enter their email in 10 seconds, and receive their card in their Wallet. That's it." },
        { q: "Can I customize my card?", a: "Yes: logo, colors, name, reward threshold — all configurable from your Fideloo dashboard." },
        { q: "How does point updates work?", a: "You scan a QR code or enter the customer code on your dashboard. The card updates in real time on the customer's phone, without any action from them." },
        { q: "Is there a commitment?", a: "No. You can cancel at any time at no cost. We also offer a free 14-day trial on the Pro plan." },
        { q: "Is my data secure?", a: "Yes. All data is hosted in Europe (Supabase EU), encrypted in transit and at rest, GDPR compliant." },
      ],
    },
    finalCta: {
      h2a: "Ready to modernize",
      h2b: "your loyalty program?",
      cta: "Start for free ↗",
      sub: "No credit card · 2-minute setup",
    },
    footer: {
      legal: "Legal notice",
      tos: "Terms",
      contact: "Contact",
      copy: `© ${new Date().getFullYear()} Fideloo. All rights reserved.`,
    },
  },
};

const featureIcons = [Wifi, QrCode, Wifi, BarChart2, Palette, Bell];

/* ─── FAQ ITEM ──────────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${BORD2}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 0", background: "none", border: "none", cursor: "pointer",
          textAlign: "left", gap: 16,
        }}
      >
        <span style={{ fontFamily: "var(--font-sora, system-ui)", fontSize: 16, fontWeight: 500, color: INK }}>
          {q}
        </span>
        <ChevronDown
          size={18}
          style={{ color: GRAY, flexShrink: 0, transition: "transform 0.25s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div style={{
        maxHeight: open ? 300 : 0, overflow: "hidden",
        transition: "max-height 0.3s ease",
      }}>
        <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7, paddingBottom: 22 }}>{a}</p>
      </div>
    </div>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(false);

  const t = translations[lang];

  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef  = useRef<HTMLElement>(null);
  const faqRef      = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const px = { paddingLeft: "clamp(24px, 6vw, 80px)", paddingRight: "clamp(24px, 6vw, 80px)" };

  return (
    <div style={{ background: BG, minHeight: "100vh", color: INK }}>

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 64,
        display: "flex", alignItems: "center",
        background: scrolled ? BG : "transparent",
        borderBottom: scrolled ? `1px solid ${BORD}` : "none",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}>
        <div style={{ ...px, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: INK, borderRadius: 10, padding: "6px 12px 6px 6px",
            }}>
              <span style={{
                width: 26, height: 26, borderRadius: 6, background: GOLD,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: INK }} />
              </span>
              <span style={{ fontFamily: "var(--font-sora, system-ui)", fontWeight: 600, fontSize: 15, color: WHITE, letterSpacing: "-0.01em" }}>Fideloo</span>
            </span>
          </Link>

          {/* Center nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden-mobile">
            {[
              { label: t.nav.features, ref: featuresRef },
              { label: t.nav.pricing, ref: pricingRef },
              { label: t.nav.faq, ref: faqRef },
            ].map(({ label, ref }) => (
              <button key={label} onClick={() => scrollTo(ref)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, color: GRAY, fontFamily: "var(--font-sora, system-ui)", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = INK)}
                onMouseLeave={e => (e.currentTarget.style.color = GRAY)}>
                {label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Lang toggle */}
            <div style={{ display: "inline-flex", alignItems: "center", background: "#D8D5CE", borderRadius: 999, padding: 3, gap: 2 }}>
              {(["fr", "en"] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  style={{
                    padding: "5px 12px", borderRadius: 999, border: "none", cursor: "pointer",
                    fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
                    fontFamily: "var(--font-sora, system-ui)",
                    background: lang === l ? INK : "transparent",
                    color: lang === l ? WHITE : GRAY,
                    transition: "background 0.2s, color 0.2s",
                  }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link href="/login"
              style={{ fontSize: 14, fontWeight: 500, color: GRAY, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)" }}
              className="hidden-mobile">
              {t.nav.login}
            </Link>
            <Link href="/register"
              style={{
                background: INK, color: WHITE, borderRadius: 999, padding: "9px 18px",
                fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)",
                whiteSpace: "nowrap",
              }}>
              {t.nav.cta}
            </Link>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 64 }}>

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section style={{ ...px, paddingTop: 80, paddingBottom: 100 }}>
          <div style={{ display: "grid", gridTemplateColumns: "60fr 40fr", gap: 48, alignItems: "center", maxWidth: 1200, margin: "0 auto" }} className="hero-grid">

            {/* Left */}
            <div>
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: WHITE, border: `1px solid ${BORD}`, borderRadius: 999,
                padding: "6px 14px", marginBottom: 36,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: GRAY, fontFamily: "var(--font-sora, system-ui)" }}>
                  {t.hero.badge}
                </span>
              </div>

              {/* H1 */}
              <h1 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, lineHeight: 1.12, marginBottom: 24, fontSize: "clamp(42px, 5.5vw, 78px)" }}>
                <span style={{ display: "block" }}>{t.hero.h1a}</span>
                <em style={{ display: "block", fontStyle: "italic", color: INK }}>{t.hero.h1b}</em>
              </h1>

              {/* Sub */}
              <p style={{ fontSize: 17, color: GRAY, lineHeight: 1.7, maxWidth: 520, marginBottom: 40, fontFamily: "system-ui, sans-serif" }}>
                {t.hero.sub}
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/register" style={{
                  background: INK, color: WHITE, borderRadius: 999, padding: "12px 28px",
                  fontSize: 15, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-sora, system-ui)",
                }}>
                  {t.hero.cta1}
                </Link>
                <button onClick={() => scrollTo(featuresRef)} style={{
                  background: WHITE, color: INK, borderRadius: 999, padding: "12px 28px",
                  fontSize: 15, fontWeight: 600, border: `1px solid ${BORD}`, cursor: "pointer",
                  fontFamily: "var(--font-sora, system-ui)",
                }}>
                  {t.hero.cta2}
                </button>
              </div>
            </div>

            {/* Right — wallet card mockup */}
            <div style={{ position: "relative" }}>
              <div style={{
                background: INK, borderRadius: 20, padding: 28, color: WHITE,
                boxShadow: "0 32px 80px rgba(11,15,14,0.18)",
              }}>
                {/* Card header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: GOLD, marginBottom: 4, fontFamily: "var(--font-sora, system-ui)" }}>
                      {t.card.label}
                    </div>
                    <div style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 22, fontWeight: 600 }}>
                      {t.card.name}
                    </div>
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(184,135,58,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Coffee size={20} color={GOLD} />
                  </div>
                </div>

                {/* Stamps */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: i < 7 ? GOLD : "rgba(255,255,255,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {i < 7 && <Coffee size={13} color={INK} />}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 20, fontFamily: "var(--font-sora, system-ui)" }}>7 / 10</div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-sora, system-ui)" }}>{t.card.reward}</span>
                  <Nfc size={16} color={GOLD} />
                </div>
              </div>

              {/* Floating stat card */}
              <div style={{
                position: "absolute", bottom: -20, right: -20, background: WHITE,
                borderRadius: 14, padding: "14px 18px", boxShadow: "0 8px 32px rgba(11,15,14,0.12)",
                minWidth: 130,
              }}>
                <div style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 28, fontWeight: 700, color: GOLD, lineHeight: 1 }}>
                  {t.card.stat}
                </div>
                <div style={{ fontSize: 11, color: GRAY, marginTop: 4, fontFamily: "var(--font-sora, system-ui)" }}>
                  {t.card.statLabel}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────── */}
        <section ref={featuresRef} style={{ ...px, paddingTop: 100, paddingBottom: 100 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ marginBottom: 56 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: GRAY, marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>
                {t.features.label}
              </div>
              <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(34px, 4vw, 56px)", lineHeight: 1.15 }}>
                <span>{t.features.h2a}</span>{" "}
                <em style={{ fontStyle: "italic" }}>{t.features.h2b}</em>
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="features-grid">
              {t.features.items.map((item, i) => {
                const Icon = featureIcons[i];
                return (
                  <div key={item.n} style={{
                    background: CARD, border: `1px solid ${BORD}`, borderRadius: 16, padding: 32,
                    transition: "box-shadow 0.2s ease, transform 0.2s ease", cursor: "default",
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 12px 40px rgba(11,15,14,0.10)"; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                      <span style={{ fontSize: 11, color: BORD2, fontWeight: 600, fontFamily: "var(--font-sora, system-ui)" }}>{item.n}</span>
                      <div style={{ flex: 1, height: 1, background: BORD }} />
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(184,135,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={16} color={GOLD} />
                      </div>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-sora, system-ui)", fontSize: 16, fontWeight: 600, color: INK, marginBottom: 10 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.65 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────────────────── */}
        <section ref={pricingRef} style={{ ...px, paddingTop: 100, paddingBottom: 100 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: GRAY, marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>
                {t.pricing.label}
              </div>
              <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(34px, 4vw, 56px)", lineHeight: 1.15 }}>
                <span>{t.pricing.h2a}</span>{" "}
                <em style={{ fontStyle: "italic" }}>{t.pricing.h2b}</em>{" "}
                <span>{t.pricing.h2c}</span>
              </h2>
            </div>

            {/* Toggle */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
              <div style={{ display: "inline-flex", alignItems: "center", background: WHITE, border: `1px solid ${BORD}`, borderRadius: 999, padding: 4, gap: 4 }}>
                {[false, true].map((val) => (
                  <button key={String(val)} onClick={() => setAnnual(val)}
                    style={{
                      padding: "8px 20px", borderRadius: 999, border: "none", cursor: "pointer",
                      fontSize: 13, fontWeight: 600, fontFamily: "var(--font-sora, system-ui)",
                      background: annual === val ? INK : "transparent",
                      color: annual === val ? WHITE : GRAY,
                      transition: "background 0.2s, color 0.2s",
                    }}>
                    {val ? `${t.pricing.annual} ${t.pricing.annualSave}` : t.pricing.monthly}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="pricing-grid">
              {t.pricing.plans.map((plan) => {
                const price = annual ? plan.annualPrice : plan.price;
                const dark = plan.dark;
                return (
                  <div key={plan.name} style={{
                    background: dark ? INK : WHITE,
                    border: `1px solid ${dark ? "transparent" : BORD}`,
                    borderRadius: 20, padding: 32,
                    display: "flex", flexDirection: "column",
                    boxShadow: dark ? "0 24px 60px rgba(11,15,14,0.16)" : "none",
                  }}>
                    {plan.badge && (
                      <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <span style={{
                          display: "inline-block", background: GOLD, color: INK,
                          borderRadius: 999, padding: "4px 14px",
                          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                          fontFamily: "var(--font-sora, system-ui)",
                        }}>
                          {plan.badge}
                        </span>
                      </div>
                    )}
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontFamily: "var(--font-sora, system-ui)", fontSize: 14, fontWeight: 600, color: dark ? "rgba(255,255,255,0.5)" : GRAY, marginBottom: 6 }}>
                        {plan.name}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontSize: 56, fontWeight: 700, lineHeight: 1, color: dark ? WHITE : INK }}>
                          {price}€
                        </span>
                        <span style={{ fontSize: 14, color: dark ? "rgba(255,255,255,0.4)" : GRAY, fontFamily: "var(--font-sora, system-ui)" }}>
                          {t.pricing.perMonth}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: dark ? "rgba(255,255,255,0.4)" : GRAY, marginTop: 8, fontFamily: "var(--font-sora, system-ui)" }}>
                        {plan.sub}
                      </p>
                    </div>

                    <Link href={plan.href} style={{
                      display: "block", textAlign: "center",
                      background: dark ? WHITE : INK,
                      color: dark ? INK : WHITE,
                      borderRadius: 999, padding: "12px 20px",
                      fontSize: 14, fontWeight: 600, textDecoration: "none",
                      fontFamily: "var(--font-sora, system-ui)",
                      marginBottom: 28, transition: "opacity 0.15s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                      {plan.cta}
                    </Link>

                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                      {plan.features.map((f) => (
                        <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{
                            width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                            background: dark ? "rgba(184,135,58,0.2)" : "rgba(184,135,58,0.12)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                              <path d="M1 3.5L3.5 6L8 1" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                          <span style={{ fontSize: 13, color: dark ? "rgba(255,255,255,0.7)" : GRAY, fontFamily: "var(--font-sora, system-ui)", lineHeight: 1.5 }}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <section ref={faqRef} style={{ ...px, paddingTop: 100, paddingBottom: 100 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80, alignItems: "start" }} className="faq-grid">
            {/* Left */}
            <div style={{ position: "sticky", top: 100 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: GRAY, marginBottom: 16, fontFamily: "var(--font-sora, system-ui)" }}>
                {t.faq.label}
              </div>
              <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(32px, 3.5vw, 50px)", lineHeight: 1.2 }}>
                <span style={{ display: "block" }}>{t.faq.h2a}</span>
                <em style={{ fontStyle: "italic" }}>{t.faq.h2b}</em>
              </h2>
            </div>
            {/* Right */}
            <div>
              {t.faq.items.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ───────────────────────────────────────────────── */}
        <section style={{ ...px, paddingTop: 40, paddingBottom: 80 }}>
          <div style={{
            maxWidth: 1200, margin: "0 auto",
            background: INK, borderRadius: 24, padding: "clamp(48px, 6vw, 80px)",
            display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center",
            position: "relative", overflow: "hidden",
          }} className="cta-grid">
            {/* Gold L decoration */}
            <div style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
              <div style={{ width: 60, height: 4, background: GOLD, borderRadius: "0 0 2px 0" }} />
              <div style={{ width: 4, height: 60, background: GOLD, borderRadius: "0 0 2px 2px" }} />
            </div>

            {/* Left text */}
            <div>
              <h2 style={{ fontFamily: "var(--font-playfair, Georgia, serif)", fontWeight: 400, fontSize: "clamp(30px, 3.5vw, 52px)", lineHeight: 1.2, color: WHITE }}>
                <span style={{ display: "block" }}>{t.finalCta.h2a}</span>
                <em style={{ fontStyle: "italic", color: GOLD }}>{t.finalCta.h2b}</em>
              </h2>
            </div>

            {/* Right */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
              <Link href="/register" style={{
                background: GOLD, color: WHITE, borderRadius: 999, padding: "14px 32px",
                fontSize: 15, fontWeight: 700, textDecoration: "none",
                fontFamily: "var(--font-sora, system-ui)", whiteSpace: "nowrap",
              }}>
                {t.finalCta.cta}
              </Link>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-sora, system-ui)" }}>
                {t.finalCta.sub}
              </span>
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer style={{ background: INK, ...px, paddingTop: 40, paddingBottom: 40 }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
        }}>
          {/* Logo */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            <FideloLogoStamp variant="onDark" size={28} />
          </span>

          {/* Links */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            {[
              { label: t.footer.legal, href: "/mentions-legales" },
              { label: t.footer.tos, href: "/cgu" },
              { label: t.footer.contact, href: "/contact" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none", fontFamily: "var(--font-sora, system-ui)", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = WHITE)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
                {label}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-sora, system-ui)" }}>
            {t.footer.copy}
          </span>
        </div>
      </footer>

      {/* ── RESPONSIVE STYLES ───────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .faq-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .cta-grid { grid-template-columns: 1fr !important; }
          .cta-grid > div:last-child { align-items: flex-start !important; }
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
