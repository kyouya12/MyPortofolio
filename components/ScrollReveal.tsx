"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  trigger?: "view" | "mount";
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  duration = 0.35,
  trigger = "view",
}: ScrollRevealProps) {
  // Translate direction options to X/Y offset values
  const offsets = {
    up: { y: 15, x: 0 },
    down: { y: -15, x: 0 },
    left: { x: 15, y: 0 },
    right: { x: -15, y: 0 },
  };

  const animProps =
    trigger === "mount"
      ? {
          initial: {
            opacity: 0,
            ...offsets[direction],
          },
          animate: {
            opacity: 1,
            x: 0,
            y: 0,
          },
        }
      : {
          initial: {
            opacity: 0,
            ...offsets[direction],
          },
          whileInView: {
            opacity: 1,
            x: 0,
            y: 0,
          },
          viewport: { once: true, amount: 0.15 },
        };

  return (
    <motion.div
      {...animProps}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // Snappy easeOutExpo
      }}
    >
      {children}
    </motion.div>
  );
}
