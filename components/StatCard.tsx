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
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full blur-2xl opacity-40"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.3), transparent 70%)" }}
      />
      <div className="relative flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "#8A8070" }}>{label}</p>
          <div className="text-3xl font-extrabold tracking-tight" style={{ color: "#F5F0E8" }}>{value}</div>
          {hint && <p className="text-xs" style={{ color: "#8A8070" }}>{hint}</p>}
        </div>
        {Icon && (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(201,168,76,0.1)",
              border: "1px solid rgba(201,168,76,0.25)",
            }}
          >
            <Icon className="w-5 h-5" style={{ color: "#C9A84C" }} />
          </div>
        )}
      </div>
    </div>
  );
}
