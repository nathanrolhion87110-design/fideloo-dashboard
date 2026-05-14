"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

const INK = "#0B0F0E";
const GRAY = "#6B6B6B";
const BORD = "#E0DDD6";
const GOLD = "#B8873A";
const INACTIVE_DOT = "#D8D5CE";

export default function TutorialOverlay({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("fideloo_tutorial_seen");
    if (!hasSeenTutorial) {
      setIsVisible(true);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const steps = [
    {
      title: "Bienvenue sur Fideloo !",
      content: "Découvrons ensemble comment gérer votre nouveau programme de fidélité en moins d'une minute.",
      target: null,
      position: "center"
    },
    {
      title: "Vos statistiques",
      content: "Voici votre dashboard — vos stats en un coup d'œil. Suivez vos visites et points distribués.",
      target: "stats-section",
      position: "bottom"
    },
    {
      title: "Votre QR Code",
      content: "Ici votre QR code — imprimez-le et affichez-le en caisse. Vos clients le scannent pour obtenir leur carte.",
      target: "qr-section",
      position: "left"
    },
    {
      title: "Scanner un client",
      content: "Cliquez ici pour scanner la carte d'un client et lui ajouter des points lors de son passage en caisse.",
      target: "scan-btn",
      position: "bottom"
    },
    {
      title: "Vos clients",
      content: "Retrouvez tous vos clients fidèles, leur progression et leur historique ici.",
      target: "nav-clients",
      position: "right"
    },
    {
      title: "Notifications Push",
      content: "Envoyez des offres spéciales qui s'affichent directement sur l'écran de verrouillage de vos clients !",
      target: "nav-notifs",
      position: "right"
    },
    {
      title: "Prêt à démarrer",
      content: "Vous pouvez personnaliser votre carte à tout moment dans les Paramètres. C'est parti !",
      target: null,
      position: "center"
    }
  ];

  const handleNext = () => {
    if (step === steps.length - 1) {
      finishTutorial();
    } else {
      setStep(s => s + 1);
    }
  };

  const finishTutorial = () => {
    localStorage.setItem("fideloo_tutorial_seen", "true");
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const currentStep = steps[step];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ position: "absolute", inset: 0, background: "rgba(11,15,14,0.80)", backdropFilter: "blur(8px)", pointerEvents: "auto" }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{
            position: "relative",
            zIndex: 101,
            background: "#FFFFFF",
            border: `1px solid ${BORD}`,
            borderRadius: 16,
            padding: 24,
            maxWidth: 440,
            width: "calc(100% - 32px)",
            margin: "0 16px",
            pointerEvents: "auto",
          }}
        >
          <button
            onClick={finishTutorial}
            style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", cursor: "pointer", color: GRAY, padding: 4, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <X size={18} />
          </button>

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontFamily: "var(--font-playfair,'Playfair Display',Georgia,serif)", fontSize: 20, fontWeight: 700, color: INK, marginBottom: 8, paddingRight: 24 }}>
              {currentStep.title}
            </h3>
            <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6 }}>{currentStep.content}</p>
          </div>

          {/* Progress + actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {steps.map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: i === step ? GOLD : INACTIVE_DOT,
                    width: i === step ? 24 : 6,
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                onClick={finishTutorial}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, color: GRAY, padding: "8px 4px" }}
              >
                Passer
              </button>
              <button
                onClick={handleNext}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", background: INK, color: "#FFFFFF", border: "none", borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                {step === steps.length - 1 ? "Commencer" : "Suivant"}
                {step !== steps.length - 1 && <ChevronRight size={15} />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
