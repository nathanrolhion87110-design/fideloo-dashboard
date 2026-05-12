"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight, Zap,
  Check, ChevronDown, Menu, X, Lock, Star, Sparkles, Send,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const USE_CASES = ["Boulangerie", "Restaurant", "Coiffeur", "Café", "Pizzeria", "Boutique", "Épicerie", "Salon de beauté", "Fleuriste", "Pharmacie"];

const FEATURES = [
  { emoji: "📱", title: "Apple & Google Wallet", desc: "La carte s'ajoute en 1 tap dans le téléphone natif du client. Aucune app à télécharger." },
  { emoji: "🔲", title: "QR Code instantané", desc: "Affichez votre QR en caisse. Le client scanne et s'inscrit en 30 secondes." },
  { emoji: "⚡", title: "Mise à jour temps réel", desc: "Ajoutez des points en 1 clic. La carte se met à jour instantanément sur le téléphone." },
  { emoji: "📊", title: "Analytics détaillés", desc: "Suivez vos meilleurs clients, la fréquence de visite et vos récompenses distribuées." },
  { emoji: "🎨", title: "100% personnalisable", desc: "Couleurs, logo, récompenses : votre carte à votre image en quelques clics." },
  { emoji: "🔔", title: "Notifications push", desc: "Envoyez des offres directement sur l'écran de verrouillage de vos clients." },
];

const PLANS = [
  {
    id: "standard", name: "Standard", badge: "Pour démarrer",
    monthly: 50, annual: 40,
    features: ["Jusqu'à 50 clients", "1 commerce", "Apple & Google Wallet", "QR code personnalisé", "Analytics de base", "Support email"],
    cta: "Commencer gratuitement", ctaHref: "/register" as string | null, highlight: false,
  },
  {
    id: "pro", name: "Pro", badge: "Le plus populaire", extraBadge: "🎁 14 jours offerts",
    monthly: 80, annual: 64,
    features: ["Clients illimités", "Commerces illimités", "Analytics avancés", "Notifications push", "Mise à jour temps réel", "Support prioritaire"],
    cta: "Essai 14 jours gratuits →", ctaHref: null, highlight: true,
  },
  {
    id: "business", name: "Business", badge: "Pour les enseignes",
    monthly: 150, annual: 120,
    features: ["Tout Pro inclus", "Multi-sites illimités", "API dédiée", "Onboarding personnalisé", "Manager dédié", "SLA 99,9%"],
    cta: "Nous contacter", ctaHref: "#contact" as string | null, highlight: false,
  },
];

const FAQS = [
  { q: "Est-ce que mes clients ont besoin d'une app ?", a: "Non. La carte s'ajoute directement dans Apple Wallet ou Google Wallet, déjà installés sur tous les smartphones modernes." },
  { q: "Comment les clients s'inscrivent-ils ?", a: "Ils scannent votre QR code et remplissent un formulaire simple (prénom + email). Ils reçoivent leur carte en moins de 30 secondes." },
  { q: "Puis-je personnaliser ma carte ?", a: "Oui : couleurs, logo, nom du commerce et récompense — tout est entièrement personnalisable depuis votre dashboard." },
  { q: "Comment mettre à jour les points ?", a: "Depuis votre dashboard, vous cherchez le client et cliquez pour ajouter des points. La carte se met à jour instantanément sur leur téléphone." },
  { q: "Y a-t-il un engagement ?", a: "Aucun. Le plan Pro est mensuel et annulable à tout moment depuis vos paramètres ou le portail Stripe." },
  { q: "Mes données et celles de mes clients sont-elles sécurisées ?", a: "Oui. Les données sont hébergées sur Supabase (région Frankfurt, UE), chiffrées au repos et en transit. Nous sommes conformes au RGPD." },
  { q: "Puis-je importer mes clients existants ?", a: "Oui, contactez-nous à contact@fideloo.fr et nous vous aidons à migrer vos clients depuis votre système actuel." },
  { q: "Que se passe-t-il si je dépasse la limite du plan gratuit ?", a: "Vos clients existants restent actifs. Vous ne pouvez simplement plus en ajouter de nouveaux au-delà de 50. Passez au Pro en 1 clic pour débloquer les clients illimités." },
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
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Navbar scrolled={scrolled} activeSection={activeSection} />
      <main>
        <Hero />
        <MarqueeSection />
        <FeaturesSection />
        <PricingSection />
        <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
        <AppStoreSection />
        <ContactSection />
        <CtaFinal />
        <Footer />
      </main>
      {showCookies && <CookieBanner onAccept={() => { localStorage.setItem("fideloo_cookie_ok", "1"); setShowCookies(false); }} />}
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
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(10,10,11,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none" }}
    >
      <div className="container h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: "var(--violet)", color: "#ffffff" }}>F</div>
          <span className="font-semibold text-base tracking-tight" style={{ color: "var(--text)" }}>Fideloo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm flex-1 justify-center">
          {navLinks.map(({ href, label, id }) => (
            <a key={href} href={href}
              style={{ color: activeSection === id ? "var(--violet)" : "var(--text-dim)", fontWeight: activeSection === id ? 500 : 400, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = activeSection === id ? "var(--violet)" : "var(--text-dim)")}>
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{ background: "#000", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#1a1a1a")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#000")}>
            <AppleLogoSVG size={14} />
            App Store
          </a>
          <Link href="/login" className="px-3 py-2 text-sm rounded-xl transition-colors"
            style={{ color: "var(--text-dim)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}>
            Se connecter
          </Link>
          <Link href="/register" className="btn btn-accent btn-sm">
            S&apos;inscrire <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button type="button" aria-label={mobileOpen ? "Fermer" : "Menu"}
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 rounded-lg" style={{ color: "var(--text)" }}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden mx-4 mb-3 rounded-2xl p-3 glass">
          <nav className="flex flex-col gap-1 text-sm">
            {navLinks.map(({ href, label }) => (
              <a key={label} href={href} onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl transition-colors" style={{ color: "var(--text)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                {label}
              </a>
            ))}
            <Link href="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl" style={{ color: "var(--text)" }}>
              Se connecter
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)} className="btn btn-accent btn-md mt-1 mx-1 justify-center">
              S&apos;inscrire gratuitement <ArrowRight className="w-4 h-4" />
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
    <section className="relative overflow-hidden section-dark pt-32 pb-24 grain">
      <div aria-hidden className="absolute pointer-events-none" style={{ top: "-10%", left: "55%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div aria-hidden className="absolute pointer-events-none float-orb" style={{ top: "20%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)", filter: "blur(50px)" }} />
      <div aria-hidden className="absolute pointer-events-none float-orb" style={{ bottom: "5%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)", filter: "blur(40px)", animationDelay: "-4s" }} />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 pulse-glow"
              style={{ background: "var(--violet-soft)", border: "1px solid rgba(167,139,250,0.3)", color: "var(--violet)" }}>
              <Sparkles className="w-3.5 h-3.5" />
              Nouveau — Cartes Apple &amp; Google Wallet
            </div>

            <h1 className="heading-display mb-6" style={{ color: "var(--text)" }}>
              La fidélité que vos clients{" "}
              <span className="serif" style={{ color: "var(--violet)" }}>adorent</span>
              {" "}vraiment
            </h1>

            <p className="lede mb-10 max-w-xl mx-auto lg:mx-0">
              Créez une carte de fidélité numérique dans Apple Wallet et Google Wallet.{" "}
              <span style={{ color: "var(--text)" }}>Zéro app. Zéro friction. 100% efficace.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link href="/register" className="btn btn-accent btn-lg">
                Créer ma carte gratuite <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#features" className="btn btn-ghost btn-lg">
                Voir comment ça marche
              </a>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-sm" style={{ color: "var(--text-dim)" }}>
              {[
                { icon: <Star className="w-3.5 h-3.5" style={{ color: "var(--mint)", fill: "var(--mint)" }} />, text: "500+ commerces actifs" },
                { icon: <Lock className="w-3.5 h-3.5" style={{ color: "var(--mint)" }} />, text: "Sans carte bancaire" },
                { icon: <Zap className="w-3.5 h-3.5" style={{ color: "var(--violet)" }} />, text: "Prêt en 2 minutes" },
              ].map(({ icon, text }, i) => (
                <span key={i} className="flex items-center gap-1.5">{icon}{text}</span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 relative fade-in-up" style={{ animationDelay: "0.15s" }}>
            <div aria-hidden className="absolute inset-0 -m-8 rounded-full blur-3xl opacity-40"
              style={{ background: "radial-gradient(ellipse, rgba(167,139,250,0.3), transparent 70%)" }} />
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Dashboard Mockup ──────────────────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div className="relative z-10" style={{ width: 340 }}>
      <div className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.08)" }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "var(--bg)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
          <div className="flex-1 mx-3 rounded-md px-3 py-1 text-xs" style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-dim)" }}>
            app.fideloo.fr/dashboard
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: "Clients", value: "248", delta: "+12", color: "var(--violet)" },
              { label: "Points", value: "1 840", delta: "+94", color: "var(--mint)" },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-3" style={{ background: "var(--bg)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-xs mb-1" style={{ color: "var(--text-dim)" }}>{stat.label}</div>
                <div className="font-semibold text-base" style={{ color: "var(--text)" }}>{stat.value}</div>
                <div className="text-xs mt-0.5" style={{ color: stat.color }}>{stat.delta} ce mois</div>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-3 mb-3" style={{ background: "var(--bg)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-xs mb-2" style={{ color: "var(--text-dim)" }}>Activité — 7 derniers jours</div>
            <svg width="100%" height="40" viewBox="0 0 280 40" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d="M0,32 L40,26 L80,30 L120,18 L160,22 L200,12 L240,16 L280,8" fill="none" stroke="#a78bfa" strokeWidth="2" />
              <path d="M0,32 L40,26 L80,30 L120,18 L160,22 L200,12 L240,16 L280,8 L280,40 L0,40 Z" fill="url(#chartGrad)" />
            </svg>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[
              { name: "Marie L.", points: 8, max: 10 },
              { name: "Karim B.", points: 5, max: 10 },
              { name: "Sophie T.", points: 10, max: 10 },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{ background: "var(--violet-soft)", color: "var(--violet)" }}>
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: "var(--text)" }}>{c.name}</div>
                  <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(c.points / c.max) * 100}%`, background: c.points === c.max ? "var(--mint)" : "var(--violet)" }} />
                  </div>
                </div>
                <div className="text-xs font-semibold flex-shrink-0" style={{ color: c.points === c.max ? "var(--mint)" : "var(--text-dim)" }}>
                  {c.points}/{c.max}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium"
        style={{ background: "var(--surface)", border: "1px solid rgba(167,139,250,0.3)", color: "var(--violet)", boxShadow: "0 8px 32px rgba(167,139,250,0.2)" }}>
        📱 Apple Wallet · Google Wallet
      </div>
    </div>
  );
}

/* ─── MARQUEE ─────────────────────────────────────────────────────────────── */
function MarqueeSection() {
  const doubled = [...USE_CASES, ...USE_CASES];
  return (
    <div className="py-12 overflow-hidden" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      <p className="eyebrow text-center mb-6">Ils utilisent Fideloo</p>
      <div className="overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track">
          {doubled.map((label, i) => (
            <span key={i} className="inline-flex items-center gap-5 px-6 text-xl font-semibold tracking-tight"
              style={{ color: "rgba(245,245,243,0.08)" }}>
              {label}
              <span style={{ color: "rgba(255,255,255,0.06)" }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SLOT MACHINE ──────────────────────────────────────────────────────── */
const SLOT_EMOJIS = ["☕", "🎁", "⭐", "🍕", "💎"];

function SlotReel({ emoji, spinning }: { emoji: string; spinning: boolean }) {
  const [displayed, setDisplayed] = useState(emoji);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (spinning) {
      ref.current = setInterval(() => {
        setDisplayed(SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)]);
      }, 80);
    } else {
      if (ref.current) { clearInterval(ref.current); ref.current = null; }
      setDisplayed(emoji);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [spinning, emoji]);
  return (
    <div style={{
      width: 80, height: 80, borderRadius: 14, fontSize: 36,
      background: spinning ? "rgba(167,139,250,0.1)" : "#1a1a22",
      border: spinning ? "1px solid rgba(167,139,250,0.4)" : "1px solid rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
    }}>
      {displayed}
    </div>
  );
}

function LoyaltyGameDemo() {
  const [phase, setPhase] = useState<"idle" | "spinning" | "result">("idle");
  const [reels, setReels] = useState(["☕", "☕", "☕"]);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [outcome, setOutcome] = useState<"jackpot" | "near" | "consolation" | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const spin = () => {
    if (phase !== "idle") return;
    setPhase("spinning");
    setSpinning([true, true, true]);
    setShowReview(false);
    setConfetti(false);

    const rand = Math.random();
    let r: ["jackpot" | "near" | "consolation", string[]] ;
    if (rand < 0.25) {
      const e = SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)];
      r = ["jackpot", [e, e, e]];
    } else if (rand < 0.65) {
      const e = SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)];
      const diff = SLOT_EMOJIS.filter(x => x !== e)[Math.floor(Math.random() * 4)];
      r = ["near", [e, e, diff]];
    } else {
      const pick = () => SLOT_EMOJIS[Math.floor(Math.random() * SLOT_EMOJIS.length)];
      let a = pick(), b = pick(), c = pick();
      while (b === a) b = pick();
      while (c === a || c === b) c = pick();
      r = ["consolation", [a, b, c]];
    }

    setTimeout(() => { setSpinning([false, true, true]); setReels(prev => [r[1][0], prev[1], prev[2]]); }, 600);
    setTimeout(() => { setSpinning([false, false, true]); setReels(prev => [prev[0], r[1][1], prev[2]]); }, 1000);
    setTimeout(() => {
      setSpinning([false, false, false]);
      setReels(r[1]);
      setOutcome(r[0]);
      setPhase("result");
      if (r[0] === "jackpot") { setConfetti(true); setTimeout(() => setConfetti(false), 2000); }
      setTimeout(() => setShowReview(true), 700);
    }, 1400);
  };

  const reset = () => { setPhase("idle"); setOutcome(null); setShowReview(false); };

  const outcomeMsg: Record<string, { title: string; sub: string; color: string }> = {
    jackpot: { title: "🎉 Jackpot ! Café offert !", sub: "Vous avez atteint 10 points !", color: "#34d399" },
    near: { title: "🌟 Presque ! +2 points", sub: "Plus que 2 passages et c'est gratuit !", color: "#a78bfa" },
    consolation: { title: "☕ +1 point fidélité", sub: "Revenez vite pour cumuler !", color: "var(--text-dim)" },
  };

  return (
    <div className="card-dark p-8 flex flex-col items-center text-center" style={{ minHeight: 340 }}>
      {confetti && (
        <style>{`
          @keyframes confettiFall {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(160px) rotate(720deg); opacity: 0; }
          }
          .confetti-piece { position: absolute; width: 8px; height: 8px; border-radius: 2px; animation: confettiFall 1.5s ease-in forwards; }
        `}</style>
      )}
      <div className="relative">
        <p className="text-sm font-medium mb-5" style={{ color: "var(--text-dim)" }}>
          Simulez l&apos;expérience fidélité de vos clients
        </p>
        <div className="relative flex gap-3 justify-center mb-6">
          {confetti && Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="confetti-piece pointer-events-none"
              style={{
                left: `${10 + i * 6}%`, top: 0,
                background: ["#a78bfa", "#34d399", "#fbbf24", "#f472b6"][i % 4],
                animationDelay: `${i * 0.08}s`,
              }} />
          ))}
          {reels.map((e, i) => (
            <SlotReel key={i} emoji={e} spinning={spinning[i]} />
          ))}
        </div>
      </div>

      {outcome && outcomeMsg[outcome] && (
        <div className="mb-5 px-5 py-3 rounded-xl w-full" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="font-bold text-base" style={{ color: outcomeMsg[outcome].color }}>{outcomeMsg[outcome].title}</p>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-dim)" }}>{outcomeMsg[outcome].sub}</p>
        </div>
      )}

      {showReview && (
        <button onClick={() => alert("Merci ! Redirection vers Google Maps… (démo)")}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold mb-3 transition-all"
          style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(251,191,36,0.2)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "rgba(251,191,36,0.12)")}>
          ⭐ Laisser un avis Google
        </button>
      )}

      {phase === "idle" ? (
        <button onClick={spin}
          className="btn btn-accent btn-md w-full justify-center">
          Tenter ma chance ☕
        </button>
      ) : phase === "result" ? (
        <button onClick={reset}
          className="btn btn-ghost btn-md w-full justify-center mt-1">
          Rejouer
        </button>
      ) : null}
    </div>
  );
}

/* ─── FEATURES ──────────────────────────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section id="features" className="section-light">
      <div className="container">
        <div className="text-center mb-16 reveal">
          <p className="eyebrow mb-4" style={{ color: "var(--ink-dim)" }}>Fonctionnalités</p>
          <h2 className="section-title mb-4" style={{ color: "var(--ink)" }}>
            Tout pour{" "}
            <span className="serif" style={{ color: "var(--violet)" }}>fidéliser</span>
            {" "}sans complexité
          </h2>
          <p className="lede max-w-2xl mx-auto" style={{ color: "var(--ink-dim)" }}>
            Une plateforme conçue pour les commerçants qui veulent fidéliser sans compétence technique.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card-light p-7 reveal" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 text-2xl"
                style={{ background: "var(--violet-soft)", border: "1px solid rgba(167,139,250,0.2)" }}>
                {f.emoji}
              </div>
              <h3 className="font-semibold mb-2 text-base" style={{ color: "var(--ink)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Slot machine demo */}
        <div className="max-w-md mx-auto reveal">
          <p className="text-center text-sm font-medium mb-4" style={{ color: "var(--ink-dim)" }}>
            Essayez le mini-jeu fidélité intégré ↓
          </p>
          <LoyaltyGameDemo />
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ───────────────────────────────────────────────────────────── */
function PricingSection() {
  const [annual, setAnnual] = useState(false);

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
    } catch {
      window.location.href = "/register";
    }
  };

  return (
    <section id="pricing" className="section-dark">
      <div className="container">
        <div className="text-center mb-12 reveal">
          <p className="eyebrow mb-4">Tarifs</p>
          <h2 className="section-title mb-4" style={{ color: "var(--text)" }}>
            Simple et{" "}
            <span className="serif" style={{ color: "var(--violet)" }}>transparent</span>
          </h2>
          <p className="lede max-w-xl mx-auto mb-8">Sans engagement. Annulable à tout moment.</p>

          {/* Toggle mensuel/annuel */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button onClick={() => setAnnual(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: annual ? "transparent" : "rgba(167,139,250,0.15)", color: annual ? "var(--text-dim)" : "var(--violet)", border: annual ? "none" : "1px solid rgba(167,139,250,0.3)" }}>
              Mensuel
            </button>
            <button onClick={() => setAnnual(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              style={{ background: !annual ? "transparent" : "rgba(52,211,153,0.15)", color: !annual ? "var(--text-dim)" : "var(--mint)", border: !annual ? "none" : "1px solid rgba(52,211,153,0.3)" }}>
              Annuel
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(52,211,153,0.2)", color: "var(--mint)" }}>−20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((plan, i) => (
            <PricingCard key={plan.id} plan={plan} annual={annual} onCheckoutPro={handleCheckoutPro} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({
  plan, annual, onCheckoutPro, delay,
}: {
  plan: typeof PLANS[0]; annual: boolean; onCheckoutPro: () => void; delay: number;
}) {
  const price = annual ? plan.annual : plan.monthly;
  const [hovered, setHovered] = useState(false);

  const handleCta = () => {
    if (plan.id === "pro") { onCheckoutPro(); return; }
    if (plan.ctaHref) window.location.href = plan.ctaHref;
  };

  return (
    <div
      className="reveal relative flex flex-col"
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {plan.highlight && (
        <>
          <div aria-hidden className="absolute -inset-px rounded-[22px]"
            style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.5), rgba(52,211,153,0.3))", zIndex: 0 }} />
        </>
      )}
      <div className="relative z-10 flex flex-col h-full rounded-[22px] p-8"
        style={{
          background: plan.highlight ? "var(--surface)" : "var(--bg-2)",
          border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.06)",
          boxShadow: plan.highlight ? "0 0 60px rgba(167,139,250,0.15)" : hovered ? "0 0 40px rgba(167,139,250,0.08)" : "none",
          transition: "box-shadow 0.3s",
        }}>
        {plan.highlight && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ background: "var(--violet)", color: "#ffffff" }}>
            {plan.badge}
          </div>
        )}
        {plan.extraBadge && (
          <div className="inline-flex self-start mb-3 px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{ background: "rgba(52,211,153,0.12)", color: "var(--mint)", border: "1px solid rgba(52,211,153,0.2)" }}>
            {plan.extraBadge}
          </div>
        )}

        <div className="mb-2">
          <h3 className="font-semibold text-lg" style={{ color: "var(--text)" }}>{plan.name}</h3>
          {!plan.highlight && <p className="text-sm mt-0.5" style={{ color: "var(--text-dim)" }}>{plan.badge}</p>}
        </div>

        <div className="mb-8 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight" style={{ color: plan.highlight ? "var(--violet)" : "var(--text)" }}>
            {price}€
          </span>
          <span style={{ color: "var(--text-dim)" }}>/mois</span>
          {annual && <span className="text-xs ml-1" style={{ color: "var(--mint)" }}>HT</span>}
        </div>

        <ul className="space-y-3 text-sm mb-8 flex-1">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-3">
              <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--mint)" }} />
              <span style={{ color: plan.highlight ? "var(--text)" : "var(--text-dim)" }}>{f}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleCta}
          className={`btn btn-lg justify-center w-full ${plan.highlight ? "btn-accent" : "btn-ghost"}`}
        >
          {plan.cta} {plan.highlight && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

/* ─── FAQ ───────────────────────────────────────────────────────────── */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (i: number | null) => void }) {
  return (
    <section id="faq" className="section-light">
      <div className="container max-w-3xl">
        <div className="text-center mb-16 reveal">
          <p className="eyebrow mb-4" style={{ color: "var(--ink-dim)" }}>FAQ</p>
          <h2 className="section-title mb-4" style={{ color: "var(--ink)" }}>
            Questions{" "}
            <span className="serif" style={{ color: "var(--violet)" }}>fréquentes</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="card-light overflow-hidden reveal" style={{ animationDelay: `${i * 0.04}s` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                style={{ color: "var(--ink)" }}>
                <span className="font-medium pr-4">{f.q}</span>
                <ChevronDown
                  className="w-5 h-5 shrink-0 transition-transform duration-200"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "none", color: openFaq === i ? "var(--violet)" : "var(--ink-dim)" }}
                />
              </button>
              <div
                style={{
                  maxHeight: openFaq === i ? 300 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.3s ease",
                }}>
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
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
    <section className="section-dark">
      <div className="container">
        <div className="relative rounded-[32px] overflow-hidden p-12 sm:p-16 reveal"
          style={{ background: "#0d0d14", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(167,139,250,0.08) 0%, transparent 60%)" }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="eyebrow mb-4">Application mobile</p>
              <h2 className="section-title mb-4" style={{ color: "var(--text)" }}>
                Gérez votre fidélité{" "}
                <span className="serif" style={{ color: "var(--mint)" }}>depuis votre poche</span>
              </h2>
              <p className="lede max-w-lg mb-8" style={{ color: "var(--text-dim)" }}>
                Scannez les QR codes, ajoutez des points et suivez vos clients directement depuis l&apos;app Fideloo. Disponible sur iPhone.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-medium transition-all"
                  style={{ background: "#000", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#1a1a1a")}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#000")}>
                  <AppleLogoSVG size={20} />
                  <div className="text-left">
                    <div className="text-xs opacity-70">Disponible sur l&apos;</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-36 h-36 rounded-3xl flex items-center justify-center shadow-2xl"
                style={{ background: "linear-gradient(135deg, var(--violet), #34d399)", boxShadow: "0 30px 60px rgba(167,139,250,0.3)" }}>
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-light">
      <div className="container max-w-2xl">
        <div className="text-center mb-12 reveal">
          <p className="eyebrow mb-4" style={{ color: "var(--ink-dim)" }}>Contact</p>
          <h2 className="section-title mb-4" style={{ color: "var(--ink)" }}>
            Une question ?{" "}
            <span className="serif" style={{ color: "var(--violet)" }}>Écrivez-nous</span>
          </h2>
          <p className="lede" style={{ color: "var(--ink-dim)" }}>
            Notre équipe vous répond sous 24h.
          </p>
        </div>

        <div className="card-light p-8 reveal">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(52,211,153,0.12)", color: "var(--mint)" }}>
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl mb-2" style={{ color: "var(--ink)" }}>Message envoyé !</h3>
              <p style={{ color: "var(--ink-dim)" }}>Nous vous répondrons sous 24h à {email}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off"
                value={honeypot} onChange={e => setHoneypot(e.target.value)}
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", top: "-9999px", width: 0, height: 0, opacity: 0, pointerEvents: "none" }} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Prénom</label>
                  <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                    className="input-field w-full" placeholder="Lucas" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Nom</label>
                  <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                    className="input-field w-full" placeholder="Bernard" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  className="input-field w-full" placeholder="lucas@moncommerce.fr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--ink)" }}>Message</label>
                <textarea required value={message} onChange={e => setMessage(e.target.value)}
                  rows={4} className="input-field w-full resize-none" placeholder="Votre message…" />
              </div>

              {error && (
                <div className="p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="btn btn-accent btn-lg w-full justify-center disabled:opacity-70">
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
    <section className="section-dark">
      <div className="container">
        <div className="relative rounded-[32px] overflow-hidden reveal"
          style={{ background: "var(--surface)", border: "1px solid rgba(167,139,250,0.2)", boxShadow: "0 0 80px rgba(167,139,250,0.1)" }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top, rgba(167,139,250,0.12) 0%, transparent 60%)" }} />
          <div className="relative z-10 p-12 sm:p-20 text-center">
            <p className="eyebrow mb-6">Prêt à démarrer ?</p>
            <h2 className="section-title mb-6" style={{ color: "var(--text)" }}>
              Fidélisez vos clients{" "}
              <span className="serif" style={{ color: "var(--violet)" }}>dès aujourd&apos;hui</span>
            </h2>
            <p className="lede max-w-xl mx-auto mb-10">
              Rejoignez les 500+ commerces qui modernisent leur fidélité avec Fideloo. Gratuit pour démarrer.
            </p>
            <Link href="/register"
              className="inline-flex items-center gap-3 font-bold text-white rounded-2xl transition-all"
              style={{
                background: "linear-gradient(135deg, var(--mint), #22c55e)",
                padding: "20px 48px",
                fontSize: 18,
                boxShadow: "0 0 40px rgba(52,211,153,0.35), 0 1px 0 rgba(255,255,255,0.2) inset",
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.03)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}>
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
    {
      title: "Produit",
      links: [
        { label: "Fonctionnalités", href: "#features" },
        { label: "Comment ça marche", href: "#features" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Scanner", href: "/dashboard/scanner" },
      ],
    },
    {
      title: "Tarifs",
      links: [
        { label: "Plan Standard", href: "#pricing" },
        { label: "Plan Pro", href: "#pricing" },
        { label: "Plan Business", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Mentions légales", href: "/mentions-legales" },
        { label: "Confidentialité", href: "/politique-confidentialite" },
        { label: "CGU", href: "/cgu" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Nous écrire", href: "#contact" },
        { label: "contact@fideloo.fr", href: "mailto:contact@fideloo.fr" },
        { label: "App Store", href: "https://apps.apple.com" },
      ],
    },
  ];

  return (
    <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--line)", paddingTop: 64, paddingBottom: 48 }}>
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {cols.map(col => (
            <div key={col.title}>
              <p className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "var(--text-dim)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ borderTop: "1px solid var(--line)", color: "var(--text-dim)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm"
              style={{ background: "var(--violet)", color: "#ffffff" }}>F</div>
            <span className="font-medium" style={{ color: "var(--text)" }}>Fideloo</span>
            <span>· © {new Date().getFullYear()}</span>
          </div>
          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{ background: "#000", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "#1a1a1a")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "#000")}>
            <AppleLogoSVG size={13} />
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
        <p className="text-sm flex-1" style={{ color: "var(--text-dim)" }}>
          Nous utilisons uniquement des cookies fonctionnels essentiels.{" "}
          <Link href="/politique-confidentialite" className="underline" style={{ color: "var(--violet)" }}>
            En savoir plus
          </Link>
        </p>
        <button onClick={onAccept} className="btn btn-primary btn-sm shrink-0">
          J&apos;accepte
        </button>
      </div>
    </div>
  );
}

/* ─── UTILS ─────────────────────────────────────────────────────────────── */
function AppleLogoSVG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    </svg>
  );
}
