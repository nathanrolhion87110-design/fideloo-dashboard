"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, ScanLine, History, BarChart3, Bell, Settings, Menu, X, LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TutorialOverlay from "../components/TutorialOverlay";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

const sidebarLinks = [
  { name: "Dashboard",     href: "/dashboard",                icon: LayoutDashboard },
  { name: "Clients",       href: "/dashboard/clients",        icon: Users },
  { name: "Scanner",       href: "/dashboard/scanner",        icon: ScanLine },
  { name: "Transactions",  href: "/dashboard/transactions",   icon: History },
  { name: "Analytiques",   href: "/dashboard/analytiques",    icon: BarChart3 },
  { name: "Notifications", href: "/dashboard/notifications",  icon: Bell },
  { name: "Paramètres",    href: "/dashboard/parametres",     icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { merchant, logout } = useAuth();

  const initials = (merchant?.business_name || "?")
    .split(" ").slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full"
      style={{
        background: "var(--bg)",
        borderRight: "1px solid var(--line)",
      }}>
      {/* Logo */}
      <div className="h-20 flex items-center px-6 gap-3"
        style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base"
          style={{ background: "var(--violet)", color: "#ffffff" }}>
          F
        </div>
        <span className="font-semibold text-lg tracking-tight" style={{ color: "var(--text)" }}>Fideloo</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onNav}
              className={["flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative",
                isActive ? "nav-active font-semibold" : ""].join(" ")}
              style={!isActive ? { color: "var(--text-dim)" } : {}}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; } }}
            >
              <link.icon className="w-[18px] h-[18px]" style={isActive ? {} : { opacity: 0.7 }} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="p-3" style={{ borderTop: "1px solid var(--line)" }}>
        <div className="px-3 py-3 rounded-xl flex items-center gap-3 transition-colors"
          style={{ cursor: "default" }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
            style={{ background: "var(--violet-soft)", border: "1px solid rgba(167,139,250,0.3)", color: "var(--violet)" }}>
            {initials || "F"}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{merchant?.business_name || "Mon Commerce"}</div>
            <div className="text-xs truncate" style={{ color: "var(--text-dim)" }}>{merchant?.email || "Pro"}</div>
          </div>
          <button onClick={() => logout()} title="Se déconnecter"
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-dim)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.background = "transparent"; }}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-[260px] fixed inset-y-0 z-40">
          <SidebarContent />
        </aside>

        {/* Sidebar Mobile overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
                style={{ background: "rgba(0,0,0,0.7)" }}
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed inset-y-0 left-0 w-[260px] z-50 md:hidden">
                <SidebarContent onNav={() => setMobileMenuOpen(false)} />
                <button onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg transition-colors"
                  style={{ color: "#8A8070" }}
                  aria-label="Fermer">
                  <X className="w-5 h-5" />
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen">
          {/* Mobile header */}
          <header className="md:hidden h-16 flex items-center px-4 justify-between sticky top-0 z-30 glass-nav">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                style={{ background: "var(--violet)", color: "#ffffff" }}>F</div>
              <span className="font-semibold" style={{ color: "var(--text)" }}>Fideloo</span>
            </div>
            <button onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg" style={{ color: "var(--text-dim)" }} aria-label="Menu">
              <Menu className="w-6 h-6" />
            </button>
          </header>

          <main className="flex-1 p-4 md:p-8 relative">
            <TutorialOverlay onComplete={() => console.log("Tutorial terminé")} />
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
