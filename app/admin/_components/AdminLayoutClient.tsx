"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Activity, Users, Clock, CreditCard, TrendingUp, MessageSquare, Terminal, LogOut } from "lucide-react";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const W    = 260;

const NAV_GROUPS = [
  {
    label: "GÉNÉRAL",
    items: [
      { label: "Vue d'ensemble",    href: "/admin",             icon: LayoutDashboard },
      { label: "Activité",          href: "/admin/activite",    icon: Activity        },
    ],
  },
  {
    label: "COMPTES",
    items: [
      { label: "Tous les comptes",  href: "/admin/comptes",     icon: Users      },
      { label: "Essais en cours",   href: "/admin/essais",      icon: Clock      },
      { label: "Abonnements",       href: "/admin/abonnements", icon: CreditCard },
    ],
  },
  {
    label: "REVENUS",
    items: [
      { label: "MRR / ARR",         href: "/admin/revenus",     icon: TrendingUp },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { label: "Messages contact",  href: "/admin/messages",    icon: MessageSquare },
      { label: "Logs système",      href: "/admin/logs",        icon: Terminal      },
    ],
  },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") { setReady(true); return; }
    const token = localStorage.getItem("admin_token");
    if (!token) { router.replace("/admin/login"); return; }
    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;
  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@fideloo.fr";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#EDEBE4" }}>
      {/* Sidebar fixe */}
      <aside style={{ width: W, background: INK, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, overflowY: "auto", flexShrink: 0 }}>

        {/* Logo + badge */}
        <div style={{ padding: "28px 24px 20px" }}>
          <img src="/brand/fideloo-logo-linked-onDark.svg" alt="Fideloo" style={{ height: 28, display: "block" }} />
          <div style={{ marginTop: 10 }}>
            <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, background: "rgba(184,135,58,0.20)", color: GOLD, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em" }}>
              ADMIN
            </span>
          </div>
        </div>

        <div style={{ height: 1, background: "#1F1F1F" }} />

        {/* Navigation groupée */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 24 }}>
          {NAV_GROUPS.map(({ label, items }) => (
            <div key={label}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#3A3A3A", letterSpacing: "0.12em", padding: "0 12px", marginBottom: 4 }}>
                {label}
              </div>
              {items.map(({ label: itemLabel, href, icon: Icon }) => {
                const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                return (
                  <Link key={href} href={href} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                    borderRadius: 8, textDecoration: "none", marginBottom: 2,
                    borderLeft: active ? `2px solid ${GOLD}` : "2px solid transparent",
                    background: active ? "rgba(255,255,255,0.05)" : "transparent",
                    color: active ? "#FFFFFF" : GRAY,
                    fontSize: 13, fontWeight: active ? 600 : 400,
                  }}>
                    <Icon size={15} />
                    {itemLabel}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div style={{ padding: "12px", borderTop: "1px solid #1F1F1F" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: INK, flexShrink: 0 }}>
              A
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Administrateur</div>
              <div style={{ fontSize: 11, color: GRAY, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{adminEmail}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px",
            background: "transparent", border: "none", borderRadius: 8,
            color: GRAY, fontSize: 13, cursor: "pointer",
          }}>
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main style={{ flex: 1, marginLeft: W, padding: "40px 48px", minWidth: 0 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
