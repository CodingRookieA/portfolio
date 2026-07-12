"use client";

import SectionShell from "@/components/SectionShell";
import { motion, useReducedMotion } from "framer-motion";

const contacts = [
  {
    label: "Email",
    href: "mailto:zhangalexander6@gmail.com",
    value: "zhangalexander6@gmail.com",
    external: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/CodingRookieA",
    value: "github.com/CodingRookieA",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39s1.97.13 2.89.39c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.68.8.56C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/azutsc/",
    value: "linkedin.com/in/azutsc",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.13 0 2.06.92 2.06 2.06 0 1.13-.93 2.06-2.06 2.06zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
] as const;

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Contact() {
  const reduced = useReducedMotion();

  return (
    <SectionShell
      id="contact"
      entrance="soft"
      className="relative mx-auto w-full max-w-6xl px-4 py-24 md:px-6 md:py-32"
    >
      <div className="relative z-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan/90">Contact</p>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Get in <span className="text-gradient">touch</span>
        </h2>
        <p className="section-lead">
          Open to Fall 2026 / Summer 2027 opportunities — reach out by email or find me on GitHub and LinkedIn.
        </p>

        <motion.ul
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={reduced ? { hidden: {}, show: {} } : listVariants}
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
        >
          {contacts.map((c) => (
            <motion.li key={c.href} variants={reduced ? { hidden: {}, show: {} } : itemVariants}>
              <a
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noreferrer" : undefined}
                className="glass-panel group flex h-full flex-col gap-4 rounded-2xl p-5 transition hover:border-accent-blue/35 md:p-6"
              >
                <span className="flex items-center gap-3 text-accent-cyan/90">
                  {c.icon}
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {c.label}
                  </span>
                </span>
                <span className="break-all text-base font-semibold text-white transition group-hover:text-accent-cyan md:text-lg">
                  {c.value}
                  {c.external ? " ↗" : ""}
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </SectionShell>
  );
}
