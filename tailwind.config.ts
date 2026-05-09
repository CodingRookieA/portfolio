import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        deep: "#0a0a1a",
        elevated: "#0f1024",
        accent: {
          blue: "#4f8ef7",
          cyan: "#00d4ff",
        },
      },
      backgroundImage: {
        "radial-glow":
          "radial-gradient(ellipse 80% 60% at 50% -30%, rgba(79,142,247,0.22), transparent 55%), radial-gradient(ellipse 60% 50% at 100% 50%, rgba(0,212,255,0.08), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
