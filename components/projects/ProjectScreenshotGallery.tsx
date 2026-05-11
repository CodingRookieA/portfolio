"use client";

/**
 * Responsive gallery for project screenshots in the detail panel (full list, including card header).
 * Images use object-contain within a max height so nothing is cropped.
 */
export function ProjectScreenshotGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  const n = images.length;

  const gridClass =
    n === 1
      ? "grid grid-cols-1"
      : n === 2
        ? "grid grid-cols-1 sm:grid-cols-2"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div
      className={`${gridClass} gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 lg:gap-x-8 lg:gap-y-10`}
    >
      {images.map((src, i) => (
        <figure
          key={`${src}-${i}`}
          className={`group relative flex items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-black/35 px-2 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-3 sm:py-4 ${
            n === 3 && i === 0 ? "sm:col-span-2" : ""
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- public paths */}
          <img
            src={src}
            alt={`Screenshot ${i + 1} of ${n}`}
            className="mx-auto block max-h-[min(480px,62vh)] max-w-full rounded-[10px] object-contain transition duration-300 group-hover:brightness-[1.03]"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </figure>
      ))}
    </div>
  );
}
