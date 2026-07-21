"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/constant/data";
import ProjectCard from "./Projects/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // On desktop, pin the section and translate the track horizontally as the
    // user scrolls vertically. On mobile it falls back to native horizontal
    // swipe (see markup), so no pin there.
    let ctx;
    const build = () => {
      if (!mq.matches || reduce || !trackRef.current) return;
      ctx = gsap.context(() => {
        const track = trackRef.current;
        const amount = () => track.scrollWidth - window.innerWidth + 96;
        const tween = gsap.to(track, { x: () => -amount(), ease: "none" });
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${amount()}`,
          pin: true,
          scrub: 1,
          animation: tween,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }, sectionRef);
    };

    build();
    const onChange = () => {
      ctx?.revert();
      ctx = undefined;
      build();
      ScrollTrigger.refresh();
    };
    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
      ctx?.revert();
    };
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative w-full overflow-hidden">
      <div className="md:flex md:h-screen md:flex-col md:justify-center py-24 md:py-0">
        {/* Track: GSAP-driven on desktop, native swipe on mobile */}
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 overflow-x-auto px-6 md:overflow-visible md:px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Intro panel */}
          <div className="flex h-[62vh] max-h-[560px] w-[80vw] shrink-0 flex-col justify-between sm:w-[380px]">
            <div>
              <div className="eyebrow mb-5 flex items-center gap-3">
                <span className="h-px w-10 bg-[color:var(--color-accent)]" />
                Selected work
              </div>
              <h2 className="text-[clamp(2.4rem,7vw,5rem)] leading-[0.95]">
                Things
                <br />
                I&apos;ve
                <br />
                <span className="text-[color:var(--color-accent)]">shipped.</span>
              </h2>
            </div>
            <p className="max-w-[280px] text-sm text-[color:var(--color-muted)]">
              {projects.length} projects across web, mobile, and developer tooling.
              <span className="mt-3 hidden md:flex items-center gap-2 text-[color:var(--color-accent)]">
                Scroll to explore →
              </span>
            </p>
          </div>

          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}

          {/* Outro panel */}
          <div className="flex h-[62vh] max-h-[560px] w-[80vw] shrink-0 flex-col items-start justify-center gap-6 sm:w-[360px]">
            <h3 className="text-3xl leading-tight">
              Got something
              <br />
              to build?
            </h3>
            <a
              href="#contact"
              data-cursor-label="Say hi"
              className="rounded-full bg-[color:var(--color-accent)] px-7 py-3.5 text-sm font-medium text-[color:var(--color-on-accent)] transition-transform duration-300 hover:scale-[1.03]"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
