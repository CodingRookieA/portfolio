"use client";

import { useReducedMotion } from "framer-motion";

/** First tab stop: jump past fixed nav to primary content and move keyboard focus into `<main>`. */
export default function SkipLink() {
  const reduced = useReducedMotion();

  return (
    <a
      href="#main-content"
      className="skip-link pointer-events-auto fixed left-4 top-4 z-[220] -translate-y-[120%] rounded-xl bg-white px-4 py-3 text-sm font-semibold text-deep shadow-lg ring-2 ring-transparent transition-[transform,opacity] duration-200 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-deep opacity-0"
      onClick={(e) => {
        const el = document.getElementById("main-content");
        if (!el) return;
        e.preventDefault();
        el.focus({ preventScroll: true });
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      }}
    >
      Skip to main content
    </a>
  );
}
