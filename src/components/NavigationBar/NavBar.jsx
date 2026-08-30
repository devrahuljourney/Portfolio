"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const items = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "experience", label: "Work" },
  { key: "skills", label: "Stack" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

export default function NavBar() {
  const [active, setActive] = useState("home");
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  // Active section via IntersectionObserver (works with Lenis/native scroll).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.key);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < 120 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: visible ? 0 : 80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-5 left-4 right-[4.75rem] z-50 md:left-1/2 md:right-auto md:w-fit md:-translate-x-1/2"
    >
      <ul className="elevated flex items-center gap-1 overflow-x-auto rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-surface)]/70 p-1.5 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:w-fit md:overflow-visible">
        {items.map((it) => {
          const isActive = active === it.key;
          return (
            <li key={it.key} className="relative shrink-0">
              <a
                href={`#${it.key}`}
                className={`relative z-10 block whitespace-nowrap rounded-full px-3 py-2 text-xs font-medium transition-colors duration-300 md:px-4 md:text-sm ${
                  isActive
                    ? "text-[color:var(--color-on-accent)]"
                    : "text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
                }`}
              >
                {it.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-[color:var(--color-accent)]"
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
