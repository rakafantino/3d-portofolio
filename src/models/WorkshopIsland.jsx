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
      <ambientLight color="#FFE3C2" intensity={1.2} />
      <directionalLight
        position={[6, 8, 4]}
        color="#FFC08A"
        intensity={2.8}
        castShadow={false}
      />
      <hemisphereLight args={["#E8B98A", "#3A2A1C", 0.9]} />
      <directionalLight
        position={[-5, 4, -4]}
        color="#6B4A33"
        intensity={0.8}
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
