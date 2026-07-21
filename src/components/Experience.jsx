"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./ui/Reveal";

gsap.registerPlugin(ScrollTrigger);

const experienceData = [
  {
    id: 1,
    role: "Software Engineer",
    tag: "Client · Indian travel brand",
    company: "Vitraga Solutions",
    location: "Delhi, India",
    start: "Mar 2026",
    end: "Present",
    points: [
      "Built an AI travel-planner chatbot with LangChain, GPT-4o, and pgvector semantic search across 20+ partner agencies — cutting agent package discovery from ~20 minutes to under 2, with mid-conversation lead capture synced to TeleCRM with UTM attribution.",
      "Designed a PaymentGateway interface and GatewayFactory unifying HDFC SmartGateway and ICICI Orange Gateway, enabling provider switches without touching orchestration code.",
      "Integrated TripJack GDS via Supabase Edge Functions for live flight search, fare validation, confirm-book, and hotel pricing — embedding travel inventory directly in the agent portal.",
    ],
  },
  {
    id: 2,
    role: "Software Engineer Intern",
    tag: "Australian NDIS client",
    company: "Vitraga Solutions",
    location: "Remote",
    start: "Sep 2025",
    end: "Feb 2026",
    points: [
      "Built a task-to-invoice pipeline with PDF generation, NDIS service codes, and GST compliance — reducing billing time from 2+ days to under 5 minutes.",
      "Shipped an LLM-assisted NDIS plan parser (pdf-parse + Google Generative AI) that extracts participant details, funded supports, and service rates from PDFs, cutting plan entry from 30–60 minutes to under 5.",
      "Architected a multi-tenant RBAC/ABAC system with 200+ permission keys gating every UI action, enforced in Express middleware and scoped SQL.",
    ],
  },
  {
    id: 3,
    role: "Frontend Developer Intern",
    tag: "E-commerce",
    company: "PlayGG (formerly Weird Esports India)",
    location: "Jaipur, India",
    start: "Sep 2024",
    end: "Jan 2025",
    points: [
      "Built and deployed a full-stack MERN e-commerce platform with responsive design across desktop, tablet, and mobile.",
      "Engineered a multi-step checkout flow, reducing user drop-off by 30%.",
      "Implemented bulk product upload via CSV, cutting manual product-entry time by 80%.",
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !lineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full py-28 md:py-40 px-6 md:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal className="eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#c7f94a]" />
              Experience
            </Reveal>
            <Reveal as="h2" delay={0.05} className="text-[clamp(2.2rem,6vw,5rem)]">
              Where I&apos;ve built
            </Reveal>
          </div>
          <Reveal
            as="p"
            delay={0.1}
            className="max-w-xs text-sm text-[color:var(--color-muted)]"
          >
            A short track record of shipping real products for real users.
          </Reveal>
        </div>

        <div className="relative pl-6 md:pl-10">
          {/* Track + scroll-drawn progress */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-[color:var(--color-line)]" />
          <div
            ref={lineRef}
            className="absolute left-0 top-2 bottom-2 w-px bg-[#c7f94a] origin-top"
          />

          <div className="space-y-16 md:space-y-24">
            {experienceData.map((exp) => (
              <Reveal key={exp.id} className="group relative">
                {/* Node */}
                <span className="absolute -left-[26px] md:-left-[42px] top-2 flex h-3.5 w-3.5 items-center justify-center">
                  <span className="h-3.5 w-3.5 rounded-full border border-[#c7f94a] bg-[color:var(--color-bg)] transition-colors duration-300 group-hover:bg-[#c7f94a]" />
                </span>

                <div className="grid gap-6 md:grid-cols-[200px_1fr] md:gap-12">
                  <div>
                    <div className="font-[family-name:var(--font-jetbrains)] text-sm text-[#c7f94a]">
                      {exp.start} — {exp.end}
                    </div>
                    <div className="eyebrow mt-2 text-[10px]">{exp.tag}</div>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl">{exp.role}</h3>
                    <div className="mt-1 text-sm text-[color:var(--color-muted)]">
                      {exp.company}
                      {exp.location ? (
                        <span className="text-[color:var(--color-faint)]">
                          {" "}
                          · {exp.location}
                        </span>
                      ) : null}
                    </div>
                    <ul className="mt-6 space-y-3">
                      {exp.points.map((p, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm md:text-base leading-relaxed text-[color:var(--color-muted)]"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#c7f94a]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
