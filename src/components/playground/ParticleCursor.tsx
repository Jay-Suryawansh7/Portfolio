"use client";

import React, { useEffect, useRef } from "react";

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function ParticleCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 300;
    canvas.height = canvas.parentElement?.clientHeight || 200;

    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.1)"; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesRef.current.length; i++) {
        particlesRef.current[i].update();
        particlesRef.current[i].draw(ctx);

        if (particlesRef.current[i].size <= 0.2) {
            particlesRef.current.splice(i, 1);
            i--;
        }
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
        
        // Spawn particles
        for (let i = 0; i < 2; i++) {
            particlesRef.current.push(new Particle(mouseRef.current.x, mouseRef.current.y));
        }
    };

    // Explosion click
    const handleClick = () => {
        for(let i=0; i<20; i++) {
            particlesRef.current.push(new Particle(mouseRef.current.x, mouseRef.current.y));
        }
    }
    
    const handleResize = () => {
         canvas.width = canvas.parentElement?.clientWidth || 300;
         canvas.height = canvas.parentElement?.clientHeight || 200;
    };


    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full h-full bg-black relative overflow-hidden cursor-none">
       <canvas ref={canvasRef} className="absolute inset-0 block" />
       <div className="absolute bottom-2 left-2 text-xs font-mono text-gray-500 opacity-50 pointer-events-none">
         INTERACT_WITH_MOUSE
       </div>
    </div>
  );
}
