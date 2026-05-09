"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });

const SUBTITLE_LINES = [
  "Computer Science @ UTSC",
  "Systems · Backend · Low-level curiosity",
  "Open to internships — let's build something sharp.",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yGlow = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yGlow2 = useTransform(scrollYProgress, [0, 1], [0, 55]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, 48]);

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (reduced) {
      setLineIndex(SUBTITLE_LINES.length - 1);
      setCharIndex(SUBTITLE_LINES[SUBTITLE_LINES.length - 1].length);
      return;
    }
    const full = SUBTITLE_LINES[lineIndex] ?? "";
    if (charIndex < full.length) {
      const t = window.setTimeout(() => setCharIndex((c) => c + 1), 38);
      return () => clearTimeout(t);
    }
    if (lineIndex < SUBTITLE_LINES.length - 1) {
      const t = window.setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, 520);
      return () => clearTimeout(t);
    }
  }, [charIndex, lineIndex, reduced]);

  const currentLine = SUBTITLE_LINES[lineIndex] ?? "";
  const visibleSubtitle = currentLine.slice(0, charIndex);

  return (
    <section
      ref={sectionRef}
      id="bio"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden scroll-mt-28 px-4 pb-28 pt-32 md:px-8 md:pb-32 md:pt-36"
    >
      <div className="absolute inset-0 z-0 bg-deep bg-radial-glow" />
      <HeroScene />

      {!reduced && (
        <>
          <motion.div
            style={{ y: yGlow }}
            className="absolute -left-40 top-1/4 z-[1] h-80 w-80 rounded-full bg-accent-blue/25 blur-[120px]"
          />
          <motion.div
            style={{ y: yGlow2 }}
            className="absolute -right-32 bottom-1/4 z-[1] h-72 w-72 rounded-full bg-accent-cyan/20 blur-[100px]"
          />
        </>
      )}

      <motion.div
        style={reduced ? undefined : { opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center md:items-start md:text-left"
      >
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--text-muted)] backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_12px_rgba(0,212,255,0.9)]" />
          Portfolio 2026
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 28, rotateX: 12 }}
          animate={reduced ? {} : { opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          Alexander
          <span className="block text-gradient">Zhang</span>
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? {} : { opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-8 min-h-[4.5rem] max-w-xl font-medium text-accent-cyan/95 sm:text-lg md:text-xl"
        >
          {visibleSubtitle}
          {!reduced && charIndex < currentLine.length && (
            <span className="ml-0.5 inline-block h-6 w-0.5 animate-pulse bg-accent-cyan align-middle" />
          )}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={reduced ? {} : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-12 flex flex-col items-center gap-10 md:flex-row md:items-start"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent-blue/50 to-accent-cyan/40 opacity-60 blur-md" />
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/15 bg-white/5 text-2xl font-semibold text-white backdrop-blur-xl glow-ring md:h-40 md:w-40">
              {/* Replace with next/image headshot */}
              AZ
            </div>
          </div>

          <div className="max-w-xl space-y-5 text-left text-base leading-relaxed text-[var(--text-muted)] md:pt-2">
            <p>
              Third-year CS student gravitating toward systems work — close enough to the metal to feel it. I ship
              thoughtful backend and low-level tools, not just UI polish.
            </p>
            <p>
              Currently interning at TD Bank on backend engineering. From C and Assembly to Kotlin and TypeScript, I
              like problems with real constraints.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2 md:justify-start">
              <motion.a
                href="#projects"
                whileHover={reduced ? {} : { scale: 1.02 }}
                whileTap={reduced ? {} : { scale: 0.98 }}
                className="rounded-xl bg-accent-blue px-6 py-3 text-sm font-semibold text-white shadow-[0_0_32px_rgba(79,142,247,0.35)] transition hover:bg-[#6ba3ff]"
              >
                View projects
              </motion.a>
              <motion.a
                href="mailto:alexander@example.com"
                whileHover={reduced ? {} : { scale: 1.02 }}
                whileTap={reduced ? {} : { scale: 0.98 }}
                className="glass-panel rounded-xl px-6 py-3 text-sm font-semibold text-white/90"
              >
                Email me
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border border-white/15 pt-2">
          <motion.span
            animate={reduced ? {} : { y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="block h-2 w-1 rounded-full bg-accent-cyan"
          />
        </div>
      </motion.div>
    </section>
  );
}
