"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Menu, X, Send } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/* ─── PALETTE ───────────────────────────────────────────────────────────── */
const BG   = "#0A0A0B";
const SURF = "#111827";
const SURF2 = "#1a2235";
const I    = "#6366F1";
const I2   = "#4F46E5";
const IS   = "rgba(99,102,241,0.10)";
const IB   = "rgba(99,102,241,0.25)";
const EM   = "#10B981";
const T    = "#F5F5F7";
const TD   = "#A1A1AA";
const LINE = "rgba(255,255,255,0.07)";

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const FEATURES: { icon: React.ReactNode; title: string; desc: string; visual: React.ReactNode }[] = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <path d="M9 7h6M9 11h6M9 15h4"/>
        <circle cx="12" cy="18" r="1"/>
      </svg>
    ),
    title: "Dans le téléphone natif",
    desc: "La carte s'ajoute en un tap dans Apple Wallet ou Google Wallet — l'app déjà installée sur tous les téléphones. Aucun téléchargement pour vos clients.",
    visual: (
      <div style={{ marginTop: 20, padding: "12px", background: "#0D0D0D", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #22C55E, #16A34A)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 14 }}>🃏</span>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#F5F5F5" }}>Carte Fidélité</div>
            <div style={{ fontSize: 10, color: "rgba(245,245,245,0.4)" }}>Ajoutée à Apple Wallet</div>
          </div>
          <div style={{ marginLeft: "auto", background: "#22C55E", borderRadius: 999, padding: "3px 8px", fontSize: 10, color: "#080808", fontWeight: 700 }}>✓ Ajoutée</div>
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M5 5h3v3H5zM16 5h3v3h-3zM5 16h3v3H5z"/>
        <path d="M14 14h2v2h-2zM18 14h3M14 18h2M18 18v3M21 18h-3v3"/>
      </svg>
    ),
    title: "Inscription en 30 secondes",
    desc: "Affichez votre QR code en caisse. Le client scanne avec son appareil photo, remplit son prénom et son email — c'est tout. Sa carte apparaît instantanément.",
    visual: (
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: 12, background: "#0D0D0D", borderRadius: 12, border: "1px solid rgba(34,197,94,0.15)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,8px)", gap: 2 }}>
            {[1,1,1,1,1,1,1, 1,0,0,0,0,0,1, 1,0,1,1,1,0,1, 1,0,1,0,1,0,1, 1,0,1,1,1,0,1, 1,0,0,0,0,0,1, 1,1,1,1,1,1,1].map((v, i) => (
              <div key={i} style={{ width: 8, height: 8, background: v ? "#22C55E" : "transparent", borderRadius: 1 }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M8 16H3v5"/>
      </svg>
    ),
    title: "Mise à jour instantanée",
    desc: "Vous ajoutez des points en un clic depuis votre dashboard. La carte dans le Wallet du client se met à jour en temps réel — sans action de sa part.",
    visual: (
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#0D0D0D", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: "rgba(245,245,245,0.4)", marginBottom: 4 }}>Points</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#F5F5F5" }}>7 <span style={{ fontSize: 11, color: "#22C55E" }}>→ 8</span></div>
        </div>
        <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.06)" }} />
        <div style={{ flex: 1, paddingLeft: 8 }}>
          <div style={{ fontSize: 10, color: "rgba(245,245,245,0.4)", marginBottom: 4 }}>Wallet mis à jour</div>
          <div style={{ fontSize: 10, color: "#22C55E", fontWeight: 600 }}>● Instantané</div>
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/>
        <path d="M7 16l4-4 4 4 4-4"/>
        <rect x="6" y="12" width="3" height="7" rx="0.5" fill="currentColor" opacity="0.3"/>
        <rect x="10.5" y="9" width="3" height="10" rx="0.5" fill="currentColor" opacity="0.3"/>
        <rect x="15" y="11" width="3" height="8" rx="0.5" fill="currentColor" opacity="0.3"/>
      </svg>
    ),
    title: "Analytics qui parlent business",
    desc: "Fréquence de visite, clients les plus fidèles, points distribués, récompenses utilisées. Des chiffres actionnables, pas des tableaux incompréhensibles.",
    visual: (
      <div style={{ marginTop: 20, padding: "12px 12px 8px", background: "#0D0D0D", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 10, color: "rgba(245,245,245,0.4)", marginBottom: 8 }}>Visites — 7 derniers jours</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 32 }}>
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? "#22C55E" : "rgba(34,197,94,0.3)", borderRadius: "3px 3px 0 0" }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/>
        <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor"/>
        <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor"/>
        <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/>
        <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor"/>
      </svg>
    ),
    title: "100% à votre image",
    desc: "Couleur principale, logo, nom de la récompense, seuil de points — chaque détail est personnalisable. Votre carte reflète votre identité de marque.",
    visual: (
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#0D0D0D", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
        {["#22C55E", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"].map((c, i) => (
          <div key={i} style={{ width: i === 0 ? 28 : 20, height: i === 0 ? 28 : 20, borderRadius: "50%", background: c, border: i === 0 ? "2px solid white" : "none", flexShrink: 0 }} />
        ))}
        <div style={{ marginLeft: "auto", fontSize: 10, color: "rgba(245,245,245,0.4)" }}>Votre couleur</div>
      </div>
    ),
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        <circle cx="18" cy="5" r="3" fill="#22C55E" stroke="none"/>
        <text x="16.5" y="7" fontSize="4" fill="#080808" fontWeight="bold">!</text>
      </svg>
    ),
    title: "Notifications push natives",
    desc: "Envoyez une offre directement sur l'écran de verrouillage de vos clients. Taux d'ouverture 4× supérieur aux SMS. Zéro spam, zéro désabonnement.",
    visual: (
      <div style={{ marginTop: 20, padding: "10px 12px", background: "#0D0D0D", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "#22C55E", borderRadius: 8, display: "grid", placeItems: "center", fontSize: 14, flexShrink: 0 }}>🎁</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#F5F5F5" }}>Boulangerie Martin</div>
            <div style={{ fontSize: 10, color: "rgba(245,245,245,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Offre spéciale — Café offert aujourd&apos;hui !</div>
          </div>
          <div style={{ fontSize: 10, color: "rgba(245,245,245,0.3)", flexShrink: 0 }}>maintenant</div>
        </div>
      </div>
    ),
  },
];

const PLANS = [
  {
    id: "standard", name: "Standard",
    subtitle: "Pour un commerce indépendant qui démarre",
    monthly: 50, annual: 40,
    included: ["1 commerce", "Jusqu'à 200 clients", "Apple Wallet & Google Wallet", "QR code personnalisé", "Analytics de base", "Liste clients", "Support email (72h)"],
    excluded: ["Notifications push", "Export CSV", "Campagnes automatiques", "Mini-jeu avis clients", "Multi-commerces"],
    cta: "Commencer gratuitement", ctaHref: "/register" as string | null, highlight: false, whiteBtn: false,
  },
  {
    id: "pro", name: "Pro",
    subtitle: "Pour les commerces en croissance",
    monthly: 80, annual: 64,
    included: ["Jusqu'à 3 commerces", "Clients illimités", "Analytics avancés", "Classement top clients", "Export CSV clients", "5 campagnes push / mois", "3 templates d'affiche personnalisables", "Gestion staff (rôles)", "Application mobile", "Support prioritaire (48h)"],
    excluded: [],
    cta: "Essai gratuit 14 jours →", ctaHref: null, highlight: true, whiteBtn: false,
  },
  {
    id: "business", name: "Business",
    subtitle: "Pour les chaînes & franchises",
    monthly: 150, annual: 120,
    included: ["Tout du plan Pro inclus", "Commerces illimités", "Analytics multi-sites consolidés", "Campagnes push illimitées", "Application mobile (Caisse & Staff)", "Mini-jeu pour booster les avis Google 🎮", "API & webhooks", "Account manager dédié", "Support prioritaire (24h)"],
    excluded: [],
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
      { threshold: 0.1 }
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
        <SocialProof />
        <FeaturesSection />
        <DashboardPreview />
        <BeforeAfter />
        <PricingSection />
        <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
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
      style={{ background: scrolled ? "rgba(10,10,11,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${LINE}` : "none" }}>
      <div className="container h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: I, color: "#fff" }}>F</div>
          <span className="font-semibold text-base tracking-tight" style={{ color: T }}>Fideloo</span>
        </Link>

        <nav className="hidden md:flex items-center p-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}` }}>
          {navLinks.map(({ href, label, id }) => (
            <a key={href} href={href}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{ background: activeSection === id ? IS : "transparent", color: activeSection === id ? I : TD }}
              onMouseEnter={e => { if (activeSection !== id) { (e.currentTarget as HTMLAnchorElement).style.color = T; } }}
              onMouseLeave={e => { if (activeSection !== id) { (e.currentTarget as HTMLAnchorElement).style.color = TD; } }}>
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: T, border: `1px solid ${LINE}`, borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 500 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = IB; el.style.color = I; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = LINE; el.style.color = T; }}>
            <AppleLogoSVG size={14} />
            App Store
          </a>
          <Link href="/login" className="px-3 py-2 text-sm font-medium transition-colors rounded-xl"
            style={{ color: TD }}
            onMouseEnter={e => (e.currentTarget.style.color = T)}
            onMouseLeave={e => (e.currentTarget.style.color = TD)}>
            Connexion
          </Link>
          <Link href="/register"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
            style={{ background: I, color: "#fff", boxShadow: `0 4px 16px rgba(99,102,241,0.35)` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = I2; (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = I; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
            Essai gratuit <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button type="button" aria-label={mobileOpen ? "Fermer" : "Menu"}
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 rounded-lg" style={{ color: T }}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden mx-4 mb-3 rounded-2xl p-3"
          style={{ background: SURF, border: `1px solid ${LINE}` }}>
          <nav className="flex flex-col gap-1 text-sm">
            {navLinks.map(({ href, label }) => (
              <a key={label} href={href} onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl font-medium transition-colors" style={{ color: T }}
                onMouseEnter={e => (e.currentTarget.style.background = IS)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                {label}
              </a>
            ))}
            <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl" style={{ color: TD }}>
              Connexion
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 mt-1 mx-1 py-3 rounded-full font-bold text-sm"
              style={{ background: I, color: "#fff" }}>
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
    <section className="relative overflow-hidden pt-28 pb-20" style={{ background: BG }}>
      {/* Orbs */}
      <div aria-hidden className="absolute pointer-events-none"
        style={{ top: "-10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)", filter: "blur(80px)" }} />
      <div aria-hidden className="absolute pointer-events-none"
        style={{ top: "30%", right: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left fade-in-up">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8"
              style={{ background: IS, border: `1px solid ${IB}`, color: I }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: I, display: "inline-block" }} />
              Carte de fidélité digitale · Apple &amp; Google Wallet
            </div>

            <h1 style={{ color: T, fontSize: "clamp(38px, 5.5vw, 68px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.08, marginBottom: 24 }}>
              Transformez chaque visite{" "}
              <span style={{ background: `linear-gradient(135deg, ${I} 0%, #818CF8 50%, #A5B4FC 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                en client fidèle.
              </span>
            </h1>

            <p style={{ maxWidth: 480, color: "rgba(245,245,247,0.6)", fontSize: 18, lineHeight: 1.6, marginBottom: 0 }}>
              Carte de fidélité dans le Wallet natif. Zéro app. Zéro friction.
              Vos clients reviennent — vous le savez en temps réel.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start" style={{ marginTop: 36 }}>
              <Link href="/register"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-base transition-all"
                style={{ background: I, color: "#fff", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = I2; (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = I; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
                Créer ma carte gratuite <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-full font-medium text-base transition-all"
                style={{ background: "transparent", color: T, border: `1px solid rgba(255,255,255,0.12)` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = IS; (e.currentTarget as HTMLElement).style.borderColor = IB; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}>
                Voir comment ça marche
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2" style={{ marginTop: 24 }}>
              {["Sans carte bancaire", "Configuration en 2 minutes", "RGPD · Hébergé en France 🇫🇷"].map((text, i) => (
                <span key={i} className="flex items-center gap-1.5" style={{ color: "rgba(245,245,247,0.45)", fontSize: 13 }}>
                  <Check className="w-3.5 h-3.5 shrink-0" style={{ color: EM }} />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right — iPhone mockup */}
          <div className="flex-shrink-0 relative fade-in-up" style={{ animationDelay: "0.12s" }}>
            <div aria-hidden className="absolute inset-0 -m-12 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{ background: `radial-gradient(ellipse, rgba(99,102,241,0.25), transparent 70%)` }} />
            <IPhoneMockup />
            {/* Floating stats */}
            <FloatingStat value="+28%" label="Clients récurrents" color={I} top="-12px" right="-56px" delay="0s" />
            <FloatingStat value="+43%" label="Engagement moyen" color={EM} bottom="20px" left="-64px" delay="0.4s" />
            <FloatingStat value="+19%" label="Chiffre d'affaires" color="#818CF8" top="40%" right="-60px" delay="0.8s" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingStat({ value, label, color, top, bottom, left, right, delay }: {
  value: string; label: string; color: string;
  top?: string; bottom?: string; left?: string; right?: string; delay: string;
}) {
  return (
    <div className="absolute hidden lg:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl fade-in-up"
      style={{ top, bottom, left, right, animationDelay: delay, background: "rgba(17,24,39,0.92)", border: `1px solid rgba(255,255,255,0.08)`, backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", whiteSpace: "nowrap", zIndex: 20 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, boxShadow: `0 0 8px ${color}` }} />
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: T, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 11, color: TD, lineHeight: 1.2 }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── IPHONE MOCKUP ─────────────────────────────────────────────────────── */
function IPhoneMockup() {
  return (
    <div className="relative z-10" style={{ width: 260 }}>
      {/* Phone shell */}
      <div style={{
        width: 260, height: 520, borderRadius: 44, background: "#0D0D14",
        border: "2px solid rgba(255,255,255,0.12)",
        boxShadow: "0 60px 120px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)",
        overflow: "hidden", position: "relative",
      }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 100, height: 28, background: "#0D0D14", borderRadius: "0 0 18px 18px", zIndex: 10 }} />
        {/* Screen */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0f172a 0%, #0a0a0b 100%)", padding: "52px 16px 16px" }}>
          {/* Wallet card */}
          <div style={{
            borderRadius: 20, overflow: "hidden",
            background: `linear-gradient(135deg, ${I} 0%, #818CF8 100%)`,
            padding: 18, marginBottom: 12,
            boxShadow: "0 20px 40px rgba(99,102,241,0.4)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Carte Fidélité</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 2 }}>Le Bon Café</div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16 }}>☕</span>
              </div>
            </div>
            {/* Progress dots */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 8, borderRadius: 4,
                  background: i < 7 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>7 / 10 tampons</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 99 }}>
                Encore 3 !
              </div>
            </div>
          </div>
          {/* Notification */}
          <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", padding: "12px 14px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: IS, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 16 }}>🎁</span>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T }}>Récompense disponible !</div>
                <div style={{ fontSize: 11, color: TD, marginTop: 2 }}>Un café offert vous attend</div>
              </div>
            </div>
          </div>
          {/* Bottom bar */}
          <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", width: 100, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.2)" }} />
        </div>
      </div>
    </div>
  );
}

/* ─── SOCIAL PROOF ──────────────────────────────────────────────────────── */
function SocialProof() {
  const stats = [
    { value: 500, suffix: "+", label: "Commerçants actifs" },
    { value: 98, suffix: "%", label: "Taux de satisfaction" },
    { value: 28, suffix: "%", label: "Retour clients moyen" },
    { value: 30, suffix: "s", label: "Inscription client" },
  ];

  return (
    <div style={{ background: "#0D0F1A", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: "48px 0" }}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x" style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}>
          {stats.map((s, i) => (
            <CounterStat key={i} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CounterStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const dur = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setDisplay(Math.round(ease * value));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center px-6 py-4">
      <div style={{ fontSize: "clamp(36px, 4vw, 52px)", fontWeight: 700, letterSpacing: "-0.04em", color: T, lineHeight: 1 }}>
        {display}{suffix}
      </div>
      <div style={{ fontSize: 14, color: TD, marginTop: 8 }}>{label}</div>
    </div>
  );
}

/* ─── FEATURES ──────────────────────────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section id="features" style={{ background: BG, padding: "96px 0" }}>
      <div className="container">
        <div className="text-center mb-16 reveal">
          <p style={{ fontFamily: "Geist Mono, monospace", fontSize: 11, letterSpacing: "0.14em", color: I, textTransform: "uppercase", marginBottom: 16 }}>
            Fonctionnalités
          </p>
          <h2 style={{ color: T, fontSize: "clamp(32px, 4.4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Tout ce qu&apos;il faut pour{" "}
            <span style={{ background: `linear-gradient(135deg, ${I}, #818CF8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>fidéliser.</span>
          </h2>
          <p style={{ color: TD, fontSize: 18, marginTop: 16 }}>
            Une plateforme complète. Une seule interface. Zéro complexité.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} visual={f.visual} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, visual, delay }: { icon: React.ReactNode; title: string; desc: string; visual: React.ReactNode; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="reveal" style={{
      background: SURF, border: `1px solid ${hovered ? IB : LINE}`, borderRadius: 20, padding: 32,
      transform: hovered ? "translateY(-6px)" : "translateY(0)",
      boxShadow: hovered ? `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${IB}` : "none",
      transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
      animationDelay: `${delay}s`,
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, display: "grid", placeItems: "center",
        background: hovered ? "rgba(99,102,241,0.18)" : IS, color: I,
        transition: "background 0.3s",
      }}>
        <span style={{ display: "flex", transform: hovered ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s" }}>
          {icon}
        </span>
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: T, marginTop: 20, letterSpacing: "-0.02em" }}>{title}</h3>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: TD, marginTop: 10 }}>{desc}</p>
      {visual}
    </div>
  );
}

/* ─── DASHBOARD PREVIEW ─────────────────────────────────────────────────── */
function DashboardPreview() {
  return (
    <section style={{ background: "#0D0F1A", padding: "96px 0" }}>
      <div className="container">
        <div className="text-center mb-16 reveal">
          <p style={{ fontFamily: "Geist Mono, monospace", fontSize: 11, letterSpacing: "0.14em", color: I, textTransform: "uppercase", marginBottom: 16 }}>
            Dashboard
          </p>
          <h2 style={{ color: T, fontSize: "clamp(32px, 4.4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Pilotez votre fidélité{" "}
            <span style={{ background: `linear-gradient(135deg, ${I}, #818CF8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>en temps réel.</span>
          </h2>
          <p style={{ color: TD, fontSize: 18, marginTop: 16, maxWidth: 560, margin: "16px auto 0" }}>
            Chiffre d&apos;affaires, clients actifs, tendances — tout en un coup d&apos;œil.
          </p>
        </div>

        {/* Browser frame */}
        <div className="reveal max-w-4xl mx-auto" style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: SURF2, borderBottom: `1px solid ${LINE}` }}>
            {["#EF4444","#F59E0B","#22C55E"].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, opacity: 0.8 }} />
            ))}
            <div className="flex-1 mx-4 py-1 px-3 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.04)", color: TD }}>
              app.fideloo.fr/dashboard
            </div>
          </div>
          {/* Content */}
          <div style={{ background: "#09090B", padding: "20px 20px 24px", display: "grid", gridTemplateColumns: "160px 1fr", gap: 16, minHeight: 340 }}>
            {/* Sidebar */}
            <div style={{ borderRight: `1px solid ${LINE}`, paddingRight: 16 }}>
              <div className="flex items-center gap-2 mb-6">
                <div style={{ width: 24, height: 24, borderRadius: 6, background: I, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>F</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: T }}>Fideloo</span>
              </div>
              {[
                { label: "Vue globale", active: true },
                { label: "Clients", active: false },
                { label: "Transactions", active: false },
                { label: "Analytics", active: false },
                { label: "Paramètres", active: false },
              ].map(item => (
                <div key={item.label} style={{
                  padding: "7px 10px", borderRadius: 8, marginBottom: 2, fontSize: 12,
                  background: item.active ? IS : "transparent",
                  color: item.active ? I : TD,
                  fontWeight: item.active ? 600 : 400,
                }}>
                  {item.label}
                </div>
              ))}
            </div>
            {/* Main */}
            <div>
              {/* KPI row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[
                  { label: "Clients", value: "248", delta: "+12", color: I },
                  { label: "Points distribués", value: "1 840", delta: "+94", color: EM },
                  { label: "Récompenses", value: "31", delta: "+5", color: "#818CF8" },
                ].map(kpi => (
                  <div key={kpi.label} style={{ background: SURF, borderRadius: 10, padding: "12px 14px", border: `1px solid ${LINE}` }}>
                    <div style={{ fontSize: 10, color: TD, marginBottom: 4 }}>{kpi.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: T, lineHeight: 1 }}>{kpi.value}</div>
                    <div style={{ fontSize: 10, color: kpi.color, marginTop: 4 }}>{kpi.delta} ce mois</div>
                  </div>
                ))}
              </div>
              {/* Chart area */}
              <div style={{ background: SURF, borderRadius: 10, padding: "12px 14px", border: `1px solid ${LINE}`, marginBottom: 10 }}>
                <div style={{ fontSize: 10, color: TD, marginBottom: 8 }}>Activité — 30 derniers jours</div>
                <svg width="100%" height="50" viewBox="0 0 400 50" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="dpg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={I} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={I} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path d="M0,42 L40,38 L80,40 L120,30 L160,34 L200,22 L240,26 L280,15 L320,18 L360,10 L400,8"
                    fill="none" stroke={I} strokeWidth="2" />
                  <path d="M0,42 L40,38 L80,40 L120,30 L160,34 L200,22 L240,26 L280,15 L320,18 L360,10 L400,8 L400,50 L0,50 Z"
                    fill="url(#dpg)" />
                </svg>
              </div>
              {/* Client list */}
              <div style={{ background: SURF, borderRadius: 10, border: `1px solid ${LINE}` }}>
                {[
                  { name: "Marie L.", pts: 8, max: 10 },
                  { name: "Karim B.", pts: 10, max: 10 },
                  { name: "Sophie T.", pts: 3, max: 10 },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderBottom: i < 2 ? `1px solid ${LINE}` : "none" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: IS, color: I, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                      {c.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: T }}>{c.name}</div>
                      <div style={{ marginTop: 3, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
                        <div style={{ width: `${(c.pts / c.max) * 100}%`, height: "100%", borderRadius: 2, background: c.pts >= c.max ? EM : I }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: c.pts >= c.max ? EM : TD }}>{c.pts}/{c.max}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── BEFORE / AFTER ────────────────────────────────────────────────────── */
function BeforeAfter() {
  return (
    <section style={{ background: BG, padding: "96px 0" }}>
      <div className="container max-w-4xl">
        <div className="text-center mb-16 reveal">
          <h2 style={{ color: T, fontSize: "clamp(32px, 4.4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            La différence est{" "}
            <span style={{ background: `linear-gradient(135deg, ${I}, #818CF8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>immédiate.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal">
          {/* Before */}
          <div style={{ borderRadius: 20, padding: 32, background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#F87171", fontWeight: 700, flexShrink: 0 }}>✕</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#F87171", letterSpacing: "0.06em", textTransform: "uppercase" }}>Avant Fideloo</span>
            </div>
            <ul className="space-y-4">
              {[
                "Carte papier — perdue ou oubliée 80% du temps",
                "Aucune idée de qui revient ou pourquoi",
                "SMS coûteux, taux d'ouverture < 20%",
                "Tamponner à la main à chaque visite",
                "Aucune donnée sur vos clients",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3" style={{ fontSize: 14, color: "rgba(245,245,247,0.6)", lineHeight: 1.5 }}>
                  <span style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* After */}
          <div style={{ borderRadius: 20, padding: 32, background: "rgba(99,102,241,0.06)", border: `1px solid ${IB}` }}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: IS, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: I, fontWeight: 700, flexShrink: 0 }}>✓</div>
              <span style={{ fontSize: 14, fontWeight: 700, color: I, letterSpacing: "0.06em", textTransform: "uppercase" }}>Avec Fideloo</span>
            </div>
            <ul className="space-y-4">
              {[
                "Carte dans le Wallet — toujours là, impossible à perdre",
                "Analytics temps réel : visites, fidélité, tendances",
                "Notifications push gratuites, taux d'ouverture 4×",
                "Points en 1 clic depuis le dashboard",
                "Base clients structurée et exportable",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3" style={{ fontSize: 14, color: "rgba(245,245,247,0.8)", lineHeight: 1.5 }}>
                  <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: I }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ───────────────────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden>
      <path d="M2.5 8.5l3.5 3.5 7-8" stroke={I} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CrossIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }} aria-hidden>
      <path d="M5 5l6 6M11 5l-6 6" stroke="rgba(245,245,245,0.2)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [priceVisible, setPriceVisible] = useState(true);

  const toggleAnnual = (val: boolean) => {
    setPriceVisible(false);
    setTimeout(() => { setAnnual(val); setPriceVisible(true); }, 150);
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
    <section id="pricing" style={{ background: "#0D0F1A", padding: "96px 0" }}>
      <div className="container">
        <div className="text-center mb-14 reveal">
          <p style={{ fontFamily: "Geist Mono, monospace", fontSize: 11, letterSpacing: "0.14em", color: I, textTransform: "uppercase", marginBottom: 16 }}>Tarifs</p>
          <h2 style={{ color: T, fontSize: "clamp(32px, 4.4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Simple et{" "}
            <span style={{ background: `linear-gradient(135deg, ${I}, #818CF8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>transparent</span>
          </h2>
          <p style={{ color: TD, marginBottom: 32 }}>Sans engagement. Annulable à tout moment.</p>

          <div className="inline-flex items-center p-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${LINE}` }}>
            {([false, true] as const).map((val) => (
              <button key={String(val)} onClick={() => toggleAnnual(val)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: annual === val ? I : "transparent",
                  color: annual === val ? "#fff" : TD,
                  fontWeight: annual === val ? 700 : 500,
                  boxShadow: annual === val ? `0 4px 12px rgba(99,102,241,0.35)` : "none",
                }}>
                {val ? "Annuel" : "Mensuel"}
                {val && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ background: annual ? "rgba(255,255,255,0.15)" : IS, color: annual ? "#fff" : I }}>
                    −20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto" style={{ gap: 16 }}>
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} annual={annual} priceVisible={priceVisible} onCheckoutPro={handleCheckoutPro} delay={i * 0.08} />
          ))}
        </div>

        <p className="text-center mt-6" style={{ fontSize: 13, color: "rgba(245,245,247,0.35)" }}>
          Pas de carte bancaire requise · Annulable à tout moment · Données hébergées en France 🇫🇷
        </p>
      </div>
    </section>
  );
}

function PricingCard({ plan, annual, priceVisible, onCheckoutPro, delay }: {
  plan: typeof PLANS[0]; annual: boolean; priceVisible: boolean; onCheckoutPro: () => void; delay: number;
}) {
  const [hov, setHov] = useState(false);
  const price = annual ? plan.annual : plan.monthly;

  const handleCta = () => {
    if (plan.id === "pro") { onCheckoutPro(); return; }
    if (plan.ctaHref) window.location.href = plan.ctaHref;
  };

  return (
    <div className="reveal relative flex flex-col"
      style={{
        background: plan.highlight ? "#13152A" : SURF,
        border: `1px solid ${plan.highlight ? IB : hov ? IB : LINE}`,
        borderRadius: 20, padding: 32,
        boxShadow: plan.highlight ? `0 0 0 1px ${IS} inset, 0 30px 60px rgba(99,102,241,0.12)` : hov ? "0 16px 40px rgba(0,0,0,0.3)" : "none",
        transform: !plan.highlight && hov ? "translateY(-4px)" : "translateY(0)",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        animationDelay: `${delay}s`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>

      {plan.highlight && (
        <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: I, color: "#fff", padding: "4px 16px", borderRadius: 999, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
          Le plus populaire
        </div>
      )}

      {plan.highlight && (
        <div style={{ alignSelf: "flex-start", marginBottom: 16, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: IS, color: I, border: `1px solid ${IB}` }}>
          🎁 14 jours offerts
        </div>
      )}

      <h3 style={{ fontSize: 15, fontWeight: 600, color: T, letterSpacing: "-0.01em" }}>{plan.name}</h3>
      <p style={{ fontSize: 13, color: "rgba(245,245,247,0.45)", marginTop: 6, marginBottom: 20 }}>{plan.subtitle}</p>

      <div style={{ display: "flex", alignItems: "baseline", opacity: priceVisible ? 1 : 0, transform: priceVisible ? "translateY(0)" : "translateY(4px)", transition: "opacity 0.15s, transform 0.15s" }}>
        <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.04em", color: T, lineHeight: 1 }}>{price}€</span>
        <span style={{ fontSize: 16, color: TD, marginLeft: 4 }}>/mois</span>
      </div>

      <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, margin: "24px 0" }} />

      <ul style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {plan.included.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "rgba(245,245,247,0.8)", lineHeight: 1.5 }}>
            <CheckIcon />{f}
          </li>
        ))}
      </ul>

      {plan.excluded.length > 0 && (
        <>
          <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)`, margin: "16px 0 12px" }} />
          <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {plan.excluded.map(f => (
              <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "rgba(245,245,247,0.22)", textDecoration: "line-through" }}>
                <CrossIcon />{f}
              </li>
            ))}
          </ul>
        </>
      )}

      <button onClick={handleCta} style={{
        marginTop: 28, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8,
        padding: "14px 24px", borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: "pointer",
        background: plan.highlight ? I : plan.whiteBtn ? "#F5F5F7" : "transparent",
        color: plan.highlight ? "#fff" : plan.whiteBtn ? "#0A0A0B" : T,
        border: plan.highlight || plan.whiteBtn ? "none" : `1px solid ${IB}`,
        boxShadow: plan.highlight ? `0 4px 20px rgba(99,102,241,0.4)` : "none",
        transition: "all 0.2s",
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          if (plan.highlight) { el.style.background = I2; el.style.transform = "scale(1.02)"; }
          else if (plan.whiteBtn) { el.style.background = "#e5e5e7"; }
          else { el.style.background = IS; el.style.color = I; }
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          if (plan.highlight) { el.style.background = I; el.style.transform = "scale(1)"; }
          else if (plan.whiteBtn) { el.style.background = "#F5F5F7"; }
          else { el.style.background = "transparent"; el.style.color = T; }
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
          <p style={{ fontFamily: "Geist Mono, monospace", fontSize: 11, letterSpacing: "0.14em", color: I, textTransform: "uppercase", marginBottom: 16 }}>FAQ</p>
          <h2 style={{ color: T, fontSize: "clamp(32px, 4.4vw, 52px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Questions{" "}
            <span style={{ background: `linear-gradient(135deg, ${I}, #818CF8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>fréquentes</span>
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="reveal overflow-hidden rounded-2xl transition-all duration-200"
              style={{ background: SURF, border: `1px solid ${LINE}`, animationDelay: `${i * 0.04}s` }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = IB)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = LINE)}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left" style={{ color: T }}>
                <span className="font-medium pr-4">{f.q}</span>
                <ChevronDown className="w-5 h-5 shrink-0 transition-transform duration-200"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "none", color: openFaq === i ? I : TD }} />
              </button>
              <div style={{ maxHeight: openFaq === i ? 300 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: TD, borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: 16 }}>
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

  const inputStyle: React.CSSProperties = {
    width: "100%", background: BG, border: `1px solid ${LINE}`, borderRadius: 12,
    padding: "12px 16px", fontSize: 14, color: T, outline: "none",
    transition: "border-color 0.2s",
  };

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
    <section id="contact" style={{ background: "#0D0F1A", padding: "96px 0" }}>
      <div className="container max-w-2xl">
        <div className="text-center mb-12 reveal">
          <p style={{ fontFamily: "Geist Mono, monospace", fontSize: 11, letterSpacing: "0.14em", color: I, textTransform: "uppercase", marginBottom: 16 }}>Contact</p>
          <h2 style={{ color: T, fontSize: "clamp(32px, 4.4vw, 48px)", fontWeight: 700, letterSpacing: "-0.03em" }}>
            Une question ?{" "}
            <span style={{ background: `linear-gradient(135deg, ${I}, #818CF8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Écrivez-nous</span>
          </h2>
          <p style={{ color: TD, marginTop: 12 }}>Notre équipe vous répond sous 24h.</p>
        </div>

        <div className="reveal rounded-[22px] p-8" style={{ background: SURF, border: `1px solid ${LINE}` }}>
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: IS }}>
                <Check className="w-8 h-8" style={{ color: I }} />
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
                    style={inputStyle} placeholder="Lucas"
                    onFocus={e => (e.currentTarget.style.borderColor = IB)}
                    onBlur={e => (e.currentTarget.style.borderColor = LINE)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: T }}>Nom</label>
                  <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                    style={inputStyle} placeholder="Bernard"
                    onFocus={e => (e.currentTarget.style.borderColor = IB)}
                    onBlur={e => (e.currentTarget.style.borderColor = LINE)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: T }}>Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  style={inputStyle} placeholder="lucas@moncommerce.fr"
                  onFocus={e => (e.currentTarget.style.borderColor = IB)}
                  onBlur={e => (e.currentTarget.style.borderColor = LINE)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: T }}>Message</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)}
                  rows={4} style={{ ...inputStyle, resize: "none" }} placeholder="Votre message…"
                  onFocus={e => (e.currentTarget.style.borderColor = IB)}
                  onBlur={e => (e.currentTarget.style.borderColor = LINE)} />
              </div>
              {error && (
                <div className="p-3 rounded-xl text-sm"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {error}
                </div>
              )}
              <button type="submit" disabled={submitting}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-full font-bold text-base transition-all disabled:opacity-60"
                style={{ background: I, color: "#fff", boxShadow: `0 4px 16px rgba(99,102,241,0.35)` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = I2; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = I; }}>
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
    <section style={{ background: BG, padding: "96px 0" }}>
      <div className="container">
        <div className="relative rounded-[32px] overflow-hidden reveal"
          style={{ background: SURF, border: `1px solid ${IB}`, boxShadow: `0 0 80px rgba(99,102,241,0.1)` }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.14) 0%, transparent 65%)` }} />
          <div className="relative z-10 p-12 sm:p-20 text-center">
            <p style={{ fontFamily: "Geist Mono, monospace", fontSize: 11, letterSpacing: "0.14em", color: I, textTransform: "uppercase", marginBottom: 24 }}>Prêt à démarrer ?</p>
            <h2 style={{ color: T, fontSize: "clamp(32px, 4.8vw, 56px)", fontWeight: 700, letterSpacing: "-0.035em", marginBottom: 20 }}>
              Commencez à fidéliser{" "}
              <span style={{ background: `linear-gradient(135deg, ${I}, #818CF8, #A5B4FC)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                aujourd&apos;hui.
              </span>
            </h2>
            <p style={{ color: TD, fontSize: 18, maxWidth: 520, margin: "0 auto 40px" }}>
              Rejoignez les 500+ commerces qui modernisent leur fidélité avec Fideloo. Gratuit pour démarrer.
            </p>
            <Link href="/register"
              className="inline-flex items-center gap-3 font-bold rounded-full transition-all"
              style={{ background: I, color: "#fff", padding: "20px 48px", fontSize: 18, boxShadow: `0 0 40px rgba(99,102,241,0.4), 0 1px 0 rgba(255,255,255,0.1) inset` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = I2; (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = I; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
              Créer mon compte gratuitement <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6">
              {["Sans carte bancaire", "Annulable à tout moment", "Configuration en 2 minutes"].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5" style={{ fontSize: 13, color: "rgba(245,245,247,0.4)" }}>
                  <Check className="w-3.5 h-3.5" style={{ color: EM }} />{t}
                </span>
              ))}
            </div>
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
    <footer style={{ background: "#0D0F1A", borderTop: `1px solid ${LINE}`, paddingTop: 64, paddingBottom: 48 }}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {cols.map(col => (
            <div key={col.title}>
              <p className="text-sm font-semibold mb-4" style={{ color: T }}>{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm transition-colors" style={{ color: TD }}
                      onMouseEnter={e => (e.currentTarget.style.color = T)}
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
              style={{ background: I, color: "#fff" }}>F</div>
            <span className="font-medium" style={{ color: T }}>Fideloo</span>
            <span>· © {new Date().getFullYear()}</span>
          </div>
          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", color: T, border: `1px solid ${LINE}`, borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 500 }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = IB; el.style.color = I; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = LINE; el.style.color = T; }}>
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
      <div className="max-w-3xl mx-auto rounded-2xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
        style={{ background: "rgba(17,24,39,0.96)", border: `1px solid ${LINE}`, backdropFilter: "blur(20px)", boxShadow: "0 -8px 40px rgba(0,0,0,0.4)" }}>
        <p className="text-sm flex-1" style={{ color: TD }}>
          Nous utilisons uniquement des cookies fonctionnels essentiels.{" "}
          <Link href="/politique-confidentialite" className="underline" style={{ color: I }}>
            En savoir plus
          </Link>
        </p>
        <button onClick={onAccept}
          className="px-5 py-2 rounded-full text-sm font-bold transition-all shrink-0"
          style={{ background: I, color: "#fff" }}
          onMouseEnter={e => (e.currentTarget.style.background = I2)}
          onMouseLeave={e => (e.currentTarget.style.background = I)}>
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
