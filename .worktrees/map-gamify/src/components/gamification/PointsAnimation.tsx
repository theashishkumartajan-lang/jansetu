"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface PointsAnimationProps {
  points: number;
  message?: string;
  onComplete?: () => void;
}

export function PointsAnimation({ points, message, onComplete }: PointsAnimationProps) {
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 120,
      y: (Math.random() - 0.5) * 120,
      color: ["#00D4AA", "#635BFF", "#FFB800", "#FF6B6B"][i % 4],
      delay: Math.random() * 0.3,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Confetti particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: p.color }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: p.x,
            y: p.y - 80,
            scale: 0.2,
          }}
          transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
        />
      ))}

      {/* Floating points */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, y: 20, scale: 0.5 }}
        animate={{ opacity: 1, y: -60, scale: 1.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#00D4AA] to-[#635BFF] px-6 py-3 text-white font-bold text-xl shadow-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Zap className="w-5 h-5 fill-white" />
          +{points} Points
        </motion.div>
        {message && (
          <motion.p
            className="mt-2 text-sm font-medium text-[#0A2540] bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
