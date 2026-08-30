"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a precise center dot plus a lagging ring that expands and
 * shows a label when hovering interactive elements (buttons, links, or any
 * element carrying data-cursor / data-cursor-label).
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false); // becomes true after first move
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    // Skip entirely on touch / coarse pointers — no fake cursor there.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("cursor-none");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...pos };
    let raf;
    let started = false;

    const render = () => {
      // Read the refs every frame — they attach after the first paint.
      const dot = dotRef.current;
      const ring = ringRef.current;
      ringPos.x += (pos.x - ringPos.x) * 0.18;
      ringPos.y += (pos.y - ringPos.y) * 0.18;
      if (dot) dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      if (ring) ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!started) {
        started = true;
        setVisible(true);
      }
    };

    const interactiveSel = "a, button, [data-cursor], input, textarea, [role='button']";
    const onOver = (e) => {
      const target = e.target.closest?.(interactiveSel);
      if (target) {
        setHovering(true);
        setLabel(target.getAttribute("data-cursor-label") || "");
      }
    };
    const onOut = (e) => {
      const target = e.target.closest?.(interactiveSel);
      if (target) {
        setHovering(false);
        setLabel("");
      }
    };
    const onLeaveWindow = () => setVisible(false);
    const onEnterWindow = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mouseenter", onEnterWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mouseenter", onEnterWindow);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: "opacity .25s" }}>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          width: 5,
          height: 5,
          background: "var(--color-accent)",
          boxShadow: "0 0 8px color-mix(in srgb, var(--color-accent) 90%, transparent)",
          opacity: hovering ? 0 : 1,
          transition: "opacity .2s",
        }}
      />
      <div
        ref={ringRef}
        className="cursor-dot flex items-center justify-center"
        style={{
          width: hovering ? 48 : 24,
          height: hovering ? 48 : 24,
          border: "1px solid color-mix(in srgb, var(--color-accent) 65%, transparent)",
          background: hovering
            ? "color-mix(in srgb, var(--color-accent) 12%, transparent)"
            : "transparent",
          transition:
            "width .3s cubic-bezier(0.16,1,0.3,1), height .3s cubic-bezier(0.16,1,0.3,1), background .3s",
        }}
      >
        {label && (
          <span className="text-[9px] uppercase tracking-widest text-[color:var(--color-accent)] font-[family-name:var(--font-jetbrains)]">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
