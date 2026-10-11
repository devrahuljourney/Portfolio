"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { projects } from "@/constant/data";
import SectionHead from "../ui/SectionHead";
import Sticker from "../stickers/Sticker";

// Works as a filing drawer: every project is a manila case file with its own
// tab. Opening one pulls the folder up out of the drawer, stamps it, and
// shows a typed case sheet with the evidence clipped to the right page.

const FILTERS = [
  { key: "all", label: "All files", match: () => true },
  { key: "ai", label: "AI", match: (c) => c.includes("ai") },
  { key: "web", label: "Web", match: (c) => c.includes("web") },
  { key: "mobile", label: "Mobile", match: (c) => c.includes("mobile") },
  { key: "client", label: "Client", match: (c) => c.includes("work") || c.includes("freelance") },
  { key: "tools", label: "Tools", match: (c) => c.includes("tool") || c.includes("extension") },
];

const MANILA = "#e2c48c";
const MANILA_DARK = "#cfae72";
const MANILA_EDGE = "#b8955a";

const hasShot = (p) => typeof p.image !== "string";
const isConfidential = (p) => !hasShot(p) && p.image !== "personal";

function stampFor(p) {
  if (isConfidential(p)) return { text: "NDA", color: "#e5470d" };
  if (p.liveLink) return { text: "LIVE", color: "#0e7c7b" };
  return { text: "OPEN SOURCE", color: "#e5470d" };
}

function PaperClip({ className = "" }) {
  return (
    <svg viewBox="0 0 24 64" className={className} aria-hidden="true">
      <path
        d="M8 54V14a6 6 0 0 1 12 0v40a9 9 0 0 1-18 0V18"
        fill="none"
        stroke="#8a8d86"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Right page: a printed screenshot, a redacted brief, or the ReThink phone.
function Evidence({ project }) {
  if (hasShot(project)) {
    return (
      <div className="relative rotate-[1.5deg] bg-[#fbfaf6] p-3 pb-10 shadow-[0_18px_30px_-14px_rgba(18,21,28,0.45)]">
        <PaperClip className="absolute -top-7 left-10 h-16 w-6" />
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image src={project.image} alt={`${project.title} screenshot`} fill sizes="(max-width: 768px) 90vw, 560px" className="object-cover object-top" />
        </div>
        <p className="absolute bottom-3 left-4 font-mono text-xs text-[#616977]">fig. 1 · {project.title.toLowerCase()}</p>
      </div>
    );
  }
  if (isConfidential(project)) {
    const bars = [92, 78, 100, 64, 88, 40, 96, 72, 84, 56];
    return (
      <div className="relative -rotate-1 bg-[#fbfaf6] px-7 py-8 shadow-[0_18px_30px_-14px_rgba(18,21,28,0.45)]">
        <PaperClip className="absolute -top-7 right-12 h-16 w-6" />
        <p className="font-mono text-xs uppercase tracking-wider text-[#616977]">Client brief · page 1 of 1</p>
        <div className="mt-5 space-y-3">
          {bars.map((w, i) => (
            <div key={i} data-redact className="h-3.5 origin-left bg-[#12151c]" style={{ width: `${w}%` }} />
          ))}
        </div>
        <p className="mt-6 font-mono text-xs text-[#616977]">Details shared on request, under NDA.</p>
      </div>
    );
  }
  return (
    <div className="grid-paper relative flex aspect-[16/11] items-center justify-center rotate-1 bg-[#fbfaf6] shadow-[0_18px_30px_-14px_rgba(18,21,28,0.45)]">
      <PaperClip className="absolute -top-7 left-10 h-16 w-6" />
      <Sticker name="phone" className="w-[22%] max-w-[120px]" />
    </div>
  );
}

function CaseFile({ project, number, total }) {
  const stamp = stampFor(project);
  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
      {/* Left page: typed case sheet */}
      <div data-sheet className="relative bg-[#fbfaf6] px-6 py-8 text-[#12151c] shadow-[0_18px_30px_-14px_rgba(18,21,28,0.4)] md:px-10 md:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs uppercase tracking-wider text-[#616977]">
          <span>
            Case file № {String(number).padStart(2, "0")}
            <span className="text-[#9aa0ab]"> / {String(total).padStart(2, "0")}</span>
          </span>
          <span>{project.year}</span>
        </div>
        <h3 data-title className="display mt-6 text-[clamp(2.4rem,4.6vw,4.4rem)]">{project.title}</h3>
        <p className="mt-3 font-mono text-sm uppercase tracking-wider text-[#e5470d]">{project.tagline}</p>
        {project.client && <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[#616977]">{project.client}</p>}

        <p data-typed-desc className="mt-6 font-mono text-[14.5px] leading-7 text-[#2a2f3a]">
          {project.description.split(" ").map((w, i) => (
            <span key={i} data-w>
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="mt-7">
          <p className="font-mono text-xs uppercase tracking-wider text-[#616977]">Stack</p>
          {/* Label-maker tape */}
          <ul className="mt-3 flex flex-wrap gap-2.5">
            {project.tech.map((t, i) => (
              <li
                key={t}
                data-tape
                className="bg-[#12151c] px-2.5 py-1 font-mono text-xs uppercase tracking-[0.12em] text-[#f1efe9] [text-shadow:0_1px_0_rgba(255,255,255,0.18)]"
                style={{ transform: `rotate(${((i * 37) % 5) - 2}deg)` }}
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 font-mono text-sm uppercase tracking-wider">
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" data-cursor-label="Visit" className="link-underline text-[#e5470d]">
              Visit live ↗
            </a>
          )}
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" data-cursor-label="Code" className="link-underline">
              Read the source ↗
            </a>
          )}
        </div>

        {/* Ink stamp */}
        <div
          data-stamp
          aria-label={`Status: ${stamp.text}`}
          className="pointer-events-none absolute -top-5 right-3 -rotate-12 md:-right-5 rounded-md border-[3.5px] px-3 py-1 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-wider opacity-80 mix-blend-multiply md:right-8 md:text-3xl"
          style={{ color: stamp.color, borderColor: stamp.color }}
        >
          {stamp.text}
        </div>
      </div>

      {/* Right page: evidence */}
      <div data-evidence className="flex flex-col justify-center gap-8 pt-4">
        <Evidence project={project} />
      </div>
    </div>
  );
}

export default function Works() {
  const root = useRef(null);
  const folderRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const visible = useMemo(() => projects.filter((p) => FILTERS.find((f) => f.key === filter).match(p.category)), [filter]);
  const [activeId, setActiveId] = useState(projects[0].id);
  const active = visible.find((p) => p.id === activeId) || visible[0];
  const index = visible.indexOf(active);

  const changeFilter = (key) => {
    setFilter(key);
    const next = projects.filter((p) => FILTERS.find((f) => f.key === key).match(p.category));
    if (!next.some((p) => p.id === activeId)) setActiveId(next[0].id);
  };

  // Pull the new folder up out of the drawer, then stamp it.
  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(folderRef);
    const tl = gsap.timeline();
    tl.fromTo(folderRef.current, { y: 70, rotation: -1.2 }, { y: 0, rotation: 0, duration: 0.8, ease: "expo.out" })
      .fromTo(q("[data-title]"), { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out" }, 0.1)
      .fromTo(q("[data-w]"), { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.012, ease: "none" }, 0.25)
      .fromTo(q("[data-tape]"), { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.35, stagger: 0.05, ease: "power3.out" }, 0.35)
      .fromTo(q("[data-evidence]"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.4)" }, 0.2);
    if (q("[data-redact]").length)
      tl.fromTo(q("[data-redact]"), { scaleX: 0 }, { scaleX: 1, duration: 0.3, stagger: 0.04, ease: "power2.out" }, 0.45);
    tl
      .fromTo(q("[data-stamp]"), { scale: 2.6, opacity: 0, rotation: -30 }, { scale: 1, opacity: 0.8, rotation: -12, duration: 0.35, ease: "power4.in" }, 0.55)
      .fromTo(folderRef.current, { x: 0 }, { x: 3, duration: 0.05, repeat: 3, yoyo: true, ease: "none" }, 0.9);
    return () => tl.kill();
  }, [active.id]);

  // ← / → flip through the drawer while it's on screen.
  useEffect(() => {
    let onScreen = false;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { threshold: 0.35 });
    io.observe(root.current);
    const onKey = (e) => {
      if (!onScreen || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return;
      if (/input|textarea|select/i.test(document.activeElement?.tagName) || document.activeElement?.dataset?.typing) return;
      e.preventDefault();
      const step = e.key === "ArrowRight" ? 1 : -1;
      setActiveId(visible[(index + step + visible.length) % visible.length].id);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, index]);

  return (
    <section id="projects" ref={root} className="relative w-full px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead label="Selected work" index="03 / 06" title="Case files" count={`${projects.length} files`} />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter case files">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => changeFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`border-[1.5px] px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  filter === f.key
                    ? "border-[color:var(--color-fg)] bg-[color:var(--color-fg)] text-[color:var(--color-bg)]"
                    : "border-[color:var(--color-line)] hover:border-[color:var(--color-fg)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="hidden font-mono text-xs uppercase tracking-wider text-[color:var(--color-muted)] md:block">
            Pick a tab, or flip with ← →
          </p>
        </div>

        {/* The drawer */}
        <div className="relative mt-10">
          {/* Folder tabs */}
          <div role="tablist" aria-label="Case files" className="relative z-[2] -mb-px flex gap-1 overflow-x-auto pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visible.map((p, i) => {
              const on = p.id === active.id;
              return (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveId(p.id)}
                  className="group relative shrink-0 text-left transition-transform duration-300"
                  style={{ transform: on ? "translateY(-6px)" : "none" }}
                >
                  <span
                    className="block min-w-[128px] px-4 pb-3 pt-2.5 font-mono text-[11px] uppercase tracking-wider text-[#12151c] transition-colors md:min-w-[150px]"
                    style={{
                      background: on ? MANILA : MANILA_DARK,
                      clipPath: "polygon(10px 0, calc(100% - 10px) 0, 100% 100%, 0 100%)",
                      boxShadow: on ? "none" : `inset 0 -6px 8px -6px ${MANILA_EDGE}`,
                    }}
                  >
                    <span className="text-[#e5470d]">{String(i + 1).padStart(2, "0")}</span>{" "}
                    <span className="group-hover:underline">{p.title.length > 16 ? p.title.slice(0, 15) + "…" : p.title}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Folders stacked behind the open one */}
          <div aria-hidden="true" className="absolute inset-x-6 top-[62px] h-10 rounded-t-md" style={{ background: MANILA_EDGE }} />
          <div aria-hidden="true" className="absolute inset-x-3 top-[68px] h-10 rounded-t-md" style={{ background: MANILA_DARK }} />

          {/* The open folder */}
          <div
            ref={folderRef}
            role="tabpanel"
            className="relative z-[1] rounded-b-lg rounded-tr-lg p-4 shadow-[0_40px_70px_-35px_rgba(18,21,28,0.55)] md:p-8"
            style={{ background: MANILA, backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.12), transparent 30%)" }}
          >
            <CaseFile project={active} number={index + 1} total={visible.length} />
            {/* Folder crease */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-6 left-1/2 hidden w-px bg-[#b8955a]/50 lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
