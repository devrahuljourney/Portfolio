// Origami paper plane, folded from a copy of the contact sheet.
//
// The paper is an SVG in its own "paper space" (W x H units, nose at the
// top). Each fold splits the current paper along a crease into a static half
// and a moving half; the moving half is reflected across the crease by
// animating a scale along the crease normal from 1 (flat) to -1 (folded
// over). Seen from above, that is exactly what a fold looks like, and since
// every fold wraps the result of the previous ones, flaps carry earlier
// flaps with them, like real paper.

import { gsap } from "@/lib/gsap";

const NS = "http://www.w3.org/2000/svg";
const PAPER = "#fbfaf6";
const B = 2000; // half-plane size, in paper units

const el = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};

function halfPlane(p, d, n) {
  const pt = (a, b) => `${p.x + d.x * a + n.x * b},${p.y + d.y * a + n.y * b}`;
  return `${pt(-B, 0)} ${pt(B, 0)} ${pt(B, B)} ${pt(-B, B)}`;
}

// Classic dart. Units: W = 200 wide, nose at (100, 0).
function creases(H) {
  const s = 0.3827, c = 0.9239; // sin/cos 22.5deg
  return [
    { p: { x: 100, y: 0 }, d: { x: -1, y: 1 }, m: { x: 0, y: 0 } }, // left corner to centre
    { p: { x: 100, y: 0 }, d: { x: 1, y: 1 }, m: { x: 200, y: 0 } }, // right corner
    { p: { x: 100, y: 0 }, d: { x: -s, y: c }, m: { x: 0, y: 40 } }, // left edge to centre
    { p: { x: 100, y: 0 }, d: { x: s, y: c }, m: { x: 200, y: 40 } }, // right edge
    { p: { x: 100, y: 0 }, d: { x: 0, y: 1 }, m: { x: 200, y: H / 2 } }, // in half
  ];
}

function paper(W, H, rotated) {
  const g = el("g");
  g.appendChild(el("rect", { x: 0, y: 0, width: W, height: H, fill: PAPER, stroke: "#12151c", "stroke-opacity": 0.85, "stroke-width": 1.3, "vector-effect": "non-scaling-stroke" }));
  // Ruled lines + margin, drawn so they read horizontally on the original
  // (unrotated) sheet.
  const lines = el("g", { stroke: "#0e7c7b", "stroke-opacity": 0.35, "stroke-width": 0.7 });
  if (rotated) {
    for (let x = W - 18; x > 0; x -= 18) lines.appendChild(el("line", { x1: x, y1: 0, x2: x, y2: H }));
    g.appendChild(lines);
    g.appendChild(el("line", { x1: 0, y1: H - 14, x2: W, y2: H - 14, stroke: "#e5470d", "stroke-opacity": 0.45, "stroke-width": 0.9 }));
  } else {
    for (let y = 18; y < H; y += 18) lines.appendChild(el("line", { x1: 0, y1: y, x2: W, y2: y }));
    g.appendChild(lines);
    g.appendChild(el("line", { x1: 14, y1: 0, x2: 14, y2: H, stroke: "#e5470d", "stroke-opacity": 0.45, "stroke-width": 0.9 }));
  }
  return g;
}

/**
 * Lays a foldable copy over `sheet` (inside `stage`) and returns controls.
 * Nothing moves until you play the returned timelines.
 */
export function createPlane(sheet, stage) {
  const s = sheet.getBoundingClientRect();
  const st = stage.getBoundingClientRect();
  const rotated = s.width > s.height; // landscape sheet: turn it upright first
  const long = rotated ? s.width : s.height;
  const short = rotated ? s.height : s.width;
  const W = 200;
  const H = (W * long) / short;

  // Pivot at the sheet's centre; everything is positioned around it.
  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  Object.assign(root.style, {
    position: "absolute",
    left: `${s.left - st.left + s.width / 2}px`,
    top: `${s.top - st.top + s.height / 2}px`,
    width: 0,
    height: 0,
    zIndex: 31,
    pointerEvents: "none",
    willChange: "transform",
  });

  // Exact copy of the sheet (with what was typed) that cross-fades away.
  const copy = sheet.cloneNode(true);
  copy.removeAttribute("id");
  copy.querySelectorAll("[name]").forEach((n) => n.removeAttribute("name"));
  Object.assign(copy.style, { position: "absolute", left: `${-s.width / 2}px`, top: `${-s.height / 2}px`, width: `${s.width}px`, height: `${s.height}px`, margin: 0 });

  // The SVG sits in a wrapper div so the turn-upright rotation is a plain
  // CSS transform GSAP can tween.
  const turn = document.createElement("div");
  Object.assign(turn.style, { position: "absolute", left: `${-short / 2}px`, top: `${-long / 2}px`, width: `${short}px`, height: `${long}px` });
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: short, height: long, overflow: "visible" });
  Object.assign(svg.style, { display: "block", overflow: "visible", filter: "drop-shadow(3px 5px 0 rgba(18,21,28,0.6))" });
  turn.appendChild(svg);
  gsap.set(turn, { rotation: rotated ? 90 : 0 });
  const defs = el("defs");
  svg.appendChild(defs);

  // Build the nested fold tree.
  const folds = creases(H);
  let scene = paper(W, H, rotated);
  const movers = [];
  folds.forEach((f, i) => {
    const len = Math.hypot(f.d.x, f.d.y);
    const d = { x: f.d.x / len, y: f.d.y / len };
    let n = { x: -d.y, y: d.x };
    if ((f.m.x - f.p.x) * n.x + (f.m.y - f.p.y) * n.y < 0) n = { x: -n.x, y: -n.y };
    const still = el("clipPath", { id: `fold-s${i}`, clipPathUnits: "userSpaceOnUse" });
    still.appendChild(el("polygon", { points: halfPlane(f.p, d, { x: -n.x, y: -n.y }) }));
    const move = el("clipPath", { id: `fold-m${i}`, clipPathUnits: "userSpaceOnUse" });
    move.appendChild(el("polygon", { points: halfPlane(f.p, d, n) }));
    defs.append(still, move);

    const next = el("g");
    const a = el("g", { "clip-path": `url(#fold-s${i})` });
    a.appendChild(scene.cloneNode(true));
    const flap = el("g", { "data-fold": i });
    const b = el("g", { "clip-path": `url(#fold-m${i})` });
    b.appendChild(scene);
    flap.appendChild(b);
    next.append(a, flap);
    scene = next;
    movers.push({ i, p: f.p, n, s: 1 });
  });
  svg.appendChild(scene);
  // Earlier flaps were copied into later layers: cache every copy of each
  // flap once instead of querying the DOM every frame.
  movers.forEach((m) => {
    m.flaps = [...svg.querySelectorAll(`[data-fold="${m.i}"]`)];
  });

  // Reflection-by-scale along the normal, about a point on the crease.
  const apply = (m) => {
    const k = m.s - 1;
    const a = 1 + k * m.n.x * m.n.x, b = k * m.n.x * m.n.y, d = 1 + k * m.n.y * m.n.y;
    const e = m.p.x - (a * m.p.x + b * m.p.y), f = m.p.y - (b * m.p.x + d * m.p.y);
    for (const flap of m.flaps) flap.setAttribute("transform", `matrix(${a} ${b} ${b} ${d} ${e} ${f})`);
  };
  const foldTo = (i, s, vars = {}) =>
    gsap.to(movers[i], { s, duration: 0.55, ease: "power2.inOut", onUpdate: () => apply(movers[i]), ...vars });

  // 3D plane for flight: two wings hinged on the centre crease, in the
  // same space as the folded paper. It takes over from the flat SVG fold:
  // the right wing starts folded flat onto the left (exactly the folded
  // dart), then swings open, and the whole plane tilts so it is seen from
  // behind and above, like a real paper plane in the air.
  const fly = document.createElement("div");
  Object.assign(fly.style, { position: "absolute", inset: 0, transformStyle: "preserve-3d", opacity: 0 });
  const wing = (side) => {
    const w = document.createElement("div");
    Object.assign(w.style, {
      position: "absolute",
      top: 0,
      left: side === "l" ? 0 : `${short / 2}px`,
      width: `${short / 2}px`,
      height: `${long}px`,
      transformOrigin: side === "l" ? "100% 50%" : "0% 50%",
      transformStyle: "preserve-3d",
    });
    const pts = side === "l" ? `100,0 4,${H * 0.9} 100,${H}` : `100,0 196,${H * 0.9} 100,${H}`;
    const ws = el("svg", { viewBox: `${side === "l" ? 0 : 100} 0 100 ${H}`, width: short / 2, height: long, preserveAspectRatio: "none", overflow: "visible" });
    ws.style.display = "block";
    ws.style.overflow = "visible";
    const clip = el("clipPath", { id: `wing-${side}` });
    clip.appendChild(el("polygon", { points: pts }));
    const lines = el("g", { "clip-path": `url(#wing-${side})`, stroke: "#0e7c7b", "stroke-opacity": 0.3, "stroke-width": 1 });
    for (let y = 18; y < H; y += 18) lines.appendChild(el("line", { x1: 0, y1: y, x2: 200, y2: y }));
    ws.append(clip, el("polygon", { points: pts, fill: side === "l" ? PAPER : "#eceae3", stroke: "#12151c", "stroke-width": 1.6, "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke" }), lines);
    w.appendChild(ws);
    return w;
  };
  const wl = wing("l"), wr = wing("r");
  fly.append(wl, wr);
  turn.appendChild(fly);
  gsap.set(wr, { rotationY: -180 }); // folded flat onto the left wing
  gsap.set(fly, { transformPerspective: 700 });

  root.append(copy, turn);
  stage.appendChild(root);

  // Paper length on screen after the turn, used to size the plane.
  const fit = (px) => px / long;

  // Tear off, turn upright, fade the writing, fold, open the wings.
  const fold = gsap.timeline({ paused: true });
  fold
    .to(root, { y: -18, rotation: -3, duration: 0.25, ease: "power2.out" })
    .to(copy, { autoAlpha: 0, duration: 0.35 }, 0.15)
    .to(root, { scale: fit(Math.min(300, window.innerHeight * 0.42)), rotation: 0, duration: 0.6, ease: "power3.inOut" }, 0.2)
    .to(turn, { rotation: 0, duration: 0.6, ease: "power3.inOut" }, 0.2)
    .add(foldTo(0, -1), ">-0.05")
    .add(foldTo(1, -1), "<0.12")
    .add(foldTo(2, -1), ">-0.05")
    .add(foldTo(3, -1), "<0.12")
    // Fold in half down the middle: a dart seen side-on, nose forward.
    .add(foldTo(4, -1, { duration: 0.6 }), ">")
    .to(root, { scale: fit(window.innerWidth < 768 ? 110 : 150), duration: 0.45, ease: "power2.inOut" }, "<");

  // Swap the flat fold for the 3D plane, open the wings, tilt into flight.
  const open = gsap.timeline({ paused: true });
  open
    .set(fly, { opacity: 1 })
    .set(svg, { opacity: 0 })
    .to(wr, { rotationY: -28, duration: 0.55, ease: "back.out(1.7)" })
    .to(wl, { rotationY: 28, duration: 0.55, ease: "back.out(1.7)" }, "<")
    .to(fly, { rotationX: 48, duration: 0.55, ease: "power2.out" }, "<");

  // Gentle banking while airborne (stopped by the caller).
  const bank = () => gsap.to(fly, { rotationY: 16, duration: 0.7, yoyo: true, repeat: -1, ease: "sine.inOut" });

  return { root, fold, open, bank, rotated };
}
