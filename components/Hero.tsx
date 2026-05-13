"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const HeroScene = dynamic(() => import("@/components/HeroScene"), { ssr: false });

const SUBTITLE_LINES = [
  "Computer Science @ UTSC · TD Bank Intern",
  "Backend · AI/ML · Systems when it counts",
  "Recruiting for Fall 2026/Summer 2027 lmaolmaolmao",
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
  /* Fade / move later and gentler so the handoff to Experience feels less abrupt. */
  const contentOpacity = useTransform(scrollYProgress, [0, 0.58], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.72], [0, 20]);

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
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-x-hidden scroll-mt-28 px-4 pb-24 pt-24 [@media(max-height:780px)]:justify-start [@media(max-height:780px)]:pb-14 [@media(max-height:780px)]:pt-[calc(5.25rem+env(safe-area-inset-top,0px))] md:px-8 md:pb-32 md:pt-28 lg:pb-36 lg:pt-32"
    >
      {/* Clip particles / glow orbs only — keeps tall hero content (CTAs) from being chopped at the fold. */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-deep bg-radial-glow" />
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
      </div>

      {/* Ramp from hero atmosphere into the flat page background — removes the hard horizontal seam. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-b from-transparent via-[#0a0a1a]/50 to-[#0a0a1a] md:h-36 md:via-[#0a0a1a]/60 lg:h-44 lg:via-[#0a0a1a]/70"
        aria-hidden
      />

      <motion.div
        style={reduced ? undefined : { opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center text-center md:items-start md:text-left"
      >
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={reduced ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-[var(--text-muted)] backdrop-blur-md md:mb-6"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_12px_rgba(0,212,255,0.9)]" />
          Portfolio 2026
        </motion.p>

        <motion.h1
          initial={reduced ? false : { opacity: 0, y: 28, rotateX: 12 }}
          animate={reduced ? {} : { opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl font-bold leading-[0.92] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.25rem]"
          style={{ transformStyle: "preserve-3d" }}
        >
          Alexander
          <span className="block text-gradient">Zhang</span>
        </motion.h1>

        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={reduced ? {} : { opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-5 min-h-[3.25rem] max-w-xl font-medium text-accent-cyan/95 text-lg leading-snug sm:min-h-[3.5rem] sm:text-xl [@media(max-height:780px)]:mt-3 md:mt-7 md:min-h-[4.25rem] md:text-2xl"
        >
          {visibleSubtitle}
          {!reduced && charIndex < currentLine.length && (
            <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-accent-cyan align-middle sm:h-6" />
          )}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={reduced ? {} : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-6 flex flex-col items-center gap-6 [@media(max-height:780px)]:mt-4 [@media(max-height:780px)]:gap-5 md:mt-10 md:gap-10 md:flex-row md:items-start lg:mt-12"
        >
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent-blue/50 to-accent-cyan/40 opacity-60 blur-md" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xl font-semibold text-white backdrop-blur-xl glow-ring sm:h-32 sm:w-32 sm:text-2xl md:h-40 md:w-40">
              {/* Replace with next/image headshot */}
              AZ
            </div>
          </div>

          <div className="max-w-xl space-y-4 text-left text-lg leading-relaxed text-[var(--text-muted)] md:space-y-5 md:pt-2 md:text-xl">
            <p>
              I&apos;d rather build the future than write thinkpieces about it. Backend services and AI features that
              hold up in production — RAG pipelines, multi-signal classifiers, the architecture underneath them.
            </p>
            <p>
              Currently interning at TD Bank. Comfortable from TypeScript/Node up top down to
              multi-threaded C tools and shell automation on Linux. I like problems with real constraints.
            </p>
            <div
              className="mt-1 rounded-xl border border-white/10 bg-white/[0.04] p-3.5 md:p-5"
              aria-label="Education"
            >
              <div className="flex gap-3 md:gap-4">
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-accent-cyan sm:h-9 sm:w-9 sm:rounded-xl md:h-10 md:w-10"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 sm:h-[18px] sm:w-[18px] md:h-5 md:w-5"
                  >
                    <path d="M22 10v6" />
                    <path d="M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </span>
                <div className="min-w-0 flex-1 space-y-2 text-base leading-relaxed text-[var(--text-muted)] md:space-y-3 md:text-lg">
                  <div>
                    <p className="font-display text-lg font-semibold text-white md:text-xl">
                      University of Toronto Scarborough
                    </p>
                    <p className="mt-1.5 text-[var(--text-muted)] md:mt-2">
                      CS Specialist Co-op
                      <span className="mx-2 text-white/20">·</span>
                      <span className="font-semibold text-accent-cyan/95">3.89 CGPA</span>
                    </p>
                  </div>
                  <p className="text-[0.9375rem] leading-relaxed text-white/70 md:text-base">
                    Dean&apos;s List &amp; Renewable Entrance Scholarship (2023–2026)
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 pt-2.5 text-sm text-[var(--text-muted)] md:gap-x-4 md:pt-3 md:text-base">
                    <span className="font-medium text-white/80">2023–present</span>
                    <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
                    <span>Projected graduation: Fall 2027</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pb-6 pt-1 md:justify-start md:pb-8 md:pt-2">
              <motion.a
                href="#projects"
                whileHover={reduced ? {} : { scale: 1.02 }}
                whileTap={reduced ? {} : { scale: 0.98 }}
                className="rounded-xl bg-accent-blue px-6 py-3 text-base font-semibold text-white shadow-[0_0_32px_rgba(79,142,247,0.35)] transition hover:bg-[#6ba3ff]"
              >
                View projects
              </motion.a>
              <motion.a
                href="mailto:alexanderz.zhang@mail.utoronto.ca"
                whileHover={reduced ? {} : { scale: 1.02 }}
                whileTap={reduced ? {} : { scale: 0.98 }}
                className="glass-panel rounded-xl px-6 py-3 text-base font-semibold text-white/90"
              >
                Email me
              </motion.a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
