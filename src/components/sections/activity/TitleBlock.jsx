"use client";

import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";

// The stats, laid out like the title block in the corner of a drawing.
// Numbers count up the first time the block scrolls into view.
export default function TitleBlock({ cells }) {
  const root = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      root.current.querySelectorAll("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const o = { v: 0 };
        gsap.to(o, {
          v: to,
          duration: 1.4,
          ease: "expo.out",
          onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString("en-US")),
          scrollTrigger: { trigger: root.current, start: "top 90%", once: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <dl
      ref={root}
      className="grid grid-cols-2 gap-px border-t-[1.5px] border-[color:var(--color-fg)] bg-[color:var(--color-fg)] md:grid-cols-5"
    >
      {cells.map(({ label, value, unit, note, wide, tone }) => (
        <div key={label} className={`bg-[color:var(--color-surface)] px-4 py-3.5 md:px-5 ${wide ? "col-span-2 md:col-span-1" : ""}`}>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-muted)]">{label}</dt>
          <dd className="mt-2 flex items-baseline gap-1.5">
            <span
              data-count={typeof value === "number" ? value : undefined}
              className="display text-[clamp(2.2rem,4vw,3.4rem)]"
              style={tone ? { color: `var(--${tone})` } : undefined}
            >
              {typeof value === "number" ? value.toLocaleString("en-US") : value}
            </span>
            {unit && <span className="font-mono text-xs uppercase text-[color:var(--color-muted)]">{unit}</span>}
          </dd>
          {note && <p className="mt-1 font-mono text-[11px] text-[color:var(--color-muted)]">{note}</p>}
        </div>
      ))}
    </dl>
  );
}
