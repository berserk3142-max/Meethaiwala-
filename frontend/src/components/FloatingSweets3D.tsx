import { useRef, useMemo, useEffect } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// ============================================
// 3D LADDU - Spherical with grainy texture
// ============================================
function Laddu3D({
    position,
    scale = 1,
    floatSpeed = 1,
}: {
    position: [number, number, number];
    scale?: number;
    floatSpeed?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const time = useRef(Math.random() * 100);

    useFrame((_state, delta) => {
        if (!meshRef.current) return;
        time.current += delta;
        meshRef.current.rotation.y += delta * 0.3;
        meshRef.current.rotation.x = Math.sin(time.current * 0.5) * 0.1;
    });

    return (
        <Float speed={floatSpeed} rotationIntensity={0.3} floatIntensity={2}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <sphereGeometry args={[1, 32, 32]} />
                <MeshDistortMaterial
                    color="#FF9933"
                    roughness={0.6}
                    metalness={0.1}
                    distort={0.15}
                    speed={2}
                />
            </mesh>
            {/* Small sugar decorations on top */}
            {[...Array(8)].map((_, i) => (
                <mesh
                    key={i}
                    position={[
                        position[0] + Math.cos(i * 0.8) * 0.6 * scale,
                        position[1] + Math.sin(i * 0.5) * 0.3 * scale + 0.7 * scale,
                        position[2] + Math.sin(i * 0.8) * 0.6 * scale,
                    ]}
                    scale={0.08 * scale}
                >
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshStandardMaterial color="#FFFACD" roughness={0.2} />
                </mesh>
            ))}
        </Float>
    );
}

// ============================================
// 3D GULAB JAMUN - Glossy brown ovals
// ============================================
function GulabJamun3D({
    position,
    scale = 1,
    floatSpeed = 1,
}: {
    position: [number, number, number];
    scale?: number;
    floatSpeed?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const time = useRef(Math.random() * 100);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        time.current += delta;
        meshRef.current.rotation.z = Math.sin(time.current * 0.4) * 0.15;
    });

    return (
        <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={1.8}>
            <group position={position}>
                {/* Main gulab jamun body - elongated sphere */}
                <mesh ref={meshRef} scale={[scale, scale * 1.2, scale]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshPhysicalMaterial
                        color="#8B4513"
                        roughness={0.15}
                        metalness={0.05}
                        clearcoat={0.8}
                        clearcoatRoughness={0.2}
                    />
                </mesh>
                {/* Syrup drip effect */}
                <mesh position={[0, -0.8 * scale, 0]} scale={[0.3 * scale, 0.5 * scale, 0.3 * scale]}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshPhysicalMaterial
                        color="#DAA520"
                        roughness={0}
                        metalness={0.1}
                        transmission={0.5}
                        thickness={0.5}
                    />
                </mesh>
            </group>
        </Float>
    );
}

// ============================================
// 3D JALEBI - Spiral pretzel shape
// ============================================
function Jalebi3D({
    position,
    scale = 1,
    floatSpeed = 1,
}: {
    position: [number, number, number];
    scale?: number;
    floatSpeed?: number;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const time = useRef(Math.random() * 100);

    // Create spiral path for jalebi
    const spiralPoints = useMemo(() => {
        const points: THREE.Vector3[] = [];
        const turns = 2.5;
        const segments = 60;
        for (let i = 0; i < segments; i++) {
            const t = i / segments;
            const angle = t * Math.PI * 2 * turns;
            const radius = 0.3 + t * 0.7;
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
            ));
        }
        return points;
    }, []);

    const curve = useMemo(() => new THREE.CatmullRomCurve3(spiralPoints), [spiralPoints]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        time.current += delta;
        groupRef.current.rotation.z += delta * 0.2;
        groupRef.current.rotation.x = Math.sin(time.current * 0.3) * 0.2;
    });

    return (
        <Float speed={floatSpeed} rotationIntensity={0.4} floatIntensity={1.5}>
            <group ref={groupRef} position={position} scale={scale}>
                <mesh>
                    <tubeGeometry args={[curve, 60, 0.12, 12, false]} />
                    <meshPhysicalMaterial
                        color="#FF8C00"
                        roughness={0.3}
                        metalness={0.1}
                        clearcoat={0.6}
                        clearcoatRoughness={0.3}
                    />
                </mesh>
            </group>
        </Float>
    );
}

// ============================================
// 3D RASGULLA - White spongy spheres
// ============================================
function Rasgulla3D({
    position,
    scale = 1,
    floatSpeed = 1,
}: {
    position: [number, number, number];
    scale?: number;
    floatSpeed?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const time = useRef(Math.random() * 100);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        time.current += delta;
        // Gentle squish effect
        const squish = 1 + Math.sin(time.current * 2) * 0.05;
        meshRef.current.scale.set(scale * squish, scale / squish, scale * squish);
    });

    return (
        <Float speed={floatSpeed} rotationIntensity={0.15} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
                <MeshDistortMaterial
                    color="#FFFEF0"
                    roughness={0.8}
                    metalness={0}
                    distort={0.2}
                    speed={3}
                />
            </Sphere>
        </Float>
    );
}

// ============================================
// 3D KAJU KATLI - Diamond shape with silver foil
// ============================================
function KajuKatli3D({
    position,
    scale = 1,
    floatSpeed = 1,
}: {
    position: [number, number, number];
    scale?: number;
    floatSpeed?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const time = useRef(Math.random() * 100);

    // Diamond shape geometry
    const diamondShape = useMemo(() => {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.8);
        shape.lineTo(0.6, 0);
        shape.lineTo(0, -0.8);
        shape.lineTo(-0.6, 0);
        shape.closePath();
        return shape;
    }, []);

    const extrudeSettings = useMemo(() => ({
        depth: 0.15,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3,
    }), []);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        time.current += delta;
        meshRef.current.rotation.y = Math.sin(time.current * 0.4) * 0.3;
        meshRef.current.rotation.x = Math.sin(time.current * 0.3) * 0.1;
    });

    return (
        <Float speed={floatSpeed} rotationIntensity={0.25} floatIntensity={1.6}>
            <group position={position}>
                {/* Main kaju katli body */}
                <mesh ref={meshRef} scale={scale} rotation={[Math.PI / 2, 0, 0]}>
                    <extrudeGeometry args={[diamondShape, extrudeSettings]} />
                    <meshStandardMaterial
                        color="#F5DEB3"
                        roughness={0.4}
                        metalness={0.1}
                    />
                </mesh>
                {/* Silver foil on top */}
                <mesh
                    position={[0, 0.1 * scale, 0]}
                    scale={scale * 0.85}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <extrudeGeometry args={[diamondShape, { ...extrudeSettings, depth: 0.02 }]} />
                    <meshStandardMaterial
                        color="#C0C0C0"
                        roughness={0.1}
                        metalness={0.9}
                    />
                </mesh>
            </group>
        </Float>
    );
}

// ============================================
// 3D BARFI - Rectangular fudge pieces
// ============================================
function Barfi3D({
    position,
    scale = 1,
    floatSpeed = 1,
    color = "#FFE4C4",
}: {
    position: [number, number, number];
    scale?: number;
    floatSpeed?: number;
    color?: string;
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const time = useRef(Math.random() * 100);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        time.current += delta;
        meshRef.current.rotation.y += delta * 0.15;
    });

    return (
        <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={1.4}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <boxGeometry args={[1, 0.4, 1]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.5}
                    metalness={0.05}
                />
            </mesh>
            {/* Pistachio decoration */}
            <mesh
                position={[position[0], position[1] + 0.25 * scale, position[2]]}
                scale={0.15 * scale}
                rotation={[0.3, 0, 0.2]}
            >
                <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
                <meshStandardMaterial color="#90EE90" roughness={0.4} />
            </mesh>
        </Float>
    );
}

// ============================================
// GOLDEN SPARKLES
// ============================================
function GoldenSparkles({ count = 80 }: { count?: number }) {
    const pointsRef = useRef<THREE.Points>(null);

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 25;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 3;
        }
        return positions;
    }, [count]);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.elapsedTime;
        pointsRef.current.rotation.y = time * 0.02;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            positions[i * 3 + 1] += Math.sin(time + i) * 0.002;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color="#FFD700"
                transparent
                opacity={0.8}
                sizeAttenuation
            />
        </points>
    );
}

// ============================================
// MOUSE PARALLAX
// ============================================
function ParallaxScene({ children }: { children: React.ReactNode }) {
    const groupRef = useRef<THREE.Group>(null);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            mouse.current.x * 0.12,
            0.04
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            mouse.current.y * 0.06,
            0.04
        );
    });

    return <group ref={groupRef}>{children}</group>;
}

// ============================================
// MAIN FLOATING 3D SWEETS SCENE
// ============================================
export function FloatingSweets3D() {
    return (
        <Canvas
            camera={{ position: [0, 0, 15], fov: 50 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
            gl={{ alpha: true, antialias: true }}
        >
            {/* Lighting setup */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#FFF8DC" />
            <pointLight position={[-8, 5, 3]} intensity={0.8} color="#FFB347" />
            <pointLight position={[8, -5, 2]} intensity={0.6} color="#FF8C00" />
            <spotLight position={[0, 10, 5]} intensity={0.5} angle={0.4} penumbra={0.5} color="#FFFAF0" />

            <ParallaxScene>
                {/* LADDUS */}
                <Laddu3D position={[-5, 3, -2]} scale={1.3} floatSpeed={0.8} />
                <Laddu3D position={[4, -2.5, -4]} scale={0.9} floatSpeed={1.1} />

                {/* GULAB JAMUNS */}
                <GulabJamun3D position={[5.5, 2, -2]} scale={1} floatSpeed={0.9} />
                <GulabJamun3D position={[-3, -3, -3]} scale={0.8} floatSpeed={1.2} />

                {/* JALEBIS */}
                <Jalebi3D position={[-6, -1, -1]} scale={1.2} floatSpeed={0.7} />
                <Jalebi3D position={[3, 3.5, -3]} scale={0.9} floatSpeed={1} />

                {/* RASGULLAS */}
                <Rasgulla3D position={[6, 0, -2]} scale={1} floatSpeed={1.1} />
                <Rasgulla3D position={[-2, 3.5, -4]} scale={0.7} floatSpeed={0.9} />

                {/* KAJU KATLIS */}
                <KajuKatli3D position={[-4.5, 0, -3]} scale={1.1} floatSpeed={0.85} />
                <KajuKatli3D position={[2, -3.5, -2]} scale={0.85} floatSpeed={1.05} />

                {/* BARFIS */}
                <Barfi3D position={[0, -2, -5]} scale={0.9} floatSpeed={0.95} color="#FFC0CB" />
                <Barfi3D position={[-6, 1.5, -4]} scale={0.7} floatSpeed={1.15} color="#FFE4B5" />

                {/* Sparkle effects */}
                <GoldenSparkles count={100} />
            </ParallaxScene>
        </Canvas>
    );
}

export default FloatingSweets3D;
