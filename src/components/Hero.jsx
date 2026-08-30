"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hero } from "@/constant/data";
import { BackgroundBeams } from "./ui/BackgroundBeams";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const scrollCueRef = useRef(null);
  const sceneWrapRef = useRef(null);
  // Shared with HeroScene/ParticleMonogram — no re-renders on scroll.
  const heroScroll = useRef({ active: false, value: 0 });

  // Pin the hero just long enough for the copy to fade and the particle
  // scene to assemble into "SOFTWARE ENGINEER" and hold — same behavior on
  // every screen size. The pin's spacer reserves the section's own full
  // height regardless — so instead of spending more pinned scroll on the
  // un-assembly (which would just be dead time before About can physically
  // reach the viewport), the retreat back toward the corners is driven by a
  // second, unpinned ScrollTrigger that tracks the section's natural
  // scroll-out. That way the particles are visibly breaking apart while
  // About is simultaneously sliding up from below, in the same continuous
  // scroll — no gap in between. Only reduced-motion gets the plain, static
  // fallback (see ParticleMonogram's own free-running path).
  useEffect(() => {
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    let ctx;
    const build = () => {
      if (reduceMq.matches || !sectionRef.current) return;
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.6}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            // Rise 0→0.8 (assemble), hold 0.8→1 (fully formed) for the rest
            // of the pin.
            heroScroll.current.value = Math.min(1, p / 0.8);

            const fadeP = Math.min(1, p / 0.4);
            gsap.set(contentRef.current, { opacity: 1 - fadeP, y: -30 * fadeP });
            gsap.set(scrollCueRef.current, { opacity: 1 - Math.min(1, p / 0.15) });
          },
        });

        // Section's natural scroll-out, right after the pin releases: its
        // bottom travels from the viewport bottom to the viewport top over
        // exactly one section-height of ordinary scrolling. Reversing the
        // particles AND fading the whole scene out over that same distance
        // — matching About's own fade-in range exactly (see About.jsx) —
        // keeps both animations locked to the same scroll, so the particles
        // finish dissolving right as About finishes fading in, instead of
        // lingering on screen after About is already fully visible.
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "bottom bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            heroScroll.current.value = 1 - p;
            gsap.set(sceneWrapRef.current, { opacity: 1 - p });
          },
        });
      }, sectionRef);
      heroScroll.current.active = true;
    };

    build();
    const onChange = () => {
      ctx?.revert();
      ctx = undefined;
      heroScroll.current.active = false;
      heroScroll.current.value = 0;
      gsap.set(contentRef.current, { opacity: 1, y: 0 });
      gsap.set(scrollCueRef.current, { opacity: 1 });
      gsap.set(sceneWrapRef.current, { opacity: 1 });
      build();
      ScrollTrigger.refresh();
    };
    reduceMq.addEventListener("change", onChange);

    return () => {
      reduceMq.removeEventListener("change", onChange);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center"
    >
      <div className="dot-grid absolute inset-0 z-0" />

      {/* Falling accent beams that burst on the floor line */}
      <BackgroundBeams className="z-0" />

      {/* Full-bleed particle scene — same on every screen size. */}
      <div ref={sceneWrapRef} className="pointer-events-none absolute inset-0 z-0">
        <HeroScene color={sceneColor} heroScroll={heroScroll} />
      </div>

      <div ref={contentRef} className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-28 pb-24">
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
        ref={scrollCueRef}
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
