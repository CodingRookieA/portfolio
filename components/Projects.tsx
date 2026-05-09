"use client";

import SectionShell from "@/components/SectionShell";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import type { ProjectCategory } from "@/lib/projects.config";

export interface Project {
  name: string;
  story: string;
  highlights: string[];
  category: ProjectCategory;
  language: { name: string; color: string } | null;
  stars: number;
  url: string;
  featured: boolean;
}

type Filter = "all" | ProjectCategory;

const GITHUB_REPOS_URL = "https://github.com/CodingRookieA?tab=repositories";

const gridContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 48, rotateX: 16, z: -36 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    z: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function ProjectTilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
  );

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 12;
    const ry = (px - 0.5) * 14;
    setTransform(
      `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`
    );
  }

  function onLeave() {
    setTransform("perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="h-full [transform-style:preserve-3d] transition-[transform] duration-150 ease-out will-change-transform"
      style={{ transform }}
    >
      {children}
    </div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const prefersReducedMotion = useReducedMotion();

  const counts = useMemo(() => {
    return {
      all: projects.length,
      systems: projects.filter((p) => p.category === "systems").length,
      mobile: projects.filter((p) => p.category === "mobile").length,
      web: projects.filter((p) => p.category === "web").length,
    };
  }, [projects]);

  const visibleProjects = useMemo(
    () => projects.filter((p) => filter === "all" || p.category === filter),
    [filter, projects]
  );

  const tabs: Array<{ key: Filter; label: string }> = [
    { key: "all", label: "All" },
    { key: "systems", label: "Systems" },
    { key: "mobile", label: "Mobile" },
    { key: "web", label: "Web" },
  ];

  return (
    <SectionShell
      id="projects"
      className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-24 md:px-6 md:py-32"
    >
      <div className="relative z-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent-cyan/90">Featured projects</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Selected <span className="text-gradient">work</span>
          </h2>
          <a
            href={GITHUB_REPOS_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-sm font-semibold text-accent-blue transition hover:text-accent-cyan"
          >
            See all on GitHub ↗
          </a>
        </div>
        <p className="mt-4 max-w-2xl text-[var(--text-muted)]">
          Pinned repositories with perspective tilt on hover. Filter by category — layout animates with staggered depth.
        </p>

        <div className="mt-10 inline-flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition md:text-[13px] ${
                filter === tab.key
                  ? "bg-white/12 text-white shadow-[0_0_24px_rgba(79,142,247,0.25)]"
                  : "text-[var(--text-muted)] hover:text-white"
              }`}
            >
              {tab.label}{" "}
              <span className="text-[var(--text-faint)]">({counts[tab.key as keyof typeof counts]})</span>
            </button>
          ))}
        </div>

        {projects.length === 0 ? (
          <div className="glass-panel mt-12 space-y-4 rounded-2xl p-8 text-[var(--text-muted)]">
            <p>Projects loading soon — or connect a GitHub token for live pins.</p>
            <a
              href={GITHUB_REPOS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-sm font-semibold text-accent-blue hover:text-accent-cyan"
            >
              Browse GitHub ↗
            </a>
          </div>
        ) : (
          <motion.div
            key={filter}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2"
            variants={prefersReducedMotion ? { hidden: {}, show: {} } : gridContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.08 }}
            style={{ perspective: prefersReducedMotion ? undefined : "1200px" }}
          >
            {visibleProjects.map((project) => {
              const indexInOriginal = projects.findIndex((p) => p.name === project.name);
              const isFeatured = indexInOriginal === 0 && filter === "all";

              const inner = (
                <article
                  className="glass-panel flex h-full flex-col rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition-[box-shadow,border-color] duration-300 hover:border-accent-blue/35 hover:shadow-[0_28px_80px_rgba(79,142,247,0.12)] md:p-7"
                >
                  <div className={`flex flex-1 flex-col gap-5 ${isFeatured ? "md:flex-row md:gap-10" : ""}`}>
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor]"
                            style={{ color: project.language?.color ?? "#6b7280", backgroundColor: project.language?.color ?? "#6b7280" }}
                          />
                          <span className="text-sm font-medium text-[var(--text-muted)]">
                            {project.language?.name ?? "Language"}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[var(--text-faint)]">★ {project.stars}</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white md:text-3xl">{project.name}</h3>
                      <p className="text-sm leading-relaxed text-[var(--text-muted)]">{project.story}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.highlights.map((h) => (
                          <span
                            key={h}
                            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                      <div className="pt-2">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-accent-blue transition hover:text-accent-cyan"
                        >
                          GitHub ↗
                        </a>
                      </div>
                    </div>
                    {isFeatured && (
                      <div className="glass-panel flex w-full shrink-0 flex-col justify-between rounded-xl border-white/10 p-5 md:max-w-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan/90">Snapshot</p>
                        <pre className="mt-4 overflow-x-auto text-left text-xs leading-relaxed text-[var(--text-muted)]">
                          {`// ${project.name}\nconst stack = ${JSON.stringify(project.highlights.slice(0, 4))};\nexport const focus = "${project.category}";`}
                        </pre>
                      </div>
                    )}
                  </div>
                </article>
              );

              return (
                <motion.div
                  key={project.name}
                  variants={prefersReducedMotion ? { hidden: {}, show: {} } : gridItem}
                  className={isFeatured ? "md:col-span-2" : ""}
                  layout={!prefersReducedMotion}
                >
                  {prefersReducedMotion ? inner : <ProjectTilt>{inner}</ProjectTilt>}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </SectionShell>
  );
}
