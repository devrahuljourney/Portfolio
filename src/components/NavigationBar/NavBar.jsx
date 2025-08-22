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
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  let timeoutId = null;

  useEffect(() => {
    const container = document.querySelector(".scroll-container");
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;

      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (currentScrollY > lastScrollY + 5) {
          setVisible(false); 
        } else if (currentScrollY < lastScrollY - 5) {
          setVisible(true); 
        }
        setLastScrollY(currentScrollY);
      }, 80);

      const scrollPosition = currentScrollY + container.clientHeight / 3;
      let currentActive = null;

      items.forEach((item) => {
        const section = document.getElementById(item.key);
        if (!section) return;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          currentActive = item.key;
        }
      });

      if (currentActive && currentActive !== active) {
        setActive(currentActive);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [lastScrollY, active]);

  return (
    <nav
      className={`
        fixed inset-x-0 bottom-4 md:left-0 left-[-14%]  z-50 mx-auto w-[75%] max-w-2xl
        rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg
        p-2 transition-transform duration-300
        ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
        md:static md:mt-4 md:w-full md:max-w-none md:rounded-2xl
      `}
    >
      <ul className="flex items-center justify-between gap-1 md:justify-center md:gap-4">
        {items.map((it) => (
          <li key={it.key}>
            <a
              href={it.href}
              onClick={() => setActive(it.key)}
              className={`
                group flex items-center gap-2 rounded-xl md:px-3 px-1 py-1 md:py-2
                text-sm transition
                ${active === it.key
                  ? "text-[#B9FD50] bg-white/10"
                  : "text-white/80 hover:text-[#B9FD50] hover:bg-white/5"}
              `}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg">
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
