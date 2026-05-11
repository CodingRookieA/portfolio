import type { Project } from "./types";

export function ProjectCardDeck({ project, variant }: { project: Project; variant: "featured" | "grid" }) {
  const isFeatured = variant === "featured";

  return (
    <div className={`min-w-0 flex-1 ${isFeatured ? "space-y-4" : "flex flex-col gap-4"}`}>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shadow-[0_0_12px_currentColor]"
            style={{
              color: project.language?.color ?? "#6b7280",
              backgroundColor: project.language?.color ?? "#6b7280",
            }}
          />
          <span className="text-sm font-medium text-[var(--text-muted)]">
            {project.language?.name ?? "Language"}
          </span>
        </div>
      </div>
      <h3
        className={`font-display min-w-0 max-w-full break-words font-bold leading-snug text-white [overflow-wrap:anywhere] ${
          isFeatured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
        }`}
      >
        {project.name}
      </h3>
      <p
        className={`font-medium leading-snug text-white/85 [overflow-wrap:anywhere] ${
          isFeatured ? "line-clamp-2 text-base md:text-lg" : "line-clamp-3 text-sm md:text-base"
        }`}
      >
        {project.excerpt ?? project.story}
      </p>
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
      <div
        className={
          isFeatured ? "flex flex-wrap items-center gap-x-4 gap-y-2 pt-2" : "mt-auto flex flex-col gap-2 pt-2"
        }
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
              className="text-sm font-semibold text-white/70 transition hover:text-white"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
        {project.sourceNote ? (
          <p className="text-xs leading-relaxed text-[var(--text-faint)]">{project.sourceNote}</p>
        ) : null}
      </div>
    </div>
  );
}
