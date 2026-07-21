"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A cursor-reactive distorted icosahedron wrapped in a slowly counter-rotating
 * wireframe cage. Lit with a lime key light so highlights stay on-brand.
 */
function Blob({ pointer }) {
  const core = useRef();
  const cage = useRef();

  useFrame((state, delta) => {
    if (!core.current || !cage.current) return;
    // Idle rotation.
    core.current.rotation.y += delta * 0.12;
    // Tilt toward the cursor.
    core.current.rotation.x = THREE.MathUtils.lerp(
      core.current.rotation.x,
      pointer.current.y * 0.45,
      0.04
    );
    core.current.rotation.z = THREE.MathUtils.lerp(
      core.current.rotation.z,
      -pointer.current.x * 0.35,
      0.04
    );
    // Cage tracks the core but drifts the other way for depth.
    cage.current.rotation.x = core.current.rotation.x;
    cage.current.rotation.z = core.current.rotation.z;
    cage.current.rotation.y -= delta * 0.05;
  });

  return (
    <group>
      <Icosahedron ref={core} args={[1.25, 20]}>
        <MeshDistortMaterial
          color="#141414"
          emissive="#0c0c0c"
          metalness={0.85}
          roughness={0.28}
          distort={0.32}
          speed={1.6}
          flatShading={false}
        />
      </Icosahedron>
      <Icosahedron ref={cage} args={[1.72, 1]}>
        <meshBasicMaterial color="#c7f94a" wireframe transparent opacity={0.12} />
      </Icosahedron>
    </group>
  );
}

export default function HeroScene() {
  // Normalized pointer (-1..1), updated globally so it works even though the
  // canvas sits behind the text with pointer-events disabled.
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
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 5], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-5, -2, 3]} intensity={40} color="#c7f94a" distance={14} />
      <pointLight position={[3, -4, -2]} intensity={16} color="#7bd0ff" distance={12} />
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7}>
        <Blob pointer={pointer} />
      </Float>
    </Canvas>
  );
}
