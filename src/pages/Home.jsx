import { Suspense, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Loader from "../components/Loader";
import WorkshopIsland from "../models/WorkshopIsland";
import Homeinfo from "../components/Homeinfo";
import { STAGE_CENTERS } from "../core/stageCalculator";

const ZONE_BUTTONS = [
  { stage: 1, name: "Awal", title: "Ringkasan Pulau" },
  { stage: 2, name: "AI & Awards", title: "Menara Observatorium" },
  { stage: 3, name: "Web3 & Kripto", title: "Reaktor & Tangki" },
  { stage: 4, name: "Fullstack", title: "Bengkel Kayu" },
  { stage: 5, name: "Kontak", title: "Mercusuar" },
];

/**
 * Camera Framings with Asymmetric Rule of Thirds:
 * Zooms in tight on the target landmark and offsets it to one side,
 * leaving intentional negative space on the opposite side for the card.
 */
const CAMERA_FRAMINGS = {
  1: {
    pos: [0, 2.9, 6.2],
    target: [0, 0.2, 0],
    islandRotY: 0,
    cardAlignment: "center",
  },
  2: {
    pos: [1.2, 1.8, 3.2],
    target: [0.6, 0.85, 0],
    islandRotY: -0.65,
    cardAlignment: "right",
  },
  3: {
    pos: [-1.2, 1.7, 3.2],
    target: [-0.6, 0.7, 0],
    islandRotY: 0.85,
    cardAlignment: "left",
  },
  4: {
    pos: [1.1, 1.4, 2.9],
    target: [0.5, 0.45, 0],
    islandRotY: 0,
    cardAlignment: "right",
  },
  5: {
    pos: [-1.2, 1.6, 3.1],
    target: [-0.6, 0.65, 0],
    islandRotY: 0.35,
    cardAlignment: "left",
  },
};

/**
 * CameraRig
 * Smoothly lerps camera position and target lookAt.
 */
const CameraRig = ({ currentStage, onMovementStateChange }) => {
  const currentPosRef = useRef(new THREE.Vector3(0, 3.8, 8.2));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0));
  const isMovingRef = useRef(false);

  useFrame((state) => {
    const framing = CAMERA_FRAMINGS[currentStage] || CAMERA_FRAMINGS[1];
    const targetPos = new THREE.Vector3(...framing.pos);
    const targetLookAt = new THREE.Vector3(...framing.target);

    // Smooth cinematic lerp
    currentPosRef.current.lerp(targetPos, 0.05);
    currentLookAtRef.current.lerp(targetLookAt, 0.05);

    state.camera.position.copy(currentPosRef.current);
    state.camera.lookAt(currentLookAtRef.current);

    // Detect if camera is still traveling
    const dist = currentPosRef.current.distanceTo(targetPos);
    const moving = dist > 0.05;

    if (moving !== isMovingRef.current) {
      isMovingRef.current = moving;
      onMovementStateChange(moving);
    }
  });

  return null;
};

CameraRig.propTypes = {
  currentStage: PropTypes.number.isRequired,
  onMovementStateChange: PropTypes.func.isRequired,
};

/**
 * IslandWorldRig
 * Holds WorkshopIsland and smoothly rotates it toward the active zone angle.
 */
const IslandWorldRig = ({ scale, currentStage }) => {
  const groupRef = useRef(null);
  const currentAngleRef = useRef(STAGE_CENTERS[1]);

  useFrame(() => {
    if (!groupRef.current) return;
    const framing = CAMERA_FRAMINGS[currentStage] || CAMERA_FRAMINGS[1];
    const targetAngle = framing.islandRotY;

    // Smooth lerp rotation toward target
    currentAngleRef.current += (targetAngle - currentAngleRef.current) * 0.06;
    groupRef.current.rotation.y = currentAngleRef.current;
  });

  return (
    <group ref={groupRef}>
      <WorkshopIsland scale={scale} currentStage={currentStage} />
    </group>
  );
};

IslandWorldRig.propTypes = {
  scale: PropTypes.arrayOf(PropTypes.number).isRequired,
  currentStage: PropTypes.number.isRequired,
};

const Home = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [displayedStage, setDisplayedStage] = useState(1);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [islandScale, setIslandScale] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return [0.9, 0.9, 0.9];
    }
    return [1.2, 1.2, 1.2];
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIslandScale([0.9, 0.9, 0.9]);
      } else {
        setIslandScale([1.2, 1.2, 1.2]);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMovementChange = (isMoving) => {
    if (isMoving) {
      setIsCardVisible(false);
    } else {
      setDisplayedStage(currentStage);
      setIsCardVisible(true);
    }
  };

  const handleZoneSelect = (stageNum) => {
    if (stageNum === currentStage) return;
    setIsCardVisible(false);
    setCurrentStage(stageNum);
    setTimeout(() => {
      setDisplayedStage(stageNum);
      setIsCardVisible(true);
    }, 350);
  };

  const activeFraming = CAMERA_FRAMINGS[displayedStage] || CAMERA_FRAMINGS[1];
  const cardAlignment = activeFraming.cardAlignment;

  return (
    <section
      role="region"
      aria-label="workshop-island"
      className="relative h-[100dvh] w-full overflow-hidden bg-island-black select-none"
    >
      {/* R3F 3D Island Canvas */}
      <Canvas
        gl={{ alpha: false, antialias: true }}
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 3.8, 8.2], fov: 45, near: 0.1, far: 2000 }}
      >
        <Suspense fallback={<Loader />}>
          <color attach="background" args={["#4A3421"]} />
          <fog attach="fog" args={["#4A3421", 18, 46]} />

          <CameraRig
            currentStage={currentStage}
            onMovementStateChange={handleMovementChange}
          />

          <IslandWorldRig scale={islandScale} currentStage={currentStage} />
        </Suspense>
      </Canvas>

      <div
        className={`absolute inset-0 z-10 flex pointer-events-none transition-all duration-500 ease-out ${
          cardAlignment === "center"
            ? "items-end justify-center pb-24 sm:pb-28"
            : "items-center"
        } ${
          isCardVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-6 pointer-events-none duration-200"
        }`}
      >
        <div
          className={`w-full flex ${
            cardAlignment === "left"
              ? "justify-start pl-6 sm:pl-10 md:pl-16"
              : cardAlignment === "right"
              ? "justify-end pr-6 sm:pr-10 md:pr-16"
              : "justify-center"
          }`}
        >
          <div className="pointer-events-auto max-w-sm w-full">
            {displayedStage && <Homeinfo currentStage={displayedStage} />}
          </div>
        </div>
      </div>

      {/* Bottom Zone Navigator Dock */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-20 flex justify-center px-4 pointer-events-auto">
        <nav
          aria-label="Navigasi zona pulau"
          className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-2 rounded-full border border-island-border/80 bg-island-dark/90 backdrop-blur-md shadow-2xl max-w-full"
        >
          {ZONE_BUTTONS.map((btn) => {
            const isActive = currentStage === btn.stage;
            return (
              <button
                key={btn.stage}
                type="button"
                onClick={() => handleZoneSelect(btn.stage)}
                aria-current={isActive ? "step" : undefined}
                title={btn.title}
                className={`px-3.5 py-1.5 text-xs font-sans rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper ${
                  isActive
                    ? "bg-copper text-cream font-medium shadow-md shadow-black/30"
                    : "text-cream/65 hover:text-cream hover:bg-island-border/40"
                }`}
              >
                {btn.name}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
};

export default Home;
