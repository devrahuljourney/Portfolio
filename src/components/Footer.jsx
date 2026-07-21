"use client";

import { social } from "@/constant/data";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#skills" },
  { label: "Work", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-[color:var(--color-line)] px-6 md:px-12 pt-20 pb-32 md:pb-24">
      <div className="mx-auto max-w-[1440px]">
        {/* Giant wordmark */}
        <div className="flex items-end justify-between gap-6 border-b border-[color:var(--color-line)] pb-12">
          <h2 className="display-huge text-[clamp(2.6rem,11vw,9rem)] leading-[0.8]">
            Rahul<span className="text-[color:var(--color-accent)]">.</span>
          </h2>
          <a
            href="#home"
            data-cursor-label="Top"
            className="mb-3 hidden shrink-0 items-center gap-2 text-sm text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-accent)] md:flex"
          >
            Back to top ↑
          </a>
        </div>

        <div className="flex flex-col gap-10 pt-10 md:flex-row md:items-start md:justify-between">
          <div className="text-sm text-[color:var(--color-muted)]">
            © {new Date().getFullYear()} Rahul Kumar Verma.
            <br />
            Built with Next.js, three.js & GSAP.
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-underline w-fit text-sm text-[color:var(--color-fg)]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-6">
            {[
              { label: "GH", href: social.github },
              { label: "IN", href: social.linkedin },
              { label: "X", href: social.x },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-jetbrains)] text-sm text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-accent)]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
