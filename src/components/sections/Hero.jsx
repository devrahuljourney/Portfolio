"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, Draggable, reducedMotion } from "@/lib/gsap";
import { hero } from "@/constant/data";
import Sticker from "../stickers/Sticker";
import { INTRO_EVENT, introStarted } from "../Preloader";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Desk layout. Positions are % of the hero; widths clamp between phone and
// wide screens. `depth` drives scroll parallax (higher = moves further).
const DESK = [
  { name: "phone", rot: -14, depth: 1.4, style: { left: "13%", top: "11%", width: "clamp(64px, 7.5vw, 118px)" } },
  { name: "keyboard", rot: 9, depth: 0.8, style: { right: "3%", top: "9%", width: "clamp(170px, 25vw, 380px)" } },
  { name: "mug", rot: -8, depth: 1.1, style: { left: "3.5%", bottom: "9%", width: "clamp(72px, 8.5vw, 136px)" } },
  { name: "sticky", rot: 7, depth: 1.7, style: { left: "17%", bottom: "6%", width: "clamp(70px, 8vw, 124px)" }, hideMobile: true },
  { name: "duck", rot: 8, depth: 1.3, style: { right: "5%", bottom: "11%", width: "clamp(70px, 8.5vw, 132px)" } },
];

const WIRE =
  "M-40,250 C180,170 420,260 340,380 C280,480 100,450 150,380 C210,290 420,500 520,640 C590,730 820,720 880,610 C940,500 1080,450 1160,530 C1230,600 1200,690 1300,660 C1380,640 1420,560 1480,600";

function Sky() {
  // Painted-ish sky from fractal noise, fading into the graph paper below.
  // Two cloud passes: warm body + bright highlights. Night swaps in cooler,
  // dimmer clouds and a few stars.
  return (
    <svg
      data-sky
      aria-hidden="true"
      className="absolute inset-0 h-full w-full will-change-transform"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="sky-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--sky-top)" />
          <stop offset="0.42" stopColor="var(--sky-mid)" />
          <stop offset="0.7" stopColor="var(--sky-mid)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="sky-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.28" stopColor="#fff" />
          <stop offset="0.7" stopColor="#000" />
        </linearGradient>
        <mask id="sky-mask">
          <rect width="1440" height="900" fill="url(#sky-fade)" />
        </mask>
        <filter id="clouds-day" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0032 0.0075" numOctaves="5" seed="11" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.83  0 0 0 0 0.73  0 0 0 3.4 -1.4" />
        </filter>
        <filter id="clouds-day-hi" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0048 0.01" numOctaves="4" seed="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.97  0 0 0 0 0.92  0 0 0 3.6 -1.75" />
        </filter>
        <filter id="clouds-night" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0032 0.0075" numOctaves="5" seed="11" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.4  0 0 0 0 0.58  0 0 0 2.6 -1.2" />
        </filter>
      </defs>
      <g mask="url(#sky-mask)">
        <rect width="1440" height="900" fill="url(#sky-g)" />
        <g className="dark:hidden">
          <rect width="1440" height="900" filter="url(#clouds-day)" />
          <rect width="1440" height="900" filter="url(#clouds-day-hi)" />
        </g>
        <g className="hidden dark:block">
          <rect width="1440" height="900" filter="url(#clouds-night)" />
          {Array.from({ length: 46 }, (_, i) => {
            const x = (i * 337) % 1440, y = (i * 131) % 380, r = i % 5 === 0 ? 1.6 : 0.9;
            return <circle key={i} cx={x} cy={y} r={r} fill="#ece6d9" opacity={0.35 + (i % 4) * 0.15} />;
          })}
        </g>
      </g>
    </svg>
  );
}

const CODE = [
  [["kw", "const "], ["", "ship = "], ["kw", "async "], ["", "() => {"]],
  [["", "  "], ["kw", "await "], ["", "build();"]],
  [["", "  "], ["kw", "await "], ["", "test();"]],
  [["", "  "], ["kw", "return "], ["hl", "users"], ["", ";"]],
  [["", "}"]],
];

function CodeWindow() {
  return (
    <span
      data-codewin
      aria-hidden="true"
      className="relative mx-[0.12em] hidden w-[clamp(118px,16vw,250px)] md:inline-block shrink-0 -rotate-2 border-[3px] border-[color:var(--color-ink)] bg-[color:var(--color-cream)] px-[0.9em] pb-[0.8em] pt-[0.6em] text-left align-middle text-[clamp(7px,0.88vw,13.5px)] tracking-normal text-[color:var(--color-ink)] shadow-[6px_8px_0_-2px_rgba(13,15,14,0.18)]"
      style={{ lineHeight: 1.55 }}
    >
      <span className="block border-b border-black/15 pb-[0.4em] font-serif text-[0.95em] font-normal">ship.js, a short history</span>
      <span className="mt-[0.5em] block font-mono font-normal">
        {CODE.map((line, i) => (
          <span key={i} className="block whitespace-pre">
            {line.map(([k, t], j) => (
              <span key={j} className={k === "kw" ? "text-[#3457d5]" : k === "hl" ? "text-[#b94835]" : ""}>
                {t.split("").map((ch, c) => (
                  <span key={c} data-typed>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
            {i === CODE.length - 1 && <span data-caret className="ml-[0.2em] inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] bg-[#b94835]" />}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Hero() {
  const root = useRef(null);

  // Hide animated pieces before first paint so the intro never flashes.
  useIsoLayoutEffect(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root);
    gsap.set(q("[data-drop]"), { autoAlpha: 0 });
    gsap.set(q("[data-typed], [data-caret]"), { opacity: 0 });
    gsap.set(q("[data-fade]"), { autoAlpha: 0 });
    gsap.set(q("[data-codewin]"), { scale: 0, rotation: -12 });
    gsap.set(q("[data-split]"), { autoAlpha: 0 });
    gsap.set(q("[data-wire]"), { drawSVG: "0%" });
  }, []);

  useEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const reduce = reducedMotion();
    const ctx = gsap.context(() => {}, el);
    const drags = [];

    const intro = () =>
      ctx.add(() => {
        if (reduce) return;
        gsap.set(q("[data-split]"), { autoAlpha: 1 });
        const splits = q("[data-split]").map((n) => SplitText.create(n, { type: "words,chars", mask: "chars" }));
        const chars = splits.flatMap((s) => s.chars);
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(chars, { yPercent: 115, duration: 1.1, stagger: 0.028 })
          .to(q("[data-codewin]"), { scale: 1, rotation: -2, duration: 0.9, ease: "back.out(1.6)" }, 0.35)
          .to(q("[data-typed]"), { opacity: 1, duration: 0.01, stagger: 0.022, ease: "none" }, 0.9)
          .to(q("[data-caret]"), { opacity: 1, duration: 0.01 })
          .to(q("[data-caret]"), { opacity: 0, repeat: -1, yoyo: true, duration: 0.5, ease: "steps(1)" })
          .to(q("[data-wire]"), { drawSVG: "100%", duration: 2.2, ease: "power2.inOut" }, 0.2)
          .to(q("[data-fade]"), { autoAlpha: 1, duration: 0.8, stagger: 0.08 }, 0.9);
        DESK.forEach((d, i) => {
          tl.fromTo(
            q(`[data-drop="${d.name}"]`),
            { autoAlpha: 0, y: -80, scale: 0.55, rotation: d.rot + (i % 2 ? 28 : -28) },
            { autoAlpha: 1, y: 0, scale: 1, rotation: d.rot, duration: 1, ease: "back.out(1.7)" },
            0.45 + i * 0.09
          );
        });
      });

    // Stickers you can pick up and flick around the desk.
    q("[data-drag]").forEach((node) => {
      const [d] = Draggable.create(node, {
        type: "x,y",
        bounds: el,
        inertia: true,
        edgeResistance: 0.7,
        zIndexBoost: true,
        onPress() {
          gsap.to(this.target, { scale: 1.08, duration: 0.25, ease: "power2.out" });
        },
        onRelease() {
          gsap.to(this.target, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        },
      });
      drags.push(d);
    });

    // Scroll: stickers drift off at different speeds, headline sinks back.
    if (!reduce) {
      ctx.add(() => {
        const st = () => ({ trigger: el, start: "top top", end: "bottom top", scrub: 0.6 });
        q("[data-parallax]").forEach((n) => {
          const depth = parseFloat(n.dataset.parallax);
          gsap.to(n, { y: -220 * depth, rotation: (depth - 1.2) * 18, ease: "none", scrollTrigger: st() });
        });
        gsap.to(q("[data-headline]"), { y: 140, scale: 0.94, opacity: 0.15, ease: "none", scrollTrigger: st() });
        gsap.to(q("[data-sky]"), { yPercent: 12, ease: "none", scrollTrigger: st() });
      });
    }

    if (introStarted()) intro();
    else window.addEventListener(INTRO_EVENT, intro, { once: true });

    return () => {
      window.removeEventListener(INTRO_EVENT, intro);
      drags.forEach((d) => d.kill());
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      id="home"
      ref={root}
      className="grid-paper relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-[color:var(--color-bg)]"
    >
      <Sky />

      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path data-wire d={WIRE} fill="none" stroke="var(--color-fg)" strokeOpacity="0.3" strokeWidth="1.6" />
      </svg>

      {/* Desk stickers: parallax wrapper > draggable > intro drop */}
      <div className="absolute inset-0">
        {DESK.map((d) => (
          <div
            key={d.name}
            data-parallax={d.depth}
            className={`absolute z-10 ${d.hideMobile ? "hidden md:block" : ""}`}
            style={d.style}
          >
            <div data-drag className="sticker-drag" data-cursor-label="Drag">
              <div data-drop={d.name} style={{ transform: `rotate(${d.rot}deg)` }}>
                <Sticker name={d.name} />
              </div>
            </div>
          </div>
        ))}
        <p
          data-fade
          className="absolute right-[10%] top-[calc(9%+clamp(90px,13vw,190px))] z-10 hidden rotate-3 font-mono text-xs text-[color:var(--color-fg-soft)] md:block"
        >
          (psst, the stickers move)
        </p>
      </div>

      <div data-headline className="pointer-events-none relative z-[5] flex h-full flex-col items-center justify-center px-4 text-center text-[color:var(--color-fg)]">
        <h1 className="sr-only">
          {hero.name}, {hero.role}. Build and ship: clean code, late nights.
        </h1>
        {/* Phones: BUILD / & SHIP stacked. Wider: BUILD [code window] SHIP. */}
        <div aria-hidden="true" className="display flex flex-col items-center text-[21vw] leading-[0.92] md:flex-row md:text-[clamp(3.6rem,12.4vw,13.5rem)] md:leading-[0.95]">
          <span data-split>BUILD</span>
          <CodeWindow />
          <span>
            <span data-split className="text-[color:var(--color-accent)] md:hidden">&amp; </span>
            <span data-split>SHIP</span>
          </span>
        </div>
        <div aria-hidden="true" data-split className="display mt-[0.3em] text-[6.6vw] md:mt-[0.12em] md:text-[clamp(1.5rem,5.6vw,6.2rem)]">
          CLEAN CODE, LATE NIGHTS<span className="text-[color:var(--color-accent)]">.</span>
        </div>
        <p data-fade className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-fg-soft)] md:text-xs">
          {hero.role} · MERN · React Native · AI
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-[6] flex items-end justify-between px-5 pb-5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg)] md:px-10 md:pb-7 md:text-xs">
        <span data-fade className="hidden items-center gap-2 md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-accent)] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-accent)]" />
          </span>
          Open to freelance
        </span>
        <a data-fade href="#about" className="mx-auto md:mx-0">
          Meet Rahul <span className="text-[color:var(--color-accent)]">↓</span>
        </a>
        <span data-fade className="hidden md:block">{hero.badge}</span>
      </div>
    </section>
  );
}
