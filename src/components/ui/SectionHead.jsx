"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, reducedMotion } from "@/lib/gsap";

/**
 * Section opener styled like a drawing sheet header: a boxed sheet number,
 * a label rule, then a condensed title that rises line by line, with an
 * optional bracketed count tag.
 */
export default function SectionHead({ label, index, title, count, className = "" }) {
  const titleRef = useRef(null);
  const sheet = String(index).split("/")[0].trim();

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(titleRef.current, { type: "lines", mask: "lines" });
      gsap.from(split.lines, {
        yPercent: 105,
        duration: 1,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: titleRef.current, start: "top 85%", once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={className}>
      <div className="flex items-stretch gap-3 font-mono text-xs uppercase tracking-wider">
        <span className="flex w-11 items-center justify-center border-[1.5px] border-[color:var(--color-fg)] py-1.5 font-bold">{sheet}</span>
        <span className="flex flex-1 items-center justify-between border-b-[1.5px] border-[color:var(--color-fg)]">
          <span className="text-[color:var(--color-accent)]">{label}</span>
          <span className="text-[color:var(--color-muted)]">Sheet {index}</span>
        </span>
      </div>
      <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3">
        <h2 ref={titleRef} className="display text-[clamp(3.6rem,13vw,13rem)] uppercase leading-[0.82]">
          {title}
        </h2>
        {count && (
          <span className="mb-[0.6em] border-[1.5px] border-[color:var(--color-fg)] px-2.5 py-1 font-mono text-xs uppercase tracking-wider">
            [{count}]
          </span>
        )}
      </div>
    </div>
  );
}
