"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * Faux-3D project card: tilts toward the cursor with a parallax image layer.
 * Projects whose image is a plain string (no bundled asset) render an
 * intentional "confidential" panel instead of a broken <Image>.
 */
export default function ProjectCard({ project, index }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 18 });
  const px = useTransform(mx, [-0.5, 0.5], [-14, 14]);
  const py = useTransform(my, [-0.5, 0.5], [-14, 14]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const hasAsset = typeof project.image !== "string";
  const isConfidential = project.image === "confidential";
  const placeholderLabel = isConfidential
    ? "Confidential — client work"
    : project.liveLink
    ? "Live project"
    : "Personal project";

  return (
    <motion.article
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", transformPerspective: 1000 }}
      className="group relative flex h-[62vh] max-h-[560px] w-[82vw] shrink-0 flex-col overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-soft)] sm:w-[440px]"
    >
      {/* Media */}
      <div className="relative h-[58%] w-full overflow-hidden">
        {hasAsset ? (
          <motion.div style={{ x: px, y: py, scale: 1.12 }} className="absolute inset-0">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 82vw, 440px"
              className="object-cover"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 dot-grid flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span
              className="display-huge text-outline text-[clamp(1.8rem,5vw,2.6rem)] leading-none"
              style={{ transform: "translateZ(20px)" }}
            >
              {project.title}
            </span>
            <span className="eyebrow text-[10px]">{placeholderLabel}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-bg-soft)] via-transparent to-transparent" />
        <div className="absolute left-5 top-5 font-[family-name:var(--font-jetbrains)] text-xs text-[#c7f94a]">
          {String(index + 1).padStart(2, "0")}
        </div>
        <div className="absolute right-5 top-5 eyebrow text-[10px]">{project.year}</div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6" style={{ transform: "translateZ(30px)" }}>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-2xl">{project.title}</h3>
          {project.client && (
            <span className="eyebrow shrink-0 text-[9px]">{project.client}</span>
          )}
        </div>
        <p className="mt-1 text-sm text-[#c7f94a]">{project.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted)] line-clamp-3">
          {project.description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-5">
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((t, i) => (
              <span
                key={i}
                className="rounded-full border border-[color:var(--color-line)] px-2.5 py-1 text-[10px] text-[color:var(--color-muted)]"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 text-sm">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="Open"
                className="link-underline text-[#c7f94a]"
              >
                Live
              </a>
            )}
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="Code"
                className="link-underline text-[color:var(--color-fg)]"
              >
                Code
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
