"use client";

import { createElement, HTMLAttributes, ReactNode } from "react";

interface GradientTextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
}

export default function GradientText({
  children,
  as = "span",
  className = "",
  ...rest
}: GradientTextProps) {
  return createElement(
    as,
    { ...rest, className: ["gradient-text", className].join(" ") },
    children
  );
}
