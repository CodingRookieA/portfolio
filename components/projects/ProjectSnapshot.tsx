import type { Project } from "./types";

function snapshotSnippet(project: Project) {
  return `// ${project.name}\nconst stack = ${JSON.stringify(project.highlights.slice(0, 6))};\nexport const focus = "${project.category}";`;
}

export function ProjectSnapshot({ project, variant }: { project: Project; variant: "featured" | "grid" }) {
  if (variant === "featured") {
    return (
      <div className="glass-panel flex w-full shrink-0 flex-col justify-between rounded-xl border-white/10 p-5 md:max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan/90">Snapshot</p>
        <pre className="mt-4 overflow-x-auto text-left text-xs leading-relaxed text-[var(--text-muted)]">
          {snapshotSnippet(project)}
        </pre>
      </div>
    );
  }

  return (
    <div className="glass-panel flex h-full min-h-0 w-full min-w-0 shrink-0 flex-col rounded-xl border-white/10 p-4 md:max-w-[min(42%,260px)] md:flex-[0_0_auto] lg:max-w-[280px]">
      <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-accent-cyan/90">Snapshot</p>
      {project.screenshots?.[0] ? (
        <div className="relative mt-3 min-h-[140px] flex-1 overflow-hidden rounded-lg border border-white/10 bg-black/35 md:min-h-[160px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote/public paths; avoids layout shift coupling */}
          <img
            src={project.screenshots[0]}
            alt={`${project.name} preview`}
            className="absolute inset-0 h-full w-full object-cover object-top"
            loading="lazy"
          />
        </div>
      ) : (
        <pre className="mt-3 min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-all text-left text-[11px] leading-relaxed text-[var(--text-muted)] [overflow-wrap:anywhere] md:text-xs">
          {snapshotSnippet(project)}
        </pre>
      )}
    </div>
  );
}
