"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, reducedMotion } from "@/lib/gsap";

/**
 * Reference-style section opener: "(LABEL)" + index on a rule, then a giant
 * word whose letters rise out of a mask when it scrolls into view.
 */
export default function SectionHead({ label, index, title, count, className = "" }) {
  const titleRef = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(titleRef.current, { type: "chars", mask: "chars" });
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 1,
        stagger: 0.035,
        ease: "expo.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 85%", once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={className}>
      <div className="flex items-center justify-between border-b border-[color:var(--color-line)] pb-3 font-mono text-xs uppercase tracking-wider">
        <span className="text-[color:var(--color-accent)]">({label})</span>
        <span className="text-[color:var(--color-muted)]">{index}</span>
      </div>
      <h2 className="display mt-5 flex items-start text-[clamp(3.6rem,15vw,15rem)] leading-[0.82]">
        <span ref={titleRef}>{title}</span>
        {count && (
          <sup className="ml-3 mt-[0.4em] font-mono text-[clamp(0.9rem,1.8vw,1.6rem)] font-normal tracking-normal text-[color:var(--color-accent)]">
            {count}
          </sup>
        )}
      </h2>
    </div>
  );
}
