import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Projects, { type Project } from "@/components/Projects";
import Skills from "@/components/Skills";
import { getPinnedRepos } from "@/lib/github";
import { loadProjectReadmeMarkdown } from "@/lib/project-readme";
import {
  flagshipProject,
  pinnedProjectDisplayOrder,
  projectOverrides,
  type ProjectCategory,
} from "@/lib/projects.config";

function inferCategoryFromTopics(topics: string[]): ProjectCategory {
  const lowered = topics.map((topic) => topic.toLowerCase());
  if (lowered.some((topic) => topic.includes("android") || topic.includes("mobile"))) return "mobile";
  if (lowered.some((topic) => topic.includes("web") || topic.includes("react") || topic.includes("next"))) return "web";
  return "systems";
}

function excerptFromStory(story: string, maxLen = 108): string {
  const t = story.trim().replace(/\s+/g, " ");
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 48 ? cut.slice(0, lastSpace) : cut) + "…";
}

/** Keeps project cards scannable: at most `maxSentences` sentences, with a hard char ceiling. */
function limitStorySentences(text: string, maxSentences = 3, maxChars = 380): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t) return "No project story available yet.";
  const chunks = t.split(/(?<=[.!?])\s+/).filter(Boolean);
  const sentences = chunks.length ? chunks : [t];
  let out = "";
  for (let i = 0; i < Math.min(maxSentences, sentences.length); i++) {
    const next = out ? `${out} ${sentences[i]}` : sentences[i];
    if (next.length > maxChars) {
      if (!out) return trimWithEllipsis(sentences[0], maxChars);
      break;
    }
    out = next;
  }
  if (!out) return trimWithEllipsis(sentences[0], maxChars);
  return out;
}

function trimWithEllipsis(s: string, max: number): string {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const ls = cut.lastIndexOf(" ");
  return (ls > max * 0.55 ? cut.slice(0, ls) : cut).trimEnd() + "…";
}

/** Stable sort: listed repos first in config order, then any extras keep API order. */
function sortPinnedByDisplayOrder(projects: Project[]): Project[] {
  const rank = new Map(pinnedProjectDisplayOrder.map((name, i) => [name, i]));
  return [...projects].sort((a, b) => {
    const ra = rank.get(a.name);
    const rb = rank.get(b.name);
    if (ra !== undefined && rb !== undefined) return ra - rb;
    if (ra !== undefined) return -1;
    if (rb !== undefined) return 1;
    return 0;
  });
}

export default async function Page() {
  const pinnedRepos = await getPinnedRepos();

  const pinnedMerged: Project[] = pinnedRepos.map((repo) => {
    const override = projectOverrides[repo.name];
    const raw = override?.story ?? repo.description ?? "No project story available yet.";
    const story = limitStorySentences(raw, 3);

    return {
      name: repo.name,
      story,
      excerpt: override?.excerpt ?? excerptFromStory(story),
      highlights: override?.highlights ?? repo.topics,
      category: override?.category ?? inferCategoryFromTopics(repo.topics),
      language: repo.primaryLanguage,
      url: repo.url,
      screenshots: override?.screenshots ?? [],
      videos: override?.videos ?? [],
      extraLinks: override?.extraLinks ?? [],
      linkLabel: undefined,
      sourceNote: undefined,
      readmeMarkdown: loadProjectReadmeMarkdown(repo.name),
    };
  });

  const flagship: Project = {
    name: flagshipProject.name,
    story: limitStorySentences(flagshipProject.story, 3),
    excerpt: flagshipProject.excerpt,
    highlights: flagshipProject.highlights,
    category: flagshipProject.category,
    language: flagshipProject.language,
    url: flagshipProject.url,
    screenshots: flagshipProject.screenshots ?? [],
    videos: flagshipProject.videos ?? [],
    extraLinks: flagshipProject.extraLinks ?? [],
    linkLabel: flagshipProject.linkLabel,
    sourceNote: flagshipProject.sourceNote,
    readmeMarkdown: loadProjectReadmeMarkdown(flagshipProject.name),
  };

  // Avoid duplicate React keys / layoutIds if the flagship repo is also a GitHub pin.
  const pinnedWithoutFlagship = sortPinnedByDisplayOrder(
    pinnedMerged.filter((p) => p.name !== flagshipProject.name),
  );
  const mergedProjects: Project[] = [flagship, ...pinnedWithoutFlagship];

  return (
    <>
      <Nav />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative min-h-screen scroll-mt-28 bg-deep text-white outline-none"
      >
        <Hero />
        <Experience />
        <Projects projects={mergedProjects} />
        <Skills />
      </main>
      <Footer />
    </>
  );
}
