"use client";

import { Escalation } from "@/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, ShieldAlert, User } from "lucide-react";
import { MOCK_ISSUES } from "@/data/mock";

interface EscalationTimelineProps {
  escalations: Escalation[];
}

const LEVEL_CONFIG = [
  { label: "L1", days: 3, color: "bg-yellow-400", text: "text-yellow-700", border: "border-yellow-400", bg: "bg-yellow-50" },
  { label: "L2", days: 7, color: "bg-orange-400", text: "text-orange-700", border: "border-orange-400", bg: "bg-orange-50" },
  { label: "L3", days: 15, color: "bg-red-500", text: "text-red-700", border: "border-red-500", bg: "bg-red-50" },
  { label: "L4", days: 30, color: "bg-red-800", text: "text-red-900", border: "border-red-800", bg: "bg-red-100" },
];

function getIssueForEscalation(issueId: string) {
  return MOCK_ISSUES.find((i) => i.id === issueId);
}

function getDaysOpen(createdAt: Date): number {
  const now = new Date();
  const created = new Date(createdAt);
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

export function EscalationTimeline({ escalations }: EscalationTimelineProps) {
  const activeEscalations = escalations.filter((e) => e.status === "Active");

  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-coral" />
          <h3 className="text-lg font-semibold text-foreground">Escalation Timeline</h3>
          <span className="ml-auto text-sm text-muted-foreground">
            {activeEscalations.length} active
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Level bar */}
        <div className="flex items-center justify-between mb-6 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-muted" />
          {LEVEL_CONFIG.map((level, idx) => (
            <div key={level.label} className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${level.color} ring-4 ring-background`}
              >
                {level.label}
              </div>
              <span className="text-xs font-medium text-muted-foreground">{level.days}d</span>
            </div>
          ))}
        </div>

        {/* Escalation cards */}
        <div className="space-y-3">
          {activeEscalations.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">No active escalations.</p>
          ) : (
            activeEscalations.map((esc, idx) => {
              const issue = getIssueForEscalation(esc.issueId);
              const daysOpen = issue ? getDaysOpen(issue.createdAt) : 0;
              const levelCfg = LEVEL_CONFIG[Math.min(esc.level - 1, 3)] || LEVEL_CONFIG[3];

              return (
                <motion.div
                  key={esc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className={`rounded-xl border ${levelCfg.border} ${levelCfg.bg} p-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold text-white ${levelCfg.color}`}>
                          {levelCfg.label}
                        </span>
                        <span className="text-sm font-semibold text-foreground">{esc.issueId}</span>
                        <span className="text-xs text-muted-foreground">{esc.department}</span>
                      </div>
                      <p className="text-sm text-foreground/80 truncate">
                        {issue?.description || "No description available"}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {esc.supervisor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {daysOpen} days open
                        </span>
                      </div>
                    </div>
                    <ShieldAlert className="h-5 w-5 text-coral shrink-0 mt-0.5" />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </GlassCard>
  );
}
