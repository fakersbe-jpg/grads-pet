import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import * as THREE from "three";
import { useCelebration } from "@/context/CelebrationContext";

// Vertex shader: size grows with scroll velocity
const vertexShader = `
  uniform float uVelocity;
  attribute float aSize;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float stretch = 1.0 + abs(uVelocity) * 0.12;
    gl_PointSize = aSize * stretch * (280.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = `
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(1.0, 0.83, 0.88, alpha * 0.75);
  }
`;

function Stars({ velocityRef }: { velocityRef: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.ShaderMaterial>(null!);

  const { positions, sizes } = useMemo(() => {
    const count = 1500;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.4 + Math.random() * 0.8;
    }
    return { positions: pos, sizes: sz };
  }, []);

  useFrame((_, dt) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += dt * 0.02;
    pointsRef.current.rotation.x += dt * 0.005;
    if (matRef.current) {
      matRef.current.uniforms.uVelocity.value = THREE.MathUtils.lerp(
        matRef.current.uniforms.uVelocity.value,
        velocityRef.current,
        0.08
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uVelocity: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Bokeh({
  mouseX,
  mouseY,
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const group = useRef<THREE.Group>(null!);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 18 });

  const items = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        pos: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          -2 - Math.random() * 6,
        ] as [number, number, number],
        scale: 0.15 + Math.random() * 0.5,
        color: i % 3 === 0 ? "#ffb3c8" : i % 3 === 1 ? "#ffd9b3" : "#c9a6ff",
      })),
    []
  );

  useFrame(() => {
    if (!group.current) return;
    group.current.rotation.y = springX.get() * 0.25;
    group.current.rotation.x = -springY.get() * 0.18;
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <Float key={i} speed={1 + Math.random()} rotationIntensity={0.2} floatIntensity={1.2}>
          <mesh position={it.pos} scale={it.scale}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshBasicMaterial
              color={it.color}
              transparent
              opacity={0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

const BURST_COUNT = 400;

function CelebrationBurst({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const positionsRef = useRef(new Float32Array(BURST_COUNT * 3));
  const velocitiesRef = useRef(new Float32Array(BURST_COUNT * 3));
  const lifetimeRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    lifetimeRef.current = 0;
    const pos = positionsRef.current;
    const vel = velocitiesRef.current;
    for (let i = 0; i < BURST_COUNT; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.04 + Math.random() * 0.12;
      vel[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      vel[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      vel[i * 3 + 2] = speed * Math.cos(phi);
    }
    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }
  }, [active]);

  useFrame((_, dt) => {
    if (!active || !pointsRef.current) return;
    lifetimeRef.current += dt;
    const pos = positionsRef.current;
    const vel = velocitiesRef.current;
    for (let i = 0; i < BURST_COUNT; i++) {
      pos[i * 3] += vel[i * 3];
      pos[i * 3 + 1] += vel[i * 3 + 1];
      pos[i * 3 + 2] += vel[i * 3 + 2];
      vel[i * 3] *= 0.96;
      vel[i * 3 + 1] *= 0.96;
      vel[i * 3 + 2] *= 0.96;
    }
    const attr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    attr.needsUpdate = true;
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, 1 - lifetimeRef.current / 2.4);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positionsRef.current, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffb3c8"
        size={0.06}
        transparent
        opacity={active ? 0.9 : 0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function ParticleField() {
  const velocityRef = useRef(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [burstActive, setBurstActive] = useState(false);
  const { onBurst } = useCelebration();

  // Scroll velocity polling
  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    const poll = () => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) velocityRef.current = ((window.scrollY - lastY) / dt) * 16;
      lastY = window.scrollY;
      lastT = now;
      raf = requestAnimationFrame(poll);
    };
    raf = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  // Celebration burst subscription
  useEffect(() => {
    return onBurst(() => {
      setBurstActive(true);
      setTimeout(() => setBurstActive(false), 3000);
    });
  }, [onBurst]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#120715"]} />
        <fog attach="fog" args={["#120715", 8, 22]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.4} color="#ffb3c8" />
        <pointLight position={[-6, -3, 2]} intensity={1.1} color="#c9a6ff" />
        <Stars velocityRef={velocityRef} />
        <Bokeh mouseX={mouseX} mouseY={mouseY} />
        <Sparkles count={120} scale={[14, 8, 6]} size={3} speed={0.4} color="#ffd4e3" opacity={0.7} />
        <CelebrationBurst active={burstActive} />
      </Canvas>
    </div>
  );
}
