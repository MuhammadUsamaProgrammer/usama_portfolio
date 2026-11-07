"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type HeroSceneProps = {
  /** Simplified geometry / lower DPR for small or touch devices. */
  simplified: boolean;
  /** Freeze idle motion and pointer response (prefers-reduced-motion). */
  still: boolean;
  /** Pause rendering entirely (e.g. when scrolled out of view). */
  paused: boolean;
  /** Re-tune materials for the dark page theme. */
  dark: boolean;
  onReady?: () => void;
};

/** Pane layout: fanned "screens" in phone proportions. */
const PANES: { position: [number, number, number]; rotation: [number, number, number] }[] = [
  { position: [-0.78, 0.22, -0.7], rotation: [0.04, 0.32, 0.05] },
  { position: [0, 0, 0], rotation: [0, 0.16, 0] },
  { position: [0.78, -0.22, 0.7], rotation: [-0.04, 0, -0.05] },
];

function usePointer(enabled: boolean) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);
  return pointer;
}

/** Glass tuning per theme: light reads as frosted white, dark as smoked glass. */
const GLASS = {
  light: { color: "#ffffff", emissive: "#f4f7ff", emissiveIntensity: 0.28, opacity: 0.34, envMapIntensity: 2.2 },
  dark: { color: "#b9c8ea", emissive: "#1a2744", emissiveIntensity: 0.3, opacity: 0.15, envMapIntensity: 2.4 },
} as const;

function Sculpture({
  simplified,
  still,
  dark,
}: {
  simplified: boolean;
  still: boolean;
  dark: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Mesh>(null);
  const pointer = usePointer(!still && !simplified);
  const tune = GLASS[dark ? "dark" : "light"];

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || still) return;
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 1 / 30);

    // Slow idle sway + gentle float.
    const idleY = -0.55 + Math.sin(t * 0.25) * 0.38;
    const idleX = 0.12 + Math.sin(t * 0.18) * 0.05;

    // Pointer influence (desktop only), softly eased.
    const targetY = idleY + pointer.current.x * 0.28;
    const targetX = idleX + pointer.current.y * 0.14;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 2.2, d);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 2.2, d);
    g.position.y = Math.sin(t * 0.6) * 0.06;

    if (orb.current) {
      orb.current.position.y = 0.55 + Math.sin(t * 0.9 + 1.2) * 0.08;
    }
  });

  const smoothness = simplified ? 3 : 5;

  return (
    <group ref={group} rotation={[0.12, -0.55, 0]} scale={simplified ? 0.86 : 0.9}>
      {PANES.map((pane, i) => (
        <RoundedBox
          key={i}
          args={[1.5, 3.1, 0.1]}
          radius={0.05}
          smoothness={smoothness}
          bevelSegments={smoothness}
          position={pane.position}
          rotation={pane.rotation}
          renderOrder={i}
        >
          {/* Declarative materials: R3F applies theme changes and re-renders on demand. */}
          <meshPhysicalMaterial
            color={tune.color}
            emissive={tune.emissive}
            emissiveIntensity={tune.emissiveIntensity}
            transparent
            opacity={tune.opacity}
            roughness={0.04}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.04}
            reflectivity={0.75}
            iridescence={0.35}
            iridescenceIOR={1.25}
            envMapIntensity={tune.envMapIntensity}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </RoundedBox>
      ))}
      <mesh ref={orb} position={[0.38, 0.55, 0.35]} renderOrder={10}>
        <sphereGeometry args={[0.26, simplified ? 32 : 64, simplified ? 32 : 64]} />
        <meshPhysicalMaterial
          color="#3478F6"
          roughness={0.18}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={dark ? 0.8 : 1.1}
        />
      </mesh>
    </group>
  );
}

export default function HeroScene({ simplified, still, paused, dark, onReady }: HeroSceneProps) {
  const frameloop = paused ? "never" : still ? "demand" : "always";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={simplified ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 8.4], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        // Neutral tone mapping keeps the accent blue true to the brand token.
        gl.toneMapping = THREE.NeutralToneMapping;
        // Wait one frame so the first paint is complete before fading in.
        requestAnimationFrame(() => onReady?.());
      }}
      aria-hidden
    >
      <ambientLight intensity={dark ? 0.35 : 0.6} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#dbe6ff" />

      <Sculpture simplified={simplified} still={still} dark={dark} />

      {/* Studio lighting via light-formers: no external HDR download. */}
      <Environment resolution={simplified ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[6, 1.5, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#cfe0ff" position={[0, 0, -6]} scale={4} />
      </Environment>
    </Canvas>
  );
}
