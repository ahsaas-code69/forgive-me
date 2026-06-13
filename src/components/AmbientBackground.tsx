"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 35; // Keep it low and lightweight for mobile GPU safety

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initialize particles
    const createParticle = (yOffset = 0): Particle => {
      const size = Math.random() * 4 + 1; // 1px to 5px particles
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + yOffset + (Math.random() * 20),
        size,
        speedY: -(Math.random() * 0.4 + 0.1), // Slow upward drift
        speedX: Math.random() * 0.2 - 0.1, // Subtle horizontal sway
        opacity: Math.random() * 0.3 + 0.1, // Soft opacity
        fadeSpeed: Math.random() * 0.002 + 0.001,
      };
    };

    for (let i = 0; i < maxParticles; i++) {
      // Scatter initial particles across the screen height
      particles.push(createParticle(-Math.random() * canvas.height));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle ambient gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.1,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, "rgba(13, 12, 11, 0.45)");
      gradient.addColorStop(1, "rgba(42, 31, 31, 0.2)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Subtle opacity oscillation
        p.opacity += p.fadeSpeed;
        if (p.opacity > 0.45 || p.opacity < 0.05) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Keep opacity positive
        const drawOpacity = Math.max(0.01, p.opacity);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Soft warm rose gold ember color
        ctx.fillStyle = `rgba(201, 122, 122, ${drawOpacity})`;
        ctx.shadowBlur = p.size * 1.5;
        ctx.shadowColor = "rgba(201, 122, 122, 0.4)";
        ctx.fill();

        // Reset particle if it drifts off the top or sides
        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          particles[idx] = createParticle(10);
        }
      });

      // Clear shadow properties for performance
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Fixed full-screen canvas for particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none -z-20 block"
      />
      {/* Film Grain overlay */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-grain opacity-100 mix-blend-multiply" />
    </>
  );
}
