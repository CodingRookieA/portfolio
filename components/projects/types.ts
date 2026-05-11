import type { ProjectCategory, ProjectExtraLink, ProjectVideo } from "@/lib/projects.config";

export interface Project {
  name: string;
  story: string;
  excerpt?: string;
  highlights: string[];
  category: ProjectCategory;
  language: { name: string; color: string } | null;
  url: string;
  screenshots?: string[];
  videos?: ProjectVideo[];
  extraLinks?: ProjectExtraLink[];
  linkLabel?: string;
  sourceNote?: string;
  /** Local markdown for the detail panel; null/undefined if no file matched. */
  readmeMarkdown?: string | null;
}
