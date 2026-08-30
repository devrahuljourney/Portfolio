"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Rasterizes `lines` onto an offscreen canvas and samples the lit pixels into
 * a flat cloud of 3D points. Exact glyph fidelity doesn't matter — the shape
 * dissolves into particles anyway — so we just auto-fit a bold system font.
 */
function buildTextParticles(lines, { targetCount = 3200, planeWidth = 3.6 } = {}) {
  const canvasWidth = 1000;
  const canvasHeight = 420;
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let fontSize = 150;
  ctx.font = `800 ${fontSize}px sans-serif`;
  const maxLineWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const margin = canvasWidth * 0.88;
  if (maxLineWidth > margin) {
    fontSize *= margin / maxLineWidth;
    ctx.font = `800 ${fontSize}px sans-serif`;
  }

  const lineHeight = fontSize * 1.08;
  const totalHeight = lines.length * lineHeight;
  const startY = canvasHeight / 2 - totalHeight / 2 + lineHeight / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, canvasWidth / 2, startY + i * lineHeight);
  });

  const { data } = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const candidates = [];
  const step = 2;
  for (let y = 0; y < canvasHeight; y += step) {
    for (let x = 0; x < canvasWidth; x += step) {
      if (data[(y * canvasWidth + x) * 4 + 3] > 128) candidates.push(x, y);
    }
  }

  const pairCount = candidates.length / 2;
  const order = Array.from({ length: pairCount }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  const count = Math.min(targetCount, pairCount);
  const planeHeight = planeWidth * (canvasHeight / canvasWidth);
  const targets = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const idx = order[i] * 2;
    const x = candidates[idx];
    const y = candidates[idx + 1];
    targets[i * 3] = (x / canvasWidth - 0.5) * planeWidth;
    targets[i * 3 + 1] = -(y / canvasHeight - 0.5) * planeHeight;
    targets[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
  }
  return targets;
}

/**
 * Four-corner burst: particles start clustered near the four corners of the
 * scene (evenly split into quadrant groups) and fly inward as they assemble,
 * so the text visibly builds in from the edges rather than a center puff.
 */
function cornerScatter(count, halfW = 3.2, halfH = 2.1) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const cornerX = i % 2 === 0 ? -1 : 1;
    const cornerY = i % 4 < 2 ? 1 : -1;
    const spreadX = halfW * (0.4 + Math.random() * 0.6);
    const spreadY = halfH * (0.4 + Math.random() * 0.6);
    arr[i * 3] = cornerX * spreadX;
    arr[i * 3 + 1] = cornerY * spreadY;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 1.0;
  }
  return arr;
}

/**
 * "SOFTWARE ENGINEER" assembles out of scattered particles, then idles with
 * a faint breathing jitter. Particles near the cursor scatter and spring
 * back — a tactile reaction in place of a decorative rotating object.
 *
 * Assembly is driven by `heroScroll` (a ref: `{ active, value }`) when the
 * parent's scroll-pin is live (desktop, motion allowed) — see Hero.jsx. When
 * inactive (mobile, or before that effect has run) it free-runs on its own
 * clock instead, so the shape still assembles once on mount either way.
 * Respects prefers-reduced-motion (renders pre-assembled, fully static).
 */
function ParticleMonogram({ pointer, color, heroScroll }) {
  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const { camera, viewport } = useThree();
  // Cap the assembled text to a fraction of the current viewport width so it
  // still fits on narrow portrait screens — the 3.6 default assumes a wide
  // canvas and overflows badly on a phone-width frustum otherwise.
  const targets = useMemo(
    () =>
      buildTextParticles(["SOFTWARE", "ENGINEER"], {
        planeWidth: Math.min(3.6, viewport.width * 0.82),
      }),
    [viewport.width] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const count = targets.length / 3;
  // Corners of the *current* full canvas viewport in world units, so the
  // burst genuinely starts from the screen's edges regardless of canvas size.
  const starts = useMemo(
    () => cornerScatter(count, viewport.width / 2, viewport.height / 2),
    [count, viewport.width, viewport.height]
  );
  const delays = useMemo(() => {
    const d = new Float32Array(count);
    for (let i = 0; i < count; i++) d[i] = Math.random() * 0.4;
    return d;
  }, [count]);
  const seeds = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = Math.random() * Math.PI * 2;
    return s;
  }, [count]);

  const positions = useMemo(
    () => (reduceMotion ? targets.slice() : starts.slice()),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const glowPositions = useMemo(() => positions.slice(), []); // eslint-disable-line react-hooks/exhaustive-deps
  const repel = useMemo(() => new Float32Array(count * 3), [count]);

  const groupRef = useRef();
  const pointsRef = useRef();
  const glowRef = useRef();
  const progress = useRef({ t: reduceMotion ? 1 : 0 });
  const mountClock = useRef(null);
  const pulsed = useRef(false);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const planeZ = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const c = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    if (reduceMotion) return;
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const arr = geo.attributes.position.array;

    // Overall assembly progress: follow the scroll-pin once it's live,
    // otherwise ease in on our own clock (mobile / pre-effect frames).
    if (heroScroll?.current?.active) {
      progress.current.t = THREE.MathUtils.lerp(
        progress.current.t,
        heroScroll.current.value,
        0.15
      );
    } else {
      if (mountClock.current === null) mountClock.current = state.clock.elapsedTime;
      const auto = THREE.MathUtils.clamp(
        (state.clock.elapsedTime - mountClock.current - 0.3) / 2.6,
        0,
        1
      );
      progress.current.t = 1 - Math.pow(1 - auto, 3);
    }
    const t = progress.current.t;
    const time = state.clock.elapsedTime;

    // Particles are invisible until assembly begins — nothing to see before
    // the user scrolls (or, on the free-running fallback, before the brief
    // initial delay), then they fade in as they build toward the shape.
    const fadeIn = THREE.MathUtils.smoothstep(t, 0, 0.14);
    if (fadeIn < 1) {
      const ptsMat = pointsRef.current.material;
      if (ptsMat) ptsMat.opacity = 0.95 * fadeIn;
      const glowMat = glowRef.current?.material;
      if (glowMat) glowMat.opacity = 0.12 * fadeIn;
    }

    // One-shot glow flash the moment the shape locks into place.
    if (glowRef.current) {
      if (t > 0.92 && !pulsed.current) {
        pulsed.current = true;
        gsap.fromTo(
          glowRef.current.material,
          { opacity: 0.12 },
          { opacity: 0.4, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out" }
        );
      } else if (t < 0.85) {
        pulsed.current = false;
      }
    }

    let hasHit = false;
    if (pointer.current.active) {
      raycaster.setFromCamera({ x: pointer.current.x, y: pointer.current.y }, camera);
      hasHit = raycaster.ray.intersectPlane(planeZ, hit) !== null;
    }

    const REPEL_RADIUS = 0.85;
    const REPEL_STRENGTH = 0.55;

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      const local = THREE.MathUtils.clamp((t - delays[i]) / (1 - delays[i]), 0, 1);
      const eased = 1 - Math.pow(1 - local, 3);

      let px = THREE.MathUtils.lerp(starts[ix], targets[ix], eased);
      let py = THREE.MathUtils.lerp(starts[iy], targets[iy], eased);
      const pz = THREE.MathUtils.lerp(starts[iz], targets[iz], eased);

      const swirl = (1 - eased) * 0.5;
      px += Math.sin(time * 1.4 + seeds[i]) * swirl;
      py += Math.cos(time * 1.1 + seeds[i]) * swirl;

      if (eased > 0.98) {
        px += Math.sin(time * 0.8 + seeds[i]) * 0.012;
        py += Math.cos(time * 0.9 + seeds[i] * 1.3) * 0.012;
      }

      let dx = 0, dy = 0;
      if (hasHit) {
        dx = px - hit.x;
        dy = py - hit.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0.0001) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          dx = (dx / dist) * force;
          dy = (dy / dist) * force;
        } else {
          dx = 0;
          dy = 0;
        }
      }
      repel[ix] = THREE.MathUtils.lerp(repel[ix], dx, 0.15);
      repel[iy] = THREE.MathUtils.lerp(repel[iy], dy, 0.15);

      arr[ix] = px + repel[ix];
      arr[iy] = py + repel[iy];
      arr[iz] = pz;
    }
    geo.attributes.position.needsUpdate = true;

    if (glowRef.current) {
      glowRef.current.geometry.attributes.position.array.set(arr);
      glowRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (groupRef.current) {
      const overallEase = 1 - Math.pow(1 - t, 3);
      groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.85, 1.3, overallEase));
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.current.x * 0.15,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.current.y * 0.1,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={c}
          size={0.026}
          sizeAttenuation
          transparent
          opacity={reduceMotion ? 0.95 : 0}
        />
      </points>
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[glowPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={c}
          size={0.09}
          sizeAttenuation
          transparent
          opacity={reduceMotion ? 0.12 : 0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function HeroScene({ color = "#c7f94a", heroScroll }) {
  // `active` stays false until a real mousemove fires — without it, the
  // default (0, 0) would sit exactly at screen-center and permanently repel
  // nearby particles (a phantom cursor), which on touch devices never
  // clears since there's no mousemove at all.
  const pointer = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.current.active = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ParticleMonogram pointer={pointer} color={color} heroScroll={heroScroll} />
    </Canvas>
  );
}
