"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";

/** DAY / NIGHT switch with a circular reveal from the button (View Transitions). */
export default function ThemeToggle({ className = "" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef(null);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const toggle = async () => {
    const next = isDark ? "light" : "dark";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      setTheme(next);
      return;
    }
    const rect = btnRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
    const y = rect ? rect.top + rect.height / 2 : 40;
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    await transition.ready;
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
      { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
    );
  };

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      aria-label={mounted ? `Switch to ${isDark ? "day" : "night"} mode` : "Toggle color theme"}
      data-cursor-label={mounted ? (isDark ? "Day" : "Night") : ""}
      className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wider ${className}`}
    >
      <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-current">
        <span
          className="absolute h-3 w-3 rounded-full bg-[color:var(--color-accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(${mounted && isDark ? 18 : 3}px)` }}
        />
      </span>
      <span className="w-10 text-left">{mounted ? (isDark ? "Night" : "Day") : ""}</span>
    </button>
  );
}
