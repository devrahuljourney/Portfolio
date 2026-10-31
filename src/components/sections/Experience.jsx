"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { useSound } from "@/components/providers/SoundProvider";
import { experience } from "@/constant/data";
import SectionHead from "../ui/SectionHead";

// The work history as a production line that plays inside one pinned screen.
// Each role is a station: its header says who/where/when, its machine takes
// the problems that role was handed (crates on the left) and ships what
// came out (crates on the right). A readout under the belt spells out the
// crate in the machine in plain words: the problem, what I built, the
// result. Scroll runs the belt; the camera pans station to station, oldest
// first, and ends at a loading dock that points to the contact form.

const LINE = [...experience].reverse(); // oldest station first
const IN_X = "18%";
const OUT_X = "82%";
const KRAFT = "#d8bd8f";
const INK = "#12151c";
const CRATE = "h-[58px] w-[92px] sm:h-[70px] sm:w-[120px] lg:h-[80px] lg:w-[170px]";
const TOTAL = LINE.reduce((n, e) => n + (e.cases?.length || 0), 0);

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const toMonth = (s) => {
  if (/present/i.test(s)) {
    const d = new Date();
    return d.getFullYear() * 12 + d.getMonth();
  }
  const [m, y] = s.toLowerCase().split(" ");
  return Number(y) * 12 + MONTHS.indexOf(m.slice(0, 3));
};
const fmtSpan = (exp) => {
  const m = toMonth(exp.end) - toMonth(exp.start) + 1;
  const y = Math.floor(m / 12);
  const r = m % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, r && `${r} mo${r > 1 ? "s" : ""}`].filter(Boolean).join(" ");
};
const isCurrent = (exp) => /present/i.test(exp.end);
const shortCompany = (c) => c.split(" (")[0];
const pad = (n) => String(n).padStart(2, "0");
const mono = "font-mono text-[10px] uppercase tracking-[0.14em]";
// The machine's screen is a dark console in both themes.
const SCREEN = {
  "--color-fg": "#f1efe9",
  "--color-fg-soft": "#cfd5df",
  "--color-muted": "#8a919d",
  "--color-accent": "#ff6a2b",
  "--color-blue": "#8fd3b6",
  "--color-surface": "#1d2230",
};

function gearPath(teeth, ro, ri) {
  const step = (Math.PI * 2) / teeth;
  const pts = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    pts.push([ri, a], [ro, a + step * 0.15], [ro, a + step * 0.45], [ri, a + step * 0.6]);
  }
  return "M" + pts.map(([r, a]) => `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`).join("L") + "Z";
}
const GEAR_BIG = gearPath(12, 46, 37);
const GEAR_SMALL = gearPath(8, 30, 22);

function Gear({ path, className, spin }) {
  return (
    <svg data-gear={spin} viewBox="-50 -50 100 100" className={className} aria-hidden>
      <path d={path} fill="var(--color-surface)" stroke="var(--color-fg)" strokeWidth="3" strokeLinejoin="round" />
      <circle r="9" fill="none" stroke="var(--color-fg)" strokeWidth="3" />
      <path d="M-22 0H22M0 -22V22" stroke="var(--color-fg)" strokeWidth="2.5" opacity="0.35" />
    </svg>
  );
}

function Crate({ crate, k }) {
  return (
    <div data-crate={k} className={`absolute z-10 ${CRATE}`} style={{ left: IN_X, bottom: "var(--belt)", translate: "-50% 0" }}>
      {/* Raw: the problem going in */}
      <div data-before className="absolute inset-0 flex flex-col justify-between border-2 p-1.5 sm:p-2" style={{ background: KRAFT, borderColor: INK, color: INK }}>
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top_right,transparent_calc(50%-1px),rgba(18,21,28,0.18)_50%,transparent_calc(50%+1px))]" />
        <span className="relative font-mono text-[8px] uppercase tracking-wider opacity-70 sm:text-[9px]">Problem</span>
        <span className="display relative line-clamp-2 text-[0.85rem] uppercase leading-[0.92] sm:text-[1rem] lg:text-[1.2rem]">{crate.label}</span>
      </div>
      {/* Shipped: what came out */}
      <div data-after className="absolute inset-0 flex flex-col justify-between border-2 p-1.5 opacity-0 sm:p-2" style={{ background: INK, borderColor: INK }}>
        <span className="flex items-center justify-between gap-1 font-mono text-[8px] uppercase tracking-wider text-[#9aa0ab] sm:text-[9px]">
          <span className="truncate">{crate.label}</span>
          <span className="text-[#8fd3b6]">✓</span>
        </span>
        <span className="display truncate text-[1.05rem] leading-none text-[#ff6a2b] sm:text-[1.35rem] lg:text-[1.8rem]">{crate.out}</span>
      </div>
    </div>
  );
}

function Station({ exp, index, readout }) {
  const now = isCurrent(exp);
  const cases = exp.cases || [];
  return (
    <>
      {/* Role header: this is the experience entry */}
      <header className="absolute inset-x-5 top-[8.4rem] md:inset-x-10 md:top-[9.4rem]">
        <div className="mx-auto max-w-[1440px]">
          <p className={`${mono} flex flex-wrap items-center gap-x-3 gap-y-1 text-[color:var(--color-muted)]`}>
            <span className="text-[color:var(--color-accent)]">Role {pad(index + 1)}</span>
            {now && (
              <span className="flex items-center gap-1.5 bg-[color:var(--color-accent)] px-1.5 py-0.5 font-bold text-[color:var(--color-on-accent)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[color:var(--color-on-accent)]" /> Current
              </span>
            )}
            <span className="text-[color:var(--color-fg)]">
              {exp.start} — {exp.end}
            </span>
            <span suppressHydrationWarning>{fmtSpan(exp)}</span>
            <span className="hidden sm:inline">· {exp.location}</span>
          </p>
          <h3 className="display mt-2 text-[clamp(2rem,4.2vw,3.6rem)] uppercase leading-[0.86]">{exp.role}</h3>
          <p className="mt-1.5 font-mono text-xs uppercase tracking-wider md:text-sm">
            <span className="text-[color:var(--color-accent)]">@ {shortCompany(exp.company)}</span>
            <span className="text-[color:var(--color-muted)]"> · {exp.tag}</span>
          </p>
        </div>
      </header>

      {/* The machine */}
      <div
        data-machine
        className="absolute inset-x-0 z-20 mx-auto flex w-[clamp(150px,46%,660px)] flex-col border-2 border-[color:var(--color-fg)] bg-[color:var(--color-surface)] shadow-[7px_8px_0_var(--shadow)]"
        style={{ bottom: "calc(var(--belt) - 22px)", height: "var(--mh)" }}
      >
        <div className="absolute -top-9 right-[14%] h-9 w-7 border-2 border-b-0 border-[color:var(--color-fg)] bg-[color:var(--color-surface)] sm:w-9">
          {cases.map((_, i) => (
            <span key={i} data-puff className="absolute -top-5 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full border-2 border-[color:var(--color-fg)] bg-[color:var(--color-bg)] opacity-0" />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 border-b-2 border-[color:var(--color-fg)] bg-[color:var(--color-ink)] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-[color:var(--color-paper)] sm:px-3 sm:text-[11px]">
          <span className="flex items-center gap-1.5">
            <span data-lamp className="h-2 w-2 rounded-full bg-[#3a3f4b] sm:h-2.5 sm:w-2.5" />
            <span className="hidden sm:inline">Machine {pad(index + 1)} · solving</span>
          </span>
          <span>
            <span data-made>0</span>/{cases.length}
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-2.5 pb-[84px] pt-2.5 sm:px-4 sm:pb-[100px] sm:pt-3 lg:pb-[104px]">
          <div
            className="relative min-h-[36px] flex-1 overflow-hidden border-2 border-[#12151c] bg-[#12151c] bg-[repeating-linear-gradient(transparent_0_3px,rgba(241,239,233,0.035)_3px_4px)] text-[#f1efe9] shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]"
            style={SCREEN}
          >
            {/* Phones: just the gears. Wider screens: the case in plain words. */}
            <Gear path={GEAR_BIG} spin="1" className="absolute left-[16%] top-1/2 h-[52px] w-[52px] -translate-y-1/2 sm:left-auto sm:right-3 sm:top-auto sm:bottom-2 sm:h-9 sm:w-9 sm:translate-y-0 sm:opacity-40" />
            <Gear path={GEAR_SMALL} spin="-1" className="absolute left-[calc(16%+44px)] top-[18%] h-[34px] w-[34px] sm:left-auto sm:right-11 sm:top-auto sm:bottom-6 sm:h-6 sm:w-6 sm:opacity-40" />
            <div className="absolute inset-0 hidden overflow-hidden p-4 sm:block lg:p-5">
              {readout.st === index ? <Readout state={readout} big /> : <Queued exp={exp} />}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-[72px] h-2.5 bg-[repeating-linear-gradient(-45deg,#f4dc4b_0_8px,#12151c_8px_16px)] sm:bottom-[86px] lg:bottom-[88px]" />
        <div className="absolute inset-x-0 bottom-0 h-[72px] bg-[repeating-linear-gradient(90deg,#12151c_0_10px,#232937_10px_12px)] sm:h-[86px] lg:h-[88px]" />
      </div>

      {cases.map((c, k) => (
        <Crate key={k} crate={c.crate} k={k} />
      ))}
    </>
  );
}

function ResultLine({ r, big }) {
  if (!r.after) return <p className={`mt-1 font-medium leading-snug ${big ? "text-[clamp(0.95rem,1.2vw,1.15rem)]" : "text-[14px]"}`}>✓ {r.text}</p>;
  return (
    <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
      {r.before && (
        <>
          <span className="font-mono text-sm text-[color:var(--color-muted)] line-through">{r.before}</span>
          <span className="text-[color:var(--color-muted)]">→</span>
        </>
      )}
      <span className={`display leading-none text-[color:var(--color-accent)] ${big ? "text-[clamp(1.8rem,2.6vw,2.6rem)]" : "text-[1.9rem]"}`}>{r.after}</span>
      <span className="font-mono text-[11px] text-[color:var(--color-muted)]">{r.label}</span>
    </p>
  );
}

// What a machine shows while it waits for the camera.
function Queued({ exp }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className={`${mono} text-[color:var(--color-muted)]`}>Standby</p>
      <p className="mt-2 text-[clamp(1rem,1.5vw,1.4rem)] font-medium leading-snug">{exp.cases.length} problems from {shortCompany(exp.company)} on this line.</p>
    </div>
  );
}

// The plain-words explanation of whatever is in the machine right now:
// big on the machine's screen, compact under the belt on phones.
function Readout({ state, big = false }) {
  const ref = useRef(null);
  const key = `${state.st}-${state.k}`;

  useEffect(() => {
    if (!ref.current || reducedMotion()) return;
    gsap.fromTo(ref.current.children, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power3.out" });
  }, [key]);

  const lead = big ? "text-[clamp(1rem,1.45vw,1.6rem)]" : "text-[14px]";

  if (state.st >= LINE.length) {
    return (
      <div ref={ref} className="flex h-full flex-col justify-center">
        <p className={`${mono} text-[color:var(--color-accent)]`}>Line complete</p>
        <p className={`mt-2 font-medium leading-snug ${lead}`}>
          {TOTAL} problems in, {TOTAL} shipped across {LINE.length} roles. Got a slow, manual or broken process? That&apos;s the kind of crate I like.
        </p>
      </div>
    );
  }

  const exp = LINE[state.st];
  if (state.k < 0) {
    return (
      <div ref={ref} className="flex h-full flex-col justify-center">
        <p className={`${mono} text-[color:var(--color-accent)]`}>Ready · {exp.cases.length} problems queued</p>
        <p className={`mt-2 font-medium leading-snug ${lead}`}>
          The crates on the left are problems I was handed at {shortCompany(exp.company)}. Scroll to feed them in.
        </p>
      </div>
    );
  }

  const c = exp.cases[state.k];
  return (
    <div ref={ref} className={`flex h-full flex-col justify-center ${big ? "gap-3.5" : "gap-2.5"}`}>
      <div>
        <p className={`${mono} text-[color:var(--color-accent)]`}>
          Problem {state.k + 1} of {exp.cases.length}
        </p>
        <p className={`mt-1 font-medium leading-snug ${lead}`}>{c.problem}</p>
      </div>
      <div>
        <p className={`${mono} text-[color:var(--color-muted)]`}>What I built</p>
        <p className={`mt-1 leading-snug text-[color:var(--color-fg-soft)] ${big ? "text-[clamp(0.85rem,1vw,0.95rem)]" : "text-[13px]"}`}>{c.built}</p>
      </div>
      <div>
        <p className={`${mono} ${state.done ? "text-[color:var(--color-blue)]" : "text-[color:var(--color-muted)]"}`}>{state.done ? "✓ Result" : "Processing…"}</p>
        <div className={`transition-opacity duration-300 ${state.done ? "opacity-100" : "opacity-20"}`}>
          <ResultLine r={c.result} big={big} />
        </div>
      </div>
    </div>
  );
}

// Same content without the line running, for reduced motion.
function StillLine() {
  return (
    <ol className="mx-auto mt-12 max-w-[1440px] space-y-10 px-5 md:px-10">
      {experience.map((exp) => (
        <li key={exp.id} className="border-2 border-[color:var(--color-fg)] bg-[color:var(--color-surface)] p-5 shadow-[6px_7px_0_var(--shadow)]">
          <p className={`${mono} text-[color:var(--color-muted)]`}>
            {exp.start} — {exp.end} · {exp.location}
          </p>
          <h3 className="display mt-2 text-4xl uppercase leading-[0.9]">{exp.role}</h3>
          <p className="mt-1 font-mono text-xs uppercase text-[color:var(--color-accent)]">@ {shortCompany(exp.company)}</p>
          <ul className="mt-4 space-y-3">
            {exp.cases.map((c, i) => (
              <li key={i} className="border-t border-[color:var(--color-line)] pt-3 text-sm">
                <b>{c.problem}</b> {c.built}{" "}
                <span className="text-[color:var(--color-accent)]">{c.result.after ? `${c.result.before ? `${c.result.before} → ` : ""}${c.result.after} ${c.result.label}` : c.result.text}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export default function Experience() {
  const stage = useRef(null);
  const world = useRef(null);
  const stRef = useRef(null);
  const stops = useRef([]);
  const [readout, setReadout] = useState({ st: 0, k: -1, done: false });
  const [still, setStill] = useState(false);
  const { play } = useSound();
  const n = LINE.length;

  useEffect(() => {
    if (reducedMotion()) {
      setStill(true);
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
      const stations = gsap.utils.toArray("[data-station]", world.current);
      const crates = []; // { st, k, enter, press, counter }
      const starts = [];

      stations.forEach((station, i) => {
        if (i > 0) tl.to(world.current, { xPercent: -100 * i, duration: 1.3, ease: "power2.inOut" }, "+=0.3");
        starts.push(tl.duration());
        const boxes = gsap.utils.toArray("[data-crate]", station);
        const puffs = station.querySelectorAll("[data-puff]");
        const machine = station.querySelector("[data-machine]");
        const lamp = station.querySelector("[data-lamp]");
        const counter = station.querySelector("[data-made]");
        gsap.set(machine, { x: 0, xPercent: 0, clearProps: "translate" });
        const t0 = tl.duration() + 0.5;
        const J = boxes.length;
        const STEP = 1.6; // slow enough to read each case in the readout

        boxes.forEach((c, k) => gsap.set(c, { yPercent: -100 * k }));

        boxes.forEach((c, k) => {
          const s = t0 + k * STEP;
          const press = s + 0.9;
          tl.to(c, { left: "50%", duration: 0.9, ease: "power1.in" }, s);
          boxes.slice(k + 1).forEach((above, m) => {
            tl.to(above, { yPercent: -100 * m, duration: 0.35, ease: "bounce.out" }, s + 0.25);
          });
          tl.set(c.querySelector("[data-before]"), { opacity: 0 }, press)
            .set(c.querySelector("[data-after]"), { opacity: 1 }, press)
            .fromTo(machine, { x: 0 }, { x: 3, duration: 0.04, repeat: 5, yoyo: true, immediateRender: false }, press - 0.05)
            .fromTo(lamp, { backgroundColor: "#ff6a2b", boxShadow: "0 0 14px #ff6a2b" }, { backgroundColor: "#3a3f4b", boxShadow: "0 0 0px #ff6a2b", duration: 0.5, immediateRender: false }, press)
            .fromTo(puffs[k], { opacity: 0.9, scale: 0.4, y: 0 }, { opacity: 0, scale: 1.8, y: -60, duration: 0.7, immediateRender: false }, press);
          boxes.slice(0, k).forEach((done) => {
            tl.to(done, { yPercent: "-=100", duration: 0.3, ease: "power2.out" }, press + 0.1);
          });
          tl.to(c, { left: OUT_X, duration: 0.6, ease: "power1.out" }, press + 0.1);
          crates.push({ st: i, k, enter: s, press, counter });
        });

        const end = t0 + (J - 1) * STEP + 1.9;
        tl.to(station.querySelectorAll('[data-gear="1"]'), { rotation: 360 * J * 0.5, duration: end - t0 }, t0);
        tl.to(station.querySelectorAll('[data-gear="-1"]'), { rotation: -360 * J * 0.75, duration: end - t0 }, t0);
        if (tl.duration() < end) tl.to({}, { duration: end - tl.duration() });
      });

      tl.to(world.current, { xPercent: -100 * n, duration: 1.3, ease: "power2.inOut" }, "+=0.3");
      starts.push(tl.duration());
      tl.to({}, { duration: 0.8 });

      const total = tl.duration();
      tl.fromTo("[data-belt]", { backgroundPositionX: "0px" }, { backgroundPositionX: `-${Math.round(total * 160)}px`, duration: total }, 0);
      tl.fromTo("[data-progress]", { scaleX: 0 }, { scaleX: 1, duration: total }, 0);
      stops.current = starts;

      let pressed = 0;
      let last = "";
      tl.eventCallback("onUpdate", () => {
        const t = tl.time();
        const counts = new Map();
        let sum = 0;
        crates.forEach((c) => {
          const hit = t >= c.press ? 1 : 0;
          counts.set(c.counter, (counts.get(c.counter) || 0) + hit);
          sum += hit;
        });
        counts.forEach((v, el) => {
          if (el.textContent !== String(v)) el.textContent = v;
        });
        if (sum > pressed) play("press");
        pressed = sum;

        // Which station is on screen, and which of its crates is in play.
        let st = 0;
        starts.forEach((s, i) => {
          if (t >= s - 0.7) st = i;
        });
        let k = -1;
        let done = false;
        crates.forEach((c) => {
          if (c.st === st && t >= c.enter) {
            k = c.k;
            done = t >= c.press;
          }
        });
        const next = `${st}-${k}-${done}`;
        if (next !== last) {
          last = next;
          setReadout({ st, k, done });
        }
      });

      stRef.current = ScrollTrigger.create({
        trigger: stage.current,
        start: "top top",
        end: () => `+=${total * window.innerHeight * 0.22}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.6,
        animation: tl,
        invalidateOnRefresh: true,
      });
    }, stage);
    return () => {
      stRef.current = null;
      ctx.revert();
    };
  }, [n, play]);

  const jump = (i) => {
    const st = stRef.current;
    if (!st || !st.animation) return;
    const y = st.start + (stops.current[i] / st.animation.duration()) * (st.end - st.start) + 2;
    window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.2 }) : window.scrollTo({ top: y, behavior: "smooth" });
  };

  const active = readout.st;
  const atDock = active >= n;

  return (
    <section id="experience" className="relative w-full py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHead label="Work history" index="02 / 06" title="Experience" count={`${experience.length} roles · ${TOTAL} problems solved`} />
        <p className="mt-6 max-w-lg text-[color:var(--color-fg-soft)]">
          Each role is a station on my line. Problems go in on the left, what I built comes out on the right, and the readout explains each one. Scroll to run it.
        </p>
      </div>

      {still ? (
        <StillLine />
      ) : (
        <div ref={stage} className="relative mt-10 h-[100svh] min-h-[600px] w-full overflow-hidden [--belt:40%] [--mh:min(calc(100%_-_var(--belt)_-_21rem),440px,70vw)] sm:[--belt:11%] sm:[--mh:min(calc(100%_-_var(--belt)_-_15rem),560px)] md:mt-14">
          {/* HUD */}
          <div className="absolute inset-x-0 top-20 z-30 px-5 md:top-24 md:px-10">
            <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-wider">
              <p className="text-[color:var(--color-muted)]">
                <span className="text-[color:var(--color-accent)]">Experience</span> · {atDock ? "Dock" : `${pad(active + 1)} / ${pad(n)}`}
                <span className="hidden md:inline"> · scroll to run the line ↓</span>
              </p>
              <div className="flex border-[1.5px] border-[color:var(--color-fg)]">
                {LINE.map((e, i) => (
                  <button
                    key={e.id}
                    onClick={() => jump(i)}
                    aria-label={`Go to ${e.role} at ${shortCompany(e.company)}`}
                    className={`border-r-[1.5px] border-[color:var(--color-fg)] px-2 py-1 transition-colors sm:px-3 ${
                      i === active ? "bg-[color:var(--color-fg)] text-[color:var(--color-bg)]" : "hover:bg-[color:var(--color-surface)]"
                    }`}
                  >
                    {e.start.slice(-4)}
                  </button>
                ))}
                <button
                  onClick={() => jump(n)}
                  className={`px-2 py-1 transition-colors sm:px-3 ${atDock ? "bg-[color:var(--color-fg)] text-[color:var(--color-bg)]" : "hover:bg-[color:var(--color-surface)]"}`}
                >
                  Dock
                </button>
              </div>
            </div>
            <div className="mx-auto mt-2 h-[3px] max-w-[1440px] bg-[color:var(--color-line)]">
              <div data-progress className="h-full origin-left scale-x-0 bg-[color:var(--color-accent)]" />
            </div>
          </div>

          <div ref={world} className="absolute inset-0">
            <div className="absolute left-0 h-[18px] border-y-2 border-[color:var(--color-fg)]" style={{ bottom: "calc(var(--belt) - 18px)", width: `${(n + 1) * 100}%` }}>
              <div data-belt className="h-full bg-[repeating-linear-gradient(90deg,#12151c_0_26px,#3a3f4b_26px_30px)]" />
            </div>
            <div
              className="absolute left-0 h-4 bg-[radial-gradient(circle_at_center,var(--color-fg)_0_4px,transparent_5px)] bg-[length:40px_16px] opacity-60"
              style={{ bottom: "calc(var(--belt) - 36px)", width: `${(n + 1) * 100}%` }}
            />

            {LINE.map((e, i) => (
              <div key={e.id} data-station className="absolute inset-y-0 w-full" style={{ left: `${i * 100}%` }}>
                <Station exp={e} index={i} readout={readout} />
              </div>
            ))}

            {/* Loading dock */}
            <div className="absolute inset-y-0 w-full" style={{ left: `${n * 100}%` }}>
              <div className="absolute inset-x-5 top-[24%] text-center md:inset-x-10">
                <p className={`${mono} text-[color:var(--color-muted)]`}>Loading dock · {TOTAL} problems shipped</p>
                <p className="display mt-3 text-[clamp(2.6rem,8vw,7rem)] uppercase leading-[0.85]">
                  Got a slow process?
                  <span className="block text-[color:var(--color-accent)]">Put it on the belt.</span>
                </p>
              </div>
              <a
                href="#contact"
                className="absolute left-1/2 z-10 flex h-[58px] w-[150px] -translate-x-1/2 flex-col justify-between border-2 p-2 transition-transform hover:-translate-y-2 sm:h-[70px] sm:w-[190px] lg:h-[96px] lg:w-[250px]"
                style={{ bottom: "var(--belt)", background: KRAFT, borderColor: INK, color: INK }}
              >
                <span className="font-mono text-[9px] uppercase tracking-wider opacity-70">Your problem</span>
                <span className="display text-[1.2rem] leading-none sm:text-[1.5rem] lg:text-[1.9rem]">Ship it in →</span>
              </a>
            </div>
          </div>

          {/* Readout console under the belt */}
          <div
            className="absolute inset-x-5 bottom-4 z-30 border-t-2 sm:hidden border-[color:var(--color-fg)] pt-3 md:inset-x-10 md:bottom-6"
            style={{ top: "calc(100% - var(--belt) + 44px)" }}
            aria-live="polite"
          >
            <div className="mx-auto h-full max-w-[1440px]">
              <Readout state={readout} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
