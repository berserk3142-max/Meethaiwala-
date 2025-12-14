import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Floating candy sphere with distortion
function CandySphere({
    position,
    color,
    size = 1,
    speed = 1,
    distort = 0.3
}: {
    position: [number, number, number];
    color: string;
    size?: number;
    speed?: number;
    distort?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
            <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={distort}
                    speed={2}
                    roughness={0.2}
                    metalness={0.1}
                />
            </Sphere>
        </Float>
    );
}

// Wrapped candy shape
function WrappedCandy({
    position,
    color
}: {
    position: [number, number, number];
    color: string;
}) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.2;
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={1.5}>
            <group ref={groupRef} position={position}>
                {/* Main candy body */}
                <mesh>
                    <capsuleGeometry args={[0.4, 0.8, 16, 32]} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
                </mesh>
                {/* Left wrapper twist */}
                <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <coneGeometry args={[0.25, 0.4, 8]} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
                </mesh>
                {/* Right wrapper twist */}
                <mesh position={[0.7, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                    <coneGeometry args={[0.25, 0.4, 8]} />
                    <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
                </mesh>
            </group>
        </Float>
    );
}

// Donut/Ring candy
function DonutCandy({
    position,
    color
}: {
    position: [number, number, number];
    color: string;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.8} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                <torusGeometry args={[0.5, 0.2, 16, 32]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
            </mesh>
        </Float>
    );
}

// Main 3D Scene Component
export function CandyScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        >
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff69b4" />

            {/* Pink candy sphere - top right */}
            <CandySphere position={[3.5, 2, -2]} color="#FF69B4" size={0.8} speed={0.8} distort={0.4} />

            {/* Blue candy sphere - left */}
            <CandySphere position={[-4, 0, -1]} color="#00BFFF" size={0.6} speed={1.2} distort={0.3} />

            {/* Orange candy - bottom right */}
            <CandySphere position={[4, -2, -1.5]} color="#FF6B35" size={0.5} speed={1} distort={0.25} />

            {/* Wrapped candy - top left */}
            <WrappedCandy position={[-3.5, 2.5, -1]} color="#00BFFF" />

            {/* Wrapped candy - bottom */}
            <WrappedCandy position={[0, -3, -2]} color="#E91E8C" />

            {/* Donut candy - right side */}
            <DonutCandy position={[5, 0, -2]} color="#FF6B35" />

            <Environment preset="city" />
        </Canvas>
    );
}

// Minimal version for other pages (less intensive)
export function CandySceneLight() {
    return (
        <Canvas
            camera={{ position: [0, 0, 6], fov: 45 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />

            {/* Just a few floating candies */}
            <CandySphere position={[4, 2, -3]} color="#FF69B4" size={0.5} speed={0.6} distort={0.2} />
            <CandySphere position={[-4, -1, -4]} color="#00BFFF" size={0.4} speed={0.8} distort={0.2} />
            <DonutCandy position={[5, -2, -3]} color="#FF6B35" />
        </Canvas>
    );
}

export default CandyScene;
