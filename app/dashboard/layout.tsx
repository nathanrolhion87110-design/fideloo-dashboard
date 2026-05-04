"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, 
  Users, 
  ScanLine, 
  History, 
  BarChart3, 
  Bell, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TutorialOverlay from "../components/TutorialOverlay";
import ProtectedRoute from "../../components/ProtectedRoute";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Scanner", href: "/dashboard/scanner", icon: ScanLine },
  { name: "Transactions", href: "/dashboard/transactions", icon: History },
  { name: "Analytiques", href: "/dashboard/analytiques", icon: BarChart3 },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Paramètres", href: "/dashboard/parametres", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-white">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-xl">
          F
        </div>
        <span className="font-bold text-xl tracking-tight">Fideloo</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-primary text-white font-medium" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm">
            ML
          </div>
          <div className="flex-1 overflow-hidden">
             <div className="text-sm font-medium truncate">Mon Commerce</div>
             <div className="text-xs text-slate-400 truncate">Pro</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background-main flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-[260px] fixed inset-y-0 z-50">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-[260px] z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 md:pl-[260px] flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">F</div>
            <span className="font-bold text-text-main">Fideloo</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-text-muted hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 relative">
          <TutorialOverlay onComplete={() => console.log('Tutorial terminé')} />
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
