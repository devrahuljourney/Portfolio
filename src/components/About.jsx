"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about, stats } from "@/constant/data";
import Reveal from "./ui/Reveal";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // The section fades in across its entire entrance — from the moment
      // its top touches the viewport bottom to the moment its top reaches
      // the viewport top. That's the exact same physical scroll distance
      // Hero's particle scene uses to retreat and dissolve after its pin
      // releases (see Hero.jsx), so the two stay in lockstep: About reaches
      // full opacity right as the particles finish disappearing, instead of
      // snapping fully visible while the old scene is still lingering above.
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        }
      );

      const words = gsap.utils.toArray(".about-word");
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 78%",
            end: "bottom 55%",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = about.heading.split(" ");

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-32 md:py-44 px-6 md:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="eyebrow mb-10 flex items-center gap-3">
          <span className="h-px w-10 bg-[color:var(--color-accent)]" />
          {about.kicker}
        </Reveal>

        <h2
          ref={headingRef}
          className="max-w-5xl text-[clamp(1.9rem,5.2vw,4.4rem)] font-[family-name:var(--font-space-grotesk)] leading-[1.03] tracking-tight"
        >
          {words.map((w, i) => (
            <span key={i} className="about-word inline-block mr-[0.25em]">
              {w}
            </span>
          ))}
        </h2>

        <div className="mt-16 grid gap-14 md:grid-cols-[1fr_1fr] md:gap-20">
          <div className="space-y-6">
            {about.body.map((p, i) => (
              <Reveal
                as="p"
                key={i}
                delay={i * 0.08}
                className="text-base md:text-lg leading-relaxed text-[color:var(--color-muted)] max-w-md"
              >
                {p}
              </Reveal>
            ))}
            {about.meta && (
              <Reveal
                delay={0.2}
                className="flex items-center gap-3 pt-2 text-xs text-[color:var(--color-faint)]"
              >
                <span className="h-px w-6 bg-[color:var(--color-faint)]" />
                {about.meta}
              </Reveal>
            )}
          </div>

          {/* Stats */}
          <div className="elevated grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-line)]">
            {stats.map((s, i) => (
              <Reveal
                key={i}
                delay={i * 0.06}
                className="bg-[color:var(--color-bg)] p-7 md:p-9"
              >
                <div className="font-[family-name:var(--font-space-grotesk)] text-4xl md:text-5xl text-[color:var(--color-accent)]">
                  {s.value}
                </div>
                <div className="eyebrow mt-3 text-[10px]">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
