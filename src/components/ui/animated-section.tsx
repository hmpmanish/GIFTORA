"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  const directions = {
    up: { y: 60, x: 0, scale: 1 },
    down: { y: -60, x: 0, scale: 1 },
    left: { x: 60, y: 0, scale: 1 },
    right: { x: -60, y: 0, scale: 1 },
    scale: { x: 0, y: 0, scale: 0.8 },
    none: { x: 0, y: 0, scale: 1 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
        delay: delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
