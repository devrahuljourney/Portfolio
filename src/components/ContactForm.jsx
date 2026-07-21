"use client";

import { useState } from "react";
import { social, contactEmail } from "@/constant/data";
import Reveal from "./ui/Reveal";

const fields = [
  { name: "name", label: "Your name", type: "text" },
  { name: "email", label: "Email address", type: "email" },
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative w-full py-28 md:py-40 px-6 md:px-12">
      <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-[1fr_1fr] md:gap-24">
        {/* Left — invitation */}
        <div>
          <Reveal className="eyebrow mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-[color:var(--color-accent)]" />
            Contact
          </Reveal>
          <Reveal as="h2" delay={0.05} className="text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95]">
            Let&apos;s build
            <br />
            something
            <br />
            <span className="text-[color:var(--color-accent)]">good.</span>
          </Reveal>
          <Reveal
            as="p"
            delay={0.1}
            className="mt-8 max-w-sm text-base leading-relaxed text-[color:var(--color-muted)]"
          >
            Open to interesting problems, collaborations, or a quick chat. Drop a
            note and I&apos;ll get back within a day.
          </Reveal>

          <Reveal delay={0.12} className="mt-6">
            <a
              href={`mailto:${contactEmail}`}
              data-cursor-label="Mail"
              className="link-underline font-[family-name:var(--font-jetbrains)] text-sm text-[color:var(--color-fg)]"
            >
              {contactEmail}
            </a>
          </Reveal>

          <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: "GitHub", href: social.github },
              { label: "LinkedIn", href: social.linkedin },
              { label: "Twitter", href: social.x },
              { label: "WhatsApp", href: social.whatsapp },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-sm text-[color:var(--color-fg)]"
              >
                {s.label}
              </a>
            ))}
          </Reveal>
        </div>

        {/* Right — form */}
        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {fields.map((f) => (
              <label key={f.name} className="group block">
                <span className="eyebrow text-[10px]">{f.label}</span>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full border-b border-[color:var(--color-line)] bg-transparent pb-3 text-lg text-[color:var(--color-fg)] outline-none transition-colors duration-300 placeholder:text-[color:var(--color-faint)] focus:border-[color:var(--color-accent)]"
                  placeholder="—"
                />
              </label>
            ))}
            <label className="group block">
              <span className="eyebrow text-[10px]">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                required
                className="mt-2 w-full resize-none border-b border-[color:var(--color-line)] bg-transparent pb-3 text-lg text-[color:var(--color-fg)] outline-none transition-colors duration-300 placeholder:text-[color:var(--color-faint)] focus:border-[color:var(--color-accent)]"
                placeholder="—"
              />
            </label>

            <button
              type="submit"
              disabled={status === "loading"}
              data-cursor-label="Send"
              className="group relative mt-2 w-fit overflow-hidden rounded-full bg-[color:var(--color-accent)] px-9 py-4 text-sm font-medium text-[color:var(--color-on-accent)] disabled:opacity-60"
            >
              <span className="relative z-10">
                {status === "loading" ? "Sending…" : "Send message"}
              </span>
            </button>

            {status === "success" && (
              <p className="text-sm text-[color:var(--color-accent)]">Message sent — talk soon.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">Something went wrong. Try again.</p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
