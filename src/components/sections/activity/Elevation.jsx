"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap, reducedMotion } from "@/lib/gsap";

// A year of commits, drawn two ways. Elevation (side view): every week is a
// hatched column standing on a ground line, the longest streak is called out
// with a dimension line, and the peak week is inked in orange. Plan (top
// view): every day is a dot sized by its commits. Hover (or arrow-key)
// through the weeks to read each one's days below the drawing.

const W = 1000;
const H = 320;
const M = { top: 64, right: 12, bottom: 34, left: 44 };
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;
const GROUND = H - M.bottom;
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

// Plan view geometry: 7 rows of days under the same week columns.
const ROW = 32;
const P_TOP = 24;
const P_GROUND = P_TOP + ROW * 7;
const P_H = P_GROUND + M.bottom;

const VIEWS = [
  { id: "elevation", label: "Elevation", note: "Side view · 1 column = 1 week" },
  { id: "plan", label: "Plan", note: "Top view · 1 dot = 1 day" },
];

const utc = (d) => new Date(`${d}T00:00:00Z`);
const fmt = (d, opts = { month: "short", day: "numeric" }) =>
  utc(d).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

function niceMax(v) {
  if (v <= 4) return 4;
  const step = Math.pow(10, Math.floor(Math.log10(v)));
  return [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10].find((m) => m * step >= v) * step;
}

export default function Elevation({ data }) {
  const { weeks, days, longest, busiest } = data;
  const n = weeks.length;
  // Open on the latest week that has something in it.
  const [sel, setSel] = useState(() => {
    for (let i = n - 1; i >= 0; i--) if (weeks[i].total) return i;
    return n - 1;
  });
  const [view, setView] = useState("elevation");
  const [hoverDay, setHoverDay] = useState(null);
  const svgRef = useRef(null);
  const scroller = useRef(null);
  const revealed = useRef(false);
  const uid = useId().replace(/:/g, "");

  const slot = PLOT_W / n;
  const barW = Math.max(3, slot * 0.62);
  const peak = weeks.reduce((p, w, i) => (w.total > weeks[p].total ? i : p), 0);
  const yMax = niceMax(weeks[peak].total);
  const y = (v) => GROUND - (v / yMax) * PLOT_H;
  const xOf = (i) => M.left + i * slot;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(yMax * t));

  // Longest streak, as a span of weeks.
  const dayIndex = (date) => days.findIndex((d) => d.date === date);
  const streak =
    longest.length > 1
      ? { a: Math.floor(dayIndex(longest.start) / 7), b: Math.floor(dayIndex(longest.end) / 7) }
      : null;
  const dimX1 = streak && xOf(streak.a) + (slot - barW) / 2;
  const dimX2 = streak && xOf(streak.b) + (slot + barW) / 2;
  const dimLabel = `LONGEST STREAK · ${longest.length} DAYS`;
  const dimMid = streak && Math.min(W - 120, Math.max(120, (dimX1 + dimX2) / 2));

  // Month marks where a week crosses into a new month.
  const months = weeks
    .map((w, i) => ({ i, m: utc(w.start).getUTCMonth(), label: fmt(w.start, { month: "short" }).toUpperCase() }))
    .filter((w, k, arr) => k > 0 && w.m !== arr[k - 1].m);

  // On narrow screens the drawing scrolls sideways; start at the recent end.
  useEffect(() => {
    const el = scroller.current;
    el.scrollLeft = el.scrollWidth;
  }, []);

  // Draw the current view in: on first scroll into view, then on every switch.
  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline(
        revealed.current
          ? {}
          : { scrollTrigger: { trigger: svgRef.current, start: "top 80%", once: true, onEnter: () => (revealed.current = true) } }
      );
      if (view === "elevation") {
        tl.from("[data-bar]", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.7, ease: "expo.out", stagger: 0.012 })
          .from("[data-dim]", { drawSVG: "50% 50%", duration: 0.8, ease: "power2.out" }, "-=0.4")
          .from("[data-dim-label]", { opacity: 0, y: 6, duration: 0.4 }, "-=0.3");
      } else {
        tl.from("[data-dot]", {
          scale: 0,
          transformOrigin: "50% 50%",
          duration: 0.5,
          ease: "back.out(2)",
          stagger: { each: 0.0025, from: "start" },
        });
      }
    }, svgRef);
    return () => ctx.revert();
  }, [view]);

  const onKey = (e) => {
    if (e.key === "ArrowLeft") setSel((s) => Math.max(0, s - 1));
    else if (e.key === "ArrowRight") setSel((s) => Math.min(n - 1, s + 1));
    else return;
    e.preventDefault();
  };

  const week = weeks[sel];
  const dayMax = Math.max(1, busiest.count);
  const end = week.days[week.days.length - 1].date;

  const rMax = Math.min(slot, ROW) / 2 - 1.5;
  const radius = (c) => (c ? 2.2 + (rMax - 2.2) * Math.sqrt(c / dayMax) : 1.4);
  const note = VIEWS.find((v) => v.id === view).note;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-wider">
        <div role="tablist" aria-label="Chart view" className="flex border-[1.5px] border-[color:var(--color-fg)] bg-[color:var(--color-surface)]">
          {VIEWS.map((v) => {
            const on = v.id === view;
            return (
              <button
                key={v.id}
                role="tab"
                aria-selected={on}
                data-sound="toggle"
                onClick={() => setView(v.id)}
                className={`px-3.5 py-2 uppercase tracking-wider transition-colors ${
                  on
                    ? "bg-[color:var(--color-fg)] text-[color:var(--color-bg)]"
                    : "text-[color:var(--color-muted)] hover:text-[color:var(--color-fg)]"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>
        <span className="text-[color:var(--color-muted)]">{note}</span>
      </div>

      <div
        ref={scroller}
        tabIndex={0}
        onKeyDown={onKey}
        aria-label="Weekly commit chart. Use left and right arrow keys to move between weeks."
        className="overflow-x-auto outline-none [scrollbar-width:thin] focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]"
      >
        {view === "plan" ? (
          <svg ref={svgRef} viewBox={`0 0 ${W} ${P_H}`} className="block w-full min-w-[720px] select-none" aria-hidden="true">
            {/* Selected week band */}
            <rect x={xOf(sel)} y={P_TOP - 6} width={slot} height={P_GROUND - P_TOP + 6} style={{ fill: "var(--blue)" }} fillOpacity="0.12" />

            {[1, 3, 5].map((d) => (
              <text key={d} x={M.left - 10} y={P_TOP + d * ROW + ROW / 2 + 4} textAnchor="end" className="font-mono" fontSize="11" style={{ fill: "var(--muted)" }}>
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][d]}
              </text>
            ))}

            {weeks.map((w, i) =>
              w.days.map((day, d) => {
                const cx = xOf(i) + slot / 2;
                const cy = P_TOP + d * ROW + ROW / 2;
                const isPeak = day.date === busiest.date;
                const isSel = i === sel;
                const isHover = isSel && hoverDay === d;
                return (
                  <g key={day.date}>
                    <circle
                      data-dot
                      cx={cx}
                      cy={cy}
                      r={radius(day.count)}
                      style={{
                        fill: !day.count ? "var(--faint)" : isPeak ? "var(--accent)" : isSel ? "var(--blue)" : "var(--fg)",
                        stroke: isHover ? "var(--fg)" : "none",
                      }}
                      strokeWidth="1.5"
                    />
                    <rect
                      x={xOf(i)}
                      y={P_TOP + d * ROW}
                      width={slot}
                      height={ROW}
                      fill="transparent"
                      data-sound
                      data-sound-hover="key"
                      onPointerEnter={() => {
                        setSel(i);
                        setHoverDay(d);
                      }}
                      onPointerLeave={() => setHoverDay(null)}
                      onClick={() => setSel(i)}
                    />
                  </g>
                );
              })
            )}

            {/* Peak day callout */}
            {(() => {
              const i = Math.floor(dayIndex(busiest.date) / 7);
              const d = dayIndex(busiest.date) % 7;
              const cx = xOf(i) + slot / 2;
              const cy = P_TOP + d * ROW + ROW / 2;
              const left = cx > W - 200;
              const tx = left ? cx - 24 : cx + 24;
              return (
                <g pointerEvents="none">
                  <circle cx={cx} cy={cy} r={rMax + 3} fill="none" style={{ stroke: "var(--accent)" }} strokeWidth="1.2" />
                  <line x1={cx} y1={cy - rMax - 3} x2={tx} y2={P_TOP - 10} style={{ stroke: "var(--accent)" }} strokeWidth="1" />
                  <text
                    x={tx + (left ? -4 : 4)}
                    y={P_TOP - 6}
                    textAnchor={left ? "end" : "start"}
                    className="font-mono"
                    fontSize="11"
                    fontWeight="700"
                    style={{ fill: "var(--accent)" }}
                  >
                    PEAK · {busiest.count} ON {fmt(busiest.date).toUpperCase()}
                  </text>
                </g>
              );
            })()}

            <line x1={M.left} x2={W - M.right} y1={P_GROUND} y2={P_GROUND} style={{ stroke: "var(--fg)" }} strokeWidth="1.8" />
            {months.map(({ i, label }) => (
              <g key={`${label}-${i}`}>
                <line x1={xOf(i)} x2={xOf(i)} y1={P_GROUND} y2={P_GROUND + 6} style={{ stroke: "var(--fg)" }} />
                <text x={xOf(i) + 3} y={P_GROUND + 20} className="font-mono" fontSize="11" style={{ fill: "var(--muted)" }}>
                  {label}
                </text>
              </g>
            ))}
          </svg>
        ) : (
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block w-full min-w-[720px] select-none" role="img" aria-hidden="true">
            <defs>
              <pattern id={`hatch-${uid}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="5" style={{ stroke: "var(--fg)" }} strokeWidth="1.1" strokeOpacity="0.55" />
              </pattern>
              <marker id={`arrow-${uid}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" style={{ fill: "var(--fg)" }} />
              </marker>
            </defs>

            {/* Scale: gridlines + ruler labels */}
            {ticks.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} style={{ stroke: "var(--line)" }} strokeDasharray={t ? "3 4" : undefined} />
                <text x={M.left - 10} y={y(t) + 4} textAnchor="end" className="font-mono" fontSize="11" style={{ fill: "var(--muted)" }}>
                  {t}
                </text>
              </g>
            ))}

            {/* Selected week guide */}
            <line
              x1={xOf(sel) + slot / 2}
              x2={xOf(sel) + slot / 2}
              y1={M.top - 8}
              y2={GROUND}
              style={{ stroke: "var(--blue)" }}
              strokeDasharray="2 3"
            />

            {/* Weeks */}
            {weeks.map((w, i) => {
              const x = xOf(i) + (slot - barW) / 2;
              const h = w.total ? Math.max(2, GROUND - y(w.total)) : 0;
              const fill = i === sel ? "var(--blue)" : i === peak ? "var(--accent)" : `url(#hatch-${uid})`;
              return (
                <g key={w.start}>
                  {h > 0 ? (
                    <rect data-bar x={x} y={GROUND - h} width={barW} height={h} style={{ fill, stroke: "var(--fg)" }} strokeWidth="1.2" />
                  ) : (
                    <line x1={x} x2={x + barW} y1={GROUND - 1.5} y2={GROUND - 1.5} style={{ stroke: "var(--faint)" }} strokeWidth="1.5" />
                  )}
                  <rect
                    x={xOf(i)}
                    y={M.top - 10}
                    width={slot}
                    height={GROUND - M.top + 10}
                    fill="transparent"
                    data-sound
                    data-sound-hover="key"
                    onPointerEnter={() => setSel(i)}
                    onClick={() => setSel(i)}
                  />
                </g>
              );
            })}

            {/* Value on the selected and peak weeks */}
            {[...new Set([peak, sel])].map((i) => (
              <text
                key={i}
                x={xOf(i) + slot / 2}
                y={y(weeks[i].total) - 7}
                textAnchor="middle"
                className="font-mono"
                fontSize="11"
                fontWeight="700"
                pointerEvents="none"
                style={{ fill: i === sel ? "var(--blue)" : "var(--accent)" }}
              >
                {weeks[i].total}
              </text>
            ))}

            {/* Ground line + month marks */}
            <line x1={M.left} x2={W - M.right} y1={GROUND} y2={GROUND} style={{ stroke: "var(--fg)" }} strokeWidth="1.8" />
            {months.map(({ i, label }) => (
              <g key={`${label}-${i}`}>
                <line x1={xOf(i)} x2={xOf(i)} y1={GROUND} y2={GROUND + 6} style={{ stroke: "var(--fg)" }} />
                <text x={xOf(i) + 3} y={GROUND + 20} className="font-mono" fontSize="11" style={{ fill: "var(--muted)" }}>
                  {label}
                </text>
              </g>
            ))}

            {/* Longest streak, dimensioned */}
            {streak && (
              <g pointerEvents="none">
                <line data-dim x1={dimX1} x2={dimX1} y1={M.top - 34} y2={M.top - 6} style={{ stroke: "var(--fg)" }} strokeDasharray="2 2" />
                <line data-dim x1={dimX2} x2={dimX2} y1={M.top - 34} y2={M.top - 6} style={{ stroke: "var(--fg)" }} strokeDasharray="2 2" />
                <line
                  data-dim
                  x1={dimX1}
                  x2={dimX2}
                  y1={M.top - 28}
                  y2={M.top - 28}
                  style={{ stroke: "var(--fg)" }}
                  strokeWidth="1.2"
                  markerStart={`url(#arrow-${uid})`}
                  markerEnd={`url(#arrow-${uid})`}
                />
                <g data-dim-label>
                  <rect x={dimMid - 104} y={M.top - 58} width="208" height="20" style={{ fill: "var(--surface)" }} />
                  <text x={dimMid} y={M.top - 44} textAnchor="middle" className="font-mono" fontSize="11" fontWeight="700" letterSpacing="0.06em" style={{ fill: "var(--fg)" }}>
                    {dimLabel}
                  </text>
                </g>
              </g>
            )}
          </svg>
        )}
      </div>

      {/* Section cut through the selected week */}
      <div className="mt-6 grid gap-5 border-t-[1.5px] border-dashed border-[color:var(--color-fg)] pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="font-mono text-xs uppercase tracking-wider">
          <p className="text-[color:var(--color-muted)]">
            Section A–A · week {sel + 1} of {n}
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-fg)]">
            {fmt(week.start)} – {fmt(end, { month: "short", day: "numeric", year: "numeric" })}
          </p>
          <p className="mt-1">
            <span className="display text-4xl text-[color:var(--color-blue)]">{week.total}</span>{" "}
            <span className="text-[color:var(--color-muted)]">{week.total === 1 ? "contribution" : "contributions"}</span>
          </p>
        </div>
        <ol className="grid grid-cols-7 gap-1.5 sm:w-[340px]">
          {DAYS.map((label, d) => {
            const day = week.days[d];
            const c = day?.count ?? 0;
            return (
              <li key={d} className="flex flex-col items-center gap-1.5 font-mono text-[11px]" title={day ? `${c} on ${fmt(day.date)}` : undefined}>
                <span
                  className={`relative flex h-16 w-full items-end border-[1.5px] bg-[color:var(--color-bg-soft)] ${
                    hoverDay === d ? "border-[color:var(--color-accent)]" : "border-[color:var(--color-fg)]"
                  }`}
                >
                  <span
                    className="w-full bg-[color:var(--color-blue)] transition-[height] duration-300 ease-[var(--ease-out-expo)]"
                    style={{ height: day ? `${(c / dayMax) * 100}%` : 0 }}
                  />
                </span>
                <span className={c ? "text-[color:var(--color-fg)]" : "text-[color:var(--color-faint)]"}>{day ? c : "–"}</span>
                <span className="text-[color:var(--color-muted)]">{label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
