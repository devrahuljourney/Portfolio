"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { play } from "@/lib/sound";

/**
 * Global "sound mode". When enabled, hovering or clicking any link/button
 * on the site plays a small synthesized sound — a generic tick by default,
 * or whatever `data-sound="name"` on the element (or a closest ancestor)
 * asks for. On by default; the choice is remembered in localStorage.
 */
const SoundContext = createContext({ enabled: true, toggle: () => {}, play: () => {} });

export function useSound() {
  return useContext(SoundContext);
}

const STORAGE_KEY = "sound-enabled";
const INTERACTIVE_SEL = "a, button, [role='button'], input[type='checkbox'], input[type='radio'], [data-sound]";

export default function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);
  const hoveredRef = useRef(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "0") setEnabled(false);
    } catch {}
  }, []);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Side effects (persisting + playing a sound) run here directly rather
  // than inside the setEnabled updater, since Strict Mode may invoke that
  // updater twice to check for purity.
  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    setEnabled(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {}
    if (next) play("toggle");
  }, []);

  const trigger = useCallback((name) => {
    if (!enabledRef.current) return;
    play(name);
  }, []);

  // Delegated listeners: anything matching INTERACTIVE_SEL gets a sound for
  // free, so components elsewhere don't need to wire this up individually.
  useEffect(() => {
    const onOver = (e) => {
      if (!enabledRef.current) return;
      const target = e.target.closest?.(INTERACTIVE_SEL);
      if (!target || target === hoveredRef.current) return;
      hoveredRef.current = target;
      play(target.dataset.soundHover || "hover");
    };
    const onOut = (e) => {
      const target = e.target.closest?.(INTERACTIVE_SEL);
      if (target === hoveredRef.current) hoveredRef.current = null;
    };
    const onDown = (e) => {
      if (!enabledRef.current) return;
      const target = e.target.closest?.(INTERACTIVE_SEL);
      if (!target) return;
      play(target.dataset.sound || "click");
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <SoundContext.Provider value={{ enabled, toggle, play: trigger }}>{children}</SoundContext.Provider>;
}
