"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { BarChart2, Users, DollarSign, LogOut } from "lucide-react";

const INK  = "#0B0F0E";
const GOLD = "#B8873A";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";

const NAV = [
  { label: "Vue globale",  href: "/admin",         icon: BarChart2  },
  { label: "Comptes",      href: "/admin/comptes",  icon: Users      },
  { label: "Revenus",      href: "/admin/revenus",  icon: DollarSign },
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

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F3EE" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: INK, display: "flex", flexDirection: "column", padding: "32px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 24px 32px", borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: GOLD, letterSpacing: "-0.3px" }}>Fideloo Admin</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Espace interne</div>
        </div>

        <nav style={{ flex: 1, padding: "24px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                borderRadius: 10, textDecoration: "none",
                background: active ? "rgba(184,135,58,0.18)" : "transparent",
                color: active ? GOLD : "rgba(255,255,255,0.65)",
                fontSize: 14, fontWeight: active ? 700 : 500,
                transition: "background 0.15s",
              }}>
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: "0 12px" }}>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 16px",
            background: "transparent", border: "none", borderRadius: 10,
            color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 500, cursor: "pointer",
          }}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "40px 48px", overflowY: "auto", minWidth: 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
