"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export default function SectionShell({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <section
      id={id}
      className={`scroll-mt-28 ${className ?? ""}`}
      style={reduced ? undefined : { perspective: "1400px" }}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, rotateX: 11, y: 72, z: -48 }}
        whileInView={reduced ? {} : { opacity: 1, rotateX: 0, y: 0, z: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
