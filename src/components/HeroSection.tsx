"use client";

import React, { useRef, useMemo, Suspense, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Text3D, Center, OrbitControls, Environment, Float, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three-stdlib";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

// ==========================================
// 3D Components
// ==========================================

function ParticleText({ text = "JAY" }: { text?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  // State for particles
  const [points, setPoints] = useState<{ position: THREE.Vector3; initial: THREE.Vector3; }[]>([]);

  useEffect(() => {
    // Only sample if the mesh is ready and has geometry
    const timer = setTimeout(() => {
        if (meshRef.current && meshRef.current.geometry) {
            meshRef.current.geometry.computeBoundingBox();
            const sampler = new MeshSurfaceSampler(meshRef.current).build();
            const tempPosition = new THREE.Vector3();
            const generatedPoints = [];
            const count = 2500; // Particle count

            for (let i = 0; i < count; i++) {
                sampler.sample(tempPosition);
                generatedPoints.push({
                    position: tempPosition.clone(),
                    initial: tempPosition.clone()
                });
            }
            setPoints(generatedPoints);
        }
    }, 500); // Delay for font load
    
    return () => clearTimeout(timer);
  }, [text]);

  useFrame((state) => {
    if (!particlesRef.current || points.length === 0) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const mouseVec = new THREE.Vector3(mouseX, mouseY, 0);

    for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const px = i * 3;
        const py = i * 3 + 1;
        const pz = i * 3 + 2;

        const currentPos = new THREE.Vector3(positions[px], positions[py], positions[pz]);
        
        // Repel force
        const dist = currentPos.distanceTo(mouseVec);
        const repelRadius = 4;
        const repelStrength = 3;

        let targetX = pt.initial.x;
        let targetY = pt.initial.y;
        let targetZ = pt.initial.z;

        // Float / Wave effect
        targetY += Math.sin(time * 1.5 + pt.initial.x * 0.5) * 0.1;
        targetZ += Math.cos(time * 1.2 + pt.initial.y * 0.5) * 0.1;

        if (dist < repelRadius) {
            const dir = currentPos.clone().sub(mouseVec).normalize();
            const force = (repelRadius - dist) / repelRadius;
            targetX += dir.x * force * repelStrength;
            targetY += dir.y * force * repelStrength;
            targetZ += dir.z * force * repelStrength;
        }

        positions[px] += (targetX - positions[px]) * 0.1;
        positions[py] += (targetY - positions[py]) * 0.1;
        positions[pz] += (targetZ - positions[pz]) * 0.1;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
        <Center onCentered={() => {}}>
            <Text3D 
                ref={meshRef as any} // eslint-disable-line @typescript-eslint/no-explicit-any
                font="/fonts/helvetiker_bold.typeface.json"
                size={4}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                visible={false} 
            >
                {text}
                <meshBasicMaterial color="white" />
            </Text3D>
        </Center>

        {points.length > 0 && (
            <Center>
                <points ref={particlesRef}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[new Float32Array(points.length * 3).map((_, i) => {
                                const ptIndex = Math.floor(i/3);
                                const axis = i % 3;
                                return axis === 0 ? points[ptIndex].initial.x : axis === 1 ? points[ptIndex].initial.y : points[ptIndex].initial.z;
                            }), 3]}
                        />
                    </bufferGeometry>
                    <pointsMaterial
                        size={0.06}
                        color="#00f5ff"
                        transparent
                        opacity={0.8}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </points>
            </Center>
        )}
    </group>
  );
}

function FloatingParticles() {
    const count = 100;
    const mesh = useRef<THREE.Points>(null);

    const [particles] = useState<Float32Array | null>(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            const z = (Math.random() - 0.5) * 50;
            temp[i * 3] = x;
            temp[i * 3 + 1] = y;
            temp[i * 3 + 2] = z;
        }
        return temp;
    });

    useFrame(() => {
       if(!mesh.current) return;
       mesh.current.rotation.y += 0.001;
       mesh.current.rotation.z += 0.0005;
    });

    if (!particles) return null;

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.1} color="#a855f7" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </points>
    );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
         <ParticleText text="JAY" />
      </Float>

      <FloatingParticles />
      <Environment preset="city" />
    </>
  );
}

export default function HeroSection() {
  return (
    <section id="hero" className="w-full h-screen relative bg-dark-base overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
            <Suspense fallback={null}>
                <Scene />
            </Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-dark-base/50 to-dark-base pointer-events-none" />

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none"> 
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center space-y-8 pointer-events-auto px-4"
         >
            <h2 className="text-sm md:text-xl font-mono text-cyan-glow tracking-[0.2em] uppercase mb-4">
                Creative Technologist
            </h2>
            
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 tracking-tighter mix-blend-overlay opacity-50 select-none">
                CURIOUS
            </h1>
            
            <p className="text-gray-400 max-w-lg mx-auto text-lg md:text-xl font-light">
                Building products that matter, <br />
                <span className="text-purple-glow">one commit at a time.</span>
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center pt-12">
                <MagneticButton variant="cyan">
                    View Projects
                </MagneticButton>
                <MagneticButton variant="purple">
                    Let&apos;s Talk
                </MagneticButton>
            </div>
         </motion.div>

         <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
         >
            <div className="w-[1px] h-16 bg-gradient-to-b from-cyan-glow to-transparent mx-auto"></div>
         </motion.div>
      </div>
    </section>
  );
}
