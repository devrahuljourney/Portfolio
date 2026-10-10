"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import Wordmark from "./ui/Wordmark";

// Fired once the loader is gone so the hero can start its intro.
export const INTRO_EVENT = "intro:start";
export const introStarted = () => typeof window !== "undefined" && window.__introStarted === true;

function startIntro() {
  window.__introStarted = true;
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/** Paper curtain with a 0 to 100 counter. Shown once per browser session. */
export default function Preloader() {
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro-seen") === "1";
      sessionStorage.setItem("intro-seen", "1");
    } catch {}

    if (seen || reducedMotion()) {
      setGone(true);
      startIntro();
      return;
    }

    window.__lenis?.stop();
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setGone(true);
        window.__lenis?.start();
      },
    });
    tl.to(counter, {
      v: 100,
      duration: 1.1,
      ease: "power2.inOut",
      onUpdate: () => {
        if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
      },
    })
      .to("[data-loader-word]", { yPercent: -110, duration: 0.5, ease: "expo.in", stagger: 0.05 }, "+=0.1")
      .add(startIntro, "-=0.1")
      .to(rootRef.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.15");

    return () => tl.kill();
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className="grid-paper fixed inset-0 z-[300] flex flex-col justify-between bg-[color:var(--color-bg)] px-5 py-6 text-[color:var(--color-fg)] md:px-10 md:py-8"
    >
      <div className="line-mask">
        <div data-loader-word className="block">
            <Wordmark />
          </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="line-mask">
          <p data-loader-word className="font-mono text-xs uppercase tracking-wider text-[color:var(--color-muted)]">
            Plotting sheet 00
          </p>
        </div>
        <div className="line-mask">
          <span data-loader-word ref={countRef} className="display block text-[22vw] leading-[0.8] md:text-[14vw]">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
