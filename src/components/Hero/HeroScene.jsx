"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/** Fibonacci-distributed points on a sphere of radius r. */
function spherePoints(count, r) {
  const arr = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = golden * i;
    arr[i * 3] = Math.cos(theta) * rad * r;
    arr[i * 3 + 1] = y * r;
    arr[i * 3 + 2] = Math.sin(theta) * rad * r;
  }
  return arr;
}

/**
 * A rotating point-cloud sphere (echoing the site's dot-grid) wrapped in a
 * faint wireframe cage. Tilts toward the cursor and breathes gently.
 */
function PointGlobe({ pointer, color }) {
  const group = useRef();
  const inner = useRef();
  const outer = useMemo(() => spherePoints(1100, 1.7), []);
  const core = useMemo(() => spherePoints(360, 1.05), []);
  const c = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.06;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.current.y * 0.4,
      0.05
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -pointer.current.x * 0.3,
      0.05
    );
    if (inner.current) inner.current.rotation.y -= delta * 0.12;
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.03;
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[outer, 3]} />
        </bufferGeometry>
        <pointsMaterial color={c} size={0.02} sizeAttenuation transparent opacity={0.9} />
      </points>
      <points ref={inner}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[core, 3]} />
        </bufferGeometry>
        <pointsMaterial color={c} size={0.03} sizeAttenuation transparent opacity={0.5} />
      </points>
      <mesh>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial color={c} wireframe transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

export default function HeroScene({ color = "#c7f94a" }) {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
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
      <PointGlobe pointer={pointer} color={color} />
    </Canvas>
  );
}
