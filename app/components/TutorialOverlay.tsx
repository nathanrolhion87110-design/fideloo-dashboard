"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, ScanLine, Users, Bell, Settings, X, ChevronRight } from "lucide-react";

export default function TutorialOverlay({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("fideloo_tutorial_seen");
    if (!hasSeenTutorial) {
      setIsVisible(true);
    } else {
      onComplete(); // Skip si déjà vu
    }
  }, [onComplete]);

  const steps = [
    {
      title: "Bienvenue sur Fideloo ! 👋",
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Overlay sombre */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm pointer-events-auto"
      />

      {/* Spotlight (simulé ici en centrant la modale ou en la plaçant arbitrairement pour la démo) */}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative z-[101] bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4 pointer-events-auto border border-slate-100"
        >
          <button 
            onClick={finishTutorial}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-text-main mb-2">{currentStep.title}</h3>
            <p className="text-text-muted leading-relaxed">{currentStep.content}</p>
          </div>

          {/* Indicateurs de progression */}
          <div className="flex justify-between items-center mt-8">
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-primary' : 'w-1.5 bg-slate-200'}`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={finishTutorial}
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                Passer
              </button>
              <button 
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-all shadow-sm"
              >
                {step === steps.length - 1 ? 'Commencer' : 'Suivant'}
                {step !== steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
