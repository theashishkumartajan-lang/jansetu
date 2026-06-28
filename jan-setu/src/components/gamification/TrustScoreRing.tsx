"use client";

import { motion } from "framer-motion";

interface TrustScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function TrustScoreRing({ score, size = 100, strokeWidth = 8 }: TrustScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(100, Math.max(0, score)) / 100;
  const dashoffset = circumference - progress * circumference;

  const getColor = (s: number) => {
    if (s >= 90) return "#00D4AA";
    if (s >= 70) return "#3B82F6";
    if (s >= 50) return "#FFB800";
    return "#FF6B6B";
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-[#0A2540]">{score}</span>
      </div>
    </div>
  );
}
