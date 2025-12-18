"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Float } from "@react-three/drei";
import * as THREE from "three";

const SYMBOLS = ["{ }", "</>", "&&", "[]", "()", "=>", ";", "||", "#"];
const HELIX_COUNT = 30;
const RADIUS = 2;
const HEIGHT = 8;

interface DNAStrandProps {
  offset?: number;
  color: string;
}

function DNAStrand({ offset = 0, color }: DNAStrandProps) {
  const points = useMemo(() => {
    return new Array(HELIX_COUNT).fill(0).map((_, i) => {
      const t = i / HELIX_COUNT;
      const angle = t * Math.PI * 4 + offset; // 2 full turns
      const y = (t - 0.5) * HEIGHT;
      const x = Math.cos(angle) * RADIUS;
      const z = Math.sin(angle) * RADIUS;
      return { 
        pos: [x, y, z] as [number, number, number], 
        symbol: SYMBOLS[i % SYMBOLS.length],
        rotation: [0, -angle, 0] as [number, number, number]
      };
    });
  }, [offset]);

  return (
    <group>
      {points.map((point, i) => (
        <Float 
          key={i} 
          speed={2} 
          rotationIntensity={0.2} 
          floatIntensity={0.2} 
          position={point.pos}
        >
          <Text
            color={color}
            fontSize={0.4}
            // font="/fonts/JetBrainsMono-Bold.ttf" // Commented out to rely on default for now to avoid 404
            anchorX="center"
            anchorY="middle"
            rotation={point.rotation}
          >
            {point.symbol}
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
          </Text>
        </Float>
      ))}
    </group>
  );
}

function Connections({ color }: { color: string }) {
   const lines = useMemo(() => {
    return new Array(HELIX_COUNT).fill(0).map((_, i) => {
        const t = i / HELIX_COUNT;
        const angle1 = t * Math.PI * 4;
        const angle2 = t * Math.PI * 4 + Math.PI;
        const y = (t - 0.5) * HEIGHT;
        
        const x1 = Math.cos(angle1) * RADIUS;
        const z1 = Math.sin(angle1) * RADIUS;
        
        const x2 = Math.cos(angle2) * RADIUS;
        const z2 = Math.sin(angle2) * RADIUS;
        
        return [
            new THREE.Vector3(x1, y, z1),
            new THREE.Vector3(x2, y, z2)
        ];
    });
   }, [color]); // Added color to dependency for linter happiness, though logic implies it's static structure

   return (
       <group>
           {lines.map((pts, i) => (
               <line key={i}>
                   <bufferGeometry>
                       <bufferAttribute 
                         attach="attributes-position" 
                         count={2} 
                         array={new Float32Array([
                             pts[0].x, pts[0].y, pts[0].z,
                             pts[1].x, pts[1].y, pts[1].z
                         ])} 
                         itemSize={3}
                         args={[new Float32Array([
                             pts[0].x, pts[0].y, pts[0].z,
                             pts[1].x, pts[1].y, pts[1].z
                         ]), 3]}
                        />
                   </bufferGeometry>
                   <lineBasicMaterial color={color} opacity={0.1} transparent />
               </line>
           ))}
       </group>
   )
}


export default function CodeDNA() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2; // Slow rotation
    }
  });

  return (
    <group ref={groupRef}>
      <DNAStrand color="#00f5ff" /> {/* Cyan Strand */}
      <DNAStrand offset={Math.PI} color="#a855f7" /> {/* Purple Strand */}
      {/* <Connections color="#ffffff" />  Optional connectors */}
      
      {/* Floating particles around */}
      <Float speed={1} rotationIntensity={1} floatIntensity={1}>
         <group>
             {new Array(15).fill(0).map((_, i) => {
                 const x = (Math.random() - 0.5) * 10;
                 const y = (Math.random() - 0.5) * 10;
                 const z = (Math.random() - 0.5) * 5;
                 return (
                     <mesh key={i} position={[x, y, z]}>
                         <sphereGeometry args={[0.03, 8, 8]} />
                         <meshBasicMaterial color="white" transparent opacity={0.3} />
                     </mesh>
                 )
             })}
         </group>
      </Float>
    </group>
  );
}
