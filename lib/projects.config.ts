export type ProjectCategory = "systems" | "mobile" | "web" | "db";

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
  /**
   * Override the language dot/label shown on the card. Useful when GitHub's
   * detected primary language doesn't reflect what the project is really about
   * (e.g. a SQL-focused repo whose file count skews toward JS plumbing).
   */
  language?: { name: string; color: string } | null;
}

/** Manual flagship entry — prepend before GitHub pins on the portfolio page. */
export interface FlagshipProjectConfig {
  name: string;
  story: string;
  /** One-line (or two very short) tagline on the card; full `story` is for a future expanded view. */
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

/**
 * The pinned project lineup, in display order, shown after the manual flagship card.
 *
 * This is the SINGLE SOURCE OF TRUTH for which non-flagship projects appear
 * on the page. Names here must each have a matching entry in `projectOverrides`
 * below — entries without an override are skipped. The names also double as
 * filenames under `.readme-fetch/<name>.md` for the expanded-view README.
 *
 * (We deliberately don't fetch from the GitHub pinned-items API at runtime: it
 * adds an env-var dependency, is offline-fragile, and provides no field that
 * isn't already overridden here. See `lib/github.ts` — kept around but unused.)
 */
export const pinnedProjectDisplayOrder: readonly string[] = [
  "MindBit",
  "Planetze",
  "Assembly-game",
  "PostFolio",
  "LinuxSystemTool",
  "Jenkins",
];

/** GitHub username; used to construct each pinned project's repo URL. */
export const GITHUB_USERNAME = "CodingRookieA";

export const flagshipProject: FlagshipProjectConfig = {
  name: "FinWise",
  excerpt: "Canadian funds & ETFs, answered with receipts—RAG + live data, not generic chatbot filler.",
  story:
    "FinWise helps Canadian investors compare mutual funds and ETFs with a risk questionnaire, optional multi-bank CSV import, and a RAG assistant over curated articles and live fund data. React and Node, two-stage Gemini over MongoDB Atlas vector search with streamed SSE, Google OAuth, deployed via Docker and GitHub Actions on Render.",
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
  language: { name: "JavaScript", color: "#f1e05a" },
  url: "https://finwise-frontend-7qbw.onrender.com/",
  linkLabel: "Live demo ↗",
  sourceNote: "Source is private (privacy / academic constraints); readme highlights & demo linked above.",
  /** First image is the featured-card preview; the rest appear in the expanded detail gallery. */
  screenshots: [
    "/screenshot/finwise/header.png",
    "/screenshot/finwise/1.png",
    "/screenshot/finwise/2.png",
    "/screenshot/finwise/3.png",
    "/screenshot/finwise/4.png",
    "/screenshot/finwise/5.png",
  ],
  videos: [],
  extraLinks: [],
};

export const projectOverrides: Record<string, ProjectOverride> = {
  LinuxSystemTool: {
    excerpt: "Your laptop’s vitals, live in the terminal—C, POSIX, and processes that don’t flinch.",
    story:
      "Real-time Linux resource monitor in C with concurrent processes, custom CLI parsing, and live terminal output. Processes (not threads) isolate sampling failures per interval.",
    highlights: ["C", "Linux", "Concurrency", "POSIX", "Makefile"],
    category: "systems",
    language: { name: "C", color: "#555555" },
  },
  "Assembly-game": {
    excerpt: "Three pixel levels, zero frameworks—just MIPS, bitmaps, and jump timing in MARS.",
    story:
      "Side-scrolling platformer in MIPS Assembly on the MARS simulator—sprites, collisions, and the main loop at register level.",
    highlights: ["MIPS Assembly", "MARS", "Game Dev"],
    category: "systems",
    language: { name: "Assembly", color: "#6E4C13" },
    screenshots: [
      "/screenshot/assembly/header.png",
      "/screenshot/assembly/Screenshot%202026-05-11%20160427.png",
      "/screenshot/assembly/Screenshot%202026-05-11%20160439.png",
      "/screenshot/assembly/Screenshot%202026-05-11%20160449.png",
    ],
  },
  Planetze: {
    excerpt: "Survey your habits, see your footprint—Android + Firebase eco tracking that sticks.",
    story:
      "Android eco-tracker that estimates carbon footprint from daily habits. MVVM, Firebase, and MPAndroidChart for trends.",
    highlights: ["Kotlin", "Android", "Firebase", "MVVM"],
    category: "mobile",
    language: { name: "Java", color: "#b07219" },
    screenshots: ["/screenshot/planetze/header.jpg", "/screenshot/planetze/1.jpg", "/screenshot/planetze/2.jpg"],
  },
  MindBit: {
    excerpt: "MBTI meets multiplayer—AI game picks, chat, and video calls in one polished stack.",
    story: "React + TypeScript sandbox—swap in your pitch and outcomes when the build is ready.",
    highlights: ["TypeScript", "React"],
    category: "web",
    language: { name: "TypeScript", color: "#3178c6" },
    screenshots: [
      "/screenshot/mindbit/header.jpg",
      "/screenshot/mindbit/1767886111081.jpg",
      "/screenshot/mindbit/1767886134358.jpg",
      "/screenshot/mindbit/1767886153854.jpg",
      "/screenshot/mindbit/1767886166628.jpg",
    ],
  },
  Jenkins: {
    excerpt:
      "Jenkins meets GitHub—webhook-driven pipelines that lint, test, and keep broken code off main.",
    story:
      "Production-style CI with Jenkins declarative and multibranch pipelines, GitHub webhooks, and Python. pytest and flake8 on every push; branch protection and failure handling are the focus, with a minimal app on purpose.",
    highlights: ["Jenkins", "Python", "GitHub", "pytest", "flake8", "Docker"],
    category: "systems",
    language: { name: "Python", color: "#3572A5" },
  },
  PostFolio: {
    excerpt:
      "Postgres + Portfolio, hence the name—CTEs, window functions, and COVAR_POP doing the heavy lifting.",
    story:
      "PostgreSQL-backed stock portfolio manager built as a SQL/database engineering showcase. The Express + vanilla-JS frontend stays intentionally thin so the schema design and analytical queries take the spotlight—chained CTEs, LAG window functions, COVAR_POP/VAR_POP/STDDEV_POP, DISTINCT ON, and conflict-aware UPSERTs computing per-stock Beta vs. a synthesized market and the portfolio-wide covariance matrix entirely in SQL.",
    highlights: [
      "PostgreSQL",
      "SQL",
      "Window Functions",
      "CTEs",
      "Express",
      "Node.js",
      "ESM",
      "pg",
    ],
    category: "db",
    language: { name: "SQL", color: "#e38c00" },
  },
};
