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
  duration = 0.8,
  trigger = "view",
}: ScrollRevealProps) {
  // Translate direction options to X/Y offset values
  const offsets = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
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
        ease: [0.21, 1.02, 0.43, 1.01], // Smooth custom cubic bezier easing
      }}
    >
      {children}
    </motion.div>
  );
}
