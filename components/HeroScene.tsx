"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, PerspectiveCamera } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

const COUNT = 2000;

/** Soft circular sprite so PointsMaterial renders dots instead of squares. */
function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Deterministic per-particle factor in [min, max] */
function particleSpread(i: number, min = 0.48, max = 1): number {
  const t = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return min + (t - Math.floor(t)) * (max - min);
}

type HeroMouseRef = MutableRefObject<{
  /** NDC x [-1, 1], left → right */
  x: number;
  /** NDC y [-1, 1], bottom → top (Three.js style) */
  y: number;
  inBounds: boolean;
  pressed: boolean;
}>;

function ParticleField({ mouseRef, reducedMotion }: { mouseRef: HeroMouseRef; reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const attractorTmp = useMemo(() => new THREE.Vector3(), []);
  const localAttractor = useMemo(() => new THREE.Vector3(), []);
  const smoothedPull = useRef(0);

  const rest = useMemo(() => {
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

  const positions = useMemo(() => new Float32Array(rest), [rest]);
  const circleMap = useMemo(() => createCircleTexture(), []);

  useEffect(() => {
    return () => {
      circleMap?.dispose();
    };
  }, [circleMap]);

  useFrame((state, dt) => {
    const pts = pointsRef.current;
    if (!pts) return;

    pts.rotation.y = state.clock.elapsedTime * 0.028;
    pts.rotation.x = Math.sin(state.clock.elapsedTime * 0.07) * 0.05;

    const geom = pts.geometry;
    const attr = geom.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    if (reducedMotion) {
      arr.set(rest);
      attr.needsUpdate = true;
      return;
    }

    const m = mouseRef.current;
    raycaster.setFromCamera(new THREE.Vector2(m.x, m.y), camera);
    const hit = raycaster.ray.intersectPlane(plane, attractorTmp);
    if (hit === null) {
      attractorTmp.set(0, 0, 0);
    } else {
      const len = attractorTmp.length();
      if (len > 36) attractorTmp.multiplyScalar(36 / len);
    }

    // Attractor is in world space; particle positions are local to the rotating Points mesh.
    // Convert so pull follows the cursor even after the cloud has spun (avoids left/right reverse).
    pts.updateMatrixWorld();
    localAttractor.copy(attractorTmp);
    pts.worldToLocal(localAttractor);

    const ax = localAttractor.x;
    const ay = localAttractor.y;
    const az = localAttractor.z;

    const targetPull = m.pressed && m.inBounds ? 1 : m.inBounds ? 0.38 : 0;
    const pullAlpha = Math.min(1, dt * 10);
    smoothedPull.current += (targetPull - smoothedPull.current) * pullAlpha;

    const hoverMix = smoothedPull.current * (m.pressed ? 0.96 : 0.72);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const rx = rest[i3];
      const ry = rest[i3 + 1];
      const rz = rest[i3 + 2];
      const spread = particleSpread(i);
      const mix = hoverMix * spread;

      arr[i3] = rx + (ax - rx) * mix;
      arr[i3 + 1] = ry + (ay - ry) * mix;
      arr[i3 + 2] = rz + (az - rz) * mix;
    }

    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.115}
        color="#a8c9ff"
        map={circleMap ?? undefined}
        transparent
        opacity={0.92}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        alphaTest={0.01}
      />
    </points>
  );
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    inBounds: false,
    pressed: false,
  });

  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (!containerRef.current) return;

    function updateFromClient(clientX: number, clientY: number) {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const m = mouseRef.current;
      m.inBounds =
        clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
      m.x = ((clientX - r.left) / Math.max(1, r.width)) * 2 - 1;
      m.y = -(((clientY - r.top) / Math.max(1, r.height)) * 2 - 1);
    }

    const onMove = (e: MouseEvent) => updateFromClient(e.clientX, e.clientY);
    const onDown = (e: MouseEvent) => {
      updateFromClient(e.clientX, e.clientY);
      mouseRef.current.pressed = true;
    };
    const onUp = () => {
      mouseRef.current.pressed = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      updateFromClient(t.clientX, t.clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const t = e.touches[0];
      updateFromClient(t.clientX, t.clientY);
      mouseRef.current.pressed = true;
    };
    const onTouchEnd = () => {
      mouseRef.current.pressed = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 h-full min-h-full w-full"
      aria-hidden="true"
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={48} />
        <ambientLight intensity={0.4} />
        <ParticleField mouseRef={mouseRef} reducedMotion={reducedMotion} />
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
