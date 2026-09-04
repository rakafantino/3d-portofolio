import { Suspense, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Loader from "../components/Loader";
import WorkshopIsland from "../models/WorkshopIsland";
import Homeinfo from "../components/Homeinfo";
import islandBg from "../assets/images/island-bg.png";

const ZONE_BUTTONS = [
  { stage: 1, name: "Awal", title: "Ringkasan Pulau" },
  { stage: 2, name: "AI & Awards", title: "Menara Observatorium" },
  { stage: 3, name: "Web3 & Kripto", title: "Reaktor & Tangki" },
  { stage: 4, name: "Fullstack", title: "Bengkel Kayu" },
  { stage: 5, name: "Kontak", title: "Mercusuar" },
];

/**
 * Camera Framings calibrated via interactive development tool.
 * Provides asymmetric rule-of-thirds framing with 0% card overlap.
 */
const CAMERA_FRAMINGS = {
  1: {
    pos: [0, 1.7, 4.8],
    target: [0.15, 0.5, 0],
    islandRotY: 0,
    cardAlignment: "center",
  },
  2: {
    pos: [-0.7, 1.8, 2],
    target: [-1.35, 1.4, 0],
    islandRotY: 0.71,
    cardAlignment: "right",
  },
  3: {
    pos: [1.15, 1.55, 2.8],
    target: [0.8, 1.05, 0],
    islandRotY: 0,
    cardAlignment: "left",
  },
  4: {
    pos: [-1.3, 1.25, 2],
    target: [0.6, 0.95, 0],
    islandRotY: 0.21,
    cardAlignment: "right",
  },
  5: {
    pos: [0.05, 1.4, 2.55],
    target: [1.9, 0.75, 0],
    islandRotY: -1.09,
    cardAlignment: "left",
  },
};

/**
 * CameraRig
 * Smoothly lerps camera position and target lookAt toward active zone framing.
 */
const CameraRig = ({ currentStage, onMovementStateChange }) => {
  const currentPosRef = useRef(new THREE.Vector3(0, 1.7, 4.8));
  const currentLookAtRef = useRef(new THREE.Vector3(0.15, 0.5, 0));
  const isMovingRef = useRef(false);

  useFrame((state) => {
    const framing = CAMERA_FRAMINGS[currentStage] || CAMERA_FRAMINGS[1];
    const targetPos = new THREE.Vector3(...framing.pos);
    const targetLookAt = new THREE.Vector3(...framing.target);

    // Smooth cinematic lerp
    currentPosRef.current.lerp(targetPos, 0.06);
    currentLookAtRef.current.lerp(targetLookAt, 0.06);

    state.camera.position.copy(currentPosRef.current);
    state.camera.lookAt(currentLookAtRef.current);

    // Detect if camera is still traveling
    const dist = currentPosRef.current.distanceTo(targetPos);
    const moving = dist > 0.04;

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
  const currentAngleRef = useRef(0);

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
      style={{ backgroundImage: `url(${islandBg})` }}
      className="relative h-[100dvh] w-full overflow-hidden bg-cover bg-center bg-no-repeat bg-island-black select-none"
    >
      {/* R3F 3D Island Canvas */}
      <Canvas
        gl={{ alpha: true, antialias: true }}
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 1.7, 4.8], fov: 45, near: 0.1, far: 2000 }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.4} />

          <CameraRig
            currentStage={currentStage}
            onMovementStateChange={handleMovementChange}
          />

          <IslandWorldRig
            scale={islandScale}
            currentStage={currentStage}
          />
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
              ? "justify-start pl-4 sm:pl-8 md:pl-12"
              : cardAlignment === "right"
              ? "justify-end pr-4 sm:pr-8 md:pr-12"
              : "justify-center"
          }`}
        >
          <div className="pointer-events-auto max-w-[18.5rem] sm:max-w-sm w-full">
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
