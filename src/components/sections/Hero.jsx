"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, Draggable, reducedMotion } from "@/lib/gsap";
import { hero } from "@/constant/data";
import Sticker from "../stickers/Sticker";
import { INTRO_EVENT, introStarted } from "../Preloader";
import { useSound } from "../providers/SoundProvider";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// The hero is the cover sheet of an engineering drawing: a condensed headline on
// the left, a labelled code figure on the right, and annotated objects you
// can pick up (with a Figma-style selection box). `depth` drives parallax.
const OBJECTS = [
  { name: "laptop", fig: "fig.1 · main, merged", rot: 7, depth: 0.8, style: { right: "max(22%, 80px)", top: "11%", width: "clamp(116px, 13vw, 210px)" } },
  { name: "phone", fig: "fig.2 · rethink.apk", rot: -9, depth: 1.4, style: { right: "4%", top: "13%", width: "clamp(50px, 6.5vw, 100px)" } },
  { name: "sticky", fig: "fig.3 · backlog", rot: -5, depth: 1.6, style: { left: "45%", bottom: "8%", width: "clamp(70px, 7.5vw, 116px)" }, hideMobile: true },
  { name: "mug", fig: "fig.4 · fuel", rot: 6, depth: 1.1, style: { left: "58%", bottom: "6%", width: "clamp(64px, 7vw, 112px)" }, hideMobile: true },
  { name: "duck", fig: "fig.5 · debugger", rot: -8, depth: 1.3, style: { left: "50%", top: "13%", width: "clamp(62px, 6.5vw, 104px)" }, hideMobile: true },
];

const CODE = [
  [["kw", "const "], ["", "ship = "], ["kw", "async "], ["", "() => {"]],
  [["", "  "], ["kw", "await "], ["", "build();"]],
  [["", "  "], ["kw", "await "], ["", "test();"]],
  [["", "  "], ["kw", "return "], ["hl", "users"], ["", ";"]],
  [["", "}"]],
];

function CodeFigure() {
  return (
    <figure data-codewin aria-hidden="true" className="relative w-[clamp(220px,22vw,330px)]">
      <figcaption className="mb-2 flex justify-between font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-fg-soft)]">
        <span>Fig. A · ship.js</span>
        <span>1:1</span>
      </figcaption>
      <div className="border-2 border-[color:var(--color-ink)] bg-[#12151c] px-4 py-3 font-mono text-[clamp(10px,0.9vw,13px)] leading-[1.7] text-[#cfd5df] shadow-[7px_8px_0_var(--shadow)]">
        {CODE.map((line, i) => (
          <span key={i} className="block whitespace-pre">
            <span className="mr-3 select-none text-[#616977]">{i + 1}</span>
            {line.map(([k, t], j) => (
              <span key={j} className={k === "kw" ? "text-[#3fc1bd]" : k === "hl" ? "text-[#ff6a2b]" : ""}>
                {t.split("").map((ch, c) => (
                  <span key={c} data-typed>
                    {ch}
                  </span>
                ))}
              </span>
            ))}
            {i === CODE.length - 1 && <span data-caret className="ml-1 inline-block h-[1.05em] w-[0.5em] translate-y-[0.18em] bg-[#f4dc4b]" />}
          </span>
        ))}
      </div>
    </figure>
  );
}

// Crop marks in the four corners of the sheet.
function CropMarks() {
  const mark = "absolute h-6 w-6 border-[color:var(--color-fg)] opacity-50";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-4 md:inset-6">
      <span className={`${mark} left-0 top-0 border-l border-t`} />
      <span className={`${mark} right-0 top-0 border-r border-t`} />
      <span className={`${mark} bottom-0 left-0 border-b border-l`} />
      <span className={`${mark} bottom-0 right-0 border-b border-r`} />
    </div>
  );
}

// Drawing title block, bottom-right: replaces a "scroll down" link.
function TitleBlock() {
  const cell = "border-[color:var(--color-fg)] px-3 py-1.5";
  return (
    <div
      data-fade
      className="hidden border-[1.5px] border-[color:var(--color-fg)] bg-[color:var(--color-bg)] font-mono text-[10.5px] uppercase tracking-wider text-[color:var(--color-fg)] lg:grid lg:grid-cols-[auto_auto]"
    >
      <div className={`${cell} col-span-2 border-b-[1.5px] text-[12px] font-bold`}>Rahul Kumar Verma · Portfolio</div>
      <div className={`${cell} border-b border-r`}>Drawn by R. Verma</div>
      <div className={`${cell} border-b`}>Sheet 00 · cover</div>
      <div className={`${cell} border-r`}>Rev {new Date().getFullYear()}</div>
      <div className={`${cell} flex items-center gap-2`}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-accent)] opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-accent)]" />
        </span>
        Open to freelance
      </div>
    </div>
  );
}

export default function Hero() {
  const root = useRef(null);
  const { play } = useSound();

  // Hide animated pieces before first paint so the intro never flashes.
  useIsoLayoutEffect(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root);
    gsap.set(q("[data-drop]"), { autoAlpha: 0 });
    gsap.set(q("[data-typed], [data-caret]"), { opacity: 0 });
    gsap.set(q("[data-fade], [data-codewin], [data-split]"), { autoAlpha: 0 });
    gsap.set(q("[data-dim]"), { drawSVG: "0%" });
  }, []);

  useEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const reduce = reducedMotion();
    const ctx = gsap.context(() => {}, el);
    const drags = [];

    // Size readout for the selection boxes.
    q("[data-drag]").forEach((n) => {
      const r = n.getBoundingClientRect();
      const label = n.querySelector("[data-size]");
      if (label) label.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
    });

    const intro = () =>
      ctx.add(() => {
        if (reduce) return;
        gsap.set(q("[data-split]"), { autoAlpha: 1 });
        const lines = q("[data-split]").map((n) => SplitText.create(n, { type: "lines", mask: "lines" }));
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(lines.flatMap((s) => s.lines), { yPercent: 105, duration: 1.1, stagger: 0.12 })
          .to(q("[data-dim]"), { drawSVG: "100%", duration: 1, stagger: 0.15, ease: "power2.inOut" }, 0.3)
          .to(q("[data-fade]"), { autoAlpha: 1, duration: 0.7, stagger: 0.07 }, 0.6)
          .fromTo(q("[data-codewin]"), { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.9 }, 0.5)
          .to(q("[data-typed]"), { opacity: 1, duration: 0.01, stagger: 0.02, ease: "none" }, 1)
          .to(q("[data-caret]"), { opacity: 1, duration: 0.01 })
          .to(q("[data-caret]"), { opacity: 0, repeat: -1, yoyo: true, duration: 0.5, ease: "steps(1)" });
        // Objects are "placed" on the sheet: a short press-down, not a drop.
        OBJECTS.forEach((o, i) => {
          tl.fromTo(
            q(`[data-drop="${o.name}"]`),
            { autoAlpha: 0, scale: 1.25, rotation: o.rot - 10 },
            { autoAlpha: 1, scale: 1, rotation: o.rot, duration: 0.6, ease: "back.out(2.2)" },
            0.6 + i * 0.08
          );
        });
      });

    // Pick objects up and throw them around the sheet.
    q("[data-drag]").forEach((node) => {
      const [d] = Draggable.create(node, {
        type: "x,y",
        bounds: el,
        inertia: true,
        edgeResistance: 0.7,
        zIndexBoost: true,
        onPress() {
          this.target.classList.add("is-dragging");
        },
        onRelease() {
          this.target.classList.remove("is-dragging");
          play("drop");
        },
      });
      drags.push(d);
    });

    if (!reduce) {
      ctx.add(() => {
        const st = () => ({ trigger: el, start: "top top", end: "bottom top", scrub: 0.6 });
        q("[data-parallax]").forEach((n) => {
          gsap.to(n, { y: -200 * parseFloat(n.dataset.parallax), ease: "none", scrollTrigger: st() });
        });
        gsap.to(q("[data-headline]"), { y: 120, opacity: 0.2, ease: "none", scrollTrigger: st() });
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
  }, [play]);

  return (
    <section
      id="home"
      ref={root}
      className="grid-paper relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[color:var(--color-bg)] text-[color:var(--color-fg)]"
    >
      <CropMarks />

      {/* Rulers along the top and left edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-3 opacity-40"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--color-fg) 0 1px, transparent 1px 12px)", maskImage: "linear-gradient(#000, transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-3 opacity-40"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, var(--color-fg) 0 1px, transparent 1px 12px)", maskImage: "linear-gradient(90deg, #000, transparent)" }}
      />

      {/* Objects: parallax wrapper > draggable (with selection box) > placed */}
      <div className="absolute inset-0">
        {OBJECTS.map((o) => (
          <div key={o.name} data-parallax={o.depth} className={`absolute z-10 ${o.hideMobile ? "hidden md:block" : ""}`} style={o.style}>
            <div data-drag data-sound="pickup" className="sticker-drag group relative" data-cursor-label="Drag">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 border border-dashed border-[color:var(--color-accent)] opacity-0 transition-opacity group-hover:opacity-100 group-[.is-dragging]:opacity-100"
              >
                {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((p) => (
                  <span key={p} className={`absolute h-2 w-2 border border-[color:var(--color-accent)] bg-[color:var(--color-bg)] ${p}`} />
                ))}
                <span data-size className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[color:var(--color-accent)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--color-on-accent)]" />
              </span>
              <div data-drop={o.name} style={{ transform: `rotate(${o.rot}deg)` }}>
                <Sticker name={o.name} />
              </div>
            </div>
            <p data-fade className="mt-3 hidden font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-muted)] md:block">
              {o.fig}
            </p>
          </div>
        ))}
      </div>

      {/* Code figure with a leader line toward the headline */}
      <div className="absolute right-[5%] top-[60%] z-[6] hidden min-[1400px]:block">
        <CodeFigure />
      </div>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4] hidden h-full w-full min-[1400px]:block" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path data-dim d="M1060,640 L990,640 L960,585" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
        <circle cx="960" cy="585" r="4" fill="var(--color-accent)" />
      </svg>

      {/* Headline */}
      <div data-headline className="pointer-events-none relative z-[5] flex h-full flex-col justify-end px-5 pb-14 pt-16 md:justify-center md:px-[5%] md:pb-0">
        <p data-fade className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--color-fg-soft)] md:text-xs">
          {hero.name} <span className="text-[color:var(--color-accent)]">/</span> {hero.role}
        </p>
        <h1 className="sr-only">
          {hero.name}, {hero.role}. Software that actually ships.
        </h1>
        <div aria-hidden="true" className="display mt-4 text-[clamp(4.2rem,11vw,12rem)] uppercase leading-[0.84]">
          <div data-split>Software that</div>
          <div data-split>
            actually ships<span className="text-[color:var(--color-accent)]">.</span>
          </div>
        </div>

        {/* Dimension line under the headline */}
        <svg aria-hidden="true" className="mt-5 hidden h-4 w-[min(62vw,900px)] md:block" viewBox="0 0 900 16" preserveAspectRatio="none">
          <path data-dim d="M1,8 H899 M1,1 V15 M899,1 V15" fill="none" stroke="var(--color-fg)" strokeOpacity="0.55" strokeWidth="1.2" />
        </svg>

        <p data-fade className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-fg-soft)] md:text-lg">
          I take products from the data model to the last pixel: Next.js, React Native, Node and LLM features that real people use.
        </p>
        <div data-fade className="pointer-events-auto mt-7 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="border-2 border-[color:var(--color-ink)] bg-[color:var(--color-accent)] px-5 py-3 font-mono text-xs uppercase tracking-wider text-[color:var(--color-on-accent)] shadow-[4px_5px_0_var(--shadow)] transition-transform hover:-translate-y-0.5"
          >
            Open the case files
          </a>
          <a
            href="#contact"
            className="border-2 border-[color:var(--color-fg)] px-5 py-3 font-mono text-xs uppercase tracking-wider transition-transform hover:-translate-y-0.5"
          >
            Start a project
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-[7] md:bottom-8 md:right-8">
        <TitleBlock />
      </div>
    </section>
  );
}
