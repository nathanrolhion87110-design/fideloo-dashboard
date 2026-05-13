"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, BarChart3, CreditCard, Megaphone, Zap,
  Plug, History, Receipt, Settings, Menu, X, LogOut, Bell,
  Search, ChevronDown, ChevronRight, ScanLine, UserPlus,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import TutorialOverlay from "@/app/components/TutorialOverlay";
import { FideloLogoStamp } from "@/components/FideloLogoStamp";

/* ── Design tokens ─────────────────────────────────── */
const DB   = "#09090B";
const DS   = "#18181B";
const DS2  = "#1C1C21";
const DL   = "rgba(255,255,255,0.06)";
const DL2  = "rgba(255,255,255,0.10)";
const DT   = "#FAFAFA";
const DTD  = "rgba(250,250,250,0.45)";
const DI   = "#6366F1";
const DIS  = "rgba(99,102,241,0.12)";
const DIB  = "rgba(99,102,241,0.22)";
const DE   = "#10B981";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
  soon?: boolean;
}
interface NavSection { label: string; items: NavItem[] }

const NAV: NavSection[] = [
  {
    label: "Principal",
    items: [
      { name: "Dashboard",      href: "/dashboard",               icon: LayoutDashboard, exact: true },
      { name: "Clients",        href: "/dashboard/clients",        icon: Users },
      { name: "Analytics",      href: "/dashboard/analytiques",    icon: BarChart3 },
      { name: "Wallet Passes",  href: "/dashboard/scanner",        icon: CreditCard },
    ],
  },
  {
    label: "Croissance",
    items: [
      { name: "Campagnes",      href: "/dashboard/notifications",  icon: Megaphone },
      { name: "Automations",    href: "#",                         icon: Zap,      soon: true },
      { name: "Intégrations",   href: "#",                         icon: Plug,     soon: true },
    ],
  },
  {
    label: "Gestion",
    items: [
      { name: "Transactions",   href: "/dashboard/transactions",   icon: History },
      { name: "Facturation",    href: "#",                         icon: Receipt,  soon: true },
      { name: "Paramètres",     href: "/dashboard/parametres",     icon: Settings },
    ],
  },
];

const NOTIFS = [
  { text: "Nouvelle inscription",       sub: "Marie L. vient de rejoindre",     time: "2min",  dot: DE },
  { text: "Campagne push envoyée",      sub: "847 clients notifiés",            time: "1h",    dot: DI },
  { text: "Objectif du mois atteint",   sub: "50 nouvelles cartes installées",  time: "3h",    dot: "#F59E0B" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const { merchant, logout } = useAuth();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef   = useRef<HTMLDivElement>(null);

  /* Click-outside closers */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ⌘K global shortcut */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(v => !v); }
      if (e.key === "Escape") { setSearchOpen(false); setNotifOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const isActive = (item: NavItem) => {
    if (item.href === "#") return false;
    return item.exact ? pathname === item.href : (pathname === item.href || pathname?.startsWith(item.href + "/"));
  };

  const initials = (merchant?.business_name || "F")
    .split(" ").slice(0, 2).map(s => s[0]?.toUpperCase() ?? "").join("");

  /* ── Sidebar inner ─────────────────────────────── */
  const SidebarInner = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full" style={{ background: DB, borderRight: `1px solid ${DL}` }}>

      {/* Logo + Search */}
      <div className="px-4 pt-5 pb-3 space-y-3">
        <div className="flex items-center gap-3 px-2 mb-1">
          <FideloLogoStamp variant="onDark" size={40} />
        </div>

        <button
          onClick={() => { setSearchOpen(true); onNav?.(); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-all"
          style={{ background: DS, border: `1px solid ${DL}`, color: DTD }}>
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1 text-xs">Rechercher…</span>
          <kbd className="text-xs rounded font-mono px-1"
            style={{ background: DB, border: `1px solid ${DL}`, color: DTD, fontSize: 9 }}>⌘K</kbd>
        </button>
      </div>

      {/* Quick actions */}
      <div className="px-4 pb-3 flex gap-2">
        <Link href="/dashboard/scanner" onClick={onNav}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all"
          style={{ background: DIS, border: `1px solid ${DIB}`, color: DI }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = DIB)}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = DIS)}>
          <ScanLine className="w-3 h-3" /> Scanner
        </Link>
        <Link href="/dashboard/clients" onClick={onNav}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all"
          style={{ background: DS, border: `1px solid ${DL}`, color: DTD }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = DIB; el.style.color = DT; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = DL; el.style.color = DTD; }}>
          <UserPlus className="w-3 h-3" /> Client
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-4 pb-2">
        {NAV.map(section => (
          <div key={section.label}>
            <p className="px-3 mb-1 uppercase tracking-widest font-medium"
              style={{ fontSize: 10, color: "rgba(250,250,250,0.22)", letterSpacing: "0.1em" }}>
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={item.soon ? undefined : onNav}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      background:    active ? DIS : "transparent",
                      color:         active ? DT  : DTD,
                      fontWeight:    active ? 500 : 400,
                      pointerEvents: item.soon ? "none" : "auto",
                    }}
                    onMouseEnter={e => {
                      if (!active && !item.soon) {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                        (e.currentTarget as HTMLElement).style.color = DT;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.color = DTD;
                      }
                    }}>
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                        style={{ background: DI }} />
                    )}
                    <item.icon className="w-4 h-4 flex-shrink-0"
                      style={{ color: active ? DI : "inherit", opacity: active ? 1 : 0.55 }} />
                    <span className="flex-1">{item.name}</span>
                    {item.soon && (
                      <span className="rounded-md px-1.5 py-0.5 font-medium"
                        style={{ fontSize: 9, background: DIS, color: DI, letterSpacing: "0.04em" }}>
                        Bientôt
                      </span>
                    )}
                    {active && (
                      <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: DI, opacity: 0.5 }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 space-y-0.5" style={{ borderTop: `1px solid ${DL}` }}>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: DTD, background: notifOpen ? "rgba(255,255,255,0.04)" : "transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = DT; }}
            onMouseLeave={e => { if (!notifOpen) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = DTD; } }}>
            <div className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full" style={{ background: DE }} />
            </div>
            <span>Notifications</span>
            <span className="ml-auto rounded-full px-1.5 py-0.5 text-xs font-semibold"
              style={{ background: "rgba(16,185,129,0.15)", color: DE }}>3</span>
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, x: -8, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-2 left-0 w-72 z-50 rounded-2xl overflow-hidden"
                style={{ background: DS2, border: `1px solid ${DL2}`, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${DL}` }}>
                  <span className="text-sm font-semibold" style={{ color: DT }}>Notifications</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: DIS, color: DI }}>3</span>
                </div>
                <div className="p-2">
                  {NOTIFS.map((n, i) => (
                    <div key={i}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: n.dot }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium" style={{ color: DT }}>{n.text}</div>
                        <div className="text-xs truncate" style={{ color: DTD }}>{n.sub}</div>
                      </div>
                      <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: DTD }}>{n.time}</span>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5" style={{ borderTop: `1px solid ${DL}` }}>
                  <Link href="/dashboard/notifications" onClick={() => setNotifOpen(false)}
                    className="block text-center text-xs font-medium transition-colors"
                    style={{ color: DI }}
                    onMouseEnter={e => (e.currentTarget.style.color = DT)}
                    onMouseLeave={e => (e.currentTarget.style.color = DI)}>
                    Voir tout →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(v => !v)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: DTD, background: profileOpen ? "rgba(255,255,255,0.04)" : "transparent" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.color = DT; }}
            onMouseLeave={e => { if (!profileOpen) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = DTD; } }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
              style={{ background: DIS, border: `1px solid ${DIB}`, color: DI }}>
              {initials}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <div className="text-sm font-medium truncate leading-tight" style={{ color: DT }}>
                {merchant?.business_name || "Mon Commerce"}
              </div>
              <div className="truncate" style={{ fontSize: 11, color: DTD }}>Plan Pro</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
              style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-2 left-0 right-0 z-50 rounded-xl p-1.5"
                style={{ background: DS2, border: `1px solid ${DL2}`, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
                <Link href="/dashboard/parametres" onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors"
                  style={{ color: DTD }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = DT; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = DTD; }}>
                  <Settings className="w-4 h-4" /> Paramètres
                </Link>
                <div style={{ height: 1, background: DL, margin: "4px 0" }} />
                <button onClick={() => { logout(); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors text-left"
                  style={{ color: "#EF4444" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex" style={{ background: DB }}>

        {/* Desktop sidebar */}
        <aside className="hidden md:flex flex-col w-60 fixed inset-y-0 z-40 shrink-0">
          <SidebarInner />
        </aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 md:hidden"
                style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
                onClick={() => setMobileOpen(false)} />
              <motion.aside
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                className="fixed inset-y-0 left-0 w-60 z-50 md:hidden">
                <SidebarInner onNav={() => setMobileOpen(false)} />
                <button onClick={() => setMobileOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg"
                  style={{ color: DTD }} aria-label="Fermer">
                  <X className="w-5 h-5" />
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 md:pl-60 flex flex-col min-h-screen">

          {/* Mobile header */}
          <header className="md:hidden h-14 flex items-center px-4 justify-between sticky top-0 z-30"
            style={{ background: "rgba(9,9,11,0.95)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${DL}` }}>
            <div className="flex items-center gap-2">
              <FideloLogoStamp variant="onDark" size={32} />
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg" style={{ color: DTD }}>
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg" style={{ color: DTD }} aria-label="Menu">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 xl:p-8">
            <TutorialOverlay onComplete={() => {}} />
            {children}
          </main>
        </div>
      </div>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
              onClick={() => setSearchOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
              <div className="rounded-2xl overflow-hidden"
                style={{ background: DS2, border: `1px solid ${DL2}`, boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
                <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: `1px solid ${DL}` }}>
                  <Search className="w-4 h-4 flex-shrink-0" style={{ color: DTD }} />
                  <input
                    autoFocus
                    placeholder="Rechercher un client, une page…"
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: DT }}
                  />
                  <kbd className="text-xs px-1.5 py-0.5 rounded font-mono"
                    style={{ background: DB, border: `1px solid ${DL}`, color: DTD, fontSize: 10 }}>Esc</kbd>
                </div>
                <div className="p-2">
                  <p className="px-3 py-1.5 text-xs uppercase tracking-wider" style={{ color: DTD, fontSize: 10 }}>Navigation</p>
                  {NAV.flatMap(s => s.items).filter(i => i.href !== "#").map(item => (
                    <Link key={item.name} href={item.href} onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                      style={{ color: DTD }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.color = DT; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = DTD; }}>
                      <item.icon className="w-4 h-4" style={{ color: DI, opacity: 0.7 }} />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
}
