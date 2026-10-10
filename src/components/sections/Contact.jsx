"use client";

import { social, contactEmail } from "@/constant/data";
import SectionHead from "../ui/SectionHead";
import Notepad from "./contact/Notepad";

export default function Contact() {
  return (
    <section id="contact" className="relative w-full px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionHead label="Get in touch" index="05 / 05" title="Say hello" />

        <div className="mt-14 grid gap-16 md:grid-cols-[1fr_1.1fr] md:gap-14">
          <div>
            <p className="font-mono text-sm text-[color:var(--color-muted)]">A good product starts with a conversation.</p>
            <h3 className="display mt-5 text-[clamp(2.8rem,6.4vw,6rem)]">
              Got an idea?
              <br />
              Let&apos;s <span className="text-[color:var(--color-accent)]">ship it.</span>
            </h3>
            <p className="mt-8 max-w-sm leading-relaxed text-[color:var(--color-fg-soft)]">
              Open to freelance projects, collaborations, or a quick chat. I usually reply within a day.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`mailto:${contactEmail}`}
                data-cursor-label="Mail"
                className="rounded-full bg-[color:var(--color-fg)] px-6 py-3.5 font-mono text-sm uppercase tracking-wider text-[color:var(--color-bg)] transition-transform hover:-rotate-2"
              >
                Send mail ↗
              </a>
              <a
                href={social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="Chat"
                className="rounded-full border-[1.5px] border-[color:var(--color-fg)] px-6 py-3.5 font-mono text-sm uppercase tracking-wider transition-transform hover:rotate-2"
              >
                WhatsApp ↗
              </a>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 font-mono text-sm uppercase tracking-wider">
              {[
                ["GitHub", social.github],
                ["LinkedIn", social.linkedin],
                ["X", social.x],
                ["Instagram", social.instagram],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Notepad />
        </div>
      </div>
    </section>
  );
}
