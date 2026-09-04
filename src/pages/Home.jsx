import { Suspense, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Loader from "../components/Loader";
import WorkshopIsland from "../models/WorkshopIsland";
import Homeinfo from "../components/Homeinfo";
import PlacementDevTools from "../components/PlacementDevTools";
import islandBg from "../assets/images/island-bg.png";

const ZONE_BUTTONS = [
  { stage: 1, name: "Awal", title: "Ringkasan Pulau" },
  { stage: 2, name: "Tentang", title: "Kabin Kerja" },
  { stage: 3, name: "Riset & Awards", title: "Observatorium" },
  { stage: 4, name: "Proyek & Lab", title: "Reaktor Mesin" },
  { stage: 5, name: "Kontak", title: "Mercusuar" },
];

const DEFAULT_SCENE_CONFIG = {
  desktop: {
    islandScale: [1.2, 1.2, 1.2],
    fov: {
      1: 45,
      2: 45,
      3: 45,
      4: 45,
      5: 45,
    },
    zones: {
      1: {
        pos: [0, 1.7, 4.8],
        target: [0.15, 0.5, 0],
        islandRotY: 0,
        card: { vAlign: "bottom", hAlign: "center", offsetX: 0, offsetY: 0 },
      },
      2: {
        pos: [-1.3, 1.25, 2],
        target: [0.6, 0.95, 0],
        islandRotY: 0.21,
        card: { vAlign: "center", hAlign: "right", offsetX: 0, offsetY: 0 },
      },
      3: {
        pos: [-0.7, 1.8, 2],
        target: [-1.35, 1.4, 0],
        islandRotY: 0.71,
        card: { vAlign: "center", hAlign: "left", offsetX: 0, offsetY: 0 },
      },
      4: {
        pos: [0.05, 1.4, 2.55],
        target: [1.9, 0.75, 0],
        islandRotY: -1.09,
        card: { vAlign: "center", hAlign: "left", offsetX: 0, offsetY: 0 },
      },
      5: {
        pos: [1.15, 1.55, 2.8],
        target: [0.8, 1.05, 0],
        islandRotY: 0,
        card: { vAlign: "center", hAlign: "right", offsetX: 0, offsetY: 0 },
      },
    },
  },
  mobile: {
    islandScale: [0.72, 0.72, 0.72],
    fov: {
      1: 62,
      2: 62,
      3: 62,
      4: 62,
      5: 62,
    },
    zones: {
      1: {
        pos: [0, 1.7, 4.8],
        target: [0.15, 0.5, 0],
        islandRotY: 0,
        card: { vAlign: "bottom", hAlign: "center", offsetX: 0, offsetY: 0 },
      },
      2: {
        pos: [-1.3, 1.25, 2],
        target: [0.6, 0.95, 0],
        islandRotY: 0.21,
        card: { vAlign: "bottom", hAlign: "center", offsetX: 0, offsetY: 0 },
      },
      3: {
        pos: [-0.7, 1.8, 2],
        target: [-1.35, 1.4, 0],
        islandRotY: 0.71,
        card: { vAlign: "bottom", hAlign: "center", offsetX: 0, offsetY: 0 },
      },
      4: {
        pos: [0.05, 1.4, 2.55],
        target: [1.9, 0.75, 0],
        islandRotY: -1.09,
        card: { vAlign: "bottom", hAlign: "center", offsetX: 0, offsetY: 0 },
      },
      5: {
        pos: [1.15, 1.55, 2.8],
        target: [0.8, 1.05, 0],
        islandRotY: 0,
        card: { vAlign: "bottom", hAlign: "center", offsetX: 0, offsetY: 0 },
      },
    },
  },
};

const MOBILE_BREAKPOINT = 768;
const isBrowserMobile = () =>
  typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT;

const CameraRig = ({ stage, layout, onMovementStateChange }) => {
  const framing = layout.zones[stage] || layout.zones[1];
  const baseFov = layout.fov[stage] || 45;
  const currentPosRef = useRef(new THREE.Vector3(...framing.pos));
  const currentLookAtRef = useRef(new THREE.Vector3(...framing.target));
  const isMovingRef = useRef(false);
  const fovRef = useRef(baseFov);

  useFrame((state) => {
    const targetPos = new THREE.Vector3(...framing.pos);
    const targetLookAt = new THREE.Vector3(...framing.target);

    if (fovRef.current !== baseFov) {
      fovRef.current = baseFov;
      state.camera.fov = baseFov;
      state.camera.updateProjectionMatrix();
    }

    currentPosRef.current.lerp(targetPos, 0.06);
    currentLookAtRef.current.lerp(targetLookAt, 0.06);

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
  stage: PropTypes.number.isRequired,
  layout: PropTypes.object.isRequired,
  onMovementStateChange: PropTypes.func.isRequired,
};

const IslandWorldRig = ({ scale, stage, layout }) => {
  const groupRef = useRef(null);
  const currentAngleRef = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const framing = layout.zones[stage] || layout.zones[1];
    const targetAngle = framing.islandRotY;

    currentAngleRef.current += (targetAngle - currentAngleRef.current) * 0.06;
    groupRef.current.rotation.y = currentAngleRef.current;
  });

  return (
    <group ref={groupRef}>
      <WorkshopIsland scale={scale} currentStage={stage} />
    </group>
  );
};

IslandWorldRig.propTypes = {
  scale: PropTypes.arrayOf(PropTypes.number).isRequired,
  stage: PropTypes.number.isRequired,
  layout: PropTypes.object.isRequired,
};

const Home = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [displayedStage, setDisplayedStage] = useState(1);
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [layout, setLayout] = useState(DEFAULT_SCENE_CONFIG);
  const [isMobile, setIsMobile] = useState(isBrowserMobile);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleChange = () => setIsMobile(mq.matches);
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

  const activeLayout = layout[isMobile ? "mobile" : "desktop"];
  const activeZone = displayedStage;
  const framing = activeLayout.zones[activeZone] || activeLayout.zones[1];
  const card = framing.card;
  const isBottomCard = card.vAlign === "bottom";

  const cardPositionClass =
    isBottomCard || isMobile
      ? "items-end justify-center"
      : card.vAlign === "center" && card.hAlign === "center"
      ? "items-center justify-center"
      : "items-center";

  const cardHorizontalClass = isMobile || card.hAlign === "center"
      ? "justify-center"
      : card.hAlign === "left"
      ? "justify-start"
      : "justify-end";

  const cardPaddingClass = isBottomCard
    ? "pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-28 px-4"
    : card.hAlign === "left"
    ? "pl-4 sm:pl-8 md:pl-12 pr-8"
    : card.hAlign === "right"
    ? "pr-4 sm:pr-8 md:pr-12 pl-8"
    : "px-4";

  return (
    <section
      role="region"
      aria-label="workshop-island"
      style={{ backgroundImage: `url(${islandBg})` }}
      className="relative h-screen supports-[height:100dvh]:h-[100dvh] w-full overflow-hidden bg-cover bg-center bg-no-repeat bg-island-black select-none"
    >
      <PlacementDevTools
        config={layout}
        onUpdate={(device, nextDeviceConfig) =>
          setLayout((prev) => ({ ...prev, [device]: nextDeviceConfig }))
        }
        onReset={() => setLayout(DEFAULT_SCENE_CONFIG)}
      />

      <Canvas
        gl={{ alpha: true, antialias: true }}
        className="absolute inset-0 h-full w-full"
        camera={{
          position: framing.pos,
          fov: activeLayout.fov[activeZone] || 45,
          near: 0.1,
          far: 2000,
        }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.4} />

          <CameraRig
            stage={currentStage}
            layout={activeLayout}
            onMovementStateChange={handleMovementChange}
          />

          <IslandWorldRig
            scale={activeLayout.islandScale}
            stage={currentStage}
            layout={activeLayout}
          />
        </Suspense>
      </Canvas>

      <div
        className={`absolute inset-0 z-10 flex pointer-events-none transition-all duration-500 ease-out ${cardPositionClass} ${
          isCardVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-6 pointer-events-none duration-200"
        }`}
      >
        <div
          className={`w-full flex ${cardHorizontalClass} ${cardPaddingClass}`}
        >
          <div
            className="pointer-events-auto w-full max-w-[20rem] sm:max-w-sm"
            style={{
              transform: `translate(${card.offsetX || 0}px, ${card.offsetY || 0}px)`,
            }}
          >
            {displayedStage && <Homeinfo currentStage={displayedStage} />}
          </div>
        </div>
      </div>

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
