import { Suspense, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";
import Loader from "../components/Loader";
import WorkshopIsland from "../models/WorkshopIsland";
import Homeinfo from "../components/Homeinfo";
import MobileSmartDock from "../components/MobileSmartDock";
import islandBg from "../assets/images/island-bg.png";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "../context/LanguageToggle";
import AudioController from "../components/AudioController";
import SplashGate from "../components/SplashGate";
import GuidedTour from "../components/GuidedTour";
import { getSharedAudioEngine } from "../core/audioEngine";

export const SPLASH_STORAGE_KEY = "visited_island_gate";
export const TOUR_STORAGE_KEY = "has_seen_island_tour";
export const LAST_ZONE_KEY = "last_visited_island_zone";
export const PROLOGUE_SEEN_KEY = "has_dismissed_island_prologue";

const SKY_DIVE_FRAMING = {
  pos: [0, 9.5, 14],
  target: [0, 1.5, 0],
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
      cardPos: [50, 66],
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

const CameraRig = ({
  currentStage,
  framings,
  onMovementStateChange,
  baseFov,
  showGate,
  isDiving,
  onDiveComplete,
}) => {
  const currentPosRef = useRef(
    showGate
      ? new THREE.Vector3(...SKY_DIVE_FRAMING.pos)
      : new THREE.Vector3(0, 1.7, 4.8)
  );
  const currentLookAtRef = useRef(
    showGate
      ? new THREE.Vector3(...SKY_DIVE_FRAMING.target)
      : new THREE.Vector3(0.15, 0.5, 0)
  );
  const isMovingRef = useRef(false);
  const baseFovRef = useRef(baseFov);
  const diveProgressRef = useRef(0);
  const startPosRef = useRef(new THREE.Vector3(...SKY_DIVE_FRAMING.pos));
  const startLookAtRef = useRef(new THREE.Vector3(...SKY_DIVE_FRAMING.target));

  useFrame((state, delta) => {
    const framing = framings[currentStage] || framings[1];
    const targetPos = new THREE.Vector3(...framing.pos);
    const targetLookAt = new THREE.Vector3(...framing.target);

    if (baseFovRef.current !== baseFov) {
      baseFovRef.current = baseFov;
      state.camera.fov = baseFov;
      state.camera.updateProjectionMatrix();
    }

    if (showGate && !isDiving) {
      state.camera.position.copy(startPosRef.current);
      state.camera.lookAt(startLookAtRef.current);
      return;
    }

    if (isDiving) {
      diveProgressRef.current = Math.min(1, diveProgressRef.current + delta * 0.45);
      const t = diveProgressRef.current;
      const smoothT = t * t * (3 - 2 * t);

      currentPosRef.current.lerpVectors(startPosRef.current, targetPos, smoothT);
      currentLookAtRef.current.lerpVectors(startLookAtRef.current, targetLookAt, smoothT);

      state.camera.position.copy(currentPosRef.current);
      state.camera.lookAt(currentLookAtRef.current);

      if (t >= 1) {
        if (typeof onDiveComplete === "function") {
          onDiveComplete();
        }
      }
      return;
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
  isDiving: PropTypes.bool,
  onDiveComplete: PropTypes.func,
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

const shouldOpenStageCard = (stage) => {
  if (stage > 1) return true;
  const hasDismissed =
    typeof window !== "undefined" &&
    sessionStorage.getItem(PROLOGUE_SEEN_KEY) === "true";
  return !hasDismissed;
};

const Home = () => {
  const { t } = useLanguage();

  const initialStage = () => {
    if (typeof window === "undefined") return 1;
    try {
      const saved = sessionStorage.getItem(LAST_ZONE_KEY);
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) {
        return parsed;
      }
      return 1;
    } catch {
      return 1;
    }
  };

  const [currentStage, setCurrentStage] = useState(initialStage);
  const [displayedStage, setDisplayedStage] = useState(initialStage);
  const [cardIsOpen, setCardIsOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const isGateOpen = sessionStorage.getItem(SPLASH_STORAGE_KEY) === "true";
      if (!isGateOpen) return false;
      const initial = initialStage();
      return shouldOpenStageCard(initial);
    } catch {
      return false;
    }
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pendingStageRef = useRef(null);
  const transitionTimerRef = useRef(null);

  const config = INITIAL_CONFIG;
  const [isMobile, setIsMobile] = useState(isBrowserMobile);
  const [islandScale, setIslandScale] = useState(() =>
    isBrowserMobile() ? [0.72, 0.72, 0.72] : [1.2, 1.2, 1.2]
  );
  const [showGate, setShowGate] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(SPLASH_STORAGE_KEY) !== "true";
    } catch {
      return false;
    }
  });

  const [isDiving, setIsDiving] = useState(false);
  const [cloudDissolve, setCloudDissolve] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);

  const handleStartTour = () => {
    setIsTourActive(true);
  };

  const handleTourClose = () => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    } catch {
      void 0;
    }
    setIsTourActive(false);
  };

  const handleTourComplete = () => {
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
      sessionStorage.setItem(PROLOGUE_SEEN_KEY, "true");
      sessionStorage.setItem(LAST_ZONE_KEY, "2");
    } catch {
      void 0;
    }

    setIsTourActive(false);
    setCardIsOpen(false);

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    pendingStageRef.current = 2;
    setIsTransitioning(true);

    transitionTimerRef.current = setTimeout(() => {
      setDisplayedStage(null);
      setCurrentStage(2);
      transitionTimerRef.current = setTimeout(() => {
        setDisplayedStage(2);
        pendingStageRef.current = null;
        setIsTransitioning(false);
        setCardIsOpen(true);
      }, 350);
    }, 450);
  };

  const handleEnterIsland = () => {
    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
    } catch {
      void 0;
    }
    const engine = getSharedAudioEngine();
    engine.play();
    setShowGate(false);
    setIsDiving(true);
    setTimeout(() => {
      setCloudDissolve(true);
    }, 900);
  };

  const handleDiveComplete = () => {
    setIsDiving(false);
    setDisplayedStage(1);
    setCardIsOpen(shouldOpenStageCard(1));
  };

  useEffect(() => {
    if (!showGate) {
      const revealTimer = setTimeout(() => {
        setCardIsOpen(shouldOpenStageCard(currentStage));
      }, 300);
      return () => clearTimeout(revealTimer);
    }
  }, [showGate, currentStage]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

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
    if (!isMoving && isTransitioning) {
      const target = pendingStageRef.current !== null ? pendingStageRef.current : currentStage;
      pendingStageRef.current = null;
      setDisplayedStage(target);
      setIsTransitioning(false);
      setCardIsOpen(shouldOpenStageCard(target));
    }
  };

  const handleZoneSelect = (stageNum) => {
    if (stageNum === currentStage) return;

    try {
      sessionStorage.setItem(LAST_ZONE_KEY, String(stageNum));
    } catch {
      void 0;
    }

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    pendingStageRef.current = stageNum;
    setIsTransitioning(true);

    const rollUpDelay = cardIsOpen ? 450 : 0;
    setCardIsOpen(false);

    transitionTimerRef.current = setTimeout(() => {
      setDisplayedStage(null);
      setCurrentStage(stageNum);
      transitionTimerRef.current = setTimeout(() => {
        try {
          sessionStorage.setItem(PROLOGUE_SEEN_KEY, "true");
        } catch {
          void 0;
        }
        setDisplayedStage(stageNum);
        pendingStageRef.current = null;
        setIsTransitioning(false);
        setCardIsOpen(shouldOpenStageCard(stageNum));
      }, 350);
    }, rollUpDelay);
  };

  const handleCardRollComplete = (openState) => {
    if (openState === false && isTransitioning && pendingStageRef.current !== null) {
      const target = pendingStageRef.current;
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
      setDisplayedStage(null);
      setCurrentStage(target);
      transitionTimerRef.current = setTimeout(() => {
        try {
          sessionStorage.setItem(PROLOGUE_SEEN_KEY, "true");
        } catch {
          void 0;
        }
        setDisplayedStage(target);
        pendingStageRef.current = null;
        setIsTransitioning(false);
        setCardIsOpen(shouldOpenStageCard(target));
      }, 350);
    }
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
      data-tour-target="island-diorama"
      style={{ backgroundImage: `url(${islandBg})` }}
      className="relative h-screen supports-[height:100dvh]:h-[100dvh] w-full overflow-hidden bg-cover bg-center bg-no-repeat bg-island-black select-none"
    >
      {/* R3F 3D Island Canvas */}
      <Canvas
        gl={{ alpha: true, antialias: true }}
        className="absolute inset-0 h-full w-full"
        camera={{
          position: showGate ? SKY_DIVE_FRAMING.pos : [0, 1.7, 4.8],
          fov: isMobile ? 62 : 45,
          near: 0.1,
          far: 2000,
        }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.4} />

          <CameraRig
            currentStage={currentStage}
            framings={currentDeviceFramings}
            onMovementStateChange={handleMovementChange}
            baseFov={isMobile ? 62 : 45}
            showGate={showGate}
            isDiving={isDiving}
            onDiveComplete={handleDiveComplete}
          />

          <IslandWorldRig
            scale={islandScale}
            currentStage={currentStage}
            framings={currentDeviceFramings}
          />

          <Clouds texture="/cloud.png" material={THREE.MeshBasicMaterial} limit={400}>
            <Cloud
              position={[0, 4.0, 4.5]}
              segments={32}
              bounds={[26, 7, 10]}
              volume={24}
              color="#FF8E4D"
              fade={30}
              speed={0.25}
              growth={6}
              opacity={cloudDissolve ? 0 : 0.98}
            />
            <Cloud
              position={[0, 7.5, 9.5]}
              segments={28}
              bounds={[22, 6, 8]}
              volume={20}
              color="#FFAF68"
              fade={32}
              speed={0.3}
              growth={5}
              opacity={cloudDissolve ? 0.02 : 0.95}
            />
            <Cloud
              position={[-4, 1.5, 3]}
              segments={16}
              bounds={[14, 3, 5]}
              volume={12}
              color="#E8834A"
              fade={20}
              speed={0.15}
              opacity={cloudDissolve ? 0.2 : 0.85}
            />
            <Cloud
              position={[4.5, 2.0, 2.5]}
              segments={16}
              bounds={[14, 3, 5]}
              volume={12}
              color="#D96E32"
              fade={20}
              speed={0.15}
              opacity={cloudDissolve ? 0.2 : 0.85}
            />
          </Clouds>
        </Suspense>
      </Canvas>

      {/* Top-Right Forged Brass Mariner's Compass Badge Housing */}
      <div
        data-tour-target="brass-compass"
        className={`absolute top-3 right-3 sm:top-6 sm:right-6 z-40 transition-opacity duration-1000 ease-out ${
          showGate ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        }`}
      >
        <div
          className="relative inline-flex items-center gap-2.5 px-3 py-1.5 filter drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] transition-all select-none"
          style={{
            background: "radial-gradient(ellipse at 50% 30%, #51381E 0%, #3A2514 50%, #201309 85%, #140C06 100%)",
            border: "1.5px solid #9E7A43",
            borderRadius: "4px",
            boxShadow:
              "inset 0 1px 1.5px rgba(255,215,140,0.4), inset 0 -2px 3px rgba(0,0,0,0.9), 0 0 14px rgba(184,135,70,0.25)",
          }}
        >
          {/* Decorative Corner Rivets */}
          <span
            aria-hidden="true"
            className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_2px_rgba(0,0,0,0.9),inset_0_0.5px_0.5px_rgba(255,255,255,0.8)] border border-[#78531E]"
          />
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_2px_rgba(0,0,0,0.9),inset_0_0.5px_0.5px_rgba(255,255,255,0.8)] border border-[#78531E]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_2px_rgba(0,0,0,0.9),inset_0_0.5px_0.5px_rgba(255,255,255,0.8)] border border-[#78531E]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#E6C687] shadow-[0_0_2px_rgba(0,0,0,0.9),inset_0_0.5px_0.5px_rgba(255,255,255,0.8)] border border-[#78531E]"
          />

          {/* Inner Azimuth Inset Rim */}
          <span
            aria-hidden="true"
            className="absolute inset-[3px] border border-[#B88746]/25 rounded-[2px] pointer-events-none"
          />

          <LanguageToggle variant="island" />

          <div
            className="h-4 w-px bg-gradient-to-b from-transparent via-[#B88746]/60 to-transparent"
            aria-hidden="true"
          />

          <AudioController variant="brass" />
        </div>
      </div>

      {/* Desktop & Mobile Card Containers - Only mount once gate is closed and camera dive completes */}
      {!showGate && !isDiving && (
        isMobile ? (
          <div
            key={`mobile-card-${displayedStage}`}
            className="md:hidden absolute top-[4.2rem] sm:top-20 left-4 right-4 z-20 pointer-events-auto max-w-sm mx-auto"
          >
            {displayedStage && (displayedStage > 1 || (shouldOpenStageCard(1) && (cardIsOpen || isTransitioning))) && (
              <Homeinfo
                currentStage={displayedStage}
                isOpen={cardIsOpen}
                onRollComplete={handleCardRollComplete}
                onStartTour={handleStartTour}
              />
            )}
          </div>
        ) : (
          <div
            key={`desktop-card-${displayedStage}`}
            style={{
              left: `${cardPos[0]}%`,
              top: `${cardPos[1]}%`,
            }}
            className="hidden md:block absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-[min(22rem,calc(100vw-2.5rem))]"
          >
            <div className="pointer-events-auto w-full">
              {displayedStage && (displayedStage > 1 || (shouldOpenStageCard(1) && (cardIsOpen || isTransitioning))) && (
                <Homeinfo
                  currentStage={displayedStage}
                  isOpen={cardIsOpen}
                  onRollComplete={handleCardRollComplete}
                  onStartTour={handleStartTour}
                />
              )}
            </div>
          </div>
        )
      )}

      <MobileSmartDock
        currentStage={currentStage}
        onSelectStage={handleZoneSelect}
        isCameraMoving={isTransitioning || !cardIsOpen}
        isVisible={!showGate}
      />

      {/* Desktop: Antique Astrolabe Carousel Navigation */}
      <div
        className={`hidden md:flex absolute bottom-0 left-0 right-0 z-20 pb-[max(1.2rem,env(safe-area-inset-bottom))] px-3 justify-center transition-opacity duration-1000 ease-out ${
          showGate ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
        }`}
      >
        <nav
          aria-label={t("desktopNavAria")}
          data-tour-target="astrolabe-nav"
          className="relative inline-flex items-center gap-3.5 px-4 py-2 filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.92)] mx-auto select-none"
          style={{
            background: "linear-gradient(180deg, #3A2514 0%, #201309 60%, #140C06 100%)",
            borderTop: "2px solid #B88746",
            borderBottom: "2px solid #51381E",
            borderLeft: "2px solid #78531E",
            borderRight: "2px solid #78531E",
            borderRadius: "6px",
            boxShadow:
              "inset 0 1.5px 2px rgba(230,198,135,0.45), inset 0 -2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(184,135,70,0.28)",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute -top-1 -left-1 w-3 h-3 rounded-sm bg-[#B88746] border border-[#51381E] shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.6)]"
          />
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 w-3 h-3 rounded-sm bg-[#B88746] border border-[#51381E] shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.6)]"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-1 -left-1 w-3 h-3 rounded-sm bg-[#B88746] border border-[#51381E] shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.6)]"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-1 -right-1 w-3 h-3 rounded-sm bg-[#B88746] border border-[#51381E] shadow-[0_1px_2px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.6)]"
          />

          <button
            type="button"
            onClick={handlePrevZone}
            aria-label={t("zonePrevAria")}
            title={t("zonePrevAria")}
            className="group relative flex items-center justify-center w-8 h-8 rounded-sm text-[#D4B688] hover:text-[#FFE3A8] active:text-[#FFDF9E] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88746] active:scale-95"
            style={{
              background: "radial-gradient(circle at 35% 30%, #51381E 0%, #3A2514 50%, #1D1208 100%)",
              border: "1px solid #9E7A43",
              boxShadow: "inset 0 1px 1px rgba(255,215,140,0.35), 0 1px 3px rgba(0,0,0,0.7)",
            }}
          >
            <span
              aria-hidden="true"
              className="font-serif font-extrabold text-lg leading-none transition-transform group-hover:-translate-x-0.5 text-[#B88746] group-hover:text-[#E6C687] select-none"
            >
              ‹
            </span>
          </button>

          <div
            className="relative flex items-center gap-2 px-4 py-1 rounded-[3px] font-mono text-xs tracking-widest shadow-inner select-none"
            style={{
              background: "linear-gradient(180deg, #241407 0%, #150B04 100%)",
              border: "1px solid #8C6A43",
              boxShadow: "inset 0 1.5px 3px rgba(0,0,0,0.95), 0 1px 0 rgba(255,215,140,0.15)",
            }}
          >
            <span
              aria-hidden="true"
              className="absolute top-1 left-1 w-1 h-1 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
            />
            <span
              aria-hidden="true"
              className="absolute top-1 right-1 w-1 h-1 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-[#E6C687] shadow-[0_0_1px_rgba(0,0,0,0.9)]"
            />

            <span className="text-[#E6C687] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{`0${currentStage}`}</span>
            <span className="text-[#947247]/60 font-semibold">/</span>
            <span className="text-[#C2A378] font-medium">05</span>
          </div>

          <button
            type="button"
            onClick={handleNextZone}
            aria-label={t("zoneNextAria")}
            title={t("zoneNextAria")}
            className="group relative flex items-center justify-center w-8 h-8 rounded-sm text-[#D4B688] hover:text-[#FFE3A8] active:text-[#FFDF9E] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B88746] active:scale-95"
            style={{
              background: "radial-gradient(circle at 35% 30%, #51381E 0%, #3A2514 50%, #1D1208 100%)",
              border: "1px solid #9E7A43",
              boxShadow: "inset 0 1px 1px rgba(255,215,140,0.35), 0 1px 3px rgba(0,0,0,0.7)",
            }}
          >
            <span
              aria-hidden="true"
              className="font-serif font-extrabold text-lg leading-none transition-transform group-hover:translate-x-0.5 text-[#B88746] group-hover:text-[#E6C687] select-none"
            >
              ›
            </span>
          </button>
        </nav>
      </div>

      {isTourActive && (
        <GuidedTour
          isOpen={isTourActive}
          onClose={handleTourClose}
          onComplete={handleTourComplete}
        />
      )}

      {showGate && <SplashGate onEnter={handleEnterIsland} />}
    </section>
  );
};

export default Home;
