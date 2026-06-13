"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  drag: number;
  opacity: number;
}

const ROMANTIC_PALETTE = [
  "#C97A7A", // Rose
  "#B55B5B", // Crimson
  "#DF9F9F", // Rose Medium
  "#D4AF37", // Muted Gold
  "#E6DCD2", // Soft Cream
  "#FAF6F0", // Warm Ivory
];

export default function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: ConfettiParticle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Spawn a burst of particles from the center/bottom
    const spawnBurst = () => {
      const particleCount = 150; // Elegant amount, safe for mobile
      for (let i = 0; i < particleCount; i++) {
        // Explode from bottom center or slightly scattered
        const x = canvas.width / 2;
        const y = canvas.height * 0.75;
        
        // Random angle pointing upwards (-30 to -150 degrees)
        const angle = (Math.random() * 120 + 30) * (Math.PI / 180);
        // Random velocity
        const velocity = Math.random() * 15 + 5;
        
        particles.push({
          x,
          y,
          size: Math.random() * 8 + 4,
          color: ROMANTIC_PALETTE[Math.floor(Math.random() * ROMANTIC_PALETTE.length)],
          speedX: Math.cos(-angle) * velocity,
          speedY: Math.sin(-angle) * velocity,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() * 0.2 - 0.1) * Math.PI,
          gravity: 0.2,
          drag: 0.98,
          opacity: 1,
        });
      }
    };

    spawnBurst();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        // Apply physics
        p.speedX *= p.drag;
        p.speedY = p.speedY * p.drag + p.gravity;
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        
        // Fade out as they fall down
        if (p.y > canvas.height * 0.6) {
          p.opacity -= 0.008;
        }

        // Render particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        
        // Draw flat rectangles representing confetti
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        ctx.restore();

        // Remove dead particles
        if (p.opacity <= 0 || p.y > canvas.height + 20) {
          particles.splice(idx, 1);
        }
      });

      // Continue animating until particles run out
      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50 block"
    />
  );
}
