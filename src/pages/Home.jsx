import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame } from "@react-three/fiber";
import Loader from "../components/Loader";
import TechCore from "../models/TechCore";
import Homeinfo from "../components/Homeinfo";
import AudioController from "../components/AudioController";
import { STAGE_CENTERS, getStageFromAngle } from "../core/stageCalculator";

const STAGE_NODES = [
  { stage: 1, code: "01", label: "SYS_INIT" },
  { stage: 2, code: "02", label: "AI_AWARDS" },
  { stage: 3, code: "03", label: "WEB3_ARSENAL" },
  { stage: 4, code: "04", label: "COMMS_LINK" },
];

/**
 * HeroRig
 * Inner 3D group container hosting TechCore.
 * Provides smooth rotation damping, dual-control tracking (pointer drag + stage snap),
 * and automatic stage calculation without DOM scroll interference.
 */
const HeroRig = ({
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

  // Sync initial target angle with stage 1
  useEffect(() => {
    if (STAGE_CENTERS[currentStage] !== undefined) {
      targetAngleRef.current = STAGE_CENTERS[currentStage];
    }
  }, [currentStage, targetAngleRef]);

  // Pointer drag event handlers on the 3D group (Zero preventDefault, keeps page mobile scroll intact)
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

      // Sensitivity factor
      const rotationSpeed = 0.006;
      targetAngleRef.current += deltaX * rotationSpeed;
    },
    [targetAngleRef]
  );

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth lerp damping toward target angle
    const damping = isSnappingRef.current ? 0.08 : 0.12;
    currentAngleRef.current += (targetAngleRef.current - currentAngleRef.current) * damping;

    // Apply Y-axis rotation to the 3D group
    groupRef.current.rotation.y = currentAngleRef.current;

    // Derive active stage from angle dynamically during free rotation
    if (!isSnappingRef.current) {
      const derivedStage = getStageFromAngle(currentAngleRef.current);
      if (derivedStage && derivedStage !== currentStage) {
        setCurrentStage(derivedStage);
      }
    } else {
      // Check if snapped close enough to target
      if (Math.abs(targetAngleRef.current - currentAngleRef.current) < 0.005) {
        isSnappingRef.current = false;
      }
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
      <TechCore scale={scale} isRotating={isRotating} />
    </group>
  );
};

HeroRig.propTypes = {
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
  const [techCoreScale, setTechCoreScale] = useState(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return [0.85, 0.85, 0.85];
    }
    return [1, 1, 1];
  });

  const targetAngleRef = useRef(STAGE_CENTERS[1]);
  const isSnappingRef = useRef(false);
  const snapResetTimerRef = useRef(null);

  // Responsive scale listener
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTechCoreScale([0.85, 0.85, 0.85]);
      } else {
        setTechCoreScale([1, 1, 1]);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Clear any pending stage-select rotation reset on unmount
  useEffect(() => {
    return () => {
      if (snapResetTimerRef.current !== null) {
        clearTimeout(snapResetTimerRef.current);
        snapResetTimerRef.current = null;
      }
    };
  }, []);

  // Handler for HUD Stage Scrubber clicks
  const handleStageSelect = (stageNum) => {
    if (STAGE_CENTERS[stageNum] === undefined) return;
    setCurrentStage(stageNum);
    targetAngleRef.current = STAGE_CENTERS[stageNum];
    isSnappingRef.current = true;
    setIsRotating(true);
    // Clear any pending reset from a previous select before arming a new one
    if (snapResetTimerRef.current !== null) {
      clearTimeout(snapResetTimerRef.current);
    }
    // Smooth reset of rotating flag after transition
    snapResetTimerRef.current = setTimeout(() => {
      snapResetTimerRef.current = null;
      setIsRotating(false);
    }, 450);
  };

  return (
    <section
      role="region"
      aria-label="hero-terminal"
      className="w-full min-h-[100dvh] relative bg-cyber-black overflow-hidden flex flex-col justify-between"
    >
      {/* Top telemetry HUD callout zone */}
      <div className="absolute top-24 sm:top-28 left-0 right-0 z-10 flex items-center justify-center pointer-events-auto">
        {currentStage && <Homeinfo currentStage={currentStage} />}
      </div>

      {/* R3F 3D Hero Canvas */}
      <Canvas
        className={`w-full h-full absolute inset-0 bg-transparent touch-pan-y ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <HeroRig
            scale={techCoreScale}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            targetAngleRef={targetAngleRef}
            isSnappingRef={isSnappingRef}
          />
        </Suspense>
      </Canvas>

      {/* Bottom Orbit Scrubber HUD */}
      <div className="absolute bottom-16 sm:bottom-12 left-0 right-0 z-20 flex justify-center px-4 pointer-events-auto">
        <nav
          aria-label="Orbit stage scrubber"
          className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-lg border border-cyber-border bg-cyber-black/85 backdrop-blur-md shadow-2xl max-w-full"
        >
          {STAGE_NODES.map((node) => {
            const isActive = currentStage === node.stage;
            return (
              <button
                key={node.stage}
                type="button"
                onClick={() => handleStageSelect(node.stage)}
                aria-current={isActive ? "step" : undefined}
                className={`px-2.5 py-1 text-[11px] sm:text-xs font-mono font-semibold tracking-wider rounded transition-all duration-200 border focus:outline-none focus:ring-1 focus:ring-cyber-cyan ${
                  isActive
                    ? "bg-cyber-slate text-cyber-cyan border-cyber-cyan shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                    : "bg-cyber-dark/60 text-gray-400 border-cyber-border/70 hover:text-gray-200 hover:border-cyber-border"
                }`}
              >
                {`[${node.code} // ${node.label}]`}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom-left Audio Controller zone */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-auto">
        <AudioController />
      </div>
    </section>
  );
};

export default Home;
