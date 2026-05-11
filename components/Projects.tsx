"use client";

import SectionShell from "@/components/SectionShell";
import { FeaturedProjectCard } from "@/components/projects/FeaturedProjectCard";
import { GridProjectCard } from "@/components/projects/GridProjectCard";
import { ProjectDetailPanel, type OriginRect } from "@/components/projects/ProjectDetailPanel";
import ProjectTilt from "@/components/projects/ProjectTilt";
import type { Project } from "@/components/projects/types";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import type { ProjectCategory } from "@/lib/projects.config";

export type { Project };

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

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [origin, setOrigin] = useState<OriginRect | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const filterRadioRefs = useRef<Map<Filter, HTMLButtonElement>>(new Map());

  const handleOpenDetail = useCallback((project: Project, originEl: HTMLElement) => {
    const rect = originEl.getBoundingClientRect();
    const cs = window.getComputedStyle(originEl);
    const radius = parseFloat(cs.borderTopLeftRadius) || 16;
    setOrigin({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      borderRadius: radius,
    });
    setDetailProject(project);
  }, []);

  const handleClosed = useCallback(() => {
    setDetailProject(null);
    setOrigin(null);
  }, []);

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
        <p className="section-lead">
          Flagship plus pinned repos — click a card for the README write-up; the card smoothly expands to a centered
          full view and shrinks back when closed.
        </p>

        <div
          role="radiogroup"
          aria-label="Filter projects by category"
          className="mt-10 inline-flex flex-wrap gap-1 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md"
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const keys = tabs.map((t) => t.key);
            const i = keys.indexOf(filter);
            if (i < 0) return;
            const next =
              e.key === "ArrowRight" ? (i + 1) % keys.length : (i - 1 + keys.length) % keys.length;
            const nextKey = keys[next]!;
            setFilter(nextKey);
            e.preventDefault();
            queueMicrotask(() => filterRadioRefs.current.get(nextKey)?.focus());
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="radio"
              aria-checked={filter === tab.key}
              tabIndex={filter === tab.key ? 0 : -1}
              ref={(el) => {
                if (el) filterRadioRefs.current.set(tab.key, el);
                else filterRadioRefs.current.delete(tab.key);
              }}
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
            className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-2"
            variants={prefersReducedMotion ? { hidden: {}, show: {} } : gridContainer}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.08 }}
            style={{ perspective: prefersReducedMotion ? undefined : "1200px" }}
          >
            {visibleProjects.map((project) => {
              // Object identity: only the manual flagship row (first in `projects`) gets the wide card.
              const isFeatured = filter === "all" && project === projects[0];
              const isThisExpanded = detailProject?.name === project.name;

              const inner = isFeatured ? (
                <FeaturedProjectCard
                  project={project}
                  onOpenDetail={handleOpenDetail}
                  isHidden={isThisExpanded}
                />
              ) : (
                <GridProjectCard
                  project={project}
                  onOpenDetail={handleOpenDetail}
                  isHidden={isThisExpanded}
                />
              );

              return (
                <motion.div
                  key={project.name}
                  variants={prefersReducedMotion ? { hidden: {}, show: {} } : gridItem}
                  className={`min-h-0 ${isFeatured ? "md:col-span-2" : ""}`}
                  layout={!prefersReducedMotion}
                >
                  {prefersReducedMotion || isThisExpanded ? inner : <ProjectTilt>{inner}</ProjectTilt>}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
      <ProjectDetailPanel project={detailProject} origin={origin} onClosed={handleClosed} />
    </SectionShell>
  );
}
