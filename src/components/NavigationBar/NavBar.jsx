"use client";
import React, { useState, useEffect } from "react";

const items = [
  {
    key: "home",
    label: "Home",
    href: "#home",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 11.5L12 4l9 7.5" />
        <path d="M5 10.5V20h14v-9.5" />
      </svg>
    ),
  },
  {
    key: "experience",
    label: "Experience",
    href: "#experience",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    key: "skill",
    label: "Skill",
    href: "#skills",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M4.93 4.93l2.83 2.83" />
        <path d="M16.24 16.24l2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    ),
  },
  {
    key: "project",
    label: "Projects",
    href: "#projects",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="7" height="7" rx="1.5" />
        <rect x="14" y="4" width="7" height="7" rx="1.5" />
        <rect x="3" y="15" width="7" height="7" rx="1.5" />
        <rect x="14" y="15" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    key: "contact",
    label: "Contact",
    href: "#contact",
    svg: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 5h16v14H4z" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    ),
  },
];

export default function NavBar() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sectionIds = items.map((item) => item.key);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = 0; i < sectionIds.length; i++) {
        const sectionId = sectionIds[i];
        const section = document.getElementById(sectionId);
        if (!section) continue;

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActive(sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="
        fixed inset-x-0 bottom-4 right-[15%] z-50 mx-auto w-[75%] max-w-2xl
        rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg
        p-2
        md:static md:mt-4 md:w-full md:max-w-none md:rounded-2xl
      "
      aria-label="Primary"
    >
      <ul
        className="
          flex items-center justify-between gap-1
          md:justify-center md:gap-4
        "
      >
        {items.map((it) => (
          <li key={it.key}>
            <a
              href={it.href}
              onClick={() => setActive(it.key)}
              className={`
                group flex items-center gap-2 rounded-xl md:px-3 px-1 py-1 md:py-2
                text-sm transition
                ${active === it.key ? "text-[#B9FD50] bg-white/10" : "text-white/80 hover:text-[#B9FD50] hover:bg-white/5"}
              `}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg" aria-hidden>
                {it.svg}
              </span>
              <span className="hidden sm:inline">{it.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
