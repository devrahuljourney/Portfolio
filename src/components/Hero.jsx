"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { hero } from "@/constant/data";
import { BackgroundBeams } from "./ui/BackgroundBeams";

// WebGL scene is client-only and lazy — the page never blocks on three.js.
const HeroScene = dynamic(() => import("./Hero/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="h-40 w-40 rounded-full border border-[color:var(--color-line)] animate-pulse" />
    </div>
  ),
});

const ease = [0.16, 1, 0.3, 1];

function Line({ children, delay = 0 }) {
  return (
    <span className="reveal-line">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const { resolvedTheme } = useTheme();
  // three.js needs a hex; match the CSS accent per theme.
  const sceneColor = resolvedTheme === "light" ? "#4d7c0f" : "#c7f94a";

  return (
    <section
      id="home"
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center"
    >
      <div className="dot-grid absolute inset-0 z-0" />

      {/* Falling accent beams that burst on the floor line */}
      <BackgroundBeams className="z-0" />

      {/* 3D object — a small offset orb on mobile so it reads as an accent
          rather than a full-bleed wireframe; full inset panel on desktop. */}
      <div className="pointer-events-none absolute -top-16 -right-16 z-0 h-[80vw] w-[80vw] max-h-[380px] max-w-[380px] opacity-55 md:top-0 md:right-0 md:bottom-0 md:left-[28%] md:h-auto md:w-auto md:max-h-none md:max-w-none md:opacity-100">
        <HeroScene color={sceneColor} />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-28 pb-24">
        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-accent)] opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-accent)]" />
          </span>
          <span className="eyebrow">{hero.badge}</span>
        </motion.div>

        {/* Name */}
        <h1 className="display-huge text-[clamp(3rem,13vw,11rem)] mb-6">
          <Line delay={0.15}>Rahul Kumar</Line>
          <Line delay={0.28}>
            <span className="text-[color:var(--color-accent)]">Verma.</span>
          </Line>
        </h1>

        {/* Role + line */}
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease, delay: 0.5 }}
            className="eyebrow mb-5"
          >
            {hero.role}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.6 }}
            className="text-base md:text-lg text-[color:var(--color-muted)] leading-relaxed"
          >
            {hero.line}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.75 }}
            className="flex flex-wrap items-center gap-4 mt-10"
          >
            <a
              href="/assests/Rahul_Kumar_FullStack_RESUME.pdf"
              download
              data-cursor-label="Get"
              className="elevated-accent group relative overflow-hidden rounded-full bg-[color:var(--color-accent)] px-7 py-3.5 text-sm font-medium text-[color:var(--color-on-accent)]"
            >
              <span className="relative z-10">Download résumé</span>
              <span className="absolute inset-0 -translate-y-full bg-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
              <span className="absolute inset-0 z-10 flex items-center justify-center text-[color:var(--color-accent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                Download résumé
              </span>
            </a>
            <a
              href="#contact"
              data-cursor-label="Say hi"
              className="elevated rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)] px-7 py-3.5 text-sm font-medium text-[color:var(--color-fg)] transition-colors duration-300 hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)]"
            >
              Let&apos;s talk
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="eyebrow text-[10px]">Scroll</span>
        <span className="h-10 w-px bg-gradient-to-b from-[color:var(--color-accent)] to-transparent" />
      </motion.div>
    </section>
  );
}
