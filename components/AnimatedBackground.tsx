"use client";

export default function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Orbe or - top left */}
      <div
        className="float-orb absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-50"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.18), transparent 70%)" }}
      />
      {/* Orbe corail - bottom right */}
      <div
        className="float-orb absolute -bottom-40 -right-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, rgba(232,112,90,0.12), transparent 70%)", animationDelay: "-7s" }}
      />
      {/* Orbe or clair - center */}
      <div
        className="float-orb absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full blur-3xl opacity-25"
        style={{ background: "radial-gradient(circle, rgba(232,200,122,0.14), transparent 70%)", animationDelay: "-3s" }}
      />
      {/* Voile */}
      <div className="absolute inset-0" style={{ background: "rgba(8,8,8,0.45)" }} />
    </div>
  );
}
