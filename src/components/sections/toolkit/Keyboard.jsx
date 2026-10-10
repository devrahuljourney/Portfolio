"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects, toolkit } from "@/constant/data";

// A real 60% keyboard wired to a tiny terminal. Click it (or tab to it) and
// type: every physical key lights up its twin on screen, Backspace / Tab /
// Enter behave like a shell, and typing a tool name shows where I used it.

// [legend, KeyboardEvent.code, width in quarter-units, tone]; rows sum to 60.
const ROWS = [
  [["`", "Backquote", 4, "red"], ...("1234567890".split("").map((d) => [d, `Digit${d}`, 4])), ["-", "Minus", 4], ["=", "Equal", 4], ["⌫", "Backspace", 8, "mod"]],
  [["Tab", "Tab", 6, "mod"], ..."QWERTYUIOP".split("").map((c) => [c, `Key${c}`, 4]), ["[", "BracketLeft", 4], ["]", "BracketRight", 4], ["\\", "Backslash", 6, "mod"]],
  [["Caps", "CapsLock", 7, "mod"], ..."ASDFGHJKL".split("").map((c) => [c, `Key${c}`, 4]), [";", "Semicolon", 4], ["'", "Quote", 4], ["Enter", "Enter", 9, "red"]],
  [["Shift", "ShiftLeft", 9, "blue"], ..."ZXCVBNM".split("").map((c) => [c, `Key${c}`, 4]), [",", "Comma", 4], [".", "Period", 4], ["/", "Slash", 4], ["Shift", "ShiftRight", 11, "blue"]],
  [["Ctrl", "ControlLeft", 5, "mod"], ["◆", "MetaLeft", 5, "mod"], ["Alt", "AltLeft", 5, "mod"], ["", "Space", 25], ["Alt", "AltRight", 5, "mod"], ["Fn", "Fn", 5, "mod"], ["☰", "ContextMenu", 5, "mod"], ["Ctrl", "ControlRight", 5, "mod"]],
];

// Small sub-legends: a hint of what each letter starts.
const HINTS = { J: "js", T: "ts", R: "react", N: "node", E: "express", K: "kotlin", M: "mongo", P: "postgres", S: "supabase", D: "docker", A: "aws", V: "vercel", G: "github", L: "langchain", W: "tailwind", X: "next" };

const ALIASES = { js: "JavaScript", ts: "TypeScript", rn: "React Native", next: "Next.js", nextjs: "Next.js", node: "Node.js", mongo: "MongoDB", pg: "PostgreSQL", postgres: "PostgreSQL", tw: "Tailwind", tailwind: "Tailwind", gh: "GitHub" };

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const techKey = (s) => norm(s).replace(/\d+$/, "").replace(/(js|css)$/, "");

function usedIn(tool) {
  const k = techKey(tool.name);
  return projects.filter((p) => p.tech.some((t) => techKey(t) === k)).map((p) => p.title);
}

function matches(buffer) {
  const b = norm(buffer);
  if (!b) return [];
  const byName = toolkit.filter((t) => norm(t.name).startsWith(b));
  const alias = Object.entries(ALIASES).filter(([a]) => a.startsWith(b)).map(([, n]) => toolkit.find((t) => t.name === n));
  return [...new Set([...byName, ...alias].filter(Boolean))].slice(0, 4);
}

const TONES = {
  base: ["#efe8d8", "#cfc5b0", "#0d0f0e"],
  mod: ["#4a4c49", "#2f312f", "#ece6d9"],
  red: ["#c4513d", "#8f3626", "#fbf7ee"],
  blue: ["#3f62de", "#233f9e", "#fbf7ee"],
};

// Short synthesized "thock": filtered noise burst. Off unless enabled.
function useClick() {
  const ctxRef = useRef(null);
  return useCallback((on) => {
    if (!on) return;
    const ctx = (ctxRef.current ??= new (window.AudioContext || window.webkitAudioContext)());
    const len = Math.floor(ctx.sampleRate * 0.03);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1800 + Math.random() * 600;
    const gain = ctx.createGain();
    gain.gain.value = 0.5;
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start();
  }, []);
}

function Key({ legend, code, w, tone = "base", down, onPress }) {
  const [top, side, ink] = TONES[tone];
  const hint = legend.length === 1 ? HINTS[legend] : null;
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={legend || "Space"}
      onPointerDown={(e) => {
        e.preventDefault();
        onPress(code, legend);
      }}
      className="relative h-full rounded-[0.7cqw] p-[0.3cqw_0.45cqw_0.85cqw] transition-[transform,box-shadow] duration-75"
      style={{
        gridColumn: `span ${w}`,
        background: side,
        boxShadow: down ? "0 0.08cqw 0 #070807" : "0 0.32cqw 0 #070807",
        transform: down ? "translateY(0.26cqw)" : "none",
      }}
    >
      <span
        className="flex h-full w-full flex-col justify-between rounded-[0.5cqw] px-[0.55cqw] py-[0.35cqw] text-left"
        style={{
          background: `linear-gradient(180deg, ${top}, color-mix(in srgb, ${top} 88%, #000))`,
          color: ink,
          boxShadow: down ? "inset 0 0.2cqw 0.4cqw rgba(0,0,0,0.25)" : "inset 0 0.12cqw 0 rgba(255,255,255,0.35)",
        }}
      >
        <span className={`font-mono leading-none ${legend.length > 1 ? "text-[1.05cqw] uppercase" : "text-[1.55cqw]"}`}>{legend}</span>
        {hint && <span className="font-mono text-[0.85cqw] leading-none text-[#b94835]">{hint}</span>}
      </span>
    </button>
  );
}

export default function Keyboard() {
  const deviceRef = useRef(null);
  const screenRef = useRef(null);
  const touched = useRef(false);
  const timers = useRef([]);
  const [focused, setFocused] = useState(false);
  const [down, setDown] = useState(() => new Set());
  const [buffer, setBuffer] = useState("");
  const [log, setLog] = useState([]); // [{cmd, out: tool | string | string[]}]
  const [sound, setSound] = useState(false);
  const [caps, setCaps] = useState(false);
  const click = useClick();
  const suggestions = useMemo(() => matches(buffer), [buffer]);
  const bufferRef = useRef("");
  bufferRef.current = buffer;

  const flash = useCallback((code) => {
    setDown((s) => new Set(s).add(code));
    const t = setTimeout(() => setDown((s) => { const n = new Set(s); n.delete(code); return n; }), 130);
    timers.current.push(t);
  }, []);

  const run = useCallback((cmdRaw) => {
    const cmd = cmdRaw.trim();
    if (!cmd) return;
    let out;
    const c = cmd.toLowerCase();
    if (c === "clear") return setLog([]);
    if (c === "ls" || c === "help") out = toolkit.map((t) => t.name);
    else {
      const m = matches(cmd);
      out = m[0] || `command not found: ${cmd}. try "ls"`;
    }
    setLog((l) => [...l.slice(-2), { cmd, out }]);
  }, []);

  // One handler for both the physical keyboard and on-screen clicks.
  const handle = useCallback(
    (code, key) => {
      click(sound);
      if (code === "Backspace") return setBuffer((b) => b.slice(0, -1));
      if (code === "Enter") {
        run(bufferRef.current);
        return setBuffer("");
      }
      if (code === "Tab") {
        setBuffer((b) => (matches(b)[0] ? matches(b)[0].name.toLowerCase() : b));
        return;
      }
      if (code === "CapsLock") return setCaps((c) => !c);
      if (code === "Space") return setBuffer((b) => (b.length < 28 ? b + " " : b));
      if (key && key.length === 1 && code !== "Backquote") {
        const ch = caps ? key.toUpperCase() : key.toLowerCase();
        setBuffer((b) => (b.length < 28 ? b + ch : b));
      }
    },
    [caps, click, run, sound]
  );

  // First real input cancels the self-typing demo and clears its half word.
  const takeOver = () => {
    if (touched.current) return;
    touched.current = true;
    timers.current.forEach(clearTimeout);
    setBuffer("");
  };

  const onScreenPress = (code, legend) => {
    takeOver();
    flash(code);
    handle(code, legend);
    deviceRef.current?.focus({ preventScroll: true });
  };

  const onKeyDown = (e) => {
    if (e.metaKey || e.ctrlKey) return;
    if (e.key === "Escape") return deviceRef.current.blur();
    takeOver();
    e.preventDefault();
    setDown((s) => new Set(s).add(e.code));
    handle(e.code, e.key);
  };
  const onKeyUp = (e) =>
    setDown((s) => {
      const n = new Set(s);
      n.delete(e.code);
      return n;
    });

  // Keep the newest output in view.
  useEffect(() => {
    screenRef.current?.scrollTo({ top: screenRef.current.scrollHeight });
  }, [log, buffer]);

  // First time it scrolls into view, it types a demo by itself.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = deviceRef.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || touched.current) return;
        io.disconnect();
        const word = "langchain";
        [...word].forEach((ch, i) => {
          timers.current.push(
            setTimeout(() => {
              if (touched.current) return;
              const code = `Key${ch.toUpperCase()}`;
              flash(code);
              setBuffer((b) => b + ch);
            }, 600 + i * 140)
          );
        });
        timers.current.push(
          setTimeout(() => {
            if (touched.current) return;
            flash("Enter");
            setBuffer("");
            run(word);
          }, 600 + word.length * 140 + 350)
        );
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    const t = timers.current;
    return () => {
      io.disconnect();
      t.forEach(clearTimeout);
    };
  }, [flash, run]);

  return (
    <div
      ref={deviceRef}
      tabIndex={0}
      data-typing="true"
      role="application"
      aria-label="Keyboard demo: type a tool name and press Enter"
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        setDown(new Set());
      }}
      className="group outline-none"
    >
      {/* Screen */}
      <div className="relative mx-auto w-[94%] rounded-t-2xl border-[10px] border-b-0 border-[#2a2c2b] bg-[#121412]">
        <div
          ref={screenRef}
          onClick={() => deviceRef.current.focus({ preventScroll: true })}
          className="h-[230px] overflow-y-auto px-5 py-4 font-mono text-[13px] leading-6 text-[#d6cfc0] [scrollbar-width:none] md:h-[250px] md:px-7 md:text-sm"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)" }}
        >
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#62655e]">
            <span className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${focused ? "bg-[#7fb069]" : "bg-[#62655e]"}`} />
              ~/toolkit
            </span>
            <span>{focused ? "listening · esc to stop" : "click to type"}</span>
          </div>

          {log.length === 0 && (
            <p className="text-[#92958b]">
              Type a tool I use and press <span className="text-[#f0cc78]">enter</span>. Try <span className="text-[#f0cc78]">react</span>,{" "}
              <span className="text-[#f0cc78]">kotlin</span>, or <span className="text-[#f0cc78]">ls</span>.
            </p>
          )}

          {log.map((entry, i) => (
            <div key={i} className="mt-2">
              <p>
                <span className="text-[#7fb069]">$</span> {entry.cmd}
              </p>
              {typeof entry.out === "string" ? (
                <p className="text-[#e05a3f]">{entry.out}</p>
              ) : Array.isArray(entry.out) ? (
                <p className="text-[#92958b]">{entry.out.join("  ·  ")}</p>
              ) : (
                <div className="mt-1 border-l-2 border-[#f0cc78] pl-3">
                  <p className="text-lg text-[#f0cc78]">{entry.out.name}</p>
                  <p>{entry.out.note}</p>
                  <p className="text-[#92958b]">
                    used in →{" "}
                    {usedIn(entry.out).length ? usedIn(entry.out).join(", ") : "behind the scenes on most of my projects"}
                  </p>
                </div>
              )}
            </div>
          ))}

          <p className="mt-2">
            <span className="text-[#7fb069]">$</span> {buffer}
            <span className={`ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-[#f0cc78] ${focused ? "animate-pulse" : "opacity-40"}`} />
            {suggestions.length > 0 && suggestions[0].name.toLowerCase() !== buffer && (
              <span className="ml-3 text-[#62655e]">tab → {suggestions.map((s) => s.name).join(" · ")}</span>
            )}
          </p>
        </div>
      </div>

      {/* Keyboard */}
      <div
        className="relative rounded-[18px] bg-[#2a2c2b] p-[1.6%] shadow-[0_40px_60px_-30px_rgba(13,15,14,0.7),inset_0_2px_0_rgba(255,255,255,0.08)]"
      >
        <div className="mb-[1%] flex items-center justify-between px-[0.6%] font-mono text-[10px] uppercase tracking-widest text-[#92958b]">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${caps ? "bg-[#7fb069] shadow-[0_0_6px_#7fb069]" : "bg-[#3b3d3b]"}`} /> caps
            </span>
            <span className="hidden sm:inline">rv-60 · mechanical</span>
          </span>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setSound((s) => !s)}
            className="uppercase tracking-widest hover:text-[#ece6d9]"
            aria-pressed={sound}
          >
            sound {sound ? "on" : "off"}
          </button>
        </div>
        <div className="rounded-[10px] bg-[#1a1c1a] p-[0.9%]" style={{ containerType: "inline-size" }}>
          {ROWS.map((row, r) => (
            <div key={r} className="grid h-[calc(100cqw/15)] grid-cols-[repeat(60,minmax(0,1fr))] gap-[0.35cqw] pb-[0.35cqw]">
              {row.map(([legend, code, w, tone]) => (
                <Key key={code} legend={legend} code={code} w={w} tone={tone} down={down.has(code)} onPress={onScreenPress} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Phones: keys are small, so offer one-tap commands too. */}
      <div className="mt-6 flex flex-wrap gap-2 md:hidden">
        {["react", "kotlin", "langchain", "supabase", "ls"].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => {
              takeOver();
              run(cmd);
            }}
            className="rounded-full border-[1.5px] border-[color:var(--color-fg)] px-3 py-1.5 font-mono text-xs"
          >
            $ {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
