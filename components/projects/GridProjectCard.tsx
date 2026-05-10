import { PROJECT_CARD_ARTICLE_CLASS } from "./project-card-shell";
import { ProjectCardDeck } from "./ProjectCardDeck";
import { ProjectSnapshot } from "./ProjectSnapshot";
import type { Project } from "./types";

export function GridProjectCard({ project }: { project: Project }) {
  return (
    <article className={PROJECT_CARD_ARTICLE_CLASS}>
      <div className="flex min-h-0 flex-1 flex-col gap-5 md:flex-row md:items-stretch md:gap-6">
        <ProjectCardDeck project={project} variant="grid" />
        <ProjectSnapshot project={project} variant="grid" />
      </div>
    </article>
  );
}
