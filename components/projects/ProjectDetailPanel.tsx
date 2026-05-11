"use client";

import type { Project } from "@/components/projects/types";
import { ProjectScreenshotGallery } from "@/components/projects/ProjectScreenshotGallery";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type OriginRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: number;
};

type Props = {
  project: Project | null;
  origin: OriginRect | null;
  /** Called after the close animation completes so the parent can clear state. */
  onClosed: () => void;
};

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function computeTargetRect(): OriginRect {
  if (typeof window === "undefined") {
    return { top: 0, left: 0, width: 0, height: 0, borderRadius: 24 };
  }
  const pad = Math.max(16, Math.min(48, window.innerWidth * 0.04));
  const maxW = 1024;
  const maxH = 920;
  const width = Math.min(window.innerWidth - pad * 2, maxW);
  const height = Math.min(window.innerHeight - pad * 2, maxH);
  return {
    top: Math.max(pad, (window.innerHeight - height) / 2),
    left: Math.max(pad, (window.innerWidth - width) / 2),
    width,
    height,
    borderRadius: 24,
  };
}

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="font-display mt-10 border-b border-white/10 pb-3 text-2xl font-bold tracking-tight text-white first:mt-0 md:text-3xl">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="font-display mt-8 text-xl font-semibold tracking-tight text-white md:text-2xl">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-6 text-lg font-semibold text-white">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="mt-4 text-base font-semibold text-white">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[15px] leading-relaxed text-[var(--text-muted)] md:text-base">{children}</p>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-accent-blue underline decoration-white/20 underline-offset-2 transition hover:text-accent-cyan hover:decoration-accent-cyan/40"
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc space-y-2 pl-5 text-[15px] text-[var(--text-muted)] md:text-base">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal space-y-2 pl-5 text-[15px] text-[var(--text-muted)] md:text-base">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed [overflow-wrap:anywhere]">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-2 border-accent-cyan/50 bg-white/[0.03] py-2 pl-4 text-[var(--text-muted)]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-white/10" />,
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/45 p-4 text-[13px] leading-relaxed text-[var(--text-primary)]">
      {children}
    </pre>
  ),
  code: ({ className, children, ...props }: { className?: string; children?: React.ReactNode }) => {
    const isBlock = Boolean(className?.includes("language-"));
    if (isBlock) {
      return (
        <code className={`${className ?? ""} font-mono text-[13px]`} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-accent-cyan/95"
        {...props}
      >
        {children}
      </code>
    );
  },
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm text-[var(--text-muted)]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-white/5 text-white">{children}</thead>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="border-b border-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="border-b border-white/5 px-3 py-2 align-top [overflow-wrap:anywhere]">{children}</td>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="transition hover:bg-white/[0.02]">{children}</tr>
  ),
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- README images are arbitrary URLs / paths
    <img
      src={src}
      alt={alt ?? ""}
      className="my-4 mx-auto block max-h-[min(480px,62vh)] w-auto max-w-full rounded-lg border border-white/10 object-contain"
      loading="lazy"
    />
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-white">{children}</strong>
  ),
};

const morphSpring = { type: "spring" as const, damping: 30, stiffness: 260, mass: 0.9 };

export function ProjectDetailPanel({ project, origin, onClosed }: Props) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const prefersReducedMotion = useReducedMotion();
  const lastFocus = useRef<HTMLElement | null>(null);
  const [target, setTarget] = useState<OriginRect>(() => computeTargetRect());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onResize() {
      setTarget(computeTargetRect());
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleClose = useCallback(() => {
    onClosed();
    queueMicrotask(() => lastFocus.current?.focus?.());
  }, [onClosed]);

  useEffect(() => {
    if (!project) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const t = window.setTimeout(() => closeRef.current?.focus(), 280);
    return () => window.clearTimeout(t);
  }, [project]);

  useBodyScrollLock(Boolean(project));

  useEffect(() => {
    if (!project) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, handleClose]);

  // Snapshot the origin so the exit animation can finish even after the user clicks a different card.
  const originSnapshot = useMemo<OriginRect | null>(() => {
    if (!origin) return null;
    return { ...origin };
  }, [origin]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && originSnapshot ? (
        <div className="fixed inset-0 z-[130]">
          <motion.button
            type="button"
            aria-label="Close project details"
            className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="pointer-events-auto absolute flex flex-col overflow-hidden border border-white/10 bg-[#0b0c1c] shadow-[0_32px_120px_rgba(0,0,0,0.55)] will-change-transform"
            initial={
              prefersReducedMotion
                ? {
                    top: target.top,
                    left: target.left,
                    width: target.width,
                    height: target.height,
                    borderRadius: target.borderRadius,
                    opacity: 0,
                  }
                : {
                    top: originSnapshot.top,
                    left: originSnapshot.left,
                    width: originSnapshot.width,
                    height: originSnapshot.height,
                    borderRadius: originSnapshot.borderRadius,
                    opacity: 1,
                  }
            }
            animate={{
              top: target.top,
              left: target.left,
              width: target.width,
              height: target.height,
              borderRadius: target.borderRadius,
              opacity: 1,
            }}
            exit={
              prefersReducedMotion
                ? { opacity: 0, transition: { duration: 0.18 } }
                : {
                    top: originSnapshot.top,
                    left: originSnapshot.left,
                    width: originSnapshot.width,
                    height: originSnapshot.height,
                    borderRadius: originSnapshot.borderRadius,
                    opacity: 0,
                    transition: {
                      default: morphSpring,
                      // Fade out while shrinking so the card behind reveals smoothly — no blank dark
                      // rectangle pause at the end of the shrink.
                      opacity: { duration: 0.32, ease: "easeIn" },
                    },
                  }
            }
            transition={prefersReducedMotion ? { duration: 0.18 } : morphSpring}
          >
            {/* Content fades in after the box has mostly settled; on close it just rides along with
                the parent opacity so the content stays visible during the shrink. */}
            <motion.div
              className="flex h-full min-h-0 flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: prefersReducedMotion ? 0 : 0.16, duration: 0.22 } }}
            >
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-6">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan/90">Project</p>
                  <h2 id={titleId} className="font-display mt-1 break-words text-2xl font-bold text-white md:text-3xl">
                    {project.name}
                  </h2>
                  {project.excerpt ? (
                    <p className="mt-2 text-sm leading-snug text-[var(--text-muted)] md:text-base">
                      {project.excerpt}
                    </p>
                  ) : null}
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={handleClose}
                  className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:border-accent-blue/40 hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-6 md:py-8">
                <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-white/5 pb-6">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-accent-blue transition hover:text-accent-cyan"
                  >
                    {project.linkLabel ?? "GitHub ↗"}
                  </a>
                  {(project.extraLinks ?? []).map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-white/75 transition hover:text-white"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>

                {project.sourceNote ? (
                  <p className="mt-4 text-xs leading-relaxed text-[var(--text-faint)]">{project.sourceNote}</p>
                ) : null}

                {(() => {
                  const shots = project.screenshots ?? [];
                  if (shots.length === 0) return null;
                  return (
                    <div className="mt-10">
                      <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan/90">
                        Screenshots
                      </p>
                      <div className="mt-4">
                        <ProjectScreenshotGallery images={shots} />
                      </div>
                    </div>
                  );
                })()}

                {Boolean(project.readmeMarkdown?.trim()) ? (
                  <div className="prose-project mt-10 space-y-4 border-t border-white/10 pt-10">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                      {project.readmeMarkdown!}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan/90">Summary</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)] md:text-base">
                      {project.story}
                    </p>
                  </div>
                )}

                {(project.videos?.length ?? 0) > 0 ? (
                  <div className="mt-10">
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan/90">Video</p>
                    <ul className="mt-2 space-y-2">
                      {project.videos!.map((v) => (
                        <li key={v.url}>
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-semibold text-accent-blue hover:text-accent-cyan"
                          >
                            {v.title ?? "Watch ↗"}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
