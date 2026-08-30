"use client";

import Image from "next/image";
import { SkillImageAndName } from "@/constant/data";
import Reveal from "./ui/Reveal";

function Pill({ item }) {
  return (
    <div className="elevated group mx-2 flex shrink-0 items-center gap-3 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)] px-6 py-3.5 transition-colors duration-300 hover:border-[color:var(--color-accent)]">
      <Image
        src={item.img}
        alt={item.name}
        width={26}
        height={26}
        className="skill-icon h-6 w-6 object-contain"
      />
      <span className="whitespace-nowrap text-sm text-[color:var(--color-muted)] transition-colors duration-300 group-hover:text-[color:var(--color-fg)]">
        {item.name}
      </span>
    </div>
  );
}

function Row({ items, duration, reverse }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-wrap relative w-full overflow-hidden">
      <div
        className={`marquee-track ${reverse ? "reverse" : ""}`}
        style={{ "--marquee-duration": duration }}
      >
        {loop.map((item, i) => (
          <Pill key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Skill() {
  const half = Math.ceil(SkillImageAndName.length / 2);
  const rowA = SkillImageAndName.slice(0, half);
  const rowB = SkillImageAndName.slice(half);

  return (
    <section id="skills" className="relative w-full py-28 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-12 mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal className="eyebrow mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[color:var(--color-accent)]" />
            Stack
          </Reveal>
          <Reveal as="h2" delay={0.05} className="text-[clamp(2.2rem,6vw,5rem)]">
            Tools I reach for
          </Reveal>
        </div>
        <Reveal
          as="p"
          delay={0.1}
          className="max-w-xs text-sm text-[color:var(--color-muted)]"
        >
          The kit I use to take products from first commit to production.
        </Reveal>
      </div>

      {/* Edge fade over the marquee rows */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 md:w-48 bg-gradient-to-r from-[color:var(--color-bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 md:w-48 bg-gradient-to-l from-[color:var(--color-bg)] to-transparent" />
        <div className="flex flex-col gap-4">
          <Row items={rowA} duration="38s" />
          <Row items={rowB} duration="32s" reverse />
        </div>
      </div>
    </section>
  );
}
