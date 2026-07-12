"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Entrance = "default" | "soft";

export default function SectionShell({
  id,
  className,
  children,
  entrance = "default",
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  /** `soft` = mild rise (hero → Experience handoff). `default` keeps the 3D tilt. */
  entrance?: Entrance;
}) {
  const reduced = useReducedMotion();
  const soft = entrance === "soft";

  return (
    <section
      id={id}
      className={`scroll-mt-28 ${className ?? ""}`}
      style={reduced || soft ? undefined : { perspective: "1400px" }}
    >
      <motion.div
        initial={
          reduced
            ? false
            : soft
              ? { opacity: 0, y: 32 }
              : { opacity: 0, rotateX: 11, y: 72, z: -48 }
        }
        whileInView={reduced ? {} : soft ? { opacity: 1, y: 0 } : { opacity: 1, rotateX: 0, y: 0, z: 0 }}
        viewport={{ once: true, amount: soft ? 0.08 : 0.12 }}
        transition={{ duration: soft ? 0.75 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={soft ? undefined : { transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
