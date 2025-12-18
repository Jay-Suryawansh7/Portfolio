"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import CodeDNA from "./CodeDNA";
import dynamic from "next/dynamic";

const View = dynamic(() => import("@react-three/drei").then((mod) => mod.View), {
    ssr: false,
    loading: () => null
})

export default function SignatureSection() {
  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center bg-dark-base overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-transparent to-dark-base pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-dark-base to-dark-base" />

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
             <ambientLight intensity={0.5} />
             <pointLight position={[10, 10, 10]} intensity={1} />
             <CodeDNA />
             <ContactShadows opacity={0.4} scale={20} blur={2} far={4} />
             <Environment preset="city" />
             <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                autoRotate 
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
             />
          </Suspense>
        </Canvas>
      </div>

      {/* Overlay Content */}
      <div className="relative z-20 text-center pointer-events-none max-w-4xl px-4">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-gray-400 mb-4 tracking-tighter"
          >
            ENGINEERING
            <br />
            IS MY DNA
          </motion.h2>
          <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide mb-8">
            Crafting digital evolution through clean code and complex logic.
          </p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-sm text-cyan-500/50 font-mono"
          >
            DRAG TO ROTATE
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
