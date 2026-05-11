"use client";

import { useRef } from "react";
import { PROJECT_CARD_ARTICLE_CLASS } from "./project-card-shell";
import { ProjectCardDeck } from "./ProjectCardDeck";
import { ProjectSnapshot } from "./ProjectSnapshot";
import type { Project } from "./types";

export function GridProjectCard({
  project,
  onOpenDetail,
  isHidden,
}: {
  project: Project;
  onOpenDetail: (project: Project, originEl: HTMLElement) => void;
  isHidden: boolean;
}) {
  const articleRef = useRef<HTMLElement>(null);

  function handleCardClick(e: React.MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (!articleRef.current) return;
    onOpenDetail(project, articleRef.current);
  }

  return (
    <article
      ref={articleRef}
      className={PROJECT_CARD_ARTICLE_CLASS}
      style={{ visibility: isHidden ? "hidden" : "visible" }}
      onClick={handleCardClick}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-5 md:flex-row md:items-stretch md:gap-6">
        <ProjectCardDeck project={project} variant="grid" />
        <ProjectSnapshot project={project} variant="grid" />
      </div>
      <button
        type="button"
        className="sr-only"
        onClick={(e) => {
          e.stopPropagation();
          if (articleRef.current) onOpenDetail(project, articleRef.current);
        }}
      >
        Open full write-up for {project.name}
      </button>
    </article>
  );
}
