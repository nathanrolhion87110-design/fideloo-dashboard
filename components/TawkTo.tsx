"use client";

import { useEffect } from "react";

/**
 * Chat support Tawk.to.
 *
 * ⚠️  Remplacer TAWK_ID par l'ID obtenu sur https://tawk.to après création du compte.
 *     Le format de l'URL est `https://embed.tawk.to/<propertyId>/<widgetId>`.
 *     Tu peux les fournir via NEXT_PUBLIC_TAWK_PROPERTY_ID et NEXT_PUBLIC_TAWK_WIDGET_ID
 *     pour ne PAS hardcoder l'ID dans le repo public.
 */
export default function TawkTo() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "default";

    if (!propertyId || propertyId === "TAWK_ID") {
      console.info("[TawkTo] NEXT_PUBLIC_TAWK_PROPERTY_ID non défini — chat support désactivé.");
      return;
    }

    // Évite double-injection en cas de re-render
    if (document.getElementById("tawk-script")) return;

    const s1 = document.createElement("script");
    s1.id = "tawk-script";
    s1.async = true;
    s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.head.appendChild(s1);

    return () => {
      // ne pas supprimer le script — Tawk veut rester monté en SPA
    };
  }, []);

  return null;
}
