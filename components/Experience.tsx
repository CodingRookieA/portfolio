"use client";

import SectionShell from "@/components/SectionShell";
import { motion, useReducedMotion } from "framer-motion";

interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
  bullets: string[];
  tags: string[];
  placeholder?: boolean;
}

const items: ExperienceItem[] = [
  {
    company: "TD Bank",
    role: "Software Engineering Intern",
    dates: "May 2025 – Present",
    bullets: [
      "Backend authentication system serving internal microservices across multiple teams.",
      "Refactored legacy service layer to event-driven architecture, reducing coupling across 4 services.",
      "Chose concurrent processes over threads for the monitoring layer to isolate failures per interval.",
    ],
    tags: ["Java", "Spring Boot", "PostgreSQL", "Kafka", "React"],
  },
  {
    company: "Your next role",
    role: "The timeline grows as you add experience",
    dates: "—",
    bullets: [],
    tags: [],
    placeholder: true,
  },
];

export default function Experience() {
  const reduced = useReducedMotion();

  return (
    <SectionShell
      id="experience"
      className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-24 md:px-6 md:py-32"
    >
      <div className="relative z-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan/90">Experience</p>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Where I&apos;ve <span className="text-gradient">worked</span>
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
          Internship highlights — cards slide in from alternating sides with a bit of perspective as you scroll.
        </p>

        <div className="relative mt-16 md:mt-20">
          <div
            className="absolute left-[11px] top-2 h-[calc(100%-12px)] w-px bg-gradient-to-b from-accent-blue via-accent-cyan/45 to-transparent md:left-[13px]"
            aria-hidden
          />

          <ul className="relative space-y-10 md:space-y-14">
            {items.map((item, index) => {
              const fromLeft = index % 2 === 0;
              return (
                <li key={item.company} className="relative pl-8 md:pl-11">
                  <span
                    className="absolute left-0 top-8 h-3 w-3 rounded-full border border-white/25 bg-accent-blue shadow-[0_0_18px_rgba(79,142,247,0.85)] md:left-0.5 md:top-9"
                    aria-hidden
                  />

                  <motion.article
                    initial={
                      reduced
                        ? false
                        : {
                            opacity: 0,
                            x: fromLeft ? -80 : 80,
                            rotateY: fromLeft ? 12 : -12,
                          }
                    }
                    whileInView={reduced ? {} : { opacity: 1, x: 0, rotateY: 0 }}
                    viewport={{ once: true, amount: 0.22 }}
                    transition={{ duration: 0.8, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformStyle: "preserve-3d" }}
                    className={`glass-panel rounded-2xl p-6 md:p-8 ${item.placeholder ? "border-dashed opacity-45" : ""}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-white md:text-3xl">{item.company}</h3>
                        <p className="mt-1 text-sm font-medium text-accent-cyan/90">{item.role}</p>
                      </div>
                      <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        {!item.placeholder && (
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                          </span>
                        )}
                        {item.dates}
                      </p>
                    </div>

                    {!item.placeholder && item.bullets.length > 0 && (
                      <ul className="mt-6 space-y-3 text-sm leading-relaxed text-[var(--text-muted)]">
                        {item.bullets.map((b) => (
                          <li key={b} className="flex gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-blue" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.tags.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.article>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
