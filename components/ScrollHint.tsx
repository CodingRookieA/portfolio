"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ScrollHint() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 80], [1, 0]);
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    setInteractive(scrollY.get() < 72);
  }, [scrollY]);

  useMotionValueEvent(scrollY, "change", (y) => {
    setInteractive(y < 72);
  });

  function scrollToNext() {
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <motion.div
      style={{ opacity }}
      className={`fixed left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center max-md:top-[calc(4.875rem+env(safe-area-inset-top,0px))] md:top-[calc(5.25rem+env(safe-area-inset-top,0px))] ${interactive ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <button
        type="button"
        onClick={scrollToNext}
        className="flex flex-col items-center justify-center rounded-full border border-white/12 bg-[rgba(10,10,26,0.5)] px-3.5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:border-accent-cyan/40 hover:bg-[rgba(10,10,26,0.65)] md:px-4 md:py-3.5"
        aria-label="Scroll down for experience and projects"
      >
        <span className="flex flex-col items-center leading-none text-accent-cyan" aria-hidden>
          {!reduced ? (
            <>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.45, ease: "easeInOut" }}
              >
                <ChevronDown className="h-7 w-7 md:h-9 md:w-9" />
              </motion.span>
              <motion.span
                className="-mt-3 md:-mt-3.5"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.45, ease: "easeInOut", delay: 0.1 }}
              >
                <ChevronDown className="h-7 w-7 md:h-9 md:w-9" />
              </motion.span>
            </>
          ) : (
            <span className="px-1 text-3xl leading-none md:text-4xl">↓</span>
          )}
        </span>
      </button>
    </motion.div>
  );
}
