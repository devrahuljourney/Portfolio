"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";

const INSTALL = "ext install rahul-dev.rn-style-injector";
const MARKETPLACE = "https://marketplace.visualstudio.com/items?itemName=rahul-dev.rn-style-injector";
const REPO = "https://github.com/devrahuljourney/rn-style-injector";

const K = ({ children }) => <span className="text-[#6b87f0]">{children}</span>;
const S = ({ children }) => <span className="text-[#f0cc78]">{children}</span>;

// Looping before/after demo: missing styles → Alt+S → injected.
function Demo() {
  const root = useRef(null);

  useEffect(() => {
    const q = gsap.utils.selector(root);
    if (reducedMotion()) {
      gsap.set(q("[data-inject]"), { height: "auto", opacity: 1 });
      return;
    }
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2, paused: true });
    tl.set(q("[data-inject]"), { height: 0, opacity: 0 })
      .set(q("[data-toast]"), { autoAlpha: 0, y: 12 })
      .set(q("[data-missing]"), { textDecorationColor: "rgba(224,90,63,1)" })
      .to({}, { duration: 1.4 })
      .to(q("[data-cap]"), { y: 4, boxShadow: "inset 0 -2px 0 #cfc5b0", duration: 0.08, stagger: 0.12 })
      .to(q("[data-cap]"), { y: 0, boxShadow: "inset 0 -6px 0 #cfc5b0", duration: 0.12 }, "+=0.15")
      .to(q("[data-inject]"), { height: "auto", opacity: 1, duration: 0.5, stagger: 0.18, ease: "expo.out" }, "-=0.05")
      .fromTo(q("[data-inject]"), { backgroundColor: "rgba(240,204,120,0.28)" }, { backgroundColor: "rgba(240,204,120,0)", duration: 1.2 }, "<")
      .to(q("[data-missing]"), { textDecorationColor: "rgba(224,90,63,0)", duration: 0.4 }, "<")
      .to(q("[data-toast]"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(2)" }, "<0.2")
      .to({}, { duration: 2.2 });

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top 85%",
      end: "bottom 10%",
      onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
    });
    return () => {
      st.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={root} className="relative">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#171917] font-mono text-[12px] leading-[1.8] text-[#d6cfc0] shadow-2xl md:text-[13.5px]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#b94835]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f0cc78]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#7fb069]" />
          <span className="ml-3 text-[11px] text-[#92958b]">Profile.jsx</span>
        </div>
        <pre className="overflow-x-auto px-5 py-4">
          <code>
            {"<"}<K>View</K> style={"{"}styles.<span data-missing className="underline decoration-wavy underline-offset-4">card</span>{"}"}{">\n"}
            {"  <"}<K>Text</K> style={"{"}styles.<span data-missing className="underline decoration-wavy underline-offset-4">title</span>{"}"}{">"}<S>Rahul</S>{"</"}<K>Text</K>{">\n"}
            {"</"}<K>View</K>{">\n\n"}
            <K>const</K> styles = StyleSheet.<K>create</K>{"({\n"}
            {"  container: { flex: "}<S>1</S>{" },"}
            <span data-inject className="block overflow-hidden">{"  card: {},"}</span>
            <span data-inject className="block overflow-hidden">{"  title: {},"}</span>
            {"});"}
          </code>
        </pre>
      </div>

      <div className="absolute -bottom-16 left-2 flex rotate-[-6deg] gap-2 md:-left-6">
        {["Alt", "S"].map((k) => (
          <span key={k} data-cap className="keycap flex h-12 min-w-12 items-center justify-center px-3 font-mono text-sm">
            {k}
          </span>
        ))}
      </div>

      <div
        data-toast
        className="absolute -right-2 -top-5 rotate-3 rounded-full bg-[#f0cc78] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#0d0f0e] md:-right-6"
      >
        2 styles injected ✓
      </div>
    </div>
  );
}

export default function Featured() {
  const root = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-panel]",
        { scale: 0.9, borderRadius: 48 },
        {
          scale: 1,
          borderRadius: 24,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section ref={root} id="featured" className="relative w-full px-3 py-10 md:px-6">
      <div
        data-panel
        className="mx-auto max-w-[1520px] overflow-hidden rounded-3xl bg-[#0d0f0e] px-6 py-16 text-[#ece6d9] md:px-14 md:py-24"
      >
        <div className="flex items-center justify-between border-b border-white/15 pb-3 font-mono text-xs uppercase tracking-wider">
          <span className="text-[#f0cc78]">(Featured) · VS Code Marketplace</span>
          <span className="text-[#92958b]">Publisher rahul-dev</span>
        </div>

        <div className="mt-12 grid items-center gap-16 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="display text-[clamp(2.8rem,7vw,6.6rem)]">
              RN Style
              <br />
              Injector<span className="text-[#e05a3f]">.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[#d6cfc0]">
              Write the JSX, press <span className="font-mono text-[#f0cc78]">Alt+S</span>, and every missing style lands in{" "}
              <span className="font-mono text-[#f0cc78]">StyleSheet.create</span>. Existing styles stay untouched.
            </p>

            <div className="mt-10 flex items-end gap-10">
              <div>
                <div className="display text-6xl md:text-7xl">450+</div>
                <div className="mt-2 font-mono text-xs uppercase tracking-wider text-[#92958b]">Developers</div>
              </div>
              <div>
                <div className="display text-6xl md:text-7xl">0</div>
                <div className="mt-2 font-mono text-xs uppercase tracking-wider text-[#92958b]">Setup steps</div>
              </div>
            </div>

            <button
              onClick={copy}
              data-cursor-label={copied ? "Copied" : "Copy"}
              className="mt-10 flex w-full max-w-md items-center justify-between gap-4 rounded-lg bg-[#292b28] px-4 py-3 text-left font-mono text-sm"
            >
              <span>
                <span className="text-[#e05a3f]">$</span> {INSTALL}
              </span>
              <span className="shrink-0 text-xs uppercase tracking-wider text-[#f0cc78]">{copied ? "Copied" : "Copy"}</span>
            </button>

            <div className="mt-8 flex gap-6 font-mono text-sm uppercase tracking-wider">
              <a href={MARKETPLACE} target="_blank" rel="noopener noreferrer" className="link-underline text-[#e05a3f]">
                Install ↗
              </a>
              <a href={REPO} target="_blank" rel="noopener noreferrer" className="link-underline">
                Source ↗
              </a>
            </div>
          </div>

          <Demo />
        </div>
      </div>
    </section>
  );
}
