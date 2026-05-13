"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Menu, X, Star, Send, QrCode, Gift, Shield } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const USE_CASES = ["Boulangerie", "Restaurant", "Coiffeur", "Café", "Pizzeria", "Boutique", "Épicerie", "Salon de beauté", "Fleuriste", "Pharmacie"];

const FEATURES: { icon: React.ReactNode; title: string; desc: string }[] = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/>
        <path d="M16 12h5v4h-5a2 2 0 0 1 0-4z"/>
      </svg>
    ),
    title: "Dans le téléphone natif",
    desc: "La carte s'ajoute en un tap dans Apple Wallet ou Google Wallet — l'app déjà installée sur tous les téléphones. Aucun téléchargement pour vos clients.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18h3v3M14 21v-3"/>
        <path d="M5 5h3v3H5zM16 5h3v3h-3zM5 16h3v3H5z"/>
      </svg>
    ),
    title: "Inscription en 30 secondes",
    desc: "Affichez votre QR code en caisse. Le client scanne avec son appareil photo, remplit son prénom et son email — c'est tout. Sa carte apparaît instantanément.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: "Mise à jour instantanée",
    desc: "Vous ajoutez des points en un clic depuis votre dashboard. La carte dans le Wallet du client se met à jour en temps réel — sans action de sa part.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/>
        <path d="M18 9l-5 5-4-4-3 3"/>
      </svg>
    ),
    title: "Analytics qui parlent business",
    desc: "Fréquence de visite, clients les plus fidèles, points distribués, récompenses utilisées. Des chiffres actionnables, pas des tableaux incompréhensibles.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="2.5"/>
        <circle cx="17.5" cy="10.5" r="2.5"/>
        <circle cx="8.5" cy="7.5" r="2.5"/>
        <circle cx="6.5" cy="12.5" r="2.5"/>
        <path d="M12 20v-4"/>
        <path d="M8 20h8"/>
        <path d="M7 16c1.5-2 5-2 5 0"/>
      </svg>
    ),
    title: "100% à votre image",
    desc: "Couleur principale, logo, nom de la récompense, seuil de points — chaque détail est personnalisable. Votre carte reflète votre identité de marque.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    title: "Notifications push natives",
    desc: "Envoyez une offre directement sur l'écran de verrouillage de vos clients. Taux d'ouverture 4× supérieur aux SMS. Zéro spam, zéro désabonnement.",
  },
];

const SLOT_EMOJIS = ["☕", "🎁", "⭐", "🍕", "💎"];

const PLANS = [
  {
    id: "standard", name: "Standard", badge: "Pour démarrer",
    monthly: 50, annual: 40,
    features: ["Jusqu'à 50 clients", "1 commerce", "Apple & Google Wallet", "QR code personnalisé", "Analytics de base", "Support email"],
    cta: "Commencer gratuitement", ctaHref: "/register" as string | null, highlight: false, whiteBtn: false,
  },
  {
    id: "pro", name: "Pro", badge: "Le plus populaire", extraBadge: "🎁 14 jours offerts",
    monthly: 80, annual: 64,
    features: ["Clients illimités", "Commerces illimités", "Analytics avancés", "Notifications push", "Mise à jour temps réel", "Support prioritaire"],
    cta: "Essai 14 jours gratuits →", ctaHref: null, highlight: true, whiteBtn: false,
  },
  {
    id: "business", name: "Business", badge: "Pour les enseignes",
    monthly: 150, annual: 120,
    features: ["Tout Pro inclus", "Machine à sous fidélité", "Multi-sites illimités", "API dédiée", "Onboarding personnalisé", "Manager dédié"],
    cta: "Nous contacter", ctaHref: "#contact" as string | null, highlight: false, whiteBtn: true,
  },
];

const FAQS = [
  { q: "Est-ce que mes clients ont besoin d'une app ?", a: "Non. La carte s'ajoute directement dans Apple Wallet ou Google Wallet, déjà installés sur tous les smartphones modernes." },
  { q: "Comment les clients s'inscrivent-ils ?", a: "Ils scannent votre QR code et remplissent un formulaire simple (prénom + email). Ils reçoivent leur carte en moins de 30 secondes." },
  { q: "Puis-je personnaliser ma carte ?", a: "Oui : couleurs, logo, nom du commerce et récompense — tout est entièrement personnalisable depuis votre dashboard." },
  { q: "Comment mettre à jour les points ?", a: "Depuis votre dashboard, vous cherchez le client et cliquez pour ajouter des points. La carte se met à jour instantanément sur leur téléphone." },
  { q: "Y a-t-il un engagement ?", a: "Aucun. Le plan Pro est mensuel et annulable à tout moment depuis vos paramètres ou le portail Stripe." },
  { q: "Mes données et celles de mes clients sont-elles sécurisées ?", a: "Oui. Les données sont hébergées sur Supabase (région Frankfurt, UE), chiffrées au repos et en transit. Conformes RGPD." },
  { q: "Puis-je importer mes clients existants ?", a: "Oui, contactez-nous à contact@fideloo.fr et nous vous aidons à migrer vos clients depuis votre système actuel." },
  { q: "Que se passe-t-il si je dépasse la limite du plan gratuit ?", a: "Vos clients existants restent actifs. Vous ne pouvez plus en ajouter au-delà de 50. Passez au Pro en 1 clic pour les clients illimités." },
];

const G = "#22C55E";
const G2 = "#16A34A";
const GS = "rgba(34,197,94,0.10)";
const GB = "rgba(34,197,94,0.25)";
const BG = "#080808";
const SURF = "#111111";
const SURF2 = "#161616";
const LINE = "rgba(255,255,255,0.07)";
const T = "#F5F5F5";
const TD = "rgba(245,245,245,0.55)";

/* ─── PAGE ──────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCookies, setShowCookies] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add("in"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("fideloo_cookie_ok")) setShowCookies(true);
  }, []);

  useEffect(() => {
    const sections = ["features", "pricing", "faq", "contact"];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Navbar scrolled={scrolled} activeSection={activeSection} />
      <main>
        <Hero />
        <MarqueeSection />
        <FeaturesSection />
        <LoyaltySlotDemo />
        <PricingSection />
        <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
        <AppStoreSection />
        <ContactSection />
        <CtaFinal />
        <Footer />
      </main>
      {showCookies && (
        <CookieBanner onAccept={() => { localStorage.setItem("fideloo_cookie_ok", "1"); setShowCookies(false); }} />
      )}
    </>
  );
}

/* ─── NAVBAR ────────────────────────────────────────────────────────────── */
function Navbar({ scrolled, activeSection }: { scrolled: boolean; activeSection: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = [
    { href: "#features", label: "Fonctionnalités", id: "features" },
    { href: "#pricing", label: "Tarifs", id: "pricing" },
    { href: "#faq", label: "FAQ", id: "faq" },
    { href: "#contact", label: "Contact", id: "contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(8,8,8,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${LINE}` : "none" }}>
      <div className="container h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: G, color: "#080808" }}>F</div>
          <span className="font-semibold text-base tracking-tight" style={{ color: T }}>Fideloo</span>
        </Link>

        {/* Pill nav — desktop */}
        <nav className="hidden md:flex items-center p-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${LINE}` }}>
          {navLinks.map(({ href, label, id }) => (
            <a key={href} href={href}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background: activeSection === id ? "rgba(34,197,94,0.15)" : "transparent",
                color: activeSection === id ? G : TD,
              }}
              onMouseEnter={e => { if (activeSection !== id) { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(34,197,94,0.08)"; (e.currentTarget as HTMLAnchorElement).style.color = G; } }}
              onMouseLeave={e => { if (activeSection !== id) { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = TD; } }}>
              {label}
            </a>
          ))}
        </nav>

        {/* Right actions — desktop */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 transition-all"
            style={{ background: "#111111", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 500 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(34,197,94,0.3)"; el.style.color = G; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.color = "#fff"; }}>
            <AppleLogoSVG size={14} />
            App Store
          </a>
          <Link href="/login" className="px-3 py-2 text-sm font-medium transition-colors rounded-xl"
            style={{ color: TD, opacity: 0.8 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.8")}>
            Connexion
          </Link>
          <Link href="/register"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
            style={{ background: G, color: "#080808", boxShadow: `0 4px 16px rgba(34,197,94,0.3)` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(34,197,94,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(34,197,94,0.3)"; }}>
            Essai gratuit <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button type="button" aria-label={mobileOpen ? "Fermer" : "Menu"}
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 rounded-lg" style={{ color: T }}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden mx-4 mb-3 rounded-2xl p-3 glass">
          <nav className="flex flex-col gap-1 text-sm">
            {navLinks.map(({ href, label }) => (
              <a key={label} href={href} onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl transition-colors font-medium" style={{ color: T }}
                onMouseEnter={e => (e.currentTarget.style.background = GS)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                {label}
              </a>
            ))}
            <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl" style={{ color: TD }}>
              Connexion
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 mt-1 mx-1 py-3 rounded-full font-bold text-sm"
              style={{ background: G, color: "#080808" }}>
              Essai gratuit <ArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ─── HERO ──────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden grain pt-32 pb-24" style={{ background: BG }}>
      <div aria-hidden className="absolute pointer-events-none float-orb"
        style={{ top: "-8%", left: "50%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)", filter: "blur(70px)" }} />
      <div aria-hidden className="absolute pointer-events-none float-orb"
        style={{ top: "25%", left: "-8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", filter: "blur(60px)", animationDelay: "-5s" }} />
      <div aria-hidden className="absolute pointer-events-none float-orb"
        style={{ bottom: "5%", right: "8%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)", filter: "blur(50px)", animationDelay: "-9s" }} />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left fade-in-up">
            <h1 className="heading-display mb-6" style={{ color: T, lineHeight: 1.1 }}>
              Transformez vos clients{" "}
              <span className="serif" style={{ color: G }}>occasionnels</span>
              {" "}en clients{" "}
              <span className="serif" style={{ color: "#4ADE80" }}>fidèles</span>
            </h1>

            <p className="lede mx-auto lg:mx-0" style={{ maxWidth: 480, color: "rgba(245,245,245,0.6)", fontSize: 18, lineHeight: 1.5, marginTop: 24, marginBottom: 0 }}>
              Carte de fidélité digitale dans Apple Wallet et Google Wallet.{" "}
              Zéro app. Zéro friction. 100% efficace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start" style={{ marginTop: 36 }}>
              <Link href="/register"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-base transition-all"
                style={{ background: G, color: "#080808", boxShadow: "0 0 32px rgba(34,197,94,0.35)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = G2; (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = G; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
                Créer ma carte gratuite <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-full font-medium text-base transition-all"
                style={{ background: "transparent", color: T, border: `1px solid ${GB}` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GS; (e.currentTarget as HTMLElement).style.color = G; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = T; }}>
                Voir comment ça marche
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-1.5" style={{ marginTop: 20 }}>
              {["Sans carte bancaire", "Configuration en 2 minutes", "Hébergement RGPD · France 🇫🇷"].map((text, i) => (
                <span key={i} className="flex items-center gap-1.5" style={{ color: "rgba(245,245,245,0.5)", fontSize: 13 }}>
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: G }} />
                  {text}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 relative fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div aria-hidden className="absolute inset-0 -m-8 rounded-full blur-3xl opacity-30"
              style={{ background: "radial-gradient(ellipse, rgba(34,197,94,0.3), transparent 70%)" }} />
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── DASHBOARD MOCKUP ──────────────────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div className="relative z-10" style={{ width: 340 }}>
      <div className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: SURF, border: `1px solid ${LINE}`, boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.06)" }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: BG, borderBottom: `1px solid ${LINE}` }}>
          {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />)}
          <div className="flex-1 mx-3 rounded-md px-3 py-1 text-xs" style={{ background: "rgba(255,255,255,0.04)", color: TD }}>
            app.fideloo.fr/dashboard
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: "Clients", value: "248", delta: "+12", color: G },
              { label: "Points", value: "1 840", delta: "+94", color: "#4ADE80" },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-3" style={{ background: BG, border: `1px solid ${LINE}` }}>
                <div className="text-xs mb-1" style={{ color: TD }}>{stat.label}</div>
                <div className="font-semibold text-base" style={{ color: T }}>{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: stat.color }}>{stat.delta} ce mois</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-3 mb-3" style={{ background: BG, border: `1px solid ${LINE}` }}>
            <div className="text-xs mb-2" style={{ color: TD }}>Activité — 7 derniers jours</div>
            <svg width="100%" height="40" viewBox="0 0 280 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d="M0,32 L40,26 L80,30 L120,18 L160,22 L200,12 L240,16 L280,8" fill="none" stroke="#22C55E" strokeWidth="2" />
              <path d="M0,32 L40,26 L80,30 L120,18 L160,22 L200,12 L240,16 L280,8 L280,40 L0,40 Z" fill="url(#cg2)" />
            </svg>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: BG, border: `1px solid ${LINE}` }}>
            {[
              { name: "Marie L.", points: 8, max: 10 },
              { name: "Karim B.", points: 5, max: 10 },
              { name: "Sophie T.", points: 10, max: 10 },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2" style={{ borderBottom: i < 2 ? `1px solid ${LINE}` : "none" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: GS, color: G }}>{c.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: T }}>{c.name}</div>
                  <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(c.points / c.max) * 100}%`, background: c.points === c.max ? "#4ADE80" : G }} />
                  </div>
                </div>
                <div className="text-xs font-semibold flex-shrink-0" style={{ color: c.points === c.max ? "#4ADE80" : TD }}>
                  {c.points}/{c.max}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium"
        style={{ background: SURF, border: `1px solid ${GB}`, color: G, boxShadow: "0 8px 32px rgba(34,197,94,0.15)" }}>
        📱 Apple Wallet · Google Wallet
      </div>
    </div>
  );
}

/* ─── MARQUEE ─────────────────────────────────────────────────────────────── */
function MarqueeSection() {
  const doubled = [...USE_CASES, ...USE_CASES];
  return (
    <div className="py-12 overflow-hidden" style={{ background: "#0D0D0D", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
      <p className="eyebrow text-center mb-6">Ils utilisent Fideloo</p>
      <div className="overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track">
          {doubled.map((label, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-6 text-xl font-semibold tracking-tight"
              style={{ color: "rgba(245,245,245,0.07)" }}>
              {label}<span style={{ color: "rgba(255,255,255,0.05)" }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── FEATURES ──────────────────────────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section id="features" style={{ background: "#0D0D0D", padding: "96px 0" }}>
      <div className="container">
        <div className="text-center mb-16 reveal">
          <p className="mb-4" style={{ fontFamily: "Geist Mono, monospace", fontSize: 11, letterSpacing: "0.14em", color: G, textTransform: "uppercase" }}>
            Fonctionnalités
          </p>
          <h2 className="mb-4" style={{ color: T, fontSize: "clamp(34px, 4.4vw, 56px)", fontWeight: 500, letterSpacing: "-0.028em", lineHeight: 1.1 }}>
            Tout ce qu&apos;il faut pour{" "}
            <span className="serif" style={{ color: G }}>fidéliser.</span>
          </h2>
          <p style={{ color: "rgba(245,245,245,0.55)", fontSize: 18, marginTop: 16 }}>
            Une plateforme complète. Une seule interface. Zéro complexité.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="reveal"
      style={{
        background: SURF, border: `1px solid ${hovered ? GB : LINE}`, borderRadius: 20, padding: 32,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 20px 40px rgba(0,0,0,0.3)" : "none",
        transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
        animationDelay: `${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, display: "grid", placeItems: "center",
        background: hovered ? "rgba(34,197,94,0.18)" : "rgba(34,197,94,0.1)",
        color: G, transition: "background 0.3s ease",
      }}>
        <span style={{ display: "flex", transform: hovered ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s ease" }}>
          {icon}
        </span>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: T, marginTop: 20, letterSpacing: "-0.02em" }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: "rgba(245,245,245,0.55)", marginTop: 10 }}>{desc}</p>
    </div>
  );
}

/* ─── SLOT REEL ──────────────────────────────────────────────────────────── */
function SlotReel({ emoji, spinning }: { emoji: string; spinning: boolean }) {
  const [displayed, setDisplayed] = useState(emoji);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (spinning) {
      interval = setInterval(() => {
        setDisplayed(SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]);
      }, 80);
    } else {
      setDisplayed(emoji);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [spinning, emoji]);

  return (
    <div style={{
      width: 80, height: 80, borderRadius: 14, fontSize: 36,
      background: spinning ? "rgba(34,197,94,0.08)" : SURF2,
      border: spinning ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(34,197,94,0.2)",
      display: "grid", placeItems: "center", transition: "background 0.15s, border-color 0.15s",
      userSelect: "none",
    }}>
      {displayed}
    </div>
  );
}

/* ─── SLOT MODAL ─────────────────────────────────────────────────────────── */
function SlotModal({ onClose }: { onClose: () => void }) {
  const [reels, setReels] = useState<[string, string, string]>(["☕", "☕", "☕"]);
  const [spinning, setSpinning] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [phase, setPhase] = useState<"idle" | "spinning" | "result">("idle");
  const [outcome, setOutcome] = useState<"jackpot" | "near" | "consolation" | null>(null);
  const [confetti, setConfetti] = useState(false);

  const doSpin = () => {
    if (phase !== "idle") return;
    const rand = Math.random();
    let target: [string, string, string];
    let outcomeType: "jackpot" | "near" | "consolation";

    if (rand < 0.25) {
      const e = SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)];
      target = [e, e, e];
      outcomeType = "jackpot";
    } else if (rand < 0.65) {
      const e = SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)];
      const others = SLOT_EMOJIS.filter(x => x !== e);
      const d = others[Math.floor(Math.random() * others.length)];
      target = [e, e, d];
      outcomeType = "near";
    } else {
      const pick = () => SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)];
      let a = pick(), b = pick(), c = pick();
      while (b === a) b = pick();
      while (c === a || c === b) c = pick();
      target = [a, b, c];
      outcomeType = "consolation";
    }

    setPhase("spinning");
    setSpinning([true, true, true]);
    setTimeout(() => { setSpinning([false, true, true]); setReels(([, r1, r2]) => [target[0], r1, r2]); }, 600);
    setTimeout(() => { setSpinning([false, false, true]); setReels(([r0,, r2]) => [r0, target[1], r2]); }, 1000);
    setTimeout(() => {
      setSpinning([false, false, false]);
      setReels(target);
      setOutcome(outcomeType);
      setPhase("result");
      if (outcomeType === "jackpot") { setConfetti(true); setTimeout(() => setConfetti(false), 2800); }
    }, 1400);
  };

  const reset = () => { setPhase("idle"); setOutcome(null); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const OUTCOME_MSG = {
    jackpot:     { title: "🎉 JACKPOT !", msg: "Vous gagnez un café offert !", color: G },
    near:        { title: "✨ Presque !", msg: "Vous gagnez 10% de réduction !", color: "#fbbf24" },
    consolation: { title: "Pas de chance...", msg: "Vous gagnez quand même 5% !", color: TD },
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {confetti && (
        <style>{`
          @keyframes cfall { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1; } 100% { transform: translateY(220px) rotate(540deg); opacity: 0; } }
          .cp { position: absolute; width: 8px; height: 8px; border-radius: 2px; animation: cfall 2s ease-in forwards; pointer-events: none; }
        `}</style>
      )}

      <div className="relative w-full max-w-[480px] rounded-3xl p-10"
        style={{ background: "#0D0D0D", border: `1px solid ${GB}`, boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}>
        {confetti && Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="cp"
            style={{ left: `${5 + i * 5.5}%`, top: 0, background: [G, "#4ADE80", "#16A34A", "#fbbf24"][i % 4], animationDelay: `${i * 0.1}s` }} />
        ))}

        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all"
          style={{ background: "rgba(255,255,255,0.06)", color: TD }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}>
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-bold mb-1" style={{ color: T }}>Démo — Machine à sous</h3>
        <p className="text-sm mb-8" style={{ color: TD }}>Simulez l&apos;expérience fidélité de vos clients</p>

        {/* Reels */}
        <div className="flex justify-center gap-4 mb-8">
          {reels.map((e, i) => (
            <SlotReel key={i} emoji={e} spinning={spinning[i]} />
          ))}
        </div>

        {phase === "result" && outcome ? (
          <div>
            <div className="rounded-2xl p-5 mb-4 text-center"
              style={{ background: SURF2, border: `1px solid ${GB}` }}>
              <p className="font-bold text-xl mb-1" style={{ color: OUTCOME_MSG[outcome].color }}>
                {OUTCOME_MSG[outcome].title}
              </p>
              <p className="text-base" style={{ color: T }}>{OUTCOME_MSG[outcome].msg}</p>
            </div>
            <button onClick={() => alert("Dans l'application réelle, ceci redirige vers votre page Google Reviews")}
              className="w-full rounded-full font-bold text-sm mb-3 transition-all"
              style={{ background: "#fbbf24", color: "#080808", height: 52, boxShadow: "0 4px 16px rgba(251,191,36,0.3)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px rgba(251,191,36,0.45)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(251,191,36,0.3)"; }}>
              ⭐ Laisser un avis pour récupérer ma récompense
            </button>
            <button onClick={reset}
              className="w-full py-2.5 rounded-full text-sm font-medium transition-all"
              style={{ background: "transparent", color: TD, border: `1px solid ${LINE}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GB; (e.currentTarget as HTMLElement).style.color = T; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = LINE; (e.currentTarget as HTMLElement).style.color = TD; }}>
              Rejouer
            </button>
            <p className="text-center text-xs mt-3" style={{ color: TD, fontFamily: "Geist Mono, monospace" }}>
              ✦ Fonctionnalité exclusive Plan Business
            </p>
          </div>
        ) : (
          <button onClick={doSpin} disabled={phase === "spinning"}
            className="w-full rounded-full font-bold text-base transition-all disabled:opacity-60"
            style={{ background: G, color: "#080808", height: 52, boxShadow: phase !== "spinning" ? "0 4px 20px rgba(34,197,94,0.35)" : "none" }}>
            {phase === "spinning" ? "🎰 En cours…" : "🎰 Lancer !"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── LOYALTY SLOT DEMO ──────────────────────────────────────────────────── */
function LoyaltySlotDemo() {
  const [showModal, setShowModal] = useState(false);
  const steps = [
    { Icon: QrCode, title: "Le client scanne & joue", desc: "Une affiche dédiée avec QR code. Le client s'inscrit et tente sa chance à la machine." },
    { Icon: Gift, title: "Il gagne un cadeau", desc: "Un lot est tiré parmi vos récompenses personnalisées." },
    { Icon: Shield, title: "Vous validez en caisse", desc: "Le client présente son QR cadeau. Votre caissier valide en 1 clic." },
  ];

  return (
    <section style={{ background: BG, padding: "96px 0" }}>
      <div className="container">
        <div className="text-center mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6"
            style={{ background: GS, border: `1px solid ${GB}`, color: G, fontFamily: "Geist Mono, monospace", letterSpacing: "0.08em" }}>
            🎮 EXCLUSIF PLAN BUSINESS
          </div>
          <h2 className="section-title mb-4" style={{ color: T }}>
            La Machine à Sous. Vos clients{" "}
            <span className="serif" style={{ color: G }}>jouent.</span>
            {" "}Vos avis{" "}
            <span className="serif" style={{ color: "#4ADE80" }}>explosent.</span>
          </h2>
          <p className="lede max-w-2xl mx-auto" style={{ color: TD }}>
            Transformez chaque passage en caisse en moment de jeu. Vos clients adorent ça. Google aussi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 reveal">
          {[
            { value: "+3×", label: "avis Google générés" },
            { value: "100%", label: "anti-fraude — QR crypté" },
            { value: "0€", label: "commission sur les lots" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-6 rounded-2xl"
              style={{ background: SURF, border: "1px solid rgba(34,197,94,0.15)" }}>
              <div className="text-4xl font-bold mb-1" style={{ color: G }}>{value}</div>
              <div className="text-xs uppercase tracking-wider" style={{ color: TD, fontFamily: "Geist Mono, monospace" }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {steps.map(({ Icon, title, desc }, i) => (
            <div key={title} className="reveal p-8 rounded-[20px] transition-all duration-200"
              style={{ background: SURF, border: `1px solid ${LINE}`, animationDelay: `${i * 0.08}s` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GB; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = LINE; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
              <div className="w-12 h-12 flex items-center justify-center rounded-xl mb-5"
                style={{ background: GS, border: `1px solid ${GB}` }}>
                <Icon className="w-5 h-5" style={{ color: G }} />
              </div>
              <div className="text-xs font-bold mb-2" style={{ color: G, fontFamily: "Geist Mono, monospace" }}>0{i + 1}</div>
              <h3 className="font-semibold mb-2 text-base" style={{ color: T }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: TD }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal rounded-[20px] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl shrink-0" style={{ background: GS }}>
              <Star className="w-5 h-5" style={{ color: G, fill: G }} />
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: T }}>
                En moyenne, 90% des clients laissent un avis Google après avoir joué.
              </p>
              <p className="text-sm" style={{ color: TD }}>La machine crée un échange émotionnel positif.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{ background: "transparent", color: G, border: `1px solid ${GB}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GS; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
              🎮 Voir une démo
            </button>
            <a href="#pricing"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
              style={{ background: G, color: "#080808", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(34,197,94,0.45)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(34,197,94,0.3)"; }}>
              Essayer Business →
            </a>
          </div>
        </div>
      </div>

      {showModal && <SlotModal onClose={() => setShowModal(false)} />}
    </section>
  );
}

/* ─── PRICING ───────────────────────────────────────────────────────────── */
function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [priceVisible, setPriceVisible] = useState(true);

  const toggleAnnual = (val: boolean) => {
    setPriceVisible(false);
    setTimeout(() => { setAnnual(val); setPriceVisible(true); }, 160);
  };

  const handleCheckoutPro = async () => {
    const merchantStr = typeof window !== "undefined" ? localStorage.getItem("fideloo_merchant") : null;
    if (!merchantStr) { window.location.href = "/register"; return; }
    try {
      const merchant = JSON.parse(merchantStr) as { id: string };
      const token = localStorage.getItem("fideloo_token");
      const res = await fetch(`${API_URL}/stripe/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ merchantId: merchant.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Erreur Stripe");
    } catch { window.location.href = "/register"; }
  };

  return (
    <section id="pricing" style={{ background: "#0D0D0D", padding: "96px 0" }}>
      <div className="container">
        <div className="text-center mb-12 reveal">
          <p className="eyebrow mb-4">Tarifs</p>
          <h2 className="section-title mb-4" style={{ color: T }}>
            Simple et{" "}
            <span className="serif" style={{ color: G }}>transparent</span>
          </h2>
          <p className="lede max-w-xl mx-auto mb-8" style={{ color: TD }}>Sans engagement. Annulable à tout moment.</p>

          {/* Pill toggle */}
          <div className="inline-flex items-center p-1 rounded-full" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}` }}>
            {([false, true] as const).map((val) => (
              <button key={String(val)} onClick={() => toggleAnnual(val)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: annual === val ? G : "transparent",
                  color: annual === val ? "#080808" : TD,
                  fontWeight: annual === val ? 700 : 500,
                  boxShadow: annual === val ? "0 4px 12px rgba(34,197,94,0.3)" : "none",
                }}>
                {val ? "Annuel" : "Mensuel"}
                {val && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: annual ? "rgba(8,8,8,0.2)" : "rgba(34,197,94,0.15)", color: annual ? "#080808" : G, fontFamily: "Geist Mono, monospace" }}>
                    −20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} annual={annual} priceVisible={priceVisible}
              onCheckoutPro={handleCheckoutPro} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  plan, annual, priceVisible, onCheckoutPro, delay,
}: {
  plan: typeof PLANS[0]; annual: boolean; priceVisible: boolean; onCheckoutPro: () => void; delay: number;
}) {
  const price = annual ? plan.annual : plan.monthly;

  const handleCta = () => {
    if (plan.id === "pro") { onCheckoutPro(); return; }
    if (plan.ctaHref) window.location.href = plan.ctaHref;
  };

  const borderColor = plan.highlight ? "rgba(34,197,94,0.5)" : LINE;
  const boxShadow = plan.highlight ? "0 30px 70px rgba(34,197,94,0.12)" : "none";

  return (
    <div className="reveal relative flex flex-col rounded-[22px] p-8 transition-all duration-200"
      style={{ background: SURF, border: `1px solid ${borderColor}`, boxShadow, animationDelay: `${delay}s` }}
      onMouseEnter={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.borderColor = GB; (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; } }}
      onMouseLeave={e => { if (!plan.highlight) { (e.currentTarget as HTMLElement).style.borderColor = LINE; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; } }}>

      {plan.highlight && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap"
          style={{ background: G, color: "#080808" }}>
          {plan.badge}
        </div>
      )}

      {plan.extraBadge && (
        <div className="inline-flex self-start mb-3 px-2.5 py-1 rounded-lg text-xs font-semibold"
          style={{ background: "rgba(34,197,94,0.12)", color: G, border: `1px solid rgba(34,197,94,0.3)` }}>
          {plan.extraBadge}
        </div>
      )}

      <div className="mb-2">
        <h3 className="font-semibold text-lg" style={{ color: T }}>{plan.name}</h3>
        {!plan.highlight && <p className="text-sm mt-0.5" style={{ color: TD }}>{plan.badge}</p>}
      </div>

      <div className="mb-8 flex items-baseline gap-1"
        style={{ opacity: priceVisible ? 1 : 0, transform: priceVisible ? "translateY(0)" : "translateY(4px)", transition: "opacity 0.3s, transform 0.3s" }}>
        <span className="text-5xl font-bold tracking-tight" style={{ color: plan.highlight ? G : T }}>{price}€</span>
        <span style={{ color: TD }}>/mois</span>
      </div>

      <ul className="space-y-3 text-sm mb-8 flex-1">
        {plan.features.map(f => (
          <li key={f} className="flex items-start gap-3">
            <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: G }} />
            <span style={{ color: plan.highlight ? T : TD }}>{f}</span>
          </li>
        ))}
      </ul>

      <button onClick={handleCta}
        className="w-full py-3.5 rounded-full font-bold text-sm transition-all"
        style={{
          background: plan.highlight ? G : plan.whiteBtn ? "#F5F5F5" : "transparent",
          color: plan.highlight ? "#080808" : plan.whiteBtn ? "#080808" : T,
          border: plan.highlight || plan.whiteBtn ? "none" : `1px solid ${GB}`,
          boxShadow: plan.highlight ? "0 4px 16px rgba(34,197,94,0.3)" : "none",
        }}
        onMouseEnter={e => {
          if (plan.highlight) { (e.currentTarget as HTMLElement).style.background = G2; (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }
          else if (plan.whiteBtn) { (e.currentTarget as HTMLElement).style.background = "#e5e5e5"; }
          else { (e.currentTarget as HTMLElement).style.background = GS; (e.currentTarget as HTMLElement).style.color = G; }
        }}
        onMouseLeave={e => {
          if (plan.highlight) { (e.currentTarget as HTMLElement).style.background = G; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }
          else if (plan.whiteBtn) { (e.currentTarget as HTMLElement).style.background = "#F5F5F5"; }
          else { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = T; }
        }}>
        {plan.cta}
      </button>
    </div>
  );
}

/* ─── FAQ ───────────────────────────────────────────────────────────── */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (i: number | null) => void }) {
  return (
    <section id="faq" style={{ background: BG, padding: "96px 0" }}>
      <div className="container max-w-3xl">
        <div className="text-center mb-16 reveal">
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="section-title mb-4" style={{ color: T }}>
            Questions{" "}
            <span className="serif" style={{ color: G }}>fréquentes</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="reveal overflow-hidden rounded-2xl transition-all duration-200"
              style={{ background: SURF, border: `1px solid ${LINE}`, animationDelay: `${i * 0.04}s` }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(34,197,94,0.03)")}
              onMouseLeave={e => (e.currentTarget.style.background = SURF)}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                style={{ color: T }}>
                <span className="font-medium pr-4">{f.q}</span>
                <ChevronDown className="w-5 h-5 shrink-0 transition-transform duration-200"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "none", color: openFaq === i ? G : TD }} />
              </button>
              <div style={{ maxHeight: openFaq === i ? 300 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: TD, borderTop: `1px solid rgba(255,255,255,0.06)`, paddingTop: 16 }}>
                  {f.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── APP STORE ─────────────────────────────────────────────────────────── */
function AppStoreSection() {
  return (
    <section style={{ background: "#0D0D0D", padding: "96px 0" }}>
      <div className="container">
        <div className="relative rounded-[32px] overflow-hidden p-12 sm:p-16 reveal"
          style={{ background: SURF, border: `1px solid ${LINE}` }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(34,197,94,0.06) 0%, transparent 60%)" }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="eyebrow mb-4">Application mobile</p>
              <h2 className="section-title mb-4" style={{ color: T }}>
                Gérez votre fidélité{" "}
                <span className="serif" style={{ color: G }}>depuis votre poche</span>
              </h2>
              <p className="lede max-w-lg mb-8" style={{ color: TD }}>
                Scannez les QR codes, ajoutez des points et suivez vos clients directement depuis l&apos;app Fideloo. Disponible sur iPhone.
              </p>
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-medium transition-all"
                style={{ background: "#000000", color: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "14px 28px" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = GB; el.style.color = G; el.style.transform = "scale(1.03)"; el.style.boxShadow = "0 20px 40px rgba(0,0,0,0.5)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = LINE; el.style.color = "#fff"; el.style.transform = "scale(1)"; el.style.boxShadow = "none"; }}>
                <AppleLogoSVG size={20} />
                <div className="text-left">
                  <div className="text-xs opacity-70">Disponible sur</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
            <div className="flex-shrink-0">
              <div className="w-36 h-36 rounded-3xl flex items-center justify-center shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${G}, ${G2})`, boxShadow: "0 30px 60px rgba(34,197,94,0.25)" }}>
                <span className="text-6xl font-black text-white select-none">F</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ───────────────────────────────────────────────────────────── */
function ContactSection() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, message, website: honeypot }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur réseau");
    } finally { setSubmitting(false); }
  };

  return (
    <section id="contact" style={{ background: BG, padding: "96px 0" }}>
      <div className="container max-w-2xl">
        <div className="text-center mb-12 reveal">
          <p className="eyebrow mb-4">Contact</p>
          <h2 className="section-title mb-4" style={{ color: T }}>
            Une question ?{" "}
            <span className="serif" style={{ color: G }}>Écrivez-nous</span>
          </h2>
          <p className="lede" style={{ color: TD }}>Notre équipe vous répond sous 24h.</p>
        </div>

        <div className="reveal rounded-[22px] p-8" style={{ background: SURF, border: `1px solid ${LINE}` }}>
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: GS }}>
                <Check className="w-8 h-8" style={{ color: G }} />
              </div>
              <h3 className="font-bold text-xl mb-2" style={{ color: T }}>Message envoyé !</h3>
              <p style={{ color: TD }}>Nous vous répondrons sous 24h à {email}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="website" tabIndex={-1} autoComplete="off"
                value={honeypot} onChange={e => setHoneypot(e.target.value)} aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 0, height: 0, opacity: 0, pointerEvents: "none" }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: T }}>Prénom</label>
                  <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                    className="input-field" placeholder="Lucas" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: T }}>Nom</label>
                  <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                    className="input-field" placeholder="Bernard" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: T }}>Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="input-field" placeholder="lucas@moncommerce.fr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: T }}>Message</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)}
                  rows={4} className="input-field resize-none" placeholder="Votre message…" />
              </div>
              {error && (
                <div className="p-3 rounded-xl text-sm"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {error}
                </div>
              )}
              <button type="submit" disabled={submitting}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold text-base transition-all disabled:opacity-60"
                style={{ background: G, color: "#080808", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}>
                {submitting ? "Envoi en cours…" : <><Send className="w-4 h-4" /> Envoyer le message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA FINAL ─────────────────────────────────────────────────────────── */
function CtaFinal() {
  return (
    <section style={{ background: "#0D0D0D", padding: "96px 0" }}>
      <div className="container">
        <div className="relative rounded-[32px] overflow-hidden reveal"
          style={{ background: SURF, border: `1px solid rgba(34,197,94,0.2)`, boxShadow: "0 0 80px rgba(34,197,94,0.08)" }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.10) 0%, transparent 65%)" }} />
          <div className="relative z-10 p-12 sm:p-20 text-center">
            <p className="eyebrow mb-6">Prêt à démarrer ?</p>
            <h2 className="section-title mb-6" style={{ color: T }}>
              Fidélisez vos clients{" "}
              <span className="serif" style={{ color: G }}>dès aujourd&apos;hui</span>
            </h2>
            <p className="lede max-w-xl mx-auto mb-10" style={{ color: TD }}>
              Rejoignez les 500+ commerces qui modernisent leur fidélité avec Fideloo. Gratuit pour démarrer.
            </p>
            <Link href="/register"
              className="inline-flex items-center gap-3 font-bold text-[#080808] rounded-full transition-all"
              style={{ background: G, padding: "20px 48px", fontSize: 18, boxShadow: "0 0 40px rgba(34,197,94,0.35), 0 1px 0 rgba(255,255,255,0.15) inset" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = G2; (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = G; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
              Créer mon compte gratuitement <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    { title: "Produit", links: [{ label: "Fonctionnalités", href: "#features" }, { label: "Comment ça marche", href: "#features" }, { label: "Dashboard", href: "/dashboard" }, { label: "Scanner", href: "/dashboard/scanner" }] },
    { title: "Tarifs", links: [{ label: "Plan Standard", href: "#pricing" }, { label: "Plan Pro", href: "#pricing" }, { label: "Plan Business", href: "#pricing" }, { label: "FAQ", href: "#faq" }] },
    { title: "Légal", links: [{ label: "Mentions légales", href: "/mentions-legales" }, { label: "Confidentialité", href: "/politique-confidentialite" }, { label: "CGU", href: "/cgu" }] },
    { title: "Contact", links: [{ label: "Nous écrire", href: "#contact" }, { label: "contact@fideloo.fr", href: "mailto:contact@fideloo.fr" }, { label: "App Store", href: "https://apps.apple.com" }] },
  ];

  return (
    <footer style={{ background: BG, borderTop: `1px solid ${LINE}`, paddingTop: 64, paddingBottom: 48 }}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {cols.map(col => (
            <div key={col.title}>
              <p className="text-sm font-semibold mb-4" style={{ color: T }}>{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm transition-colors" style={{ color: TD }}
                      onMouseEnter={e => (e.currentTarget.style.color = G)}
                      onMouseLeave={e => (e.currentTarget.style.color = TD)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ borderTop: `1px solid ${LINE}`, color: TD }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm"
              style={{ background: G, color: "#080808" }}>F</div>
            <span className="font-medium" style={{ color: T }}>Fideloo</span>
            <span>· © {new Date().getFullYear()}</span>
          </div>
          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 transition-all"
            style={{ background: "#111111", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 500 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(34,197,94,0.3)"; el.style.color = G; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.color = "#fff"; }}>
            <AppleLogoSVG size={14} />
            App Store
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─── COOKIE BANNER ──────────────────────────────────────────────────────── */
function CookieBanner({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] p-3 sm:p-4">
      <div className="glass-strong max-w-3xl mx-auto rounded-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <p className="text-sm flex-1" style={{ color: TD }}>
          Nous utilisons uniquement des cookies fonctionnels essentiels.{" "}
          <Link href="/politique-confidentialite" className="underline" style={{ color: G }}>
            En savoir plus
          </Link>
        </p>
        <button onClick={onAccept}
          className="px-5 py-2 rounded-full text-sm font-bold transition-all shrink-0"
          style={{ background: G, color: "#080808" }}
          onMouseEnter={e => (e.currentTarget.style.background = G2)}
          onMouseLeave={e => (e.currentTarget.style.background = G)}>
          J&apos;accepte
        </button>
      </div>
    </div>
  );
}

/* ─── UTILS ─────────────────────────────────────────────────────────────── */
function AppleLogoSVG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 814 1000" fill="currentColor" aria-hidden>
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.3-164-39.3c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 411.1 32 212.3 73.3 165.4c14.7-17.5 35.2-28.5 57.3-28.5 7.1 0 14.2 1.3 21 4.5 5.8 2.6 12.9 7.1 20 12.9 13.5 10.3 28.5 26.6 41.4 49.4 5.8 10.3 12.3 21 18.7 30.5 7.7 11.6 15.4 21.6 23.1 30.5 22.4 26 49.4 42.8 73.2 49.4-6.4 20.7-7.1 42.8-7.1 61 0 26 3.9 54.5 15.4 79.2 25.4-3.9 48.4-13.5 67.7-29.2 25.4-20.6 44.1-52.8 44.1-91.4 0-37.7-18-68.7-41.4-91.4-21.6-20.6-47.4-35.9-73.2-46.9-2.6-1.3-5.8-2.6-8.4-3.2-26-8.4-54.5-12.9-84.4-12.9-74.5 0-144 30.5-194.1 80.6-43.4 44.1-78.5 105.7-89.5 173.2C54.7 351 72.1 417 116.2 474.7c44.1 57.8 109.6 93.6 179.6 93.6 61.6 0 114.3-30.5 155.5-70.4l20-19.4 19.4 20c41.4 42.1 95.4 70.4 152.8 70.4 65.5 0 128.4-34 172.5-92.3 38.3-51.5 55.8-110.8 56.4-170.2z"/>
    </svg>
  );
}
