import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Projects, { type Project } from "@/components/Projects";
import Skills from "@/components/Skills";
import { getPinnedRepos } from "@/lib/github";
import { projectOverrides, type ProjectCategory } from "@/lib/projects.config";

function inferCategoryFromTopics(topics: string[]): ProjectCategory {
  const lowered = topics.map((topic) => topic.toLowerCase());
  if (lowered.some((topic) => topic.includes("android") || topic.includes("mobile"))) return "mobile";
  if (lowered.some((topic) => topic.includes("web") || topic.includes("react") || topic.includes("next"))) return "web";
  return "systems";
}

export default async function Page() {
  const pinnedRepos = await getPinnedRepos();

  const mergedProjects: Project[] = pinnedRepos.map((repo) => {
    const override = projectOverrides[repo.name];

    return {
      name: repo.name,
      story: override?.story ?? repo.description ?? "No project story available yet.",
      highlights: override?.highlights ?? repo.topics,
      category: override?.category ?? inferCategoryFromTopics(repo.topics),
      language: repo.primaryLanguage,
      stars: repo.stargazerCount,
      url: repo.url,
      featured: true,
    };
  });

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
