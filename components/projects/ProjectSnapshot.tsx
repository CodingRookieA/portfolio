import type { Project } from "./types";

/** Grid cards: one fixed-height panel for screenshot or code — no flex-grown “tower”. */
const GRID_SNAPSHOT_H = "h-[200px] md:h-[220px]";

function snapshotSnippet(project: Project) {
  return `// ${project.name}\nconst stack = ${JSON.stringify(project.highlights.slice(0, 6))};\nexport const focus = "${project.category}";`;
}

export function ProjectSnapshot({ project, variant }: { project: Project; variant: "featured" | "grid" }) {
  if (variant === "featured") {
    const hero = project.screenshots?.[0];
    return (
      <div className="glass-panel flex w-full shrink-0 flex-col justify-between rounded-xl border-white/10 p-5 md:max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-accent-cyan/90">
          {hero ? "Preview" : "Snapshot"}
        </p>
        {hero ? (
          <div className="relative mt-4 min-h-[200px] flex-1 overflow-hidden rounded-lg border border-white/10 bg-black/35 md:min-h-[240px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- public paths */}
            <img
              src={hero}
              alt={`${project.name} preview`}
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
            />
          </div>
        ) : (
          <pre className="mt-4 overflow-x-auto text-left text-xs leading-relaxed text-[var(--text-muted)]">
            {snapshotSnippet(project)}
          </pre>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel flex h-auto w-full min-w-0 shrink-0 flex-col self-start rounded-xl border-white/10 p-3 md:max-w-[min(32%,180px)] md:flex-[0_0_auto] md:p-4 lg:max-w-[200px]">
      <p className="shrink-0 text-xs font-semibold uppercase tracking-wider text-accent-cyan/90">
        {project.screenshots?.[0] ? "Preview" : "Snapshot"}
      </p>
      <div
        className={`relative mt-3 w-full shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/35 ${GRID_SNAPSHOT_H}`}
      >
        {project.screenshots?.[0] ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- remote/public paths; avoids layout shift coupling */}
            <img
              src={project.screenshots[0]}
              alt={`${project.name} preview`}
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
            />
          </>
        ) : (
          <pre className="h-full overflow-auto whitespace-pre-wrap break-all p-2.5 text-left text-[11px] leading-relaxed text-[var(--text-muted)] [overflow-wrap:anywhere] md:p-3 md:text-xs">
            {snapshotSnippet(project)}
          </pre>
        )}
      </div>
    </div>
  );
}
