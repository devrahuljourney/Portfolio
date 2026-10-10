"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { experience } from "@/constant/data";
import SectionHead from "../ui/SectionHead";

// The work log as a paused debugger's call stack. Every role is a stack
// frame; the role before it is its caller. Frames are a physical deck:
// "step out" pops the top card to the back and the caller slides forward.
// All cards share one grid cell, so the section never grows taller with
// more roles: only the frame list gets another row. While it's on screen
// the section pins and scrolling steps through the frames, so every role
// is seen before the page moves on.

const toFn = (role) =>
  role
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w))
    .join("") + "()";
const toFile = (exp) => `${exp.company.split(/[\s(]/)[0].toLowerCase()}.ts:${exp.start.slice(-2)}`;

const PEEK = 16; // px each buried card peeks above the one in front

function place(card, pos, n, immediate) {
  const vars = {
    x: 0,
    y: -pos * PEEK,
    scale: 1 - pos * 0.045,
    opacity: pos > 2 ? 0 : 1,
    rotation: pos === 0 ? 0 : pos % 2 ? 1.2 : -1.2,
    zIndex: n - pos,
    duration: immediate ? 0 : 0.6,
    ease: "expo.out",
  };
  return immediate ? gsap.set(card, vars) : gsap.to(card, vars);
}

function Frame({ exp, n, index, total }) {
  const caller = experience[index + 1];
  return (
    <article
      data-card
      aria-hidden={n !== 0 ? "true" : undefined}
      className="col-start-1 row-start-1 flex origin-top flex-col border-[1.5px] border-[color:var(--color-fg)] bg-[color:var(--color-surface)] shadow-[6px_7px_0_var(--shadow)]"
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b-[1.5px] border-[color:var(--color-fg)] bg-[#12151c] px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-[#f1efe9] md:px-6">
        <span className="flex items-center gap-2 text-[#ff6a2b]">
          <span className="h-2 w-2 rounded-full bg-[#ff6a2b]" /> Paused
        </span>
        <span className="text-[#9aa0ab]">frame #{index}</span>
        <span className="ml-auto text-[#9aa0ab]">{toFile(exp)}</span>
      </header>

      <div className="flex flex-1 flex-col px-4 py-4 sm:py-5 md:px-7 md:py-7">
        <p className="hidden break-words font-mono text-xs text-[color:var(--color-muted)] sm:block md:text-sm">
          <span className="text-[color:var(--color-blue)]">fn</span> {toFn(exp.role)}{" "}
          <span className="text-[color:var(--color-faint)]">{"{"} company: </span>
          <span className="text-[color:var(--color-accent)]">&quot;{exp.company}&quot;</span>
          <span className="text-[color:var(--color-faint)]"> {"}"}</span>
        </p>
        <h3 className="display text-[clamp(2rem,4.4vw,4rem)] uppercase leading-[0.88] sm:mt-3">{exp.role}</h3>
        {/* Phones: one meta line instead of the variables table */}
        <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-muted)] sm:hidden">
          {exp.company} · {exp.start} → {exp.end}
        </p>

        {/* Scope: like the debugger's variables pane */}
        <dl className="mt-5 hidden grid-cols-2 gap-px border-[1.5px] border-[color:var(--color-fg)] bg-[color:var(--color-fg)] font-mono text-[11px] sm:grid sm:grid-cols-4 md:text-xs">
          {[
            ["start", exp.start],
            ["end", exp.end],
            ["where", exp.location],
            ["for", exp.tag],
          ].map(([k, v]) => (
            <div key={k} className="bg-[color:var(--color-surface)] px-3 py-2">
              <dt className="text-[color:var(--color-muted)]">{k}</dt>
              <dd className="mt-0.5 truncate text-[color:var(--color-fg)]" title={v}>
                {v}
              </dd>
            </div>
          ))}
        </dl>

        <ol className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
          {exp.points.map((p, i) => (
            <li key={i} className="grid grid-cols-[1.6rem_minmax(0,1fr)] text-[13.5px] leading-[1.5] text-[color:var(--color-fg-soft)] sm:text-[14.5px] sm:leading-relaxed md:text-[15px]">
              <span className="pt-[2px] font-mono text-xs text-[color:var(--color-faint)]">{String(i + 1).padStart(2, "0")}</span>
              <span>{p}</span>
            </li>
          ))}
        </ol>

        <p className="mt-auto pt-4 font-mono text-[11px] text-[color:var(--color-muted)] sm:pt-6 sm:text-xs">
          {caller ? (
            <>
              ↳ called by <span className="text-[color:var(--color-fg)]">{toFn(caller.role)}</span> at {caller.company}
            </>
          ) : (
            <>↳ entry point · B.Tech CSE, J.C. Bose University</>
          )}
          <span className="float-right">
            {index + 1} / {total}
          </span>
        </p>
      </div>
    </article>
  );
}

export default function Experience() {
  const deck = useRef(null);
  const gridRef = useRef(null);
  const stRef = useRef(null);
  const activeRef = useRef(0);
  const prev = useRef(0);
  const [active, setActive] = useState(0);
  const n = experience.length;
  const posOf = (i, a) => (i - a + n) % n;

  // Lay the deck out, and animate between frames.
  useLayoutEffect(() => {
    const cards = gsap.utils.toArray("[data-card]", deck.current);
    const from = prev.current;
    prev.current = active;
    if (from === active || reducedMotion()) {
      cards.forEach((c, i) => place(c, posOf(i, active), n, true));
      return;
    }
    // Anything but a single step back in is a "pop".
    const forward = active !== (from - 1 + n) % n;
    const leaving = cards[from];
    cards.forEach((c, i) => i !== from && place(c, posOf(i, active), n, false));
    if (forward) {
      // Pop: the old top flies off, then tucks in at the back.
      gsap
        .timeline()
        .to(leaving, { y: -140, x: 60, rotation: 9, opacity: 0, duration: 0.35, ease: "power2.in" })
        .add(() => place(leaving, posOf(from, active), n, true))
        .fromTo(leaving, { opacity: 0 }, { opacity: posOf(from, active) > 2 ? 0 : 1, duration: 0.3 });
    } else {
      place(leaving, posOf(from, active), n, false);
      gsap.fromTo(cards[active], { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // First reveal: cards deal onto the deck.
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-card]", {
        yPercent: 18,
        opacity: 0,
        stagger: { each: 0.12, from: "end" },
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: { trigger: deck.current, start: "top 80%", once: true },
      });
    }, deck);
    return () => ctx.revert();
  }, []);

  // Scroll-driven stepping. Pins the whole panel + deck on wide screens,
  // just the deck on phones, and only when it fits in the viewport.
  useEffect(() => {
    if (reducedMotion() || n < 2) return;
    const mm = gsap.matchMedia();
    mm.add({ wide: "(min-width: 1024px)", narrow: "(max-width: 1023px)" }, (c) => {
      const target = c.conditions.wide ? gridRef.current : deck.current;
      const top = c.conditions.wide ? 110 : 72;
      if (target.offsetHeight + top + 16 > window.innerHeight) return;
      const st = ScrollTrigger.create({
        trigger: target,
        start: `top ${top}px`,
        end: () => `+=${window.innerHeight * 0.7 * n}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(n - 1, Math.floor(self.progress * n));
          if (i !== activeRef.current) {
            activeRef.current = i;
            setActive(i);
          }
        },
      });
      stRef.current = st;
      return () => {
        stRef.current = null;
        st.kill();
      };
    });
    return () => mm.revert();
  }, [n]);

  // Buttons and tabs scroll to the frame when pinned, so state and scroll agree.
  const goTo = (i) => {
    const st = stRef.current;
    // Pinned: clamp (the ends are where the page carries on). Unpinned: wrap.
    const target = st ? Math.max(0, Math.min(n - 1, i)) : ((i % n) + n) % n;
    if (!st) {
      activeRef.current = target;
      return setActive(target);
    }
    const y = st.start + ((target + 0.5) / n) * (st.end - st.start);
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 0.9 }) : window.scrollTo({ top: y, behavior: "smooth" });
  };
  const stepOut = () => goTo(active + 1);
  const stepIn = () => goTo(active - 1);

  const btn =
    "flex items-center gap-2 border-[1.5px] border-[color:var(--color-fg)] px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-[color:var(--color-fg)] hover:text-[color:var(--color-bg)]";

  return (
    <section id="experience" className="relative w-full px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead label="Work log" index="02 / 05" title="Log" count={`${n} frames`} />
        <p className="mt-6 max-w-md text-[color:var(--color-fg-soft)]">
          My career, paused in the debugger. Each role was called by the one before it. Scroll to step out and walk back in time.
        </p>

        <div ref={gridRef} className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-12">
          {/* Call stack panel */}
          <aside className="self-start border-[1.5px] border-[color:var(--color-fg)] bg-[color:var(--color-surface)] font-mono text-xs">
            <div className="flex items-center justify-between border-b-[1.5px] border-[color:var(--color-fg)] px-4 py-2.5 uppercase tracking-wider">
              <span>Call stack</span>
              <span className="text-[color:var(--color-muted)]">{n} frames</span>
            </div>
            <ol className="flex overflow-x-auto [scrollbar-width:none] lg:block [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Roles">
              {experience.map((exp, i) => {
                const on = i === active;
                return (
                  <li key={exp.id} className="shrink-0 border-r border-[color:var(--color-line)] lg:border-b lg:border-r-0">
                    <button
                      role="tab"
                      aria-selected={on}
                      onClick={() => goTo(i)}
                      className={`relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                        on ? "bg-[color:var(--color-fg)] text-[color:var(--color-bg)]" : "hover:bg-[color:var(--color-bg)]"
                      }`}
                    >
                      <span className={on ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-faint)]"}>{on ? "▶" : `#${i}`}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{toFn(exp.role)}</span>
                        <span className={`block truncate text-[11px] ${on ? "opacity-70" : "text-[color:var(--color-muted)]"}`}>
                          {exp.company} · {exp.start.slice(-4)}
                        </span>
                      </span>
                      <span className={`hidden text-[11px] lg:inline ${on ? "opacity-70" : "text-[color:var(--color-faint)]"}`}>{toFile(exp)}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="flex gap-2 border-t-[1.5px] border-[color:var(--color-fg)] p-3">
              <button onClick={stepOut} className={btn} aria-label="Step out to the previous role">
                ⤴ Step out
              </button>
              <button onClick={stepIn} className={btn} aria-label="Step in to the next role">
                ⤵ Step in
              </button>
            </div>
          </aside>

          {/* The deck: every frame in one grid cell */}
          <div ref={deck} className="grid min-w-0 grid-cols-[minmax(0,1fr)]" style={{ paddingTop: `${PEEK * 2 + 8}px` }}>
            {experience.map((exp, i) => (
              <Frame key={exp.id} exp={exp} index={i} n={posOf(i, active)} total={n} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
