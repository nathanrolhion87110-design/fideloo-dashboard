"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "ghost" | "apple";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function GlowButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...rest
}: GlowButtonProps) {
  const sizeCls =
    size === "sm" ? "px-3 py-2 text-sm" :
    size === "lg" ? "px-6 py-4 text-base" :
    "px-5 py-3 text-sm";

  const variantCls =
    variant === "ghost" ? "btn-ghost" :
    variant === "apple" ? "btn-apple-wallet" :
    "btn-glow";

  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        sizeCls,
        variantCls,
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
