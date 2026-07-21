import React from "react";
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from "framer-motion";

/**
 * Reusable 3D Tilt Card wrapper using Framer Motion spring physics with dynamic specular glare.
 * Optimized for both Light and Dark themes.
 */
export default function TiltCard({ children, className = "", glowClass = "" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Mouse tilt spring transforms
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 300,
    damping: 25,
  });

  // Dynamic Specular Glare Coordinates
  const glareX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 75%)`;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`perspective-1000 glass-card rounded-3xl p-6 flex justify-between items-start relative overflow-hidden group transition-all border ${glowClass} ${className}`}
    >
      {/* Dynamic Specular Light Glare sheen for both Light & Dark modes */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{
          background: glareBackground,
        }}
      />
      {children}
    </motion.div>
  );
}
