"use client";

import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { experience } from "@/constant/data";
import SectionHead from "../ui/SectionHead";

// Each role is an index card. On wider screens cards are CSS-sticky so they
// stack as you scroll and GSAP pushes the covered card back a little. Phones
// get a plain list: a card taller than the screen can't be read once covered.
export default function Experience() {
  const root = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const mm = gsap.matchMedia(root);
    mm.add("(min-width: 768px)", () => {
      const cards = gsap.utils.toArray("[data-card]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.93,
          rotation: i % 2 ? 1.5 : -1.5,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="experience" ref={root} className="relative w-full px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead label="Work log" index="02 / 05" title="LOG" count={String(experience.length).padStart(2, "0")} />
        <p className="mt-6 max-w-md text-[color:var(--color-fg-soft)]">
          From intern to engineer, shipping real products for real users.
        </p>

        <div className="mt-16 space-y-10 md:space-y-[18vh] md:pb-[6vh]">
          {experience.map((exp, i) => (
            <div key={exp.id} className="md:sticky" style={{ top: `calc(14vh + ${i * 26}px)` }}>
              <article
                data-card
                className="ruled relative mx-auto max-w-5xl origin-top rounded-md border border-[color:var(--color-line)] px-6 pb-10 pt-6 pl-[76px] text-[#0d0f0e] shadow-[0_24px_50px_-20px_rgba(13,15,14,0.35)] md:px-12 md:pl-[96px]"
                style={{ backgroundColor: "#fbf7ee" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs uppercase tracking-wider">
                  <span className="text-[#b94835]">
                    {exp.start} → {exp.end}
                  </span>
                  <span className="text-[#62655e]">{exp.tag}</span>
                </div>
                <h3 className="display mt-6 text-[clamp(2rem,4.6vw,3.8rem)]">{exp.role}</h3>
                <p className="mt-2 font-semibold text-[#292b28]">
                  {exp.company}
                  {exp.location && <span className="font-medium text-[#62655e]"> · {exp.location}</span>}
                </p>
                <ul className="mt-6 space-y-3">
                  {exp.points.map((p, j) => (
                    <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-[#292b28] md:text-base">
                      <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rotate-45 bg-[#b94835]" />
                      {p}
                    </li>
                  ))}
                </ul>
                {exp.end === "Present" && (
                  <span className="absolute -right-3 -top-4 rotate-6 rounded-full bg-[#b94835] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#fbf7ee]">
                    Current
                  </span>
                )}
                <span className="absolute bottom-4 right-6 font-mono text-xs text-[#92958b]">
                  {String(i + 1).padStart(2, "0")} / {String(experience.length).padStart(2, "0")}
                </span>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
