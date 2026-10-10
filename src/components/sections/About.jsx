"use client";

import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { about, stats } from "@/constant/data";

function Stat({ value, label }) {
  const ref = useRef(null);
  const [, num, suffix] = value.match(/^(\d+)(.*)$/) || [null, value, ""];

  useEffect(() => {
    if (reducedMotion()) return;
    const n = { v: 0 };
    const tween = gsap.to(n, {
      v: Number(num),
      duration: 1.6,
      ease: "power3.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(n.v);
      },
      scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [num]);

  return (
    <div className="border-t border-[color:var(--color-line)] pt-4">
      <div className="display text-[clamp(2.6rem,5vw,4.4rem)]">
        <span ref={ref}>{num}</span>
        <span className="text-[color:var(--color-accent)]">{suffix}</span>
      </div>
      <div className="eyebrow mt-2">{label}</div>
    </div>
  );
}

export default function About() {
  const root = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      // Heading words ink in as you read down the page.
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: "[data-about-heading]", start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
      // Name tag drops onto the desk.
      gsap.from("[data-polaroid]", {
        y: -60,
        rotation: -18,
        opacity: 0,
        duration: 1.2,
        ease: "back.out(1.4)",
        scrollTrigger: { trigger: "[data-polaroid]", start: "top 85%", once: true },
      });
      gsap.from("[data-pill]", {
        scale: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "back.out(2)",
        delay: 0.5,
        scrollTrigger: { trigger: "[data-polaroid]", start: "top 85%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="relative w-full px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-center justify-between border-b border-[color:var(--color-line)] pb-3 font-mono text-xs uppercase tracking-wider">
          <span className="text-[color:var(--color-accent)]">(About)</span>
          <span className="text-[color:var(--color-muted)]">01 / 05</span>
        </div>

        <div className="mt-14 grid gap-16 md:grid-cols-12 md:gap-10">
          {/* "HELLO my name is" name tag, stuck on the desk */}
          <div className="relative mx-auto w-[min(80vw,330px)] self-start md:col-span-4 md:mx-0 md:mt-6">
            <figure
              data-polaroid
              aria-label="Name tag: Hello, my name is Rahul"
              className="die-cut relative -rotate-3 overflow-hidden rounded-2xl bg-[#b94835] text-center transition-transform duration-500 hover:rotate-0"
            >
              <div className="px-4 pb-3 pt-5 text-[#fbf7ee]">
                <div className="display text-[4.2rem] leading-none tracking-[-0.03em]">HELLO</div>
                <div className="mt-1 font-mono text-sm uppercase tracking-[0.2em]">my name is</div>
              </div>
              <div className="mx-3 flex aspect-[5/3] items-center justify-center rounded-lg bg-[#fbf7ee]">
                <span className="-rotate-3 font-serif text-[4.4rem] italic leading-none text-[#0d0f0e]">Rahul</span>
              </div>
              <figcaption className="py-3 font-mono text-xs uppercase tracking-wider text-[#fbf7ee]/85">
                full-stack · ships things
              </figcaption>
            </figure>
            <span data-pill className="absolute -bottom-9 -right-3 rotate-6 rounded-full bg-[color:var(--color-yellow)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#0d0f0e]">
              Based in India
            </span>
            <span data-pill className="absolute -left-4 -top-4 -rotate-6 rounded-full bg-[color:var(--color-blue)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#fbf7ee]">
              B.Tech CSE &apos;26
            </span>
          </div>

          {/* Copy */}
          <div className="md:col-span-8">
            <h2
              data-about-heading
              className="display text-[clamp(2.2rem,5.4vw,5.2rem)] leading-[0.95]"
            >
              {about.heading.split(" ").map((w, i) => (
                <span key={i} data-word className="mr-[0.22em] inline-block">
                  {w}
                </span>
              ))}
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {about.body.map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-[color:var(--color-fg-soft)] md:text-lg">
                  {p}
                </p>
              ))}
            </div>

            <blockquote className="mt-10 border-l-4 border-[color:var(--color-blue)] pl-5 font-mono text-sm text-[color:var(--color-blue)] md:text-base">
              &ldquo;Ship it, watch people use it, then make it better.&rdquo;
            </blockquote>

            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
              {stats.map((s) => (
                <Stat key={s.label} {...s} />
              ))}
            </div>

            <p className="eyebrow mt-10">{about.meta}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
