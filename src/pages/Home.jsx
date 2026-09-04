import { Suspense, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Loader from "../components/Loader";
import WorkshopIsland from "../models/WorkshopIsland";
import Homeinfo from "../components/Homeinfo";
import UltimatePlacementDevTools from "../components/UltimatePlacementDevTools";
import islandBg from "../assets/images/island-bg.png";

const ZONE_BUTTONS = [
  { stage: 1, name: "Awal", title: "Ringkasan Pulau" },
  { stage: 2, name: "Tentang", title: "Kabin Kerja" },
  { stage: 3, name: "Riset & Awards", title: "Observatorium" },
  { stage: 4, name: "Proyek & Lab", title: "Reaktor Mesin" },
  { stage: 5, name: "Kontak", title: "Mercusuar" },
];

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
      pos: [0, 2.2, 5.8],
      target: [0.15, 0.6, 0],
      islandRotY: 0,
      cardPos: [50, 76],
    },
    2: {
      pos: [-1.1, 1.4, 2.8],
      target: [0.5, 0.9, 0],
      islandRotY: 0.21,
      cardPos: [50, 74],
    },
    3: {
      pos: [-0.6, 1.9, 2.8],
      target: [-1.1, 1.3, 0],
      islandRotY: 0.71,
      cardPos: [50, 74],
    },
    4: {
      pos: [0.05, 1.5, 3.1],
      target: [1.6, 0.8, 0],
      islandRotY: -1.09,
      cardPos: [50, 74],
    },
    5: {
      pos: [1.0, 1.7, 3.4],
      target: [0.7, 1.0, 0],
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
  const [config, setConfig] = useState(INITIAL_CONFIG);
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
      {/* Universal Placement & Card DevTool */}
      <UltimatePlacementDevTools
        currentStage={currentStage}
        onSelectStage={handleZoneSelect}
        config={config}
        onUpdateConfig={setConfig}
        onResetConfig={() => setConfig(INITIAL_CONFIG)}
        defaultCollapsed={isMobile}
      />

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

      {/* Free-Placement Story Card (Positioned via 100% customizable X% and Y% coordinates) */}
      <div
        style={{
          left: `${cardPos[0]}%`,
          top: `${cardPos[1]}%`,
        }}
        className={`absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out w-[min(21rem,calc(100vw-2.5rem))] ${
          isCardVisible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90 pointer-events-none duration-200"
        }`}
      >
        <div className="pointer-events-auto w-full">
          {displayedStage && <Homeinfo currentStage={displayedStage} />}
        </div>
      </div>

      {/* Bottom Zone Navigator Dock */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3 pointer-events-auto">
        <nav
          aria-label="Navigasi zona pulau"
          className={`flex items-center gap-1 p-1.5 rounded-full border border-island-border/80 bg-island-dark/90 backdrop-blur-md shadow-2xl mx-auto ${
            isMobile
              ? "max-w-full overflow-x-auto no-scrollbar whitespace-nowrap"
              : "inline-flex flex-wrap justify-center gap-1.5 sm:gap-2 p-2"
          }`}
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
                className={`shrink-0 font-sans rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper ${
                  isMobile ? "px-3 py-1.5 text-[11px]" : "px-3.5 py-1.5 text-xs"
                } ${
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
