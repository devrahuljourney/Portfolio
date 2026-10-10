"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";
import { social, contactEmail } from "@/constant/data";
import SectionHead from "../ui/SectionHead";
import Sticker from "../stickers/Sticker";

const blank = { name: "", email: "", message: "" };

function Blank({ className = "", ...props }) {
  return (
    <input
      {...props}
      required
      className={`mx-1 inline-block border-b-2 border-dashed border-[#12151c]/40 bg-transparent px-1 font-mono text-[0.95em] text-[#0e7c7b] outline-none transition-colors placeholder:text-[#9aa0ab] focus:border-[#e5470d] ${className}`}
    />
  );
}

export default function Contact() {
  const letter = useRef(null);
  const plane = useRef(null);
  const [form, setForm] = useState(blank);
  const [status, setStatus] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Fold the letter away, then send the plane flying off the page.
  const flyAway = () =>
    new Promise((resolve) => {
      if (reducedMotion()) return resolve();
      const tl = gsap.timeline({ onComplete: resolve });
      tl.to(letter.current, { scaleY: 0.08, rotation: -6, duration: 0.55, ease: "power3.in", transformOrigin: "50% 50%" })
        .to(letter.current, { autoAlpha: 0, duration: 0.15 })
        .fromTo(plane.current, { autoAlpha: 0, scale: 0.4, x: 0, y: 0, rotation: 0 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" }, "-=0.15")
        .to(plane.current, {
          duration: 1.4,
          ease: "power2.in",
          motionPath: { path: [{ x: 60, y: 40 }, { x: 220, y: -40 }, { x: 420, y: -260 }, { x: 900, y: -520 }], curviness: 1.4, autoRotate: true },
        })
        .to(plane.current, { autoAlpha: 0, duration: 0.2 }, "-=0.2");
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      await flyAway();
      setStatus("success");
      setForm(blank);
    } catch {
      setStatus("error");
    }
  };

  const writeAnother = () => {
    setStatus(null);
    gsap.fromTo(letter.current, { autoAlpha: 0, scaleY: 1, rotation: 0, y: 40 }, { autoAlpha: 1, y: 0, rotation: -1.5, duration: 0.7, ease: "expo.out" });
  };

  useEffect(() => {
    gsap.set(plane.current, { autoAlpha: 0 });
  }, []);

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

          <div className="relative">
            <form
              ref={letter}
              onSubmit={onSubmit}
              className="ruled relative -rotate-[1.5deg] rounded-md py-8 pl-[46px] pr-5 text-[17px] leading-[32px] text-[#12151c] shadow-[0_30px_60px_-24px_rgba(18,21,28,0.45)] md:pr-10 md:text-lg"
              style={{ backgroundColor: "#fbfaf6" }}
            >
              <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-3deg] bg-[#f4dc4b]/80" />
              <p className="font-semibold">Dear Rahul,</p>
              <p className="mt-[32px]">
                My name is
                <Blank name="name" value={form.name} onChange={onChange} placeholder="your name" aria-label="Your name" className="w-[11ch]" />
                and you can reach me at
                <Blank type="email" name="email" value={form.email} onChange={onChange} placeholder="you@email.com" aria-label="Your email" className="w-[17ch]" />.
              </p>
              <p className="mt-[32px]">Here&apos;s what I have in mind:</p>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                required
                rows={4}
                aria-label="Your message"
                placeholder="an app, a site, an AI feature, a wild idea..."
                className="block w-full resize-none bg-transparent font-mono text-[0.95em] leading-[32px] text-[#0e7c7b] outline-none placeholder:text-[#9aa0ab]"
              />
              <div className="mt-[32px] flex flex-wrap items-center justify-between gap-4">
                <span className="font-semibold">Talk soon,</span>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  data-cursor-label="Send"
                  className="rounded-full bg-[#e5470d] px-6 py-3 font-mono text-sm uppercase tracking-wider text-[#fbfaf6] transition-transform hover:-rotate-2 disabled:opacity-60"
                >
                  {status === "loading" ? "Folding..." : "Fold & send ✈"}
                </button>
              </div>
              {status === "error" && (
                <p className="mt-4 font-mono text-sm text-[#e5470d]">
                  That didn&apos;t send. Try again, or email {contactEmail}.
                </p>
              )}
            </form>

            <div ref={plane} className="pointer-events-none absolute left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2">
              <Sticker name="plane" />
            </div>

            {status === "success" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="display text-[clamp(2rem,4vw,3.4rem)]">Delivered.</p>
                <p className="mt-3 text-[color:var(--color-fg-soft)]">Thanks for writing. I&apos;ll reply within a day.</p>
                <button onClick={writeAnother} className="link-underline mt-6 font-mono text-sm uppercase tracking-wider text-[color:var(--color-accent)]">
                  Write another
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
