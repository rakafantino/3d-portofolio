import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import Loader from "../components/Loader";
import WorkshopIsland from "../models/WorkshopIsland";
import Homeinfo from "../components/Homeinfo";
import { STAGE_CENTERS, getStageFromAngle } from "../core/stageCalculator";

const ZONE_BUTTONS = [
  { stage: 1, name: "Awal", title: "Zona A: Masuk" },
  { stage: 2, name: "AI & Awards", title: "Zona B: Observatorium" },
  { stage: 3, name: "Web3 & Kripto", title: "Zona C: Reaktor" },
  { stage: 4, name: "Fullstack", title: "Zona D: Bengkel" },
  { stage: 5, name: "Kontak", title: "Mercusuar" },
];

/**
 * IslandWorldRig
 * Inner 3D group container hosting the Workshop Island.
 * Dual-control tracking: pointer drag rotation + stage snapping with damping.
 * No DOM scroll interference (no preventDefault), safe touch handling.
 */
const IslandWorldRig = ({
  scale,
  isRotating,
  setIsRotating,
  currentStage,
  setCurrentStage,
  targetAngleRef,
  isSnappingRef,
}) => {
  const groupRef = useRef(null);
  const currentAngleRef = useRef(STAGE_CENTERS[1]);
  const pointerDownRef = useRef(false);
  const lastPointerXRef = useRef(0);

  // Sync target angle when currentStage changes externally
  useEffect(() => {
    if (STAGE_CENTERS[currentStage] !== undefined) {
      targetAngleRef.current = STAGE_CENTERS[currentStage];
    } else if (currentStage === 5) {
      // Lighthouse is positioned on the edge
      targetAngleRef.current = 3.14;
    }
  }, [currentStage, targetAngleRef]);

  const handlePointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      pointerDownRef.current = true;
      isSnappingRef.current = false;
      setIsRotating(true);
      lastPointerXRef.current = e.clientX;
    },
    [setIsRotating, isSnappingRef]
  );

  const handlePointerUp = useCallback(
    (e) => {
      e.stopPropagation();
      pointerDownRef.current = false;
      setIsRotating(false);
    },
    [setIsRotating]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!pointerDownRef.current) return;
      e.stopPropagation();

      const deltaX = e.clientX - lastPointerXRef.current;
      lastPointerXRef.current = e.clientX;

      // Smooth drag sensitivity
      const rotationSpeed = 0.005;
      targetAngleRef.current += deltaX * rotationSpeed;
    },
    [targetAngleRef]
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth lerp damping toward target angle
    const damping = isSnappingRef.current ? 0.08 : 0.12;
    currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * damping;

    // Gentle auto-rotate drift when idle
    if (!pointerDownRef.current && !isSnappingRef.current && !isRotating) {
      targetAngleRef.current += (delta || 0.016) * 0.035;
    }

    // Apply Y-axis rotation to the island world
    groupRef.current.rotation.y = currentAngleRef.current;

    // Derive active stage dynamically during free rotation
    if (!isSnappingRef.current) {
      const derivedStage = getStageFromAngle(currentAngleRef.current);
      if (derivedStage && derivedStage !== currentStage && currentStage !== 5) {
        setCurrentStage(derivedStage);
      }
    } else if (Math.abs(targetAngleRef.current - currentAngleRef.current) < 0.005) {
      isSnappingRef.current = false;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <WorkshopIsland
        scale={scale}
        isRotating={isRotating}
        currentStage={currentStage}
        onSelectZone={(zoneId) => {
          setCurrentStage(zoneId);
          if (STAGE_CENTERS[zoneId] !== undefined) {
            targetAngleRef.current = STAGE_CENTERS[zoneId];
            isSnappingRef.current = true;
          } else if (zoneId === 5) {
            targetAngleRef.current = 3.14;
            isSnappingRef.current = true;
          }
        }}
      />
    </group>
  );
};

IslandWorldRig.propTypes = {
  scale: PropTypes.arrayOf(PropTypes.number).isRequired,
  isRotating: PropTypes.bool.isRequired,
  setIsRotating: PropTypes.func.isRequired,
  currentStage: PropTypes.number.isRequired,
  setCurrentStage: PropTypes.func.isRequired,
  targetAngleRef: PropTypes.shape({ current: PropTypes.number }).isRequired,
  isSnappingRef: PropTypes.shape({ current: PropTypes.bool }).isRequired,
};

const Home = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [islandScale, setIslandScale] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return [0.75, 0.75, 0.75];
    }
    return [0.95, 0.95, 0.95];
  });

  const targetAngleRef = useRef(STAGE_CENTERS[1]);
  const isSnappingRef = useRef(false);
  const snapResetTimerRef = useRef(null);

  // Responsive scale listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIslandScale([0.75, 0.75, 0.75]);
      } else {
        setIslandScale([0.95, 0.95, 0.95]);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (snapResetTimerRef.current !== null) {
        clearTimeout(snapResetTimerRef.current);
        snapResetTimerRef.current = null;
      }
    };
  }, []);

  const handleZoneSelect = (stageNum) => {
    setHasInteracted(true);
    setCurrentStage(stageNum);
    if (STAGE_CENTERS[stageNum] !== undefined) {
      targetAngleRef.current = STAGE_CENTERS[stageNum];
    } else if (stageNum === 5) {
      targetAngleRef.current = 3.14;
    }
    isSnappingRef.current = true;
    setIsRotating(true);

    if (snapResetTimerRef.current !== null) {
      clearTimeout(snapResetTimerRef.current);
    }
    snapResetTimerRef.current = setTimeout(() => {
      snapResetTimerRef.current = null;
      setIsRotating(false);
    }, 450);
  };

  return (
    <section
      role="region"
      aria-label="workshop-island"
      className="relative h-[100dvh] w-full overflow-hidden bg-island-black select-none"
    >
      {/* Top Story Callout Card Overlay */}
      <div className="absolute top-20 sm:top-24 left-0 right-0 z-10 flex items-center justify-center px-4 pointer-events-auto">
        {currentStage && <Homeinfo currentStage={currentStage} />}
      </div>

      {/* R3F 3D Island Canvas */}
      <Canvas
        gl={{ alpha: false, antialias: true }}
        className={`absolute inset-0 h-full w-full touch-pan-y ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ position: [0, 4.2, 8.4], fov: 45, near: 0.1, far: 2000 }}
        onPointerDown={() => setHasInteracted(true)}
      >
        <Suspense fallback={<Loader />}>
          {/* Warm dusk atmosphere: flat dusk background + matching fog (drei <Sky> shader
              renders a narrow warm band with pale everywhere else — documented behavior,
              so we use a solid dusk tone + fog for a cohesive warm environment). */}
          <color attach="background" args={["#4A3421"]} />
          <fog attach="fog" args={["#4A3421", 18, 46]} />

          <IslandWorldRig
            scale={islandScale}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            targetAngleRef={targetAngleRef}
            isSnappingRef={isSnappingRef}
          />
        </Suspense>
      </Canvas>

      {/* Bottom Hint Text (fades after first interaction) */}
      <div
        className={`absolute bottom-24 sm:bottom-20 left-0 right-0 z-10 flex justify-center pointer-events-none transition-opacity duration-700 ${
          hasInteracted ? "opacity-0" : "opacity-80"
        }`}
      >
        <span className="px-3 py-1 rounded-full bg-island-dark/80 border border-island-border/70 text-cream/70 text-[11px] sm:text-xs font-sans tracking-wide shadow-lg">
          Geser untuk memutar pulau · Klik landmark untuk detail
        </span>
      </div>

      {/* Bottom Zone Navigator Dock */}
      <div className="absolute bottom-5 sm:bottom-6 left-0 right-0 z-20 flex justify-center px-4 pointer-events-auto">
        <nav
          aria-label="Navigasi zona pulau"
          className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-2 p-1.5 rounded-full border border-island-border/80 bg-island-dark/85 backdrop-blur-md shadow-2xl max-w-full"
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
                className={`px-3 py-1.5 text-xs font-sans rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-island-copper ${
                  isActive
                    ? "bg-copper text-cream font-medium shadow-md shadow-black/20"
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
