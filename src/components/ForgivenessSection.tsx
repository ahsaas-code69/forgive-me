"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, AlertCircle } from "lucide-react";
import { acceptForgiveness, resetForgivenessState } from "@/app/actions";
import ConfettiCanvas from "./ConfettiCanvas";

interface ForgivenessSectionProps {
  initialForgiven: boolean;
}

const NO_BUTTON_COPY = [
  "No 😢",
  "Nice try! 😜",
  "Error: Option cooperative failure 🤖",
  "Are you sure? 🥺",
  "Wait, think about the pizza! 🍕",
  "No is not in my vocabulary 😝",
  "Access Denied 🚫",
  "Please reconsider? 👉👈",
  "Click Yes already! ❤️",
  "Almost had it! 🏃‍♂️",
  "Not quite! 🔍",
];

export default function ForgivenessSection({ initialForgiven }: ForgivenessSectionProps) {
  const [isForgiven, setIsForgiven] = useState(initialForgiven);
  const [noButtonIndex, setNoButtonIndex] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showConfetti, setShowConfetti] = useState(initialForgiven);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const noButtonRef = useRef<HTMLButtonElement | null>(null);

  // Auto-center the "No" button on mount or resize
  useEffect(() => {
    if (!hasMoved) {
      centerNoButton();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [hasMoved]);

  // Intercept closing/reload attempts until she clicks Yes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isForgiven) {
        e.preventDefault();
        // Note: Modern browsers show a generic message to prevent phishing, but standard prevention works.
        e.returnValue = "You cannot leave without saying Yes! 👉👈";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isForgiven]);

  const handleResize = () => {
    if (!hasMoved) {
      centerNoButton();
    } else {
      // Keep within bounds after resize
      keepInBounds();
    }
  };

  const centerNoButton = () => {
    const container = containerRef.current;
    const button = noButtonRef.current;
    if (!container || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    // Center in the right half of the container
    const x = (containerRect.width * 0.7) - (buttonRect.width / 2);
    const y = (containerRect.height / 2) - (buttonRect.height / 2);

    setNoPosition({ x, y });
  };

  const keepInBounds = () => {
    const container = containerRef.current;
    const button = noButtonRef.current;
    if (!container || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    setNoPosition((pos) => {
      const maxX = containerRect.width - buttonRect.width - 16;
      const maxY = containerRect.height - buttonRect.height - 16;
      return {
        x: Math.min(Math.max(16, pos.x), maxX),
        y: Math.min(Math.max(16, pos.y), maxY),
      };
    });
  };

  const moveNoButton = () => {
    const container = containerRef.current;
    const button = noButtonRef.current;
    if (!container || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const maxX = containerRect.width - buttonRect.width - 24;
    const maxY = containerRect.height - buttonRect.height - 24;

    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;

    // Avoid spawning too close to the current location (min 80px distance)
    let tries = 0;
    while (tries < 10) {
      const distance = Math.hypot(newX - noPosition.x, newY - noPosition.y);
      if (distance > 100) break;
      newX = Math.random() * maxX;
      newY = Math.random() * maxY;
      tries++;
    }

    // Add safe padding
    newX = Math.max(16, Math.min(newX, maxX));
    newY = Math.max(16, Math.min(newY, maxY));

    setNoPosition({ x: newX, y: newY });
    setHasMoved(true);
    setNoButtonIndex((prev) => (prev + 1) % NO_BUTTON_COPY.length);
  };

  const handleYes = async () => {
    setIsPending(true);
    setErrorMsg(null);
    try {
      // Set local state instantly for a highly responsive UI
      setIsForgiven(true);
      setShowConfetti(true);
      
      // Fire Next.js Server Action
      await acceptForgiveness();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to persist acceptance, but your love was received! ❤️");
    } finally {
      setIsPending(false);
    }
  };

  const handleReset = async () => {
    setIsPending(true);
    setErrorMsg(null);
    try {
      setIsForgiven(false);
      setShowConfetti(false);
      setHasMoved(false);
      setNoButtonIndex(0);
      
      // Reset Next.js Server Action
      await resetForgivenessState();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to reset state.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section className="py-24 px-4 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[600px] relative select-none">
      {showConfetti && <ConfettiCanvas />}

      <AnimatePresence mode="wait">
        {!isForgiven ? (
          <motion.div
            key="ask"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full text-center space-y-12"
          >
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C97A7A] font-semibold">
                The Moment of Truth
              </span>
              <h2 className="text-4xl md:text-5xl font-serif text-[#F4EAE6] font-medium">
                Are we okay? 👉👈
              </h2>
              <p className="text-[#C0B4AC] text-sm max-w-md mx-auto">
                Take your time. If you click yes, we are back on track. If you click no, well... good luck!
              </p>
            </div>

            {/* Evasive sandbox wrapper */}
            <div
              ref={containerRef}
              className="relative w-full h-[320px] md:h-[400px] border border-[#2E2824] bg-[#141211]/80 rounded-2xl shadow-inner shadow-black/40 overflow-hidden flex items-center justify-start p-6"
            >
              {/* Static Yes Button - Left side */}
              <div className="absolute left-6 md:left-24 z-10">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                  disabled={isPending}
                  className="px-10 py-5 rounded-full bg-[#C97A7A] text-[#FAF6F0] font-semibold text-lg shadow-lg shadow-[#C97A7A]/25 hover:bg-[#B55B5B] transition-colors duration-200 cursor-pointer flex items-center gap-2 group disabled:opacity-70"
                >
                  Yes! <Heart className="w-5 h-5 fill-[#FAF6F0] group-hover:scale-125 transition-transform" />
                </motion.button>
              </div>

              {/* Dynamic Evasive No Button - Absolute moving */}
              <motion.button
                ref={noButtonRef}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
                animate={{
                  x: noPosition.x,
                  y: noPosition.y,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                  damping: 20,
                }}
                onMouseEnter={moveNoButton}
                onTouchStart={(e) => {
                  e.preventDefault(); // Stop default tapping Zoom behavior
                  moveNoButton();
                }}
                className="px-6 py-3 rounded-full border border-[#2E2824] bg-[#181615] text-[#D5C9C0] font-medium text-sm shadow-md hover:bg-[#201D1A] transition-colors select-none touch-none"
              >
                {NO_BUTTON_COPY[noButtonIndex]}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="w-full text-center bg-[#181615] border border-[#2E2824] rounded-2xl shadow-2xl shadow-black/60 p-10 md:p-16 space-y-8"
          >
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-[#C97A7A]/10 p-5 rounded-full text-[#C97A7A]"
              >
                <Sparkles className="w-12 h-12 fill-[#C97A7A]/20" />
              </motion.div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-serif text-[#F4EAE6] font-medium">
                Yay! We're Okay! 💖
              </h2>
              <p className="text-[#C0B4AC] text-sm md:text-base max-w-md mx-auto leading-relaxed">
                Thank you for being so forgiving and wonderful. I promise to fix myself bacha, listen to you, and make this up to you completely. You make everything brighter.
              </p>
            </div>

            <div className="pt-6 border-t border-[#2E2824] flex flex-col items-center gap-4">
              <span className="text-xs text-slate-500">
                Acceptance saved in server records ✨
              </span>
              <button
                onClick={handleReset}
                disabled={isPending}
                className="text-xs text-[#E09F9F]/60 hover:text-[#E09F9F] underline transition-colors cursor-pointer disabled:opacity-50"
              >
                Play again / Reset state
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMsg && (
        <div className="absolute bottom-4 flex items-center gap-2 text-rose-400 bg-rose-950/30 px-4 py-2 rounded-lg text-xs border border-rose-900/50">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}
    </section>
  );
}
