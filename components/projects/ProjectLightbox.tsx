"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type LightboxOriginRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: number;
};

type Props = {
  images: string[];
  /** Active image index when open, or `null` when closed. */
  index: number | null;
  /** Returns the on-screen rect of thumbnail `i` so we can morph from/to it. */
  getOriginRect: (i: number) => LightboxOriginRect | null;
  onClose: () => void;
  onIndexChange?: (next: number) => void;
};

function computeTargetRect(): LightboxOriginRect {
  if (typeof window === "undefined") {
    return { top: 0, left: 0, width: 0, height: 0, borderRadius: 16 };
  }
  const pad = Math.max(24, Math.min(72, window.innerWidth * 0.045));
  return {
    top: pad,
    left: pad,
    width: window.innerWidth - pad * 2,
    height: window.innerHeight - pad * 2,
    borderRadius: 16,
  };
}

const morphSpring = { type: "spring" as const, damping: 30, stiffness: 260, mass: 0.9 };

export function ProjectLightbox({ images, index, getOriginRect, onClose, onIndexChange }: Props) {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  const open = index !== null;
  const n = images.length;
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const [target, setTarget] = useState<LightboxOriginRect>(() => computeTargetRect());
  // The rect we morph from on open and morph to on close. Updated when the
  // active image changes so closing always lands back on the right thumbnail.
  const [origin, setOrigin] = useState<LightboxOriginRect | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onResize() {
      setTarget(computeTargetRect());
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Re-snapshot the origin rect whenever the active image changes while open.
  // This way, navigating to a new image updates the morph-back target without
  // animating during nav (the `animate` prop stays at `target`).
  useEffect(() => {
    if (!open) return;
    const r = getOriginRect(index!);
    setOrigin(r ?? target);
  }, [open, index, getOriginRect, target]);

  const handleClose = useCallback(() => {
    // Make sure origin reflects the currently-displayed image before close, so
    // the exit morph lands on the thumbnail the user last saw.
    if (index !== null) {
      const r = getOriginRect(index);
      if (r) setOrigin(r);
    }
    onClose();
  }, [index, getOriginRect, onClose]);

  const handlePrev = useCallback(() => {
    if (index === null || n <= 1) return;
    onIndexChange?.((index - 1 + n) % n);
  }, [index, n, onIndexChange]);

  const handleNext = useCallback(() => {
    if (index === null || n <= 1) return;
    onIndexChange?.((index + 1) % n);
  }, [index, n, onIndexChange]);

  // Capture-phase key handler. Using capture + stopImmediatePropagation prevents
  // the parent ProjectDetailPanel's window-level Escape handler from also firing
  // and closing the panel underneath when we just want to dismiss the lightbox.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopImmediatePropagation();
        handlePrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleNext();
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, handleClose, handlePrev, handleNext]);

  // Manage focus: park focus on the Close button while open, restore previous
  // focus on close.
  useEffect(() => {
    if (!open) return;
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 260);
    return () => {
      window.clearTimeout(t);
      queueMicrotask(() => lastFocusRef.current?.focus?.());
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && origin ? (
        <div className="fixed inset-0 z-[180]">
          {/* Backdrop. Clicking it (i.e. anywhere outside the image) closes. */}
          <motion.button
            type="button"
            aria-label="Close screenshot viewer"
            className="absolute inset-0 cursor-zoom-out bg-black/85 backdrop-blur-md"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
            onClick={handleClose}
          />

          {/* Morphing image container. Pointer events stay off here so the
              backdrop receives clicks; only the image itself swallows clicks. */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="pointer-events-none absolute flex items-center justify-center overflow-hidden"
            initial={
              reduced
                ? {
                    top: target.top,
                    left: target.left,
                    width: target.width,
                    height: target.height,
                    borderRadius: target.borderRadius,
                    opacity: 0,
                  }
                : {
                    top: origin.top,
                    left: origin.left,
                    width: origin.width,
                    height: origin.height,
                    borderRadius: origin.borderRadius,
                    opacity: 1,
                  }
            }
            animate={{
              top: target.top,
              left: target.left,
              width: target.width,
              height: target.height,
              borderRadius: target.borderRadius,
              opacity: 1,
            }}
            exit={
              reduced
                ? { opacity: 0, transition: { duration: 0.18 } }
                : {
                    top: origin.top,
                    left: origin.left,
                    width: origin.width,
                    height: origin.height,
                    borderRadius: origin.borderRadius,
                    opacity: 0,
                    transition: {
                      default: morphSpring,
                      opacity: { duration: 0.32, ease: "easeIn" },
                    },
                  }
            }
            transition={reduced ? { duration: 0.2 } : morphSpring}
          >
            <AnimatePresence mode="wait" initial={false}>
              {/* eslint-disable-next-line @next/next/no-img-element -- public paths */}
              <motion.img
                key={images[index!]}
                src={images[index!]}
                alt={`Screenshot ${index! + 1} of ${n}`}
                id={titleId}
                draggable={false}
                className="pointer-events-auto max-h-full max-w-full select-none object-contain"
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            </AnimatePresence>
          </motion.div>

          {/* Floating UI: counter, close, prev/next. Fades in after the morph
              settles so it doesn't shrink with the container. */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: reduced ? 0 : 0.18, duration: 0.22 } }}
            exit={{ opacity: 0, transition: { duration: 0.14 } }}
          >
            <div className="pointer-events-auto absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-white/15 bg-black/55 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur md:top-5">
              {index! + 1} / {n}
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleClose}
              className="pointer-events-auto absolute right-4 top-4 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur transition hover:border-accent-blue/40 hover:bg-white/15 md:right-6 md:top-5"
            >
              Close
            </button>

            {n > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous screenshot"
                  onClick={handlePrev}
                  className="pointer-events-auto absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur transition hover:border-accent-blue/40 hover:bg-black/80 md:left-6 md:p-3"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Next screenshot"
                  onClick={handleNext}
                  className="pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur transition hover:border-accent-blue/40 hover:bg-black/80 md:right-6 md:p-3"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
