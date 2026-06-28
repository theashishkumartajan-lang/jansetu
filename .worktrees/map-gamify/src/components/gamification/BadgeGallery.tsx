"use client";

import { motion } from "framer-motion";
import { Shield, Car, Droplets, Trophy, Brain, Zap, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/types";
import { BADGE_INFO } from "@/data/mock";

interface BadgeGalleryProps {
  earnedBadges: Badge[];
}

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6" />,
  Car: <Car className="w-6 h-6" />,
  Droplets: <Droplets className="w-6 h-6" />,
  Trophy: <Trophy className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
};

export function BadgeGallery({ earnedBadges }: BadgeGalleryProps) {
  const allBadges = Object.entries(BADGE_INFO) as [Badge, { icon: string; description: string; requirement: string; color: string }][];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {allBadges.map(([badgeName, info], index) => {
        const isEarned = earnedBadges.includes(badgeName);
        return (
          <motion.div
            key={badgeName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={isEarned ? { scale: 1.03, y: -4 } : undefined}
            className={cn(
              "relative rounded-2xl border p-5 transition-all duration-300",
              isEarned
                ? "bg-white/80 border-white/40 shadow-lg hover:shadow-xl"
                : "bg-slate-50/50 border-slate-200/50 opacity-60"
            )}
          >
            {isEarned && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00D4AA]/5 to-[#635BFF]/5 pointer-events-none" />
            )}
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                  isEarned
                    ? `bg-gradient-to-br ${info.color} text-white shadow-lg`
                    : "bg-slate-200 text-slate-400"
                )}
                style={isEarned ? { filter: `drop-shadow(0 4px 12px ${info.color.includes("blue") ? "#635BFF" : info.color.includes("cyan") ? "#00D4AA" : info.color.includes("yellow") ? "#FFB800" : "#FF6B6B"}40)` } : undefined}
              >
                {isEarned ? iconMap[info.icon] : <Lock className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={cn("font-semibold text-sm", isEarned ? "text-[#0A2540]" : "text-slate-400")}>
                  {badgeName}
                </h4>
                <p className={cn("text-xs mt-0.5 leading-relaxed", isEarned ? "text-muted-foreground" : "text-slate-300")}>
                  {info.description}
                </p>
                <p className={cn("text-[10px] mt-2 font-medium uppercase tracking-wider", isEarned ? "text-[#00D4AA]" : "text-slate-300")}>
                  {isEarned ? "Earned" : info.requirement}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
