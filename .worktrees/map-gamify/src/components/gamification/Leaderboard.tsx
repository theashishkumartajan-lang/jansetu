"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardEntry } from "@/types";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export function Leaderboard({ entries, currentUserId }: LeaderboardProps) {
  const [sortBy, setSortBy] = useState<"points" | "reports" | "verified">("points");
  const sorted = [...entries].sort((a, b) => b[sortBy] - a[sortBy]);

  const rankStyles = [
    "bg-gradient-to-r from-yellow-400/20 to-amber-500/10 border-yellow-400/30",
    "bg-gradient-to-r from-slate-300/20 to-slate-400/10 border-slate-300/30",
    "bg-gradient-to-r from-orange-400/20 to-amber-600/10 border-orange-400/30",
  ];

  const rankIcons = [
    <Trophy key="1" className="w-5 h-5 text-yellow-500" />,
    <Medal key="2" className="w-5 h-5 text-slate-400" />,
    <Medal key="3" className="w-5 h-5 text-orange-400" />,
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contributor</th>
            <th className="text-right py-3 px-4">
              <button
                onClick={() => setSortBy("points")}
                className={cn(
                  "flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors",
                  sortBy === "points" ? "text-[#00D4AA]" : "text-muted-foreground hover:text-[#0A2540]"
                )}
              >
                Points <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="text-right py-3 px-4">
              <button
                onClick={() => setSortBy("reports")}
                className={cn(
                  "flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors ml-auto",
                  sortBy === "reports" ? "text-[#00D4AA]" : "text-muted-foreground hover:text-[#0A2540]"
                )}
              >
                Reports <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="text-right py-3 px-4">
              <button
                onClick={() => setSortBy("verified")}
                className={cn(
                  "flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors ml-auto",
                  sortBy === "verified" ? "text-[#00D4AA]" : "text-muted-foreground hover:text-[#0A2540]"
                )}
              >
                Verified <ArrowUpDown className="w-3 h-3" />
              </button>
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Area</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;
            const rank = index + 1;
            return (
              <motion.tr
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "border-b border-slate-100/50 transition-colors",
                  isCurrentUser && "bg-[#00D4AA]/5",
                  rank <= 3 && rankStyles[rank - 1]
                )}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full">
                    {rank <= 3 ? (
                      rankIcons[rank - 1]
                    ) : (
                      <span className="text-sm font-semibold text-muted-foreground">{rank}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border-2 border-white shadow-sm">
                      <AvatarImage src={entry.avatar} alt={entry.name} />
                      <AvatarFallback className="bg-[#0A2540] text-white text-xs">
                        {entry.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={cn("text-sm font-medium", isCurrentUser ? "text-[#00D4AA]" : "text-[#0A2540]")}>
                        {entry.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-[10px] font-semibold bg-[#00D4AA]/10 text-[#00D4AA] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            You
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-bold text-[#0A2540]">{entry.points.toLocaleString()}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-muted-foreground">{entry.reports}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-muted-foreground">{entry.verified}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-muted-foreground">{entry.area}</span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
