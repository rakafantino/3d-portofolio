import { useRef } from "react";
import PropTypes from "prop-types";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import islandScene from "../assets/3d/island.glb";

const isFiniteNumber = (val) => typeof val === "number" && Number.isFinite(val);

const safeVector3 = (val, fallback = [0, 0, 0]) => {
  if (Array.isArray(val) && val.length === 3 && val.every(isFiniteNumber)) {
    return val;
  }
  if (isFiniteNumber(val)) {
    return [val, val, val];
  }
  return fallback;
};

const DEFAULT_LIGHTING = {
  ambient: { color: "#FFE0C0", intensity: 0.65 },
  sun: { color: "#FFB070", intensity: 2.8, position: [11, 7.5, 8] },
  hemi: { skyColor: "#E8B98A", groundColor: "#3A2A1C", intensity: 0.65 },
  fill: { color: "#804828", intensity: 0.3, position: [-5, 4, -4] },
};

/**
 * WorkshopIsland
 * Loads the custom 3D low-poly island diorama created with AI (Meshy)
 * and positions it within our warm sunset dusk environment.
 */
const WorkshopIsland = ({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isRotating = false,
  currentStage = 1,
  onSelectZone = null,
  ...props
}) => {
  const rootGroupRef = useRef(null);
  const islandGroupRef = useRef(null);

  // Load the 3D glTF model generated via Meshy
  const { scene } = useGLTF(islandScene);

  const safeScaleValue = safeVector3(scale, [1, 1, 1]);
  const safePosValue = safeVector3(position, [0, 0, 0]);
  const safeRotValue = safeVector3(rotation, [0, 0, 0]);

  useFrame((state, delta) => {
    // Subtle breathing floating motion for the whole island
    if (islandGroupRef.current?.position) {
      const dt = delta || 0.016;
      const breathingSpeed = isRotating ? 1.6 : 0.8;
      const elapsedTime =
        (state?.clock?.elapsedTime ??
          (typeof state?.clock?.getElapsedTime === "function"
            ? state.clock.getElapsedTime()
            : 0)) * breathingSpeed;
      islandGroupRef.current.position.y = 0.45 + Math.sin(elapsedTime) * (0.04 * (dt * 60));
    }
  });

  return (
    <group
      ref={rootGroupRef}
      scale={safeScaleValue}
      position={safePosValue}
      rotation={safeRotValue}
      {...props}
    >
      {/* Warm Ambient & Sunset Directional Lighting */}
      <ambientLight color={DEFAULT_LIGHTING.ambient.color} intensity={DEFAULT_LIGHTING.ambient.intensity} />
      <directionalLight
        position={DEFAULT_LIGHTING.sun.position}
        color={DEFAULT_LIGHTING.sun.color}
        intensity={DEFAULT_LIGHTING.sun.intensity}
        castShadow={false}
      />
      <hemisphereLight
        args={[
          DEFAULT_LIGHTING.hemi.skyColor,
          DEFAULT_LIGHTING.hemi.groundColor,
          DEFAULT_LIGHTING.hemi.intensity,
        ]}
      />
      <directionalLight
        position={DEFAULT_LIGHTING.fill.position}
        color={DEFAULT_LIGHTING.fill.color}
        intensity={DEFAULT_LIGHTING.fill.intensity}
      />

      {/* Upward bounce light to illuminate dark rocks under the island */}
      <pointLight position={[0, -3, 0]} color="#C56B3B" intensity={1.5} distance={10} />

      {/* Main Island Model */}
      <group
        ref={islandGroupRef}
        position={[0, 0.45, 0]}
        onClick={() => {
          if (typeof onSelectZone === "function") {
            onSelectZone(currentStage);
          }
        }}
      >
        <primitive
          object={scene}
          scale={[2.2, 2.2, 2.2]}
          position={[0, 0, 0]}
        />
      </group>
    </group>
  );
};

WorkshopIsland.propTypes = {
  scale: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  position: PropTypes.arrayOf(PropTypes.number),
  rotation: PropTypes.arrayOf(PropTypes.number),
  isRotating: PropTypes.bool,
  currentStage: PropTypes.number,
  onSelectZone: PropTypes.func,
};

export default WorkshopIsland;

// Preload the GLB model for smooth loading
useGLTF.preload(islandScene);
