"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  ttl: number;
  speed: number;
  hue: number;
}

interface VortexProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  particleCount?: number;
  rangeY?: number;
  baseHue?: number;
  baseSpeed?: number;
  rangeSpeed?: number;
  baseRadius?: number;
  rangeRadius?: number;
  backgroundColor?: string;
}

const Vortex: React.FC<VortexProps> = ({
  children,
  className,
  containerClassName,
  particleCount = 700,
  rangeY = 100,
  baseHue = 220,
  baseSpeed = 0.0,
  rangeSpeed = 1.5,
  baseRadius = 1,
  rangeRadius = 2,
  backgroundColor = "#000000",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlePropCount = 9;
  const particlePropsLength = particleCount * particlePropCount;
  const baseTTL = 50;
  const rangeTTL = 150;
  const rangeHue = 100;
  const noiseSteps = 3;
  const xOff = 0.00125;
  const yOff = 0.00125;
  const zOff = 0.0005;
  let tick = 0;
  let particles: Particle[] = [];
  const center: [number, number] = [0, 0];

  // Constants
  const HALF_PI: number = 0.5 * Math.PI;
  const TAU: number = 2 * Math.PI;
  const TO_RAD: number = Math.PI / 180;

  // Helper functions
  const rand = (n: number): number => n * Math.random();
  const randRange = (n: number): number => n - rand(2 * n);
  const fadeInOut = (t: number, m: number): number => {
    const hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  };
  const lerp = (n1: number, n2: number, speed: number): number =>
    (1 - speed) * n1 + speed * n2;

  // Simplified noise3D function (you'll need to implement or import a proper noise function)
  const noise3D = (x: number, y: number, z: number): number => {
    // Implement proper noise function or use a library like simplex-noise
    return Math.random();
  };

  const initParticle = (i: number): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particle: Particle = {
      x: rand(canvas.width),
      y: center[1] + randRange(rangeY),
      size: baseRadius + rand(rangeRadius),
      speedX: 0,
      speedY: 0,
      life: 0,
      ttl: baseTTL + rand(rangeTTL),
      speed: baseSpeed + rand(rangeSpeed),
      hue: baseHue + rand(rangeHue),
    };

    particles[i] = particle;
  };

  const setup = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    resize(canvas, ctx);
    initParticles();
    draw(canvas, ctx);
  };

  const initParticles = () => {
    tick = 0;
    // simplex = new SimplexNoise();
    particles = [];

    for (let i = 0; i < particleCount; i++) {
      initParticle(i);
    }
  };

  const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    tick++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawParticles(ctx);
    renderGlow(canvas, ctx);
    renderToScreen(canvas, ctx);

    window.requestAnimationFrame(() => draw(canvas, ctx));
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < particlePropsLength; i += particlePropCount) {
      updateParticle(i, ctx);
    }
  };

  const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const i2 = 1 + i,
      i3 = 2 + i,
      i4 = 3 + i,
      i5 = 4 + i,
      i6 = 5 + i,
      i7 = 6 + i,
      i8 = 7 + i,
      i9 = 8 + i;

    const x: number = particles[i].x;
    const y: number = particles[i].y;
    const n: number = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
    const vx: number = lerp(particles[i].speedX, Math.cos(n), 0.5);
    const vy: number = lerp(particles[i].speedY, Math.sin(n), 0.5);
    let life: number = particles[i].life;
    const ttl: number = particles[i].ttl;
    const speed: number = particles[i].speed;
    const x2: number = x + vx * speed;
    const y2: number = y + vy * speed;
    const radius: number = particles[i].size;
    const hue: number = particles[i].hue;

    drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

    life++;

    particles[i].x = x2;
    particles[i].y = y2;
    particles[i].speedX = vx;
    particles[i].speedY = vy;
    particles[i].life = life;

    if (checkBounds(x, y, canvas) || life > ttl) {
      initParticle(i);
    }
  };

  const drawParticle = (
    x: number,
    y: number,
    x2: number,
    y2: number,
    life: number,
    ttl: number,
    radius: number,
    hue: number,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineWidth = radius;
    ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };

  const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) => {
    return x > canvas.width || x < 0 || y > canvas.height || y < 0;
  };

  const resize = (
    canvas: HTMLCanvasElement,
    ctx?: CanvasRenderingContext2D
  ) => {
    const { innerWidth, innerHeight } = window;

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    center[0] = 0.5 * canvas.width;
    center[1] = 0.5 * canvas.height;
  };

  const renderGlow = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.filter = "blur(8px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.filter = "blur(4px) brightness(200%)";
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  const renderToScreen = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  };

  useEffect(() => {
    setup();
    const handleResize = (): void => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      resize(canvas, ctx);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={cn("relative h-full w-full", containerClassName)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={containerRef}
        className="absolute h-full w-full inset-0 z-0 bg-transparent flex items-center justify-center"
      >
        <canvas ref={canvasRef}></canvas>
      </motion.div>

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};

export default Vortex;
