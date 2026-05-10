export type ProjectCategory = "systems" | "mobile" | "web";

export interface ProjectVideo {
  url: string;
  title?: string;
}

export interface ProjectExtraLink {
  label: string;
  href: string;
}

export interface ProjectOverride {
  story: string;
  highlights: string[];
  category: ProjectCategory;
  /** Short preview for compact cards (1–2 lines). Falls back to truncated story if omitted. */
  excerpt?: string;
  /** Paths under `/public`, e.g. `/finwise/chat.png` */
  screenshots?: string[];
  videos?: ProjectVideo[];
  extraLinks?: ProjectExtraLink[];
}

/** Manual flagship entry — prepend before GitHub pins on the portfolio page. */
export interface FlagshipProjectConfig {
  name: string;
  story: string;
  /** Shown on the small name card; keep to ~2 short sentences. */
  excerpt: string;
  highlights: string[];
  category: ProjectCategory;
  language: { name: string; color: string } | null;
  /** Primary outbound link (e.g. live demo). */
  url: string;
  /** Anchor label; defaults to “GitHub ↗” in UI when omitted. */
  linkLabel?: string;
  /** Optional note when repo/source isn’t public. */
  sourceNote?: string;
  screenshots?: string[];
  videos?: ProjectVideo[];
  extraLinks?: ProjectExtraLink[];
}

export const flagshipProject: FlagshipProjectConfig = {
  name: "FinWise",
  excerpt:
    "AI-grounded mutual fund & ETF advisor for Canadian investors: questionnaire, multi-bank CSV import, and RAG chat over articles plus live fund data.",
  story:
    "FinWise helps Canadian investors evaluate mutual funds and ETFs through a risk-aware questionnaire, optional multi-bank holdings CSV import, and an assistant grounded in curated articles plus live fund data—not blind chatbot guesses. The stack is React and Node with a two-stage Gemini workflow over MongoDB Atlas vector search and streamed SSE responses. Google OAuth handles sessions; Docker and GitHub Actions deploy to Render.",
  highlights: [
    "React",
    "Vite",
    "Node.js",
    "Express",
    "MongoDB Atlas",
    "Gemini",
    "RAG",
    "MUI",
    "Jest",
    "Vitest",
    "Cypress",
    "Docker",
    "GitHub Actions",
  ],
  category: "web",
  language: { name: "TypeScript", color: "#3178c6" },
  url: "https://finwise-frontend-7qbw.onrender.com/",
  linkLabel: "Live demo ↗",
  sourceNote: "Source is private (privacy / academic constraints); readme highlights & demo linked above.",
  // Add files under public/, e.g. "/finwise/landing.png", "/finwise/chat.png"
  screenshots: [],
  videos: [],
  extraLinks: [],
};

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
