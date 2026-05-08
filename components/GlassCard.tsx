"use client";

import { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "strong";
  lift?: boolean;
}

export default function GlassCard({
  children,
  variant = "default",
  lift = false,
  className = "",
  ...rest
}: GlassCardProps) {
  return (
    <div
      {...rest}
      className={[
        variant === "strong" ? "glass-strong" : "glass",
        "rounded-2xl",
        lift ? "card-lift" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
