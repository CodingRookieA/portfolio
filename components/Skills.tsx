"use client";

import SectionShell from "@/components/SectionShell";
import { motion, useReducedMotion } from "framer-motion";

const groups = [
  {
    title: "Languages",
    subtitle: "Core languages I reach for",
    skills: ["C", "Java", "Kotlin", "Python", "TypeScript", "x86 Assembly"],
  },
  {
    title: "Frameworks",
    subtitle: "Where ideas become products",
    skills: ["React", "Next.js", "Spring Boot", "Android SDK"],
  },
  {
    title: "Tools & infra",
    subtitle: "Shipping, data, and systems",
    skills: ["Linux", "Git", "Firebase", "PostgreSQL", "Docker", "Kafka"],
  },
];

const gridContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.06 },
  },
};

const card = {
  hidden: { opacity: 0, y: 56, rotateX: 16, z: -36 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    z: 0,
    transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Skills() {
  const reduced = useReducedMotion();

  return (
    <SectionShell id="skills" className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-24 md:px-6 md:py-32">
      <div className="relative z-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan/90">Skills</p>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Capabilities <span className="text-gradient">by layer</span>
        </h2>
        <p className="section-lead">
          Languages, frameworks, and tools — tiles stagger in with depth; a gentle float keeps the grid alive (unless
          reduced motion is on).
        </p>

        <motion.div
          className="mt-14 grid gap-6 md:grid-cols-3"
          variants={reduced ? { hidden: {}, show: {} } : gridContainer}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? "show" : "show"}
          viewport={{ once: true, amount: 0.12 }}
          style={{ perspective: reduced ? undefined : "1200px" }}
        >
          {groups.map((group) => (
            <motion.div key={group.title} variants={reduced ? { hidden: {}, show: {} } : card} className="glass-panel rounded-2xl p-6 md:p-7">
              <h3 className="font-display text-2xl font-bold text-white">{group.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{group.subtitle}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {group.skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={reduced ? false : { opacity: 0, y: 22, rotateX: 22 }}
                    whileInView={reduced ? {} : { opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={reduced ? {} : { y: -4, rotateX: 8 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="inline-flex min-h-[2.75rem] items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-3 py-2 text-sm font-semibold text-white/95 shadow-[0_14px_40px_rgba(0,0,0,0.28)]"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SectionShell>
  );
}
