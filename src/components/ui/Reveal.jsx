"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1];

/** Fade + rise on scroll into view. Cheap, reliable, used across sections. */
export default function Reveal({ children, delay = 0, y = 24, className = "", as = "div" }) {
  const M = motion[as] || motion.div;
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
    >
      {children}
    </M>
  );
}
