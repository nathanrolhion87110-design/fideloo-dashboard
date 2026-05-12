"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Smartphone, QrCode, Zap, BarChart3, Palette, Bell,
  Check, ChevronDown, Menu, X, Lock, Star, Sparkles,
} from "lucide-react";

/* ─── DATA ──────────────────────────────────────────────────────────────── */
const USE_CASES = ["Boulangerie", "Restaurant", "Coiffeur", "Café", "Pizzeria", "Boutique", "Épicerie", "Salon de beauté", "Fleuriste", "Pharmacie"];

const FEATURES = [
  { Icon: Smartphone, title: "Apple Wallet & Google Wallet", desc: "La carte s'ajoute en 1 tap dans le téléphone natif du client. Aucune app à télécharger." },
  { Icon: QrCode, title: "QR Code instantané", desc: "Affichez votre QR en caisse. Le client scanne et s'inscrit en 30 secondes." },
  { Icon: Zap, title: "Mise à jour temps réel", desc: "Ajoutez des points en 1 clic. La carte se met à jour instantanément sur le téléphone." },
  { Icon: BarChart3, title: "Analytics détaillés", desc: "Suivez vos meilleurs clients, la fréquence de visite et vos récompenses distribuées." },
  { Icon: Palette, title: "100% personnalisable", desc: "Couleurs, logo, récompenses : votre carte à votre image en quelques clics." },
  { Icon: Bell, title: "Notifications push", desc: "Envoyez des offres directement sur l'écran de verrouillage de vos clients." },
];

const TESTIMONIALS = [
  { name: "Marie L.", role: "Boulangerie des Halles", text: "En 3 semaines, 80 clients ont ajouté la carte. Mes ventes du matin ont augmenté de 20%.", stars: 5 },
  { name: "Karim B.", role: "Café du Marché", text: "L'installation m'a pris 10 minutes. Mes clients fidèles reviennent 2× plus souvent.", stars: 5 },
  { name: "Sophie T.", role: "Salon Éclat", text: "Mes clientes adorent avoir leur carte dans leur iPhone. Fini les vieilles cartes papier.", stars: 5 },
];

const FAQS = [
  { q: "Est-ce que mes clients ont besoin d'une app ?", a: "Non. La carte s'ajoute directement dans Apple Wallet ou Google Wallet, déjà installés sur tous les smartphones." },
  { q: "Comment les clients s'inscrivent-ils ?", a: "Ils scannent votre QR code et remplissent un formulaire simple (prénom + email). Ils reçoivent leur carte en moins de 30 secondes." },
  { q: "Puis-je personnaliser ma carte ?", a: "Oui : couleurs, logo, nom du commerce et récompense — tout est entièrement personnalisable depuis votre dashboard." },
  { q: "Comment mettre à jour les points ?", a: "Depuis votre dashboard, vous cherchez le client et cliquez pour ajouter des points. La carte se met à jour instantanément sur leur téléphone." },
  { q: "Y a-t-il un engagement ?", a: "Aucun. Le plan Pro est mensuel et annulable à tout moment depuis vos paramètres ou le portail Stripe." },
];

/* ─── PAGE ──────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showCookies, setShowCookies] = useState(false);

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

  return (
    <>
      <Navbar scrolled={scrolled} />
      <main>
        <Hero />
        <MarqueeSection />
        <FeaturesSection />
        <DemoSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
        <CtaFinal />
        <Footer />
      </main>
      {showCookies && <CookieBanner onAccept={() => { localStorage.setItem("fideloo_cookie_ok", "1"); setShowCookies(false); }} />}
    </>
  );
}

/* ─── NAVBAR ────────────────────────────────────────────────────────────── */
function Navbar({ scrolled }: { scrolled: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ background: scrolled ? "rgba(10,10,11,0.92)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none" }}
    >
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ background: "var(--violet)", color: "#ffffff" }}>F</div>
          <span className="font-semibold text-base tracking-tight" style={{ color: "var(--text)" }}>Fideloo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--text-dim)" }}>
          {(["#features", "#pricing", "#faq"] as const).map((href, i) => {
            const labels = ["Fonctionnalités", "Tarifs", "FAQ"];
            return (
              <a key={href} href={href} className="transition-colors hover:text-[--text]"
                style={{ color: "var(--text-dim)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}>
                {labels[i]}
              </a>
            );
          })}
          <Link href="/login" className="transition-colors"
            style={{ color: "var(--text-dim)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}>
            Se connecter
          </Link>
        </nav>

        <Link href="/register" className="hidden md:inline-flex btn btn-accent btn-sm">
          Commencer <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button type="button" aria-label={mobileOpen ? "Fermer" : "Menu"}
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 rounded-lg" style={{ color: "var(--text)" }}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden mx-4 mb-3 rounded-2xl p-3 glass">
          <nav className="flex flex-col gap-1 text-sm">
            {[["#features", "Fonctionnalités"], ["#pricing", "Tarifs"], ["#faq", "FAQ"]].map(([href, label]) => (
              <a key={label} href={href} onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl transition-colors" style={{ color: "var(--text)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                {label}
              </a>
            ))}
            <Link href="/login" onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-xl" style={{ color: "var(--text)" }}>
              Se connecter
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}
              className="btn btn-accent btn-md mt-1 mx-1 justify-center">
              Commencer gratuitement <ArrowRight className="w-4 h-4" />
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
    <section className="relative overflow-hidden section-dark pt-32 pb-20 grain">
      {/* Orbs */}
      <div aria-hidden className="absolute pointer-events-none" style={{ top: "-10%", left: "55%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div aria-hidden className="absolute pointer-events-none float-orb" style={{ top: "20%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)", filter: "blur(50px)" }} />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
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
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" style={{ color: "var(--mint)", fill: "var(--mint)" }} />
                500+ commerces actifs
              </span>
              <span style={{ color: "var(--line-2)" }}>·</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" style={{ color: "var(--mint)" }} />
                Sans carte bancaire
              </span>
              <span style={{ color: "var(--line-2)" }}>·</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" style={{ color: "var(--violet)" }} />
                Prêt en 2 minutes
              </span>
            </div>
          </div>

          {/* Right — Dashboard mockup */}
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
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "var(--bg)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
          <div className="flex-1 mx-3 rounded-md px-3 py-1 text-xs" style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-dim)" }}>
            app.fideloo.fr/dashboard
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Stat cards row */}
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

          {/* Mini chart */}
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

          {/* Client list */}
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

      {/* Floating wallet badge */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card-light p-7 reveal" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "var(--violet-soft)", border: "1px solid rgba(167,139,250,0.2)" }}>
                <f.Icon className="w-5 h-5" style={{ color: "var(--violet)" }} />
              </div>
              <h3 className="font-semibold mb-2 text-base" style={{ color: "var(--ink)" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── DEMO ──────────────────────────────────────────────────────────────── */
function DemoSection() {
  const steps = [
    { n: "01", title: "Créez votre compte", desc: "Inscrivez-vous gratuitement avec email, Google ou Apple en 30 secondes." },
    { n: "02", title: "Configurez votre carte", desc: "Choisissez vos couleurs, ajoutez votre logo et définissez votre récompense." },
    { n: "03", title: "Partagez votre QR code", desc: "Affichez-le en caisse. Vos clients s'inscrivent et reçoivent leur carte instantanément." },
  ];

  return (
    <section className="section-dark">
      <div className="container">
        <div className="text-center mb-16 reveal">
          <p className="eyebrow mb-4">Comment ça marche</p>
          <h2 className="section-title mb-4" style={{ color: "var(--text)" }}>
            Lancez-vous en{" "}
            <span className="serif" style={{ color: "var(--mint)" }}>3 minutes</span>
          </h2>
          <p className="lede max-w-xl mx-auto">Aucune compétence technique requise.</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          <div aria-hidden className="hidden md:block absolute top-10 left-[18%] right-[18%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent)" }} />

          {steps.map((s, i) => (
            <div key={s.n} className="card-dark p-8 text-center reveal" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg mb-5"
                style={{ background: "var(--violet-soft)", border: "1px solid rgba(167,139,250,0.3)", color: "var(--violet)" }}>
                {s.n}
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ───────────────────────────────────────────────────────────── */
function PricingSection() {
  const handleCheckoutPro = async () => {
    const merchantStr = typeof window !== "undefined" ? localStorage.getItem("fideloo_merchant") : null;
    if (!merchantStr) { window.location.href = "/register"; return; }
    try {
      const merchant = JSON.parse(merchantStr) as { id: string };
      const token = localStorage.getItem("fideloo_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe/create-checkout`, {
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
        <div className="text-center mb-16 reveal">
          <p className="eyebrow mb-4">Tarifs</p>
          <h2 className="section-title mb-4" style={{ color: "var(--text)" }}>
            Simple et{" "}
            <span className="serif" style={{ color: "var(--violet)" }}>transparent</span>
          </h2>
          <p className="lede max-w-xl mx-auto">Sans engagement. Annulable à tout moment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Gratuit */}
          <div className="card-dark p-8 flex flex-col reveal">
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--text)" }}>Gratuit</h3>
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>Pour démarrer votre fidélité</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tight" style={{ color: "var(--text)" }}>0€</span>
              <span style={{ color: "var(--text-dim)" }}>/mois</span>
            </div>
            <ul className="space-y-3 text-sm mb-8 flex-1">
              {["Jusqu'à 50 clients", "1 commerce", "Apple & Google Wallet", "QR code personnalisé", "Support email"].map(f => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--mint)" }} />
                  <span style={{ color: "var(--text-dim)" }}>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/register" className="btn btn-ghost btn-lg justify-center">
              Commencer gratuitement
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col reveal" style={{ animationDelay: "0.1s" }}>
            <div aria-hidden className="absolute -inset-px rounded-[22px]"
              style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.5), rgba(52,211,153,0.3))", zIndex: 0 }} />
            <div className="relative z-10 p-8 flex flex-col h-full rounded-[22px]"
              style={{ background: "var(--surface)", boxShadow: "0 0 60px rgba(167,139,250,0.15)" }}>
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "var(--violet)", color: "#ffffff" }}>
                Recommandé
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--text)" }}>Pro</h3>
                <p className="text-sm" style={{ color: "var(--text-dim)" }}>Pour scaler votre fidélité</p>
              </div>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight gradient-text">70€</span>
                <span style={{ color: "var(--text-dim)" }}>/mois</span>
              </div>
              <ul className="space-y-3 text-sm mb-8 flex-1">
                {["Clients illimités", "Commerces illimités", "Analytics avancés", "Notifications push", "Mise à jour temps réel", "Support prioritaire"].map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--mint)" }} />
                    <span style={{ color: "var(--text)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={handleCheckoutPro} className="btn btn-accent btn-lg justify-center">
                Passer au Pro <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ──────────────────────────────────────────────────────── */
function TestimonialsSection() {
  return (
    <section className="section-light">
      <div className="container">
        <div className="text-center mb-16 reveal">
          <p className="eyebrow mb-4" style={{ color: "var(--ink-dim)" }}>Témoignages</p>
          <h2 className="section-title mb-4" style={{ color: "var(--ink)" }}>
            Ils ont{" "}
            <span className="serif" style={{ color: "var(--violet)" }}>adopté</span>
            {" "}Fideloo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="card-light p-7 flex flex-col reveal" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4" style={{ color: "var(--violet)", fill: "var(--violet)" }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: "var(--ink-dim)" }}>"{t.text}"</p>
              <div>
                <div className="font-semibold text-sm" style={{ color: "var(--ink)" }}>{t.name}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--ink-dim)" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ───────────────────────────────────────────────────────────────── */
function FaqSection({ openFaq, setOpenFaq }: { openFaq: number | null; setOpenFaq: (i: number | null) => void }) {
  return (
    <section id="faq" className="section-dark">
      <div className="container max-w-3xl">
        <div className="text-center mb-16 reveal">
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="section-title mb-4" style={{ color: "var(--text)" }}>
            Questions{" "}
            <span className="serif" style={{ color: "var(--mint)" }}>fréquentes</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="card-dark overflow-hidden reveal" style={{ animationDelay: `${i * 0.05}s` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
                style={{ color: "var(--text)" }}>
                <span className="font-medium pr-4">{f.q}</span>
                <ChevronDown
                  className="w-5 h-5 shrink-0 transition-transform duration-200"
                  style={{ transform: openFaq === i ? "rotate(180deg)" : "none", color: openFaq === i ? "var(--violet)" : "var(--text-dim)" }}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
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
        <div className="relative rounded-[32px] overflow-hidden p-12 sm:p-20 text-center reveal"
          style={{ background: "var(--surface)", border: "1px solid rgba(167,139,250,0.2)", boxShadow: "0 0 80px rgba(167,139,250,0.1)" }}>
          <div aria-hidden className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top, rgba(167,139,250,0.12) 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <p className="eyebrow mb-6">Prêt à démarrer ?</p>
            <h2 className="section-title mb-6" style={{ color: "var(--text)" }}>
              Fidélisez vos clients{" "}
              <span className="serif" style={{ color: "var(--violet)" }}>dès aujourd'hui</span>
            </h2>
            <p className="lede max-w-xl mx-auto mb-10">
              Rejoignez les 500+ commerces qui modernisent leur fidélité avec Fideloo. Gratuit pour démarrer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="btn btn-accent btn-lg">
                Créer mon compte gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/login" className="btn btn-ghost btn-lg">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="section-dark" style={{ paddingTop: 0, paddingBottom: 48 }}>
      <div className="container">
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
          style={{ borderTop: "1px solid var(--line)", color: "var(--text-dim)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-sm"
              style={{ background: "var(--violet)", color: "#ffffff" }}>F</div>
            <span className="font-medium" style={{ color: "var(--text)" }}>Fideloo</span>
            <span>· © {new Date().getFullYear()}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[["/mentions-legales", "Mentions légales"], ["/politique-confidentialite", "Confidentialité"], ["/cgu", "CGU"]].map(([href, label]) => (
              <Link key={href} href={href} className="transition-colors hover:text-[--text]"
                style={{ color: "var(--text-dim)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}>
                {label}
              </Link>
            ))}
            <a href="mailto:contact@fideloo.fr" className="transition-colors"
              style={{ color: "var(--text-dim)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}>
              Contact
            </a>
          </div>
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
