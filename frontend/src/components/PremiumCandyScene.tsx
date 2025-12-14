import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { shaderMaterial, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader for liquid distortion effect
const DistortionMaterial = shaderMaterial(
    {
        time: 0,
        color: new THREE.Color('#E91E8C'),
        distortion: 0.3,
    },
    // Vertex shader
    `
    uniform float time;
    uniform float distortion;
    varying vec2 vUv;
    varying float vDistort;
    
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vUv = uv;
      float noise = snoise(vec3(position.x * 2.0, position.y * 2.0, time * 0.5));
      vDistort = noise;
      vec3 pos = position;
      pos += normal * noise * distortion;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    // Fragment shader
    `
    uniform vec3 color;
    uniform float time;
    varying vec2 vUv;
    varying float vDistort;
    
    void main() {
      vec3 col = color;
      col = mix(col, col * 1.5, vDistort * 0.5 + 0.5);
      gl_FragColor = vec4(col, 1.0);
    }
  `
);

extend({ DistortionMaterial });

// Declare the custom material for TypeScript
declare global {
    namespace JSX {
        interface IntrinsicElements {
            distortionMaterial: any;
        }
    }
}

// Animated blob with custom shader
function LiquidBlob({
    position,
    color,
    size = 1
}: {
    position: [number, number, number];
    color: string;
    size?: number;
}) {
    const materialRef = useRef<any>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.time = state.clock.elapsedTime;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={2}>
            <mesh position={position} scale={size}>
                <icosahedronGeometry args={[1, 32]} />
                <distortionMaterial
                    ref={materialRef}
                    color={color}
                    distortion={0.4}
                />
            </mesh>
        </Float>
    );
}

// Premium candy with metallic material
function PremiumCandy({
    position,
    color,
    rotationSpeed = 1
}: {
    position: [number, number, number];
    color: string;
    rotationSpeed?: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * rotationSpeed;
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * rotationSpeed;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={2.5}>
            <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.5}
                    speed={3}
                    roughness={0.1}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

// Wrapped candy with realistic geometry
function WrappedCandy3D({
    position,
    color,
}: {
    position: [number, number, number];
    color: string;
}) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
        }
    });

    return (
        <Float speed={1} rotationIntensity={0.2} floatIntensity={1.5}>
            <group ref={groupRef} position={position} scale={0.8}>
                <mesh>
                    <capsuleGeometry args={[0.5, 1, 16, 32]} />
                    <meshStandardMaterial
                        color={color}
                        roughness={0.2}
                        metalness={0.3}
                        envMapIntensity={1}
                    />
                </mesh>
                <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <coneGeometry args={[0.3, 0.5, 6]} />
                    <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
                </mesh>
                <mesh position={[0.9, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                    <coneGeometry args={[0.3, 0.5, 6]} />
                    <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
                </mesh>
            </group>
        </Float>
    );
}

// Chocolate piece
function ChocolatePiece({
    position
}: {
    position: [number, number, number];
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                <sphereGeometry args={[0.7, 32, 32]} />
                <meshStandardMaterial
                    color="#6B3E26"
                    roughness={0.3}
                    metalness={0.1}
                />
            </mesh>
        </Float>
    );
}

// Main Premium 3D Scene
export function PremiumCandyScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 10], fov: 45 }}
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
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
            <pointLight position={[-10, -5, -5]} intensity={0.8} color="#FF69B4" />
            <pointLight position={[10, -5, 5]} intensity={0.5} color="#00BFFF" />

            {/* Liquid blobs with shader distortion */}
            <LiquidBlob position={[4, 2, -3]} color="#E91E8C" size={0.8} />
            <LiquidBlob position={[-4.5, -1, -4]} color="#00BFFF" size={0.6} />

            {/* Premium metallic candies */}
            <PremiumCandy position={[-3.5, 2.5, -2]} color="#FF69B4" rotationSpeed={0.8} />
            <PremiumCandy position={[3, -2.5, -3]} color="#FF6B35" rotationSpeed={1.2} />

            {/* Wrapped candies */}
            <WrappedCandy3D position={[-4, 0, -2]} color="#00BFFF" />
            <WrappedCandy3D position={[4.5, 1, -2.5]} color="#E91E8C" />

            {/* Chocolate */}
            <ChocolatePiece position={[0, -3, -4]} />
        </Canvas>
    );
}

export default PremiumCandyScene;
