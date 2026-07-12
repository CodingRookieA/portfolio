"use client";

import SectionShell from "@/components/SectionShell";
import { motion, useReducedMotion } from "framer-motion";

interface ExperienceItem {
  company: string;
  role: string;
  dates: string;
  bullets: string[];
  tags: string[];
  /** Path under `public/`, e.g. `/logos/td.svg` — optional; shows a placeholder slot until set */
  logoSrc?: string;
  placeholder?: boolean;
  current?: boolean;
}

function ExperienceLogo({
  company,
  logoSrc,
}: {
  company: string;
  logoSrc?: string;
}) {
  return (
    <div
      className={`relative flex h-16 w-16 shrink-0 overflow-hidden rounded-2xl border sm:h-20 sm:w-20 md:h-28 md:w-28 ${
        logoSrc ? "border-white/15 bg-white/[0.07]" : "border-dashed border-white/20 bg-white/[0.03]"
      }`}
    >
      {logoSrc ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- local assets under /public */}
          <img
            src={logoSrc}
            alt={`${company} logo`}
            className="h-full w-full object-contain p-2.5 sm:p-3 md:p-3.5"
            loading="lazy"
          />
        </>
      ) : (
        <span className="m-auto select-none px-1 text-center text-xs font-semibold uppercase leading-tight tracking-wider text-[var(--text-faint)]">
          Logo
        </span>
      )}
    </div>
  );
}

const items: ExperienceItem[] = [
  {
    company: "TD Bank Group",
    role: "Business Systems Analyst (Co-op)",
    dates: "May 2026 – Present",
    logoSrc: "/logos/Toronto-Dominion_Bank_logo.svg",
    current: true,
    bullets: [
      "Designing a Python/Flask ingestion pipeline that replaces email/Jira ticket intake and Excel tracking with a unified portal: CSV schema validation, a rules engine cross-checking records against a local extract, dual routing (automated feeds vs. API injection), and pre/post snapshot comparison to verify only intended records changed.",
      "Maintained and extended end-to-end test coverage for an enterprise eGRC platform on Archer—patching Selenium and Cucumber scenarios in Java (Gherkin across `.feature`, `Steps.java`, `Page.java`) and updating XPath locators after each SIT release.",
      "Improved test reliability by fixing non-idempotent control-procedure runs (auto-reverting record state at teardown) and adding checkbox pre-checks so targets aren’t re-selected when already set—reducing false failures without breaking shared step code.",
      "Built a Python ETL script with pandas and openpyxl to automate cross-Excel field-description lookups, with row classification and style preservation—eliminating a fully manual reconciliation workflow.",
      "Own ~50% of business upload requests—validating Excel submissions for compliance controls and legal regulatory records before injection into a sensitive, access-restricted eGRC system.",
    ],
    tags: ["Python", "Flask", "Java", "Selenium", "Cucumber", "pandas", "eGRC"],
  },
  {
    company: "Uphouse Inc.",
    role: "Research and Strategy Assistant (Co-op)",
    dates: "Jan. 2026 – Apr. 2026",
    logoSrc: "/logos/uphouse.jpg",
    bullets: [
      "Built automated workflows in Power Automate and n8n with conditional logic, input normalization, and null-handling—removing daily manual deadline monitoring.",
      "Integrated Trello with n8n via webhooks for client feedback forms; applied event filtering and payload projection for reliable downstream processing.",
      "Analyzed AI visibility gaps across industry verticals using Profound; helped lift visibility from near-zero to roughly 50% within one month.",
      "Validated AI-generated articles against structured source data for factual consistency and legal accuracy before client-facing publication.",
    ],
    tags: ["Power Automate", "n8n", "Profound", "Excel"],
  },
  {
    company: "Employment and Social Development Canada (ESDC)",
    role: "IT Analyst (Co-op)",
    dates: "June 2025 – Aug. 2025",
    logoSrc: "/logos/esdc.png",
    bullets: [
      "Developed and automated internal workflows with Microsoft Power Platform (Power Automate, MS Forms, Power Apps), cutting manual processing time by about 50%.",
      "Designed Forms and automated flows for real-time submission routing; built reusable Power Apps components for consistent internal UIs.",
      "Ran structured testing on OCR-based AI tools with Excel-tracked results; managed Agile work and test suites in Azure DevOps.",
    ],
    tags: ["Power Platform", "Power Apps", "Azure DevOps", "SharePoint"],
  },
];

export default function Experience() {
  const reduced = useReducedMotion();

  return (
    <SectionShell
      id="experience"
      entrance="soft"
      className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-24 md:px-6 md:py-32"
    >
      <div className="relative z-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan/90">Experience</p>
        <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Where I&apos;ve <span className="text-gradient">worked</span>
        </h2>
        <p className="section-lead">
          Co-op and internship roles drawn from my résumé — cards slide in from alternating sides as you scroll.
        </p>

        <div className="relative mt-16 md:mt-20">
          {/* Rail: line + dots share the same x so the stroke passes through dot centers (h-3 w-3 → 6px). */}
          <div
            className="absolute left-[6px] top-2 h-[calc(100%-12px)] w-px -translate-x-1/2 bg-gradient-to-b from-accent-blue via-accent-cyan/45 to-transparent"
            aria-hidden
          />

          <ul className="relative space-y-10 md:space-y-14">
            {items.map((item, index) => {
              const fromLeft = index % 2 === 0;
              return (
                <li key={`${item.company}-${item.role}-${index}`} className="relative pl-8 md:pl-11">
                  <span
                    className="absolute left-[6px] top-10 h-3 w-3 -translate-x-1/2 rounded-full border border-white/25 bg-accent-blue shadow-[0_0_18px_rgba(79,142,247,0.85)] md:top-14"
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
                    className={`glass-panel rounded-2xl p-5 sm:p-7 md:p-10 ${item.placeholder ? "border-dashed opacity-45" : ""}`}
                  >
                    <div className="flex gap-4 sm:gap-5 md:gap-7">
                      <ExperienceLogo company={item.company} logoSrc={item.logoSrc} />
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-col gap-y-1 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-x-6">
                          <h3 className="font-display min-w-0 break-words text-2xl font-bold leading-snug text-white [overflow-wrap:anywhere] sm:text-3xl md:text-4xl">
                            {item.company}
                          </h3>
                          <p className="flex items-center gap-2 whitespace-nowrap text-sm text-[var(--text-muted)] sm:gap-2.5 sm:text-base md:justify-self-end md:pt-1.5 md:text-lg">
                            {!item.placeholder && item.current && (
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                              </span>
                            )}
                            {item.dates}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-accent-cyan/90 sm:text-base md:text-lg">{item.role}</p>
                      </div>
                    </div>

                    {!item.placeholder && item.bullets.length > 0 && (
                      <ul className="mt-6 space-y-3 text-[0.9375rem] leading-relaxed text-[var(--text-muted)] sm:mt-7 sm:space-y-3.5 sm:text-base md:mt-8 md:space-y-4 md:text-lg">
                        {item.bullets.map((b) => (
                          <li key={b} className="flex gap-3.5">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue md:mt-3" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.tags.length > 0 && (
                      <div className="mt-7 flex flex-wrap gap-2.5 md:mt-8">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-[var(--text-muted)]"
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
