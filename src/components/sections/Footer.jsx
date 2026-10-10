"use client";

import { useEffect, useState } from "react";
import { social } from "@/constant/data";

const links = [
  { label: "About", href: "#about" },
  { label: "Log", href: "#experience" },
  { label: "Works", href: "#projects" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "Connect", href: "#contact" },
];

const WORDS = ["BUILD", "SHIP", "ITERATE", "REAL PRODUCTS", "REAL USERS"];

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time || "--:--:--"}</span>;
}

export default function Footer() {
  const strip = [...WORDS, ...WORDS];
  return (
    <footer className="relative w-full overflow-hidden bg-[#0d0f0e] pt-16 text-[#ece6d9] md:pt-20">
      <div className="marquee-track" style={{ "--marquee-duration": "36s" }} aria-hidden="true">
        {[0, 1].map((n) => (
          <div key={n} className="flex shrink-0">
            {strip.map((w, i) => (
              <span key={i} className="display flex items-center whitespace-nowrap px-6 text-[clamp(3.4rem,10vw,9rem)]">
                {w}
                <span className="ml-12 text-[#e05a3f]">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-[1440px] px-5 pb-10 md:px-10">
        <div className="grid gap-10 border-t border-white/15 pt-10 md:grid-cols-4">
          <div>
            <div className="display text-[22px] leading-[0.86] tracking-[-0.06em]">
              rahul
              <br />
              verma
            </div>
            <p className="mt-4 text-sm text-[#92958b]">Full-stack software engineer, India.</p>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-xs uppercase tracking-wider text-[#92958b]">Pages</p>
            <ul className="mt-4 space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[#92958b]">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {[
                ["GitHub", social.github],
                ["LinkedIn", social.linkedin],
                ["X", social.x],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[#92958b]">Local time</p>
            <p className="display mt-4 text-4xl tabular-nums">
              <Clock />
            </p>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[#92958b]">IST · UTC+5:30</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 font-mono text-xs uppercase tracking-wider text-[#92958b] md:flex-row">
          <span>© {new Date().getFullYear()} Rahul Kumar Verma</span>
          <span>Designed &amp; coded in India · Next.js &amp; GSAP</span>
          <a href="#home" data-cursor-label="Top" className="text-[#e05a3f]">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
