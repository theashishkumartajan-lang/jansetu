"use client";

import { Department } from "@/types";
import { GlassCard } from "@/components/shared/GlassCard";
import { motion } from "framer-motion";
import {
  Building2,
  Wrench,
  Trash2,
  Droplets,
  Lightbulb,
  Waves,
  TrafficCone,
  TreePine,
} from "lucide-react";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

interface DepartmentMetricsProps {
  departments: Department[];
}

const DEPT_ICON: Record<string, React.ReactNode> = {
  "Public Works": <Wrench className="h-5 w-5" />,
  "Sanitation Dept": <Trash2 className="h-5 w-5" />,
  "Water Board": <Droplets className="h-5 w-5" />,
  "Electrical Dept": <Lightbulb className="h-5 w-5" />,
  "Drainage Board": <Waves className="h-5 w-5" />,
  "Traffic Police": <TrafficCone className="h-5 w-5" />,
  "Parks & Gardens": <TreePine className="h-5 w-5" />,
};

function efficiencyColor(efficiency: number): string {
  if (efficiency >= 90) return "bg-teal";
  if (efficiency >= 70) return "bg-amber";
  return "bg-coral";
}

function efficiencyText(efficiency: number): string {
  if (efficiency >= 90) return "text-teal-700";
  if (efficiency >= 70) return "text-amber-700";
  return "text-coral-700";
}

export function DepartmentMetrics({ departments }: DepartmentMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((dept, idx) => (
        <motion.div
          key={dept.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.35 }}
        >
          <GlassCard hover className="h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/5 text-primary">
                  {DEPT_ICON[dept.name] || <Building2 className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm leading-tight">{dept.name}</h4>
                  <p className="text-xs text-muted-foreground">{dept.category}</p>
                </div>
              </div>
              <span className={`text-lg font-bold ${efficiencyText(dept.efficiency)}`}>
                {dept.efficiency}%
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Efficiency</span>
                <span className="font-medium text-foreground">{dept.efficiency}%</span>
              </div>
              <Progress value={dept.efficiency}>
                <ProgressTrack>
                  <ProgressIndicator className={efficiencyColor(dept.efficiency)} />
                </ProgressTrack>
              </Progress>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted/50 p-2.5">
                <p className="text-xs text-muted-foreground mb-0.5">Assigned</p>
                <p className="font-semibold text-foreground">{dept.assignedIssues}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2.5">
                <p className="text-xs text-muted-foreground mb-0.5">Resolved</p>
                <p className="font-semibold text-foreground">{dept.resolvedIssues}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2.5">
                <p className="text-xs text-muted-foreground mb-0.5">Avg Response</p>
                <p className="font-semibold text-foreground">{dept.avgResolutionTime}d</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2.5">
                <p className="text-xs text-muted-foreground mb-0.5">Staff</p>
                <p className="font-semibold text-foreground">{dept.staffCount}</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
