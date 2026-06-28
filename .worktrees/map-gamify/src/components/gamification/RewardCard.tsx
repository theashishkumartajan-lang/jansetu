"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, Coins, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface RewardCardProps {
  points: number;
  badge?: string;
  message: string;
  onDismiss?: () => void;
}

export function RewardCard({ points, badge, message, onDismiss }: RewardCardProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <motion.div
      className={cn(
        "fixed top-24 right-4 z-50 w-80 rounded-2xl border p-4 shadow-xl backdrop-blur-xl",
        "bg-white/90 border-white/40"
      )}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#00D4AA] to-[#635BFF] flex items-center justify-center">
          {badge ? (
            <Award className="w-6 h-6 text-white" />
          ) : (
            <Coins className="w-6 h-6 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#0A2540] text-sm">
            {badge ? `New Badge: ${badge}` : "Points Earned!"}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{message}</p>
          <div className="flex items-center gap-1 mt-2">
            <Gift className="w-3.5 h-3.5 text-[#00D4AA]" />
            <span className="text-sm font-bold text-[#00D4AA]">+{points} points</span>
          </div>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(() => onDismiss?.(), 300);
          }}
          className="flex-shrink-0 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      {/* Progress bar for auto-dismiss */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#00D4AA] to-[#635BFF] rounded-b-2xl"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
      />
    </motion.div>
  );
}
