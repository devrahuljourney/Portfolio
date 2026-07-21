"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin lime progress bar pinned to the top edge of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[200] h-[2px] w-full origin-left bg-[color:var(--color-accent)]"
    />
  );
}
