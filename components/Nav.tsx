"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const sections = [
  { id: "bio", label: "Bio" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
];

export default function Nav() {
  const [active, setActive] = useState("bio");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const ratios = new Map<string, number>();

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => {
          ratios.set(id, e.intersectionRatio);
          const best = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
          if (best?.[0]) setActive(best[0]);
        },
        { threshold: [0.12, 0.25, 0.4, 0.55, 0.72] }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function go(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-4 md:px-6">
      <nav className="pointer-events-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[rgba(10,10,26,0.52)] px-3 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:h-[58px] md:gap-6 md:px-5">
        <button
          type="button"
          onClick={() => go("bio")}
          className="shrink-0 font-display text-lg font-bold tracking-tight text-white"
        >
          AZ<span className="text-accent-cyan">.</span>
        </button>

        <div className="flex min-w-0 flex-1 justify-end overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-0.5 md:gap-1">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(s.id)}
                  className="relative shrink-0 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] transition hover:text-white md:text-[13px]"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="hidden shrink-0 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 backdrop-blur-md transition hover:border-accent-blue/50 hover:text-white sm:inline-block"
        >
          Résumé ↗
        </a>
      </nav>
    </header>
  );
}
