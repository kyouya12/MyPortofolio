"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  rx: number;           // Fractional X position (0 to 1)
  ry: number;           // Fractional Y position (0 to 1)
  vx: number;           // Velocity X (fractional per frame)
  vy: number;           // Velocity Y (fractional per frame)
  depth: number;        // Parallax depth factor (0.1 to 1.0)
  size: number;         // Sizing of star in pixels
  color: string;        // RGB color string
  opacity: number;      // Base opacity (0 to 1)
  twinkle: number;      // Twinkle phase offset
  twinkleSpeed: number; // Twinkle frequency
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, vx: 0, vy: 0 });
  const easedMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Initialize positions
    mouseRef.current = { x: width / 2, y: height / 2, lastX: width / 2, lastY: height / 2, vx: 0, vy: 0 };
    easedMouseRef.current = { x: width / 2, y: height / 2 };

    const generateStars = () => {
      const stars: Star[] = [];
      const starsCount = 350;

      for (let i = 0; i < starsCount; i++) {
        const rx = Math.random();
        const ry = Math.random();
        const depth = 0.1 + Math.random() * 0.9;

        // Size and base opacity scale with depth
        const size = 0.3 + depth * 1.5;
        const opacity = 0.15 + depth * 0.7;

        // Twinkle properties
        const twinkle = Math.random() * Math.PI * 2;
        const twinkleSpeed = 0.008 + Math.random() * 0.02;

        // Color mapping
        let color = "255, 255, 255";
        const colorRand = Math.random();
        if (colorRand > 0.85) {
          color = "165, 243, 252"; // Soft Cyan
        } else if (colorRand > 0.75) {
          color = "132, 204, 22";   // Brand Lime Green
        } else if (colorRand > 0.65) {
          color = "196, 181, 253"; // Soft Violet
        } else {
          color = Math.random() > 0.5 ? "255, 255, 255" : "254, 254, 240";
        }

        // Star drift velocity: slow, gentle float in random directions
        // Foreground stars drift slightly faster than background stars
        const floatAngle = Math.random() * Math.PI * 2;
        const floatSpeed = (0.00001 + Math.random() * 0.00003) * depth;
        const vx = Math.cos(floatAngle) * floatSpeed;
        const vy = Math.sin(floatAngle) * floatSpeed;

        stars.push({
          rx,
          ry,
          vx,
          vy,
          depth,
          size,
          color,
          opacity,
          twinkle,
          twinkleSpeed,
        });
      }

      starsRef.current = stars;
    };

    generateStars();

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse coordinates and calculate mouse drag speed (wind force)
    const handleMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Calculate instantaneous speed of cursor movement
      const dx = mouse.x - mouse.lastX;
      const dy = mouse.y - mouse.lastY;

      // Add to accumulated velocity (fractional units)
      // Dividing by width/height to get screen-independent fractional force
      mouse.vx += (dx / width) * 0.12;
      mouse.vy += (dy / height) * 0.12;

      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      const dpr = window.devicePixelRatio || 1;

      ctx.clearRect(0, 0, width * dpr, height * dpr);

      const mouse = mouseRef.current;

      // Decay mouse velocity (friction) to slowly return stars to their standard float speed
      mouse.vx *= 0.94;
      mouse.vy *= 0.94;

      // Smoothly ease mouse movement coordinates for fluid parallax shifts
      easedMouseRef.current.x += (mouse.x - easedMouseRef.current.x) * 0.05;
      easedMouseRef.current.y += (mouse.y - easedMouseRef.current.y) * 0.05;

      ctx.save();
      ctx.scale(dpr, dpr);

      const stars = starsRef.current;
      const midX = width / 2;
      const midY = height / 2;

      // Parallax offset variables based on eased cursor position
      const mouseDx = easedMouseRef.current.x - midX;
      const mouseDy = easedMouseRef.current.y - midY;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // 1. Move stars: standard float drift + interactive cosmic wind from mouse speed
        // Foreground stars react more heavily to mouse velocity, enhancing depth
        const windForceX = mouse.vx * star.depth * 0.8;
        const windForceY = mouse.vy * star.depth * 0.8;

        star.rx += star.vx + windForceX;
        star.ry += star.vy + windForceY;

        // Wrap around fractional screen boundaries [0, 1]
        if (star.rx < 0) star.rx += 1;
        if (star.rx > 1) star.rx -= 1;
        if (star.ry < 0) star.ry += 1;
        if (star.ry > 1) star.ry -= 1;

        // 2. Parallax offset: shift stars slightly opposite of cursor position
        const parallaxOffsetX = -mouseDx * star.depth * 0.035;
        const parallaxOffsetY = -mouseDy * star.depth * 0.035;

        // Absolute rendering coordinates
        const starX = star.rx * width + parallaxOffsetX;
        const starY = star.ry * height + parallaxOffsetY;

        // 3. Twinkle modulation
        star.twinkle += star.twinkleSpeed;
        const currentOpacity = star.opacity * (0.15 + 0.85 * Math.abs(Math.sin(star.twinkle)));

        // 4. Render Star Dot
        ctx.beginPath();
        ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${currentOpacity})`;

        // Glow halo for larger foreground stars
        if (star.size > 1.2 && star.depth > 0.7) {
          ctx.shadowColor = `rgba(${star.color}, 0.6)`;
          ctx.shadowBlur = 5;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block z-0 pointer-events-none opacity-80"
    />
  );
}
