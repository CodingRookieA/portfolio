"use client";

import { useCallback, useRef, useState } from "react";
import { ProjectLightbox, type LightboxOriginRect } from "@/components/projects/ProjectLightbox";

/**
 * Responsive gallery for project screenshots in the detail panel. Each thumb
 * opens a full-screen lightbox that supports prev/next navigation (mouse,
 * keyboard arrows) and Esc/click-outside to close.
 */
export function ProjectScreenshotGallery({ images }: { images: string[] }) {
  const imgRefs = useRef<Array<HTMLImageElement | null>>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getOriginRect = useCallback((i: number): LightboxOriginRect | null => {
    const el = imgRefs.current[i];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
      borderRadius: 10,
    };
  }, []);

  if (images.length === 0) return null;

  const n = images.length;

  const gridClass =
    n === 1
      ? "grid grid-cols-1"
      : n === 2
        ? "grid grid-cols-1 sm:grid-cols-2"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={`${gridClass} gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:gap-x-8 lg:gap-y-10`}>
        {images.map((src, i) => (
          <figure
            key={`${src}-${i}`}
            className={`group relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-black/35 px-2 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-3 sm:py-4 ${
              n === 3 && i === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Expand screenshot ${i + 1} of ${n}`}
              className="block w-full cursor-zoom-in rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- public paths */}
              <img
                ref={(el) => {
                  imgRefs.current[i] = el;
                }}
                src={src}
                alt={`Screenshot ${i + 1} of ${n}`}
                className="mx-auto block max-h-[min(480px,62vh)] max-w-full rounded-[10px] object-contain transition duration-300 group-hover:brightness-[1.05] group-hover:scale-[1.01]"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
          </figure>
        ))}
      </div>

      <ProjectLightbox
        images={images}
        index={openIndex}
        getOriginRect={getOriginRect}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </>
  );
}
