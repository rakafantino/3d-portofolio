import { Suspense, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Loader from "../components/Loader";
import WorkshopIsland from "../models/WorkshopIsland";
import Homeinfo from "../components/Homeinfo";
import MobileSmartDock from "../components/MobileSmartDock";
import islandBg from "../assets/images/island-bg.png";

const ZONE_NAMES = {
  1: "Diorama Pulau",
  2: "Kabin Kerja",
  3: "Observatorium",
  4: "Reaktor Mesin",
  5: "Mercusuar",
};

/**
 * Initial Preset Config for Desktop & Mobile
 * cardPos: [X%, Y%] allows 100% free-placement of the story card anywhere on screen.
 */
const INITIAL_CONFIG = {
  desktop: {
    1: {
      pos: [0, 1.7, 4.8],
      target: [0.15, 0.5, 0],
      islandRotY: 0,
      cardPos: [50, 78],
    },
    2: {
      pos: [-1.3, 1.25, 2],
      target: [0.6, 0.95, 0],
      islandRotY: 0.21,
      cardPos: [78, 48],
    },
    3: {
      pos: [-0.7, 1.8, 2],
      target: [-1.35, 1.4, 0],
      islandRotY: 0.71,
      cardPos: [24, 48],
    },
    4: {
      pos: [0.05, 1.4, 2.55],
      target: [1.9, 0.75, 0],
      islandRotY: -1.09,
      cardPos: [24, 48],
    },
    5: {
      pos: [1.15, 1.55, 2.8],
      target: [0.8, 1.05, 0],
      islandRotY: 0,
      cardPos: [78, 48],
    },
  },
  mobile: {
    1: {
      pos: [0, 2.2, 4.35],
      target: [-0.05, 0.6, 0],
      islandRotY: 0,
      cardPos: [50, 76],
    },
    2: {
      pos: [-1.2, 1.1, 1.85],
      target: [0.15, 0.9, 0],
      islandRotY: 0.21,
      cardPos: [50, 74],
    },
    3: {
      pos: [-0.65, 1.15, 1.5],
      target: [-0.9, 1, 0],
      islandRotY: 0.71,
      cardPos: [50, 74],
    },
    4: {
      pos: [0.05, 1, 2.15],
      target: [1.05, 0.8, 0],
      islandRotY: -1.09,
      cardPos: [50, 74],
    },
    5: {
      pos: [-0.15, 0.95, 1.8],
      target: [1.8, 0.5, 0],
      islandRotY: 0,
      cardPos: [50, 74],
    },
  },
};

const CameraRig = ({ currentStage, framings, onMovementStateChange, baseFov }) => {
  const currentPosRef = useRef(new THREE.Vector3(0, 1.7, 4.8));
  const currentLookAtRef = useRef(new THREE.Vector3(0.15, 0.5, 0));
  const isMovingRef = useRef(false);
  const baseFovRef = useRef(baseFov);

  useFrame((state) => {
    const framing = framings[currentStage] || framings[1];
    const targetPos = new THREE.Vector3(...framing.pos);
    const targetLookAt = new THREE.Vector3(...framing.target);

    if (baseFovRef.current !== baseFov) {
      baseFovRef.current = baseFov;
      state.camera.fov = baseFov;
      state.camera.updateProjectionMatrix();
    }

    currentPosRef.current.lerp(targetPos, 0.07);
    currentLookAtRef.current.lerp(targetLookAt, 0.07);

    state.camera.position.copy(currentPosRef.current);
    state.camera.lookAt(currentLookAtRef.current);

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
  framings: PropTypes.object.isRequired,
  onMovementStateChange: PropTypes.func.isRequired,
  baseFov: PropTypes.number,
};

const IslandWorldRig = ({ scale, currentStage, framings }) => {
  const groupRef = useRef(null);
  const currentAngleRef = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const framing = framings[currentStage] || framings[1];
    const targetAngle = framing.islandRotY;

    currentAngleRef.current += (targetAngle - currentAngleRef.current) * 0.07;
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
  framings: PropTypes.object.isRequired,
};

const MOBILE_BREAKPOINT = 768;
const isBrowserMobile = () =>
  typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

const Home = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [displayedStage, setDisplayedStage] = useState(1);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const config = INITIAL_CONFIG;
  const [isMobile, setIsMobile] = useState(isBrowserMobile);
  const [islandScale, setIslandScale] = useState(() =>
    isBrowserMobile() ? [0.72, 0.72, 0.72] : [1.2, 1.2, 1.2]
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleChange = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      setIslandScale(mobile ? [0.72, 0.72, 0.72] : [1.2, 1.2, 1.2]);
    };

    handleChange();
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
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
    window.setTimeout(() => {
      setDisplayedStage(stageNum);
      setIsCardVisible(true);
    }, 350);
  };

  const handlePrevZone = () => {
    const prev = currentStage === 1 ? 5 : currentStage - 1;
    handleZoneSelect(prev);
  };

  const handleNextZone = () => {
    const next = currentStage === 5 ? 1 : currentStage + 1;
    handleZoneSelect(next);
  };

  const currentDeviceFramings = isMobile ? config.mobile : config.desktop;
  const activeFraming = currentDeviceFramings[displayedStage] || currentDeviceFramings[1];
  const cardPos = activeFraming.cardPos || [50, 76];

  return (
    <section
      role="region"
      aria-label="workshop-island"
      style={{ backgroundImage: `url(${islandBg})` }}
      className="relative h-screen supports-[height:100dvh]:h-[100dvh] w-full overflow-hidden bg-cover bg-center bg-no-repeat bg-island-black select-none"
    >
      {/* R3F 3D Island Canvas */}
      <Canvas
        gl={{ alpha: true, antialias: true }}
        className="absolute inset-0 h-full w-full"
        camera={{ position: [0, 1.7, 4.8], fov: isMobile ? 62 : 45, near: 0.1, far: 2000 }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.4} />

          <CameraRig
            currentStage={currentStage}
            framings={currentDeviceFramings}
            onMovementStateChange={handleMovementChange}
            baseFov={isMobile ? 62 : 45}
          />

          <IslandWorldRig
            scale={islandScale}
            currentStage={currentStage}
            framings={currentDeviceFramings}
          />
        </Suspense>
      </Canvas>

      {/* Mobile: Ultra-compact Unified Smart Dock (Uses <12% screen, 90% view remains clean) */}
      <MobileSmartDock
        currentStage={currentStage}
        onSelectStage={handleZoneSelect}
        isCameraMoving={isCardVisible === false}
      />

      {/* Desktop: Free-Placement Story Card */}
      <div
        style={{
          left: `${cardPos[0]}%`,
          top: `${cardPos[1]}%`,
        }}
        className={`hidden md:block absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out w-[min(21rem,calc(100vw-2.5rem))] ${
          isCardVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none duration-200"
        }`}
      >
        <div className="pointer-events-auto w-full">
          {displayedStage && <Homeinfo currentStage={displayedStage} />}
        </div>
      </div>

      {/* Desktop: Carousel Exploration Controls (Previous / Next) */}
      <div className="hidden md:flex absolute bottom-0 left-0 right-0 z-20 pb-[max(1rem,env(safe-area-inset-bottom))] px-3 pointer-events-auto justify-center">
        <nav
          aria-label="Navigasi zona pulau"
          className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-island-border/80 bg-island-dark/90 backdrop-blur-md shadow-2xl mx-auto select-none"
        >
          <button
            type="button"
            onClick={handlePrevZone}
            aria-label="Zona Sebelumnya"
            className="flex items-center gap-1 px-3 py-1 text-xs font-sans text-cream/70 hover:text-cream hover:bg-island-border/40 rounded-full transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper"
          >
            <span aria-hidden="true">←</span>
            <span>Sebelumnya</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-black/40 border border-island-border/40 font-mono text-xs">
            <span className="text-copper font-bold">{`0${currentStage}`}</span>
            <span className="text-cream/30">/</span>
            <span className="text-cream/60">05</span>
            <span className="text-island-border/80">·</span>
            <span className="font-serif text-cream font-medium">{ZONE_NAMES[currentStage]}</span>
          </div>

          <button
            type="button"
            onClick={handleNextZone}
            aria-label="Zona Selanjutnya"
            className="flex items-center gap-1 px-3 py-1 text-xs font-sans text-cream/70 hover:text-cream hover:bg-island-border/40 rounded-full transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper"
          >
            <span>Selanjutnya</span>
            <span aria-hidden="true">→</span>
          </button>
        </nav>
      </div>
    </section>
  );
};

export default Home;
