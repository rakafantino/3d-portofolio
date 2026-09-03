import { useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural PBR 3D Tech Core Model.
 * Composed purely of Three.js / R3F primitives:
 * - Central metallic icosahedron core with cyan emissive glow
 * - 3 nested rotating gimbal torus rings with dark metallic surfaces & faint emissive accent
 * - Inner cyan point light + cursor-reactive point light lerped across pointer-projected plane
 * - Outer particle ring with additive blending & circular distribution
 *
 * Replaces legacy Island.glb without any external GLB assets.
 */
const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

const TechCore = ({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isRotating = false,
  setCurrentStage = null,
  ...props
}) => {
  const rootGroupRef = useRef(null);
  const coreMeshRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const particleRingRef = useRef(null);
  const cursorLightRef = useRef(null);

  const { viewport } = useThree();

  // Guard transform props against invalid / non-finite values
  const safeScale = useMemo(() => {
    if (isFiniteNumber(scale)) return [scale, scale, scale];
    if (Array.isArray(scale) && scale.length === 3 && scale.every(isFiniteNumber)) {
      return scale;
    }
    return [1, 1, 1];
  }, [scale]);

  const safePosition = useMemo(() => {
    if (Array.isArray(position) && position.length === 3 && position.every(isFiniteNumber)) {
      return position;
    }
    return [0, 0, 0];
  }, [position]);

  const safeRotation = useMemo(() => {
    if (Array.isArray(rotation) && rotation.length === 3 && rotation.every(isFiniteNumber)) {
      return rotation;
    }
    return [0, 0, 0];
  }, [rotation]);

  // Generate outer particle ring positions & colors (~320 particles in a flat circular ring)
  const particleCount = 320;
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const baseRadius = 2.7;
    const ringSpread = 0.5;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const r = baseRadius + (Math.sin(i * 12.34) * 0.5 + 0.5) * ringSpread;
      const x = Math.cos(angle) * r;
      const y = (Math.cos(i * 34.56) * 0.5) * 0.25; // slight vertical jitter
      const z = Math.sin(angle) * r;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    return positions;
  }, [particleCount]);

  useFrame((state, delta) => {
    const dt = delta || 0.016;
    const speedMultiplier = isRotating ? 2.4 : 1.0;

    // 1. Core slow pulsing rotation & breathing
    if (coreMeshRef.current && coreMeshRef.current.rotation) {
      coreMeshRef.current.rotation.x += 0.3 * dt * speedMultiplier;
      coreMeshRef.current.rotation.y += 0.45 * dt * speedMultiplier;
    }

    // 2. Gimbal rings counter-rotation on distinct axes
    if (ring1Ref.current && ring1Ref.current.rotation) {
      ring1Ref.current.rotation.x += 0.35 * dt * speedMultiplier;
      ring1Ref.current.rotation.z += 0.2 * dt * speedMultiplier;
    }
    if (ring2Ref.current && ring2Ref.current.rotation) {
      ring2Ref.current.rotation.y += 0.4 * dt * speedMultiplier;
      ring2Ref.current.rotation.x -= 0.15 * dt * speedMultiplier;
    }
    if (ring3Ref.current && ring3Ref.current.rotation) {
      ring3Ref.current.rotation.z -= 0.3 * dt * speedMultiplier;
      ring3Ref.current.rotation.y += 0.25 * dt * speedMultiplier;
    }

    // 3. Particle field slow orbit
    if (particleRingRef.current && particleRingRef.current.rotation) {
      particleRingRef.current.rotation.y += 0.15 * dt * speedMultiplier;
    }

    // 4. Cursor-reactive point light: lerp towards pointer projected coordinates
    if (cursorLightRef.current && cursorLightRef.current.position && state && state.pointer) {
      const vWidth = viewport ? viewport.width : 10;
      const vHeight = viewport ? viewport.height : 10;

      const targetX = (state.pointer.x * vWidth) * 0.35;
      const targetY = (state.pointer.y * vHeight) * 0.35;
      const targetZ = 1.8;

      cursorLightRef.current.position.x += (targetX - cursorLightRef.current.position.x) * 0.1;
      cursorLightRef.current.position.y += (targetY - cursorLightRef.current.position.y) * 0.1;
      cursorLightRef.current.position.z += (targetZ - cursorLightRef.current.position.z) * 0.1;
    }

    // Optional hook compatibility: trigger setCurrentStage if provided
    if (typeof setCurrentStage === "function") {
      // Stage mapping logic lives in stageCalculator; pass-through only if needed
    }
  });

  return (
    <group
      ref={rootGroupRef}
      scale={safeScale}
      position={safePosition}
      rotation={safeRotation}
      {...props}
    >
      {/* 1. Inner Omni Point Light (Cyan Glow) */}
      <pointLight
        color="#00F0FF"
        intensity={2.5}
        distance={6}
        decay={2}
      />

      {/* 2. Cursor-Reactive Interactive Light (Amber Highlight) */}
      <pointLight
        ref={cursorLightRef}
        color="#FFB800"
        intensity={3.0}
        distance={8}
        decay={2}
        position={[0, 0, 1.8]}
      />

      {/* 3. Central Icosahedron Tech Core */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial
          color="#0E121A"
          roughness={0.25}
          metalness={0.92}
          emissive="#00F0FF"
          emissiveIntensity={0.65}
          wireframe={false}
        />
      </mesh>

      {/* 4. Gimbal Ring 1 (Inner Torus) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.35, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#1A202C"
          roughness={0.3}
          metalness={0.88}
          emissive="#00F0FF"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* 5. Gimbal Ring 2 (Middle Torus) */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.75, 0.045, 16, 64]} />
        <meshStandardMaterial
          color="#121722"
          roughness={0.28}
          metalness={0.9}
          emissive="#FFB800"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 6. Gimbal Ring 3 (Outer Torus) */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 4, Math.PI / 3]}>
        <torusGeometry args={[2.15, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#1A202C"
          roughness={0.32}
          metalness={0.85}
          emissive="#00F0FF"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 7. Procedural Orbital Particle Ring */}
      <points ref={particleRingRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#00F0FF"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};

TechCore.propTypes = {
  scale: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  position: PropTypes.arrayOf(PropTypes.number),
  rotation: PropTypes.arrayOf(PropTypes.number),
  isRotating: PropTypes.bool,
  setCurrentStage: PropTypes.func,
};

export default TechCore;
