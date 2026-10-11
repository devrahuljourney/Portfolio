"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { projects, toolkit } from "@/constant/data";
import { useSound } from "@/components/providers/SoundProvider";
import { SWITCHES, setSwitch } from "@/lib/sound";

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

const SWITCH_KEY = "key-switch";
const SWITCH_DOTS = { red: "#e5484d", blue: "#3e8ed0", brown: "#9a6b43" };

// Big keys get their own recorded sample; everything else plays an alpha key.
const KEY_SOUND = { Space: "space", Enter: "enter", Backspace: "backspace", ShiftLeft: "space", ShiftRight: "space" };

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
  base: ["#eef0f2", "#c9ccd2", "#12151c"],
  mod: ["#4a4c49", "#2f312f", "#f1efe9"],
  red: ["#f05a1e", "#a8340a", "#fbfaf6"],
  blue: ["#129493", "#095a59", "#fbfaf6"],
};

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
        {hint && <span className="font-mono text-[0.85cqw] leading-none text-[#e5470d]">{hint}</span>}
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
  const [caps, setCaps] = useState(false);
  const { enabled: sound, play } = useSound();
  const [switchType, setSwitchType] = useState("red");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SWITCH_KEY);
      if (SWITCHES[saved]) {
        setSwitchType(saved);
        setSwitch(saved);
      }
    } catch {}
  }, []);

  const pickSwitch = (name) => {
    setSwitchType(name);
    try {
      localStorage.setItem(SWITCH_KEY, name);
    } catch {}
    // Preview the new switch once its samples are in.
    setSwitch(name).then(() => play("key"));
  };
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
      play("key", KEY_SOUND[code]);
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
    [caps, play, run]
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
          className="h-[230px] overflow-y-auto px-5 py-4 font-mono text-[13px] leading-6 text-[#cfd5df] [scrollbar-width:none] md:h-[250px] md:px-7 md:text-sm"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px)" }}
        >
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#616977]">
            <span className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${focused ? "bg-[#7fb069]" : "bg-[#616977]"}`} />
              ~/toolkit
            </span>
            <span>{focused ? "listening · esc to stop" : "click to type"}</span>
          </div>

          {log.length === 0 && (
            <p className="text-[#9aa0ab]">
              Type a tool I use and press <span className="text-[#f4dc4b]">enter</span>. Try <span className="text-[#f4dc4b]">react</span>,{" "}
              <span className="text-[#f4dc4b]">kotlin</span>, or <span className="text-[#f4dc4b]">ls</span>.
            </p>
          )}

          {log.map((entry, i) => (
            <div key={i} className="mt-2">
              <p>
                <span className="text-[#7fb069]">$</span> {entry.cmd}
              </p>
              {typeof entry.out === "string" ? (
                <p className="text-[#ff6a2b]">{entry.out}</p>
              ) : Array.isArray(entry.out) ? (
                <p className="text-[#9aa0ab]">{entry.out.join("  ·  ")}</p>
              ) : (
                <div className="mt-1 border-l-2 border-[#f4dc4b] pl-3">
                  <p className="text-lg text-[#f4dc4b]">{entry.out.name}</p>
                  <p>{entry.out.note}</p>
                  <p className="text-[#9aa0ab]">
                    used in →{" "}
                    {usedIn(entry.out).length ? usedIn(entry.out).join(", ") : "behind the scenes on most of my projects"}
                  </p>
                </div>
              )}
            </div>
          ))}

          <p className="mt-2">
            <span className="text-[#7fb069]">$</span> {buffer}
            <span className={`ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-[#f4dc4b] ${focused ? "animate-pulse" : "opacity-40"}`} />
            {suggestions.length > 0 && suggestions[0].name.toLowerCase() !== buffer && (
              <span className="ml-3 text-[#616977]">tab → {suggestions.map((s) => s.name).join(" · ")}</span>
            )}
          </p>
        </div>
      </div>

      {/* Keyboard */}
      <div
        className="relative rounded-[18px] bg-[#2a2c2b] p-[1.6%] shadow-[0_40px_60px_-30px_rgba(18,21,28,0.7),inset_0_2px_0_rgba(255,255,255,0.08)]"
      >
        <div className="mb-[1%] flex items-center justify-between px-[0.6%] font-mono text-[10px] uppercase tracking-widest text-[#9aa0ab]">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${caps ? "bg-[#7fb069] shadow-[0_0_6px_#7fb069]" : "bg-[#3b3d3b]"}`} /> caps
            </span>
            <span className="hidden sm:inline">rv-60 · mechanical</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="hidden sm:inline">{sound ? "switch" : "sound off"}</span>
            <span role="radiogroup" aria-label="Key switch sound" className="flex gap-1">
              {Object.entries(SWITCHES).map(([name, sw]) => (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={switchType === name}
                  title={`Cherry MX ${sw.label} · ${sw.feel}`}
                  data-sound="silent"
                  onClick={() => pickSwitch(name)}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 transition-colors ${
                    switchType === name ? "bg-[#3b3d3b] text-[#f4f1ea]" : "hover:text-[#f4f1ea]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: SWITCH_DOTS[name] }} />
                  {sw.label}
                </button>
              ))}
            </span>
          </span>
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
