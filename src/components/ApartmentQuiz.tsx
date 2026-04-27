"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const steps = [
  {
    question: "How long are you planning to stay?",
    options: ["1 - 3 Months", "3 - 6 Months", "6+ Months"],
    key: "duration"
  },
  {
    question: "How many guests will be staying?",
    options: ["Just me", "A couple", "Family (3+)"],
    key: "guests"
  },
  {
    question: "What is your primary focus for the stay?",
    options: ["Working Remotely", "Wellness & Health", "Leisure & Exploration"],
    key: "focus"
  }
];

export function ApartmentQuiz() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSelect = async (val: string) => {
    const newAnswers = { ...answers, [steps[step].key]: val };
    setAnswers(newAnswers);
    
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // 1. Logic to suggest apartment
      let suggest = "solo";
      if (newAnswers.guests === "Family (3+)") suggest = "soho";
      else if (newAnswers.guests === "A couple" || newAnswers.duration === "6+ Months") suggest = "studio";
      
      // 2. Capture Intent & Tag Lead
      const { trackEvent } = await import("@/lib/tracking");
      trackEvent("quiz_complete", {
        suggested_unit: suggest,
        quiz_responses: newAnswers,
        intent_phase: "high_intent"
      });

      // 3. Redirect
      router.push(`/apartments/${suggest}?quiz=true`);
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={async () => {
          setIsOpen(true);
          const { trackEvent } = await import("@/lib/tracking");
          trackEvent("form_start", { form_name: "apartment_quiz" });
        }}
        className="fixed bottom-6 right-6 z-100 bg-[#8b7658] text-white px-6 py-4 rounded-full shadow-2xl font-bold text-xs tracking-[0.2em] uppercase hover:scale-105 transition-transform flex items-center gap-3 border-4 border-white"
      >
        Find your apartment <ArrowRight size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white w-full max-w-xl rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <button 
                onClick={async () => {
                  if (step < steps.length) {
                    const { trackEvent } = await import("@/lib/tracking");
                    trackEvent("quiz_abandon", { last_step: step + 1 });
                  }
                  setIsOpen(false);
                }}
                className="absolute top-6 right-6 text-neutral-400 hover:text-black transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <div className="p-10 md:p-14">
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold-dark mb-4">Step {step + 1} of 3</p>
                <h2 className="text-3xl font-serif text-ink mb-10 leading-tight">
                  {steps[step].question}
                </h2>

                <div className="space-y-4">
                  {steps[step].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className="w-full text-left p-6 border border-neutral-100 bg-neutral-50 rounded-xl hover:border-gold/50 hover:bg-gold/5 transition-all group flex justify-between items-center"
                    >
                      <span className="text-lg font-medium text-neutral-800">{option}</span>
                      <div className="w-6 h-6 rounded-full border border-neutral-200 group-hover:border-gold flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 px-10 py-6 text-center">
                <p className="text-xs text-neutral-400 italic">Finding the perfect match for your lifestyle...</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
