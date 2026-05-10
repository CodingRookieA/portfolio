import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Projects, { type Project } from "@/components/Projects";
import Skills from "@/components/Skills";
import { getPinnedRepos } from "@/lib/github";
import { flagshipProject, projectOverrides, type ProjectCategory } from "@/lib/projects.config";

function inferCategoryFromTopics(topics: string[]): ProjectCategory {
  const lowered = topics.map((topic) => topic.toLowerCase());
  if (lowered.some((topic) => topic.includes("android") || topic.includes("mobile"))) return "mobile";
  if (lowered.some((topic) => topic.includes("web") || topic.includes("react") || topic.includes("next"))) return "web";
  return "systems";
}

function excerptFromStory(story: string, maxLen = 130): string {
  const t = story.trim().replace(/\s+/g, " ");
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 48 ? cut.slice(0, lastSpace) : cut) + "…";
}

export default async function Page() {
  const pinnedRepos = await getPinnedRepos();

  const pinnedMerged: Project[] = pinnedRepos.map((repo) => {
    const override = projectOverrides[repo.name];
    const story = override?.story ?? repo.description ?? "No project story available yet.";

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
    };
  });

  const flagship: Project = {
    name: flagshipProject.name,
    story: flagshipProject.story,
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
  };

  const mergedProjects: Project[] = [flagship, ...pinnedMerged];

  return (
    <main className="relative min-h-screen bg-deep text-white">
      <Nav />
      <Hero />
      <Experience />
      <Projects projects={mergedProjects} />
      <Skills />
      <Footer />
    </main>
  );
}
