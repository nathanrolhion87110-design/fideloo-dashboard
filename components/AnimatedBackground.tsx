"use client";

export default function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Violet - top left */}
      <div
        className="float-orb absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.2), transparent 70%)" }}
      />
      {/* Mint - bottom right */}
      <div
        className="float-orb absolute -bottom-40 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, rgba(52,211,153,0.12), transparent 70%)", animationDelay: "-7s" }}
      />
      {/* Violet soft - center */}
      <div
        className="float-orb absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.15), transparent 70%)", animationDelay: "-3s" }}
      />
      {/* Voile */}
      <div className="absolute inset-0" style={{ background: "rgba(10,10,11,0.5)" }} />
    </div>
  );
}
