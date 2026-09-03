import { useRef } from "react";
import PropTypes from "prop-types";
import { useFrame } from "@react-three/fiber";

/**
 * Procedural low-poly 3D Workshop Island.
 * Composed purely of Three.js / React Three Fiber primitives (boxes, cylinders, cones, spheres).
 * Zero external .glb / .gltf assets (Asset-weight: 0).
 *
 * 4 Story Zones positioned to align with STAGE_CENTERS in stageCalculator.js:
 * - Zone 1 (Intro): Campfire & Workbench + Signpost (~1.78 rad)
 * - Zone 2 (AI & Awards): Observatory Tower with rotating star dome (~3.78 rad)
 * - Zone 3 (Web3 & Crypto): Tech Reactor / Lab with warm copper glow & antenna (~5.23 rad)
 * - Zone 4 (Fullstack & Client): Timber Workshop Barn with pitched roof & chimney (~0.63 rad)
 * - Lighthouse (Contact): Outcropping tower with rotating lantern beam
 */

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

// Low-poly Tree primitive
const LowPolyTree = ({ position, scale = 1 }) => (
  <group position={position} scale={scale}>
    {/* Trunk */}
    <mesh position={[0, 0.35, 0]}>
      <cylinderGeometry args={[0.07, 0.11, 0.7, 5]} />
      <meshStandardMaterial color="#422E1B" roughness={0.9} flatShading />
    </mesh>
    {/* Foliage Tier 1 */}
    <mesh position={[0, 0.85, 0]}>
      <coneGeometry args={[0.5, 0.7, 5]} />
      <meshStandardMaterial color="#2E3A24" roughness={0.8} flatShading />
    </mesh>
    {/* Foliage Tier 2 */}
    <mesh position={[0, 1.25, 0]}>
      <coneGeometry args={[0.38, 0.6, 5]} />
      <meshStandardMaterial color="#3E4D30" roughness={0.8} flatShading />
    </mesh>
  </group>
);

LowPolyTree.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.number,
};

// Low-poly Rock primitive
const LowPolyRock = ({ position, scale = 1, rotation = [0, 0, 0] }) => (
  <mesh position={position} scale={scale} rotation={rotation}>
    <dodecahedronGeometry args={[0.35, 0]} />
    <meshStandardMaterial color="#3A332B" roughness={0.95} flatShading />
  </mesh>
);

LowPolyRock.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
  rotation: PropTypes.arrayOf(PropTypes.number),
};

const WorkshopIsland = ({
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isRotating = false,
  onSelectZone = null,
  ...props
}) => {
  const rootGroupRef = useRef(null);
  const islandGroupRef = useRef(null);
  const observatoryDomeRef = useRef(null);
  const campfireGlowRef = useRef(null);
  const beaconRef = useRef(null);
  const lighthouseLanternRef = useRef(null);
  const gliderRef = useRef(null);
  const waterRef = useRef(null);

  const safeScaleValue = safeVector3(scale, [1, 1, 1]);
  const safePosValue = safeVector3(position, [0, 0, 0]);
  const safeRotValue = safeVector3(rotation, [0, 0, 0]);

  useFrame((state) => {
    const t = state?.clock?.getElapsedTime ? state.clock.getElapsedTime() : 0;
    const speedMult = isRotating ? 2.0 : 1.0;

    // 1. Subtle island floating bob
    if (islandGroupRef.current?.position) {
      islandGroupRef.current.position.y = Math.sin(t * 0.8) * 0.05;
    }

    // 2. Observatory dome / dish slow rotation
    if (observatoryDomeRef.current?.rotation) {
      observatoryDomeRef.current.rotation.y = t * 0.35 * speedMult;
    }

    // 3. Campfire gentle flicker
    if (campfireGlowRef.current && "intensity" in campfireGlowRef.current) {
      campfireGlowRef.current.intensity = 1.4 + Math.sin(t * 7.5) * 0.35 + Math.cos(t * 11) * 0.2;
    }

    // 4. Tech reactor beacon gentle pulse
    if (beaconRef.current && "intensity" in beaconRef.current) {
      beaconRef.current.intensity = 1.2 + Math.sin(t * 2.5) * 0.6;
    }

    // 5. Lighthouse lantern rotation
    if (lighthouseLanternRef.current?.rotation) {
      lighthouseLanternRef.current.rotation.y = t * 0.8;
    }

    // 6. Tiny low-poly glider / bird orbit
    if (gliderRef.current?.position && gliderRef.current?.rotation) {
      const orbitRadius = 4.2;
      const orbitSpeed = t * 0.45;
      gliderRef.current.position.x = Math.cos(orbitSpeed) * orbitRadius;
      gliderRef.current.position.z = Math.sin(orbitSpeed) * orbitRadius;
      gliderRef.current.position.y = 2.4 + Math.sin(t * 1.5) * 0.25;
      gliderRef.current.rotation.y = -orbitSpeed - Math.PI / 2;
    }

    // 7. Water subtle wave breathing
    if (waterRef.current?.rotation) {
      waterRef.current.rotation.z = Math.sin(t * 0.4) * 0.02;
    }
  });

  const handleZoneClick = (zoneId) => (e) => {
    e.stopPropagation();
    if (typeof onSelectZone === "function") {
      onSelectZone(zoneId);
    }
  };

  return (
    <group
      ref={rootGroupRef}
      scale={safeScaleValue}
      position={safePosValue}
      rotation={safeRotValue}
      {...props}
    >
      {/* Warm Ambient & Sunset Directional Lighting */}
      <ambientLight color="#FFEBD4" intensity={0.85} />
      <directionalLight
        position={[6, 8, 4]}
        color="#F8B179"
        intensity={2.0}
        castShadow={false}
      />
      <directionalLight
        position={[-5, 4, -4]}
        color="#594034"
        intensity={0.65}
      />

      {/* Water disc around island */}
      <mesh
        ref={waterRef}
        position={[0, -0.65, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[5.8, 32]} />
        <meshStandardMaterial
          color="#1D2428"
          roughness={0.2}
          metalness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Foam ring / shore contour */}
      <mesh position={[0, -0.63, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.4, 3.8, 24]} />
        <meshStandardMaterial
          color="#E7D9BF"
          transparent
          opacity={0.18}
          roughness={0.9}
        />
      </mesh>

      {/* Main Island Group */}
      <group ref={islandGroupRef}>
        {/* Island Terrain Base: layered low-poly slabs */}
        {/* Deep substrate / cliff base */}
        <mesh position={[0, -0.75, 0]}>
          <cylinderGeometry args={[2.8, 3.4, 0.9, 9]} />
          <meshStandardMaterial color="#211B14" roughness={0.9} flatShading />
        </mesh>
        {/* Mid rock layer */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[3.2, 2.9, 0.6, 9]} />
          <meshStandardMaterial color="#2A2119" roughness={0.85} flatShading />
        </mesh>
        {/* Top fertile soil / sand plateau */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[3.1, 3.25, 0.45, 9]} />
          <meshStandardMaterial color="#3A2F24" roughness={0.8} flatShading />
        </mesh>

        {/* Central mound */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[1.5, 2.2, 0.4, 8]} />
          <meshStandardMaterial color="#32281E" roughness={0.85} flatShading />
        </mesh>

        {/* Pathway stones connecting zones */}
        <mesh position={[0.7, 0.28, -0.1]} rotation={[-Math.PI / 2, 0, 0.4]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshStandardMaterial color="#E7D9BF" roughness={0.9} />
        </mesh>
        <mesh position={[-0.4, 0.28, -0.6]} rotation={[-Math.PI / 2, 0, -0.2]}>
          <planeGeometry args={[0.45, 0.25]} />
          <meshStandardMaterial color="#E7D9BF" roughness={0.9} />
        </mesh>
        <mesh position={[-0.6, 0.28, 0.4]} rotation={[-Math.PI / 2, 0, 0.6]}>
          <planeGeometry args={[0.4, 0.3]} />
          <meshStandardMaterial color="#E7D9BF" roughness={0.9} />
        </mesh>
        <mesh position={[0.5, 0.28, 0.6]} rotation={[-Math.PI / 2, 0, -0.5]}>
          <planeGeometry args={[0.45, 0.28]} />
          <meshStandardMaterial color="#E7D9BF" roughness={0.9} />
        </mesh>

        {/* ============================================================== */}
        {/* ZONE 1: Intro / Identity — Campfire, Workbench & Signpost      */}
        {/* Position: ~[1.85, 0.3, -0.4] (facing front at Stage 1 ~4.5rad) */}
        {/* ============================================================== */}
        <group
          position={[1.85, 0.3, -0.4]}
          onClick={handleZoneClick(1)}
          cursor="pointer"
        >
          {/* Subtle warm campfire pointLight */}
          <pointLight
            ref={campfireGlowRef}
            color="#FFA040"
            intensity={1.8}
            distance={3.5}
            decay={2}
            position={[0, 0.35, 0]}
          />

          {/* Fire pit ring stones */}
          <mesh position={[0, 0.05, 0]}>
            <torusGeometry args={[0.22, 0.06, 6, 8]} />
            <meshStandardMaterial color="#3A332B" roughness={0.95} flatShading />
          </mesh>

          {/* Firewood logs */}
          <mesh position={[0, 0.08, 0]} rotation={[0.4, 0.6, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.35, 5]} />
            <meshStandardMaterial color="#3B2615" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.08, 0]} rotation={[-0.3, -0.7, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.35, 5]} />
            <meshStandardMaterial color="#3B2615" roughness={0.9} />
          </mesh>

          {/* Low-poly Flame */}
          <mesh position={[0, 0.22, 0]}>
            <coneGeometry args={[0.12, 0.28, 5]} />
            <meshStandardMaterial
              color="#FFA040"
              emissive="#C56B3B"
              emissiveIntensity={0.8}
              roughness={0.3}
              flatShading
            />
          </mesh>

          {/* Carpenter's Workbench table */}
          <group position={[0.45, 0, 0.4]}>
            {/* Table top */}
            <mesh position={[0, 0.28, 0]}>
              <boxGeometry args={[0.65, 0.06, 0.35]} />
              <meshStandardMaterial color="#6B492B" roughness={0.85} flatShading />
            </mesh>
            {/* Table legs */}
            <mesh position={[-0.26, 0.14, -0.12]}>
              <boxGeometry args={[0.06, 0.28, 0.06]} />
              <meshStandardMaterial color="#4A311A" roughness={0.9} />
            </mesh>
            <mesh position={[0.26, 0.14, -0.12]}>
              <boxGeometry args={[0.06, 0.28, 0.06]} />
              <meshStandardMaterial color="#4A311A" roughness={0.9} />
            </mesh>
            <mesh position={[-0.26, 0.14, 0.12]}>
              <boxGeometry args={[0.06, 0.28, 0.06]} />
              <meshStandardMaterial color="#4A311A" roughness={0.9} />
            </mesh>
            <mesh position={[0.26, 0.14, 0.12]}>
              <boxGeometry args={[0.06, 0.28, 0.06]} />
              <meshStandardMaterial color="#4A311A" roughness={0.9} />
            </mesh>
            {/* Small tool on bench */}
            <mesh position={[-0.05, 0.34, 0]}>
              <boxGeometry args={[0.18, 0.04, 0.08]} />
              <meshStandardMaterial color="#C56B3B" roughness={0.4} metalness={0.5} />
            </mesh>
          </group>

          {/* Wooden Signpost */}
          <group position={[-0.45, 0, 0.3]}>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 0.7, 5]} />
              <meshStandardMaterial color="#543A22" roughness={0.9} />
            </mesh>
            <mesh position={[0.08, 0.55, 0]} rotation={[0, 0, 0.08]}>
              <boxGeometry args={[0.32, 0.1, 0.04]} />
              <meshStandardMaterial color="#E7D9BF" roughness={0.8} />
            </mesh>
          </group>

          {/* Hit target helper */}
          <mesh position={[0, 0.3, 0]} visible={false}>
            <boxGeometry args={[1.5, 1.2, 1.5]} />
          </mesh>
        </group>

        {/* ============================================================== */}
        {/* ZONE 2: AI & Awards — Observatory Tower & Rotating Star Dome  */}
        {/* Position: ~[-1.2, 0.3, -1.65] (facing front at Stage 2 ~2.5rad)*/}
        {/* ============================================================== */}
        <group
          position={[-1.2, 0.3, -1.65]}
          onClick={handleZoneClick(2)}
          cursor="pointer"
        >
          {/* Tower Base */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.55, 0.68, 1.2, 8]} />
            <meshStandardMaterial color="#3A2F24" roughness={0.85} flatShading />
          </mesh>

          {/* Tower Mid Ledge */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.62, 0.58, 0.12, 8]} />
            <meshStandardMaterial color="#5C4533" roughness={0.8} flatShading />
          </mesh>

          {/* Tower Doorway (warm arched entrance) */}
          <mesh position={[0, 0.28, 0.52]}>
            <boxGeometry args={[0.26, 0.45, 0.1]} />
            <meshStandardMaterial color="#17130E" roughness={0.9} />
          </mesh>

          {/* Rotating Observatory Dome */}
          <group ref={observatoryDomeRef} position={[0, 1.35, 0]}>
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.52, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color="#C56B3B"
                roughness={0.35}
                metalness={0.65}
                flatShading
              />
            </mesh>
            {/* Telescope aperture / cylinder */}
            <mesh position={[0.22, 0.38, 0.22]} rotation={[-0.4, 0.7, 0]}>
              <cylinderGeometry args={[0.09, 0.11, 0.55, 6]} />
              <meshStandardMaterial color="#E7D9BF" roughness={0.4} metalness={0.5} />
            </mesh>
            {/* Warm lens glow */}
            <mesh position={[0.33, 0.52, 0.33]} rotation={[-0.4, 0.7, 0]}>
              <circleGeometry args={[0.08, 8]} />
              <meshStandardMaterial
                color="#FFC580"
                emissive="#FFA040"
                emissiveIntensity={0.6}
              />
            </mesh>
          </group>

          {/* Golden / Copper Award Pedestal nearby */}
          <group position={[0.7, 0, 0.3]}>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.18, 0.22, 0.3, 6]} />
              <meshStandardMaterial color="#2E241B" roughness={0.8} />
            </mesh>
            {/* Mini trophy star */}
            <mesh position={[0, 0.38, 0]} rotation={[0, 0.4, 0]}>
              <octahedronGeometry args={[0.12, 0]} />
              <meshStandardMaterial
                color="#E7D9BF"
                emissive="#C56B3B"
                emissiveIntensity={0.4}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>

          {/* Hit target */}
          <mesh position={[0, 0.8, 0]} visible={false}>
            <boxGeometry args={[1.5, 2.0, 1.5]} />
          </mesh>
        </group>

        {/* ============================================================== */}
        {/* ZONE 3: Web3 & Crypto — Reactor Lab & Glowing Beacon Antenna   */}
        {/* Position: ~[-1.7, 0.3, 0.95] (facing front at Stage 3 ~1.05rad)*/}
        {/* ============================================================== */}
        <group
          position={[-1.7, 0.3, 0.95]}
          onClick={handleZoneClick(3)}
          cursor="pointer"
        >
          {/* Main Lab Building */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.95, 0.85, 0.95]} />
            <meshStandardMaterial color="#2E251E" roughness={0.8} flatShading />
          </mesh>

          {/* Roof bevel / slab */}
          <mesh position={[0, 0.92, 0]}>
            <boxGeometry args={[1.05, 0.1, 1.05]} />
            <meshStandardMaterial color="#4A3728" roughness={0.7} flatShading />
          </mesh>

          {/* Glowing Windows (Warm Copper, NOT cyan) */}
          <mesh position={[0.3, 0.45, 0.49]}>
            <planeGeometry args={[0.22, 0.25]} />
            <meshStandardMaterial
              color="#C56B3B"
              emissive="#C56B3B"
              emissiveIntensity={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[-0.3, 0.45, 0.49]}>
            <planeGeometry args={[0.22, 0.25]} />
            <meshStandardMaterial
              color="#C56B3B"
              emissive="#C56B3B"
              emissiveIntensity={0.8}
              roughness={0.3}
            />
          </mesh>
          {/* Side glowing window */}
          <mesh position={[-0.49, 0.45, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.35, 0.25]} />
            <meshStandardMaterial
              color="#E7D9BF"
              emissive="#C56B3B"
              emissiveIntensity={0.5}
              roughness={0.3}
            />
          </mesh>

          {/* Antenna mast & beacon */}
          <mesh position={[0.25, 1.35, -0.2]}>
            <cylinderGeometry args={[0.025, 0.035, 0.8, 5]} />
            <meshStandardMaterial color="#8C5C38" roughness={0.6} metalness={0.4} />
          </mesh>
          {/* Antenna beacon bulb */}
          <mesh position={[0.25, 1.78, -0.2]}>
            <sphereGeometry args={[0.07, 6, 6]} />
            <meshStandardMaterial
              color="#FFA040"
              emissive="#FFA040"
              emissiveIntensity={0.9}
            />
          </mesh>
          <pointLight
            ref={beaconRef}
            color="#FFA040"
            intensity={1.2}
            distance={2.8}
            decay={2}
            position={[0.25, 1.8, -0.2]}
          />

          {/* Sub-node / Mini Server Cubes */}
          <mesh position={[0.7, 0.18, 0.2]}>
            <boxGeometry args={[0.35, 0.35, 0.35]} />
            <meshStandardMaterial color="#3D3025" roughness={0.7} flatShading />
          </mesh>
          <mesh position={[0.7, 0.22, 0.39]}>
            <planeGeometry args={[0.2, 0.08]} />
            <meshStandardMaterial
              color="#C56B3B"
              emissive="#C56B3B"
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Hit target */}
          <mesh position={[0, 0.7, 0]} visible={false}>
            <boxGeometry args={[1.5, 1.8, 1.5]} />
          </mesh>
        </group>

        {/* ============================================================== */}
        {/* ZONE 4: Fullstack & Client — Timber Workshop Barn & Chimney   */}
        {/* Position: ~[1.15, 0.3, 1.55] (facing front at Stage 4 ~5.65rad)*/}
        {/* ============================================================== */}
        <group
          position={[1.15, 0.3, 1.55]}
          onClick={handleZoneClick(4)}
          cursor="pointer"
        >
          {/* Barn walls */}
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[1.1, 0.85, 0.85]} />
            <meshStandardMaterial color="#5C3D24" roughness={0.85} flatShading />
          </mesh>

          {/* Pitched Barn Roof (Prism) */}
          <mesh position={[0, 1.08, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.72, 0.72, 0.95]} />
            <meshStandardMaterial color="#3B2615" roughness={0.8} flatShading />
          </mesh>

          {/* Brick / stone chimney */}
          <mesh position={[0.35, 1.15, -0.15]}>
            <boxGeometry args={[0.18, 0.65, 0.18]} />
            <meshStandardMaterial color="#4A3423" roughness={0.9} flatShading />
          </mesh>
          {/* Low-poly smoke puff */}
          <mesh position={[0.35, 1.55, -0.15]}>
            <dodecahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial color="#E7D9BF" transparent opacity={0.45} roughness={0.9} />
          </mesh>

          {/* Big timber barn door */}
          <mesh position={[0, 0.32, 0.435]}>
            <boxGeometry args={[0.38, 0.58, 0.05]} />
            <meshStandardMaterial color="#352315" roughness={0.9} />
          </mesh>
          {/* Door copper handle */}
          <mesh position={[0.12, 0.32, 0.47]}>
            <sphereGeometry args={[0.025, 5, 5]} />
            <meshStandardMaterial color="#C56B3B" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Side Lean-to shed / client delivery crate */}
          <mesh position={[-0.7, 0.2, 0]}>
            <boxGeometry args={[0.35, 0.38, 0.45]} />
            <meshStandardMaterial color="#47301D" roughness={0.85} flatShading />
          </mesh>

          {/* Hit target */}
          <mesh position={[0, 0.6, 0]} visible={false}>
            <boxGeometry args={[1.5, 1.6, 1.5]} />
          </mesh>
        </group>

        {/* ============================================================== */}
        {/* LIGHTHOUSE: Edge Outcropping Tower (Contact CTA Landmark)     */}
        {/* Position: ~[-2.35, 0.1, -0.2] (edge of the island)            */}
        {/* ============================================================== */}
        <group
          position={[-2.35, 0.1, -0.2]}
          onClick={handleZoneClick(5)}
          cursor="pointer"
        >
          {/* Rocky cliff ledge */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.65, 0.78, 0.5, 7]} />
            <meshStandardMaterial color="#2E261E" roughness={0.95} flatShading />
          </mesh>

          {/* Lighthouse Tower base & body */}
          <mesh position={[0, 0.95, 0]}>
            <cylinderGeometry args={[0.26, 0.42, 1.3, 8]} />
            <meshStandardMaterial color="#E7D9BF" roughness={0.7} flatShading />
          </mesh>

          {/* Copper Accent Ring */}
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.3, 0.32, 0.2, 8]} />
            <meshStandardMaterial color="#C56B3B" roughness={0.5} metalness={0.4} />
          </mesh>

          {/* Observation Gallery */}
          <mesh position={[0, 1.63, 0]}>
            <cylinderGeometry args={[0.36, 0.28, 0.08, 8]} />
            <meshStandardMaterial color="#3A2D22" roughness={0.8} />
          </mesh>

          {/* Lantern Room Glass & Light */}
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.26, 8]} />
            <meshStandardMaterial
              color="#FFA040"
              emissive="#FFA040"
              emissiveIntensity={0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
          <pointLight
            color="#FFA040"
            intensity={2.2}
            distance={4.5}
            decay={2}
            position={[0, 1.85, 0]}
          />

          {/* Lighthouse Copper Conical Roof */}
          <mesh position={[0, 2.06, 0]}>
            <coneGeometry args={[0.28, 0.28, 8]} />
            <meshStandardMaterial color="#C56B3B" roughness={0.4} metalness={0.6} flatShading />
          </mesh>

          {/* Rotating Light Beam (very faint stylized cone) */}
          <group ref={lighthouseLanternRef} position={[0, 1.8, 0]}>
            <mesh position={[1.4, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[0.45, 2.8, 6]} />
              <meshStandardMaterial
                color="#FFE4B5"
                transparent
                opacity={0.12}
                depthWrite={false}
              />
            </mesh>
          </group>

          {/* Hit target */}
          <mesh position={[0, 1.0, 0]} visible={false}>
            <boxGeometry args={[1.2, 2.4, 1.2]} />
          </mesh>
        </group>

        {/* ============================================================== */}
        {/* Scattered Low-Poly Trees & Rocks for Natural Living Island   */}
        {/* ============================================================== */}
        <LowPolyTree position={[0.2, 0.45, -1.2]} scale={1.1} />
        <LowPolyTree position={[0.8, 0.4, -1.5]} scale={0.85} />
        <LowPolyTree position={[-0.4, 0.4, -1.9]} scale={0.9} />
        <LowPolyTree position={[-0.8, 0.4, 0.1]} scale={1.0} />
        <LowPolyTree position={[0.4, 0.45, 1.8]} scale={0.8} />
        <LowPolyTree position={[-1.1, 0.35, 1.8]} scale={0.75} />
        <LowPolyTree position={[2.0, 0.35, 0.5]} scale={0.95} />

        <LowPolyRock position={[1.6, 0.25, -1.2]} scale={0.7} rotation={[0.2, 0.5, 0]} />
        <LowPolyRock position={[-1.8, 0.2, -0.9]} scale={0.9} rotation={[-0.3, 0.8, 0.2]} />
        <LowPolyRock position={[0.1, 0.3, 1.9]} scale={0.6} rotation={[0.4, -0.2, 0]} />
        <LowPolyRock position={[-2.1, 0.15, 0.4]} scale={0.8} rotation={[0.1, 0.3, 0]} />
      </group>

      {/* Orbiting Tiny Glider Silhouette */}
      <group ref={gliderRef} position={[0, 2.4, 0]}>
        {/* Fuselage / Body */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.06, 0.45, 4]} />
          <meshStandardMaterial color="#E7D9BF" roughness={0.6} flatShading />
        </mesh>
        {/* Main Wings */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[0.85, 0.02, 0.18]} />
          <meshStandardMaterial color="#C56B3B" roughness={0.5} flatShading />
        </mesh>
        {/* Tail fin */}
        <mesh position={[0, 0.08, 0.15]}>
          <boxGeometry args={[0.02, 0.14, 0.1]} />
          <meshStandardMaterial color="#4A3728" roughness={0.6} />
        </mesh>
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
  onSelectZone: PropTypes.func,
};

export default WorkshopIsland;
