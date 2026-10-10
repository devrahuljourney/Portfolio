"use client";

import { useSound } from "./providers/SoundProvider";

/** ON / OFF switch for global UI sound, styled to match ThemeToggle. */
export default function SoundToggle({ className = "" }) {
  const { enabled, toggle } = useSound();

  return (
    <button
      onClick={toggle}
      data-sound="toggle"
      aria-pressed={enabled}
      aria-label={`Turn interface sound ${enabled ? "off" : "on"}`}
      data-cursor-label={enabled ? "Mute" : "Sound"}
      className={`flex items-center gap-2 font-mono text-xs uppercase tracking-wider ${className}`}
    >
      <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-current">
        <span
          className="absolute h-3 w-3 rounded-full bg-[color:var(--color-accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(${enabled ? 18 : 3}px)` }}
        />
      </span>
      <span className="w-10 text-left">{enabled ? "Sound" : "Muted"}</span>
    </button>
  );
}
