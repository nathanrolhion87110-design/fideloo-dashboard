"use client";

/**
 * Fond premium pour pages d'auth et /join : 3 orbes flous animés sur grille subtile.
 * Pas de canvas / pas de JS lourd — pure CSS, GPU-friendly.
 */
export default function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Orbe violet en haut à gauche */}
      <div
        className="float-orb absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-60"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.55), transparent 70%)",
        }}
      />
      {/* Orbe bleu en bas à droite */}
      <div
        className="float-orb absolute -bottom-40 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(37,99,235,0.45), transparent 70%)",
          animationDelay: "-7s",
        }}
      />
      {/* Orbe violet rose au centre haut */}
      <div
        className="float-orb absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(167,139,250,0.4), transparent 70%)",
          animationDelay: "-3s",
        }}
      />
      {/* Voile très léger pour ramener au noir */}
      <div className="absolute inset-0 bg-[#0A0A0F]/40" />
    </div>
  );
}
