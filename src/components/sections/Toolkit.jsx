"use client";

import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { services } from "@/constant/data";
import SectionHead from "../ui/SectionHead";
import Keyboard from "./toolkit/Keyboard";

// What I can help with, printed as a receipt that feeds out as you scroll.
function Receipt() {
  const paper = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const tween = gsap.fromTo(
      paper.current,
      { clipPath: "inset(0 0 100% 0)", y: -40 },
      {
        clipPath: "inset(0 0 0% 0)",
        y: 0,
        ease: "none",
        scrollTrigger: { trigger: paper.current, start: "top 85%", end: "bottom 70%", scrub: 0.5 },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  const order = new Date().getFullYear();

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      {/* Printer slot */}
      <div className="relative z-[2] mx-auto h-4 w-[108%] -translate-x-[3.7%] rounded-full bg-[#2a2c2b] shadow-[inset_0_-3px_0_#121412]" />
      <div
        ref={paper}
        className="relative mx-auto -mt-2 w-full bg-[#fbfaf6] px-6 pb-10 pt-8 font-mono text-[13px] text-[#12151c] shadow-[0_25px_40px_-25px_rgba(18,21,28,0.5)]"
        style={{
          // Torn zig-zag bottom edge.
          maskImage: "linear-gradient(#000, #000), conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg)",
          maskSize: "100% calc(100% - 10px), 20px 10px",
          maskPosition: "top, bottom",
          maskRepeat: "no-repeat, repeat-x",
        }}
      >
        <p className="display text-center text-2xl tracking-[-0.03em]">RAHUL&apos;S DEV SHOP</p>
        <p className="mt-1 text-center text-[11px] uppercase tracking-widest text-[#616977]">Open late · India</p>
        <div className="my-4 border-t border-dashed border-[#12151c]/40" />
        <div className="flex justify-between text-[11px] uppercase text-[#616977]">
          <span>Order #{order}</span>
          <span>Table: you</span>
        </div>
        <div className="my-4 border-t border-dashed border-[#12151c]/40" />

        <p className="mb-3 text-[11px] uppercase tracking-widest text-[#616977]">Services</p>
        <ul className="space-y-4">
          {services.map((s, i) => (
            <li key={s.title}>
              <div className="flex items-baseline gap-2 uppercase">
                <span className="text-[#e5470d]">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium">{s.title}</span>
                <span className="flex-1 translate-y-[-3px] border-b border-dotted border-[#12151c]/50" />
                <span>✓</span>
              </div>
              <p className="mt-1 pl-7 text-[12px] leading-snug text-[#616977]">{s.note}</p>
            </li>
          ))}
        </ul>

        <div className="my-5 border-t border-dashed border-[#12151c]/40" />
        <div className="flex justify-between text-base font-medium uppercase">
          <span>Total</span>
          <span>1 shipped product</span>
        </div>
        <p className="mt-1 text-right text-[11px] uppercase text-[#616977]">bugs: on the house</p>

        <div
          className="mx-auto mt-6 h-12 w-[85%]"
          aria-hidden="true"
          style={{
            background:
              "repeating-linear-gradient(90deg, #12151c 0 2px, transparent 2px 4px, #12151c 4px 5px, transparent 5px 8px, #12151c 8px 11px, transparent 11px 12px)",
          }}
        />
        <p className="mt-3 text-center text-[11px] uppercase tracking-widest">Thank you · come back soon</p>
      </div>
    </div>
  );
}

export default function Toolkit() {
  return (
    <section id="toolkit" className="relative w-full px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead label="Services & stack" index="04 / 05" title="Toolkit" />

        <div className="mt-16 grid items-start gap-16 lg:grid-cols-[380px_1fr] lg:gap-14">
          <Receipt />
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <h3 className="display text-[clamp(1.9rem,3.6vw,3.2rem)]">Type a tool. See where I used it.</h3>
              <p className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-muted)]">
                Your keyboard works here
              </p>
            </div>
            <Keyboard />
          </div>
        </div>
      </div>
    </section>
  );
}
