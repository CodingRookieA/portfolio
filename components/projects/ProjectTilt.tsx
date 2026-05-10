"use client";

import { useRef, useState } from "react";

export default function ProjectTilt({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
  );

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 12;
    const ry = (px - 0.5) * 14;
    setTransform(
      `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`
    );
  }

  function onLeave() {
    setTransform("perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="h-full min-h-0 [transform-style:preserve-3d] transition-[transform] duration-150 ease-out will-change-transform"
      style={{ transform }}
    >
      {children}
    </div>
  );
}
