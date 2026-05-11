"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, PerspectiveCamera } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 2000;

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 8 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      a[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      a[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      a[i * 3 + 2] = r * Math.cos(phi) * 0.38 + (Math.random() - 0.5) * 1.5;
    }
    return a;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.028;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.07) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.042}
        color="#4f8ef7"
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full min-h-[100vh] w-full" aria-hidden="true">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={48} />
        <ambientLight intensity={0.4} />
        <ParticleField />
        <Float speed={1.35} rotationIntensity={0.32} floatIntensity={0.5}>
          <group rotation={[0.22, 0.55, 0]}>
            <Icosahedron args={[2.35, 0]}>
              <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.11} />
            </Icosahedron>
          </group>
        </Float>
      </Canvas>
    </div>
  );
}
