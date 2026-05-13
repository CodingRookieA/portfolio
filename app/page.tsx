import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import ScrollHint from "@/components/ScrollHint";
import Projects, { type Project } from "@/components/Projects";
import Skills from "@/components/Skills";
import { loadProjectReadmeMarkdown } from "@/lib/project-readme";
import {
  GITHUB_USERNAME,
  flagshipProject,
  pinnedProjectDisplayOrder,
  projectOverrides,
} from "@/lib/projects.config";

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

function repoUrlFor(name: string): string {
  return `https://github.com/${GITHUB_USERNAME}/${name}`;
}

export default async function Page() {
  // Build pinned projects entirely from the local config — no GitHub fetch,
  // no env-var dependency, deterministic on every host.
  const pinnedMerged: Project[] = pinnedProjectDisplayOrder
    .filter((name) => name !== flagshipProject.name) // dedupe if flagship is also pinned
    .map((name): Project | null => {
      const override = projectOverrides[name];
      if (!override) return null;
      const story = limitStorySentences(override.story, 3);
      return {
        name,
        story,
        excerpt: override.excerpt ?? excerptFromStory(story),
        highlights: override.highlights,
        category: override.category,
        language: override.language ?? null,
        url: repoUrlFor(name),
        screenshots: override.screenshots ?? [],
        videos: override.videos ?? [],
        extraLinks: override.extraLinks ?? [],
        linkLabel: undefined,
        sourceNote: undefined,
        readmeMarkdown: loadProjectReadmeMarkdown(name),
      };
    })
    .filter((p): p is Project => p !== null);

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

  const mergedProjects: Project[] = [flagship, ...pinnedMerged];

  return (
    <>
      <Nav />
      <ScrollHint />
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
