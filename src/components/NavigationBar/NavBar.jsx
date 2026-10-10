"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import ThemeToggle from "../ThemeToggle";
import Wordmark from "../ui/Wordmark";

const items = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Log" },
  { href: "#projects", label: "Works" },
  { href: "#toolkit", label: "Toolkit" },
  { href: "#contact", label: "Connect" },
];

function ScrambleLink({ href, label, onClick, className = "" }) {
  const ref = useRef(null);
  const scramble = () => {
    if (reducedMotion()) return;
    gsap.to(ref.current, {
      duration: 0.6,
      scrambleText: { text: label, chars: "upperCase", speed: 0.6 },
    });
  };
  return (
    <a href={href} onMouseEnter={scramble} onClick={onClick} className={className}>
      <span ref={ref}>{label}</span>
    </a>
  );
}

export default function NavBar() {
  const navRef = useRef(null);
  const overlayRef = useRef(null);
  const [open, setOpen] = useState(false);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const hide = y > 160 && y > last;
      gsap.to(navRef.current, { yPercent: hide ? -120 : 0, duration: 0.5, ease: "expo.out", overwrite: true });
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile overlay menu.
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const links = el.querySelectorAll("[data-menu-link]");
    if (open) {
      window.__lenis?.stop();
      gsap.set(el, { display: "flex" });
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "expo.inOut" });
      gsap.fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "expo.out", delay: 0.25 });
    } else {
      window.__lenis?.start();
      gsap.to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.5, ease: "expo.inOut", onComplete: () => gsap.set(el, { display: "none" }) });
    }
  }, [open]);

  return (
    <>
      <header ref={navRef} className="fixed inset-x-0 top-0 z-[150] px-5 pt-5 md:px-10 md:pt-7">
        <nav className="flex items-start justify-between text-[color:var(--color-fg)]">
          <a href="#home" aria-label="Rahul Verma, home" className="block">
            <Wordmark />
          </a>
          <div className="flex items-center gap-8">
            <ul className="hidden items-center gap-7 md:flex">
              {items.map((it) => (
                <li key={it.href}>
                  <ScrambleLink href={it.href} label={it.label} className="font-mono text-[13px] uppercase tracking-wide" />
                </li>
              ))}
            </ul>
            <ThemeToggle className="hidden md:flex" />
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="relative z-[160] font-mono text-xs uppercase tracking-wider md:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={overlayRef}
        className="fixed inset-0 z-[140] hidden flex-col justify-between bg-[color:var(--color-accent)] px-5 pb-10 pt-28 text-[color:var(--color-on-accent)] md:hidden"
      >
        <ul className="space-y-1">
          {items.map((it, i) => (
            <li key={it.href} className="line-mask">
              <a data-menu-link href={it.href} onClick={() => setOpen(false)} className="display flex items-baseline gap-3 text-[15vw]">
                <span className="font-mono text-sm font-normal tracking-normal">0{i + 1}</span>
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <ThemeToggle />
      </div>
    </>
  );
}
