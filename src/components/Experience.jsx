"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./ui/Reveal";

gsap.registerPlugin(ScrollTrigger);

const experienceData = [
  {
    id: 1,
    role: "Frontend Developer Intern",
    tag: "Founding member",
    company: "We Play India",
    start: "Sep 2024",
    end: "Jan 2025",
    points: [
      "Built and deployed a full-stack furniture e-commerce site on the MERN stack with a responsive UI and an optimized checkout flow.",
      "Shipped CSV bulk product upload, cutting manual entry by ~80% and boosting admin efficiency.",
      "Contributed to the esports admin panel with user management and Cloudinary-backed image uploads.",
    ],
  },
  {
    id: 2,
    role: "Freelance Full-Stack Developer",
    tag: "Self-employed",
    company: "Independent",
    start: "Jan 2025",
    end: "Present",
    points: [
      "Delivered a full MERN commerce platform — user, seller, and admin dashboards, CSV uploads, Cashfree payments, and invoice generation.",
      "Built a responsive legal-services site with a Quill.js blog and a content-management admin panel.",
      "Produced a client marketing site with interactive sections and smooth motion.",
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full py-28 md:py-40 px-6 md:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal className="eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#c7f94a]" />
              Experience
            </Reveal>
            <Reveal as="h2" delay={0.05} className="text-[clamp(2.2rem,6vw,5rem)]">
              Where I&apos;ve built
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={0.1}
            className="max-w-xs text-sm text-[color:var(--color-muted)]"
          >
            A short track record of shipping real products for real users.
          </Reveal>
        </div>

        <div className="relative pl-6 md:pl-10">
          {/* Track + scroll-drawn progress */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-[color:var(--color-line)]" />
          <div
            ref={lineRef}
            className="absolute left-0 top-2 bottom-2 w-px bg-[#c7f94a] origin-top"
          />

          <div className="space-y-16 md:space-y-24">
            {experienceData.map((exp) => (
              <Reveal key={exp.id} className="group relative">
                {/* Node */}
                <span className="absolute -left-[26px] md:-left-[42px] top-2 flex h-3.5 w-3.5 items-center justify-center">
                  <span className="h-3.5 w-3.5 rounded-full border border-[#c7f94a] bg-[color:var(--color-bg)] transition-colors duration-300 group-hover:bg-[#c7f94a]" />
                </span>

                <div className="grid gap-6 md:grid-cols-[200px_1fr] md:gap-12">
                  <div>
                    <div className="font-[family-name:var(--font-jetbrains)] text-sm text-[#c7f94a]">
                      {exp.start} — {exp.end}
                    </div>
                    <div className="eyebrow mt-2 text-[10px]">{exp.tag}</div>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl">{exp.role}</h3>
                    <div className="mt-1 text-sm text-[color:var(--color-muted)]">
                      {exp.company}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {exp.points.map((p, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm md:text-base leading-relaxed text-[color:var(--color-muted)]"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#c7f94a]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
