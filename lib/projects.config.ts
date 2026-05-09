export type ProjectCategory = "systems" | "mobile" | "web";

export interface ProjectOverride {
  story: string;
  highlights: string[];
  category: ProjectCategory;
}

export const projectOverrides: Record<string, ProjectOverride> = {
  LinuxSystemTool: {
    story:
      "Built a real-time Linux resource monitor in C with concurrent processes, custom CLI parsing, and live terminal output. Chose processes over threads to isolate sample failures per interval.",
    highlights: ["C", "Linux", "Concurrency", "POSIX", "Makefile"],
    category: "systems",
  },
  "Assembly-game": {
    story:
      "Full platform game in x86 Assembly on the MARS simulator. Every sprite, collision check, and game loop written at the register level.",
    highlights: ["x86 Assembly", "MARS", "Game Dev"],
    category: "systems",
  },
  Planetze: {
    story:
      "Android eco-tracker calculating personal carbon footprint from daily habits. MVVM architecture, Firebase backend, and MPAndroidChart visualizations.",
    highlights: ["Kotlin", "Android", "Firebase", "MVVM"],
    category: "mobile",
  },
  MindBit: {
    story: "ADD YOUR STORY HERE",
    highlights: ["TypeScript", "React"],
    category: "web",
  },
};
