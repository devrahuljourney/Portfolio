"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Thin red progress bar pinned to the top edge of the viewport. */
export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const tween = gsap.to(ref.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
    return () => tween.scrollTrigger?.kill();
  }, []);

  return (
    <div
      ref={ref}
      className="fixed left-0 top-0 z-[200] h-[3px] w-full origin-left scale-x-0 bg-[color:var(--color-accent)]"
    />
  );
}
