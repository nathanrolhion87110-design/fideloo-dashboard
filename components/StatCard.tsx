"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  delay?: number;
  hint?: string;
}

export default function StatCard({ label, value, icon: Icon, delay = 0, hint }: StatCardProps) {
  return (
    <div
      className="stat-card card-lift fade-in-up rounded-2xl p-6 relative overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Reflet diagonal subtil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full blur-2xl opacity-50"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.35), transparent 70%)" }}
      />
      <div className="relative flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs uppercase tracking-wider text-text-muted font-semibold">{label}</p>
          <div className="text-3xl font-extrabold tracking-tight text-text-main">{value}</div>
          {hint && <p className="text-xs text-text-muted">{hint}</p>}
        </div>
        {Icon && (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.18))",
              border: "1px solid rgba(124,58,237,0.35)",
            }}
          >
            <Icon className="w-5 h-5" style={{ color: "#A78BFA" }} />
          </div>
        )}
      </div>
    </div>
  );
}
