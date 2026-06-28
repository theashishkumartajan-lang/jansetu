"use client";

import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  AnalyticsCharts,
  IssueTrendsChart,
  DepartmentEfficiencyChart,
  StatusDistributionChart,
  EngagementChart,
  SeverityDistributionChart,
} from "@/components/dashboard/AnalyticsCharts";
import { useAppStore } from "@/stores/app-store";
import { DEPARTMENTS as MOCK_DEPARTMENTS, MOCK_PREDICTIONS } from "@/data/mock";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Activity,
  MapPin,
  Shield,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

function AnimatedScore({ target }: { target: number }) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    motionValue.set(target);
  }, [target, motionValue]);

  return <motion.span>{display}</motion.span>;
}

function CityHealthScore() {
  const score = 78;
  const status = score >= 80 ? "Good" : score >= 60 ? "Moderate" : "Critical";
  const statusColor = score >= 80 ? "text-teal" : score >= 60 ? "text-amber" : "text-coral";
  const statusBg = score >= 80 ? "bg-teal/10" : score >= 60 ? "bg-amber/10" : "bg-coral/10";
  const trend = 4;

  return (
    <GlassCard glow className="flex items-center gap-6">
      <div className="relative">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(10,37,64,0.08)" strokeWidth="10" />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#00D4AA"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={326.73}
            initial={{ strokeDashoffset: 326.73 }}
            animate={{ strokeDashoffset: 326.73 - (326.73 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">
            <AnimatedScore target={score} />
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-lg font-semibold text-foreground">City Health Score</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBg} ${statusColor}`}>
            {status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Overall civic health based on resolution rate, response time, and active issues.
        </p>
        <div className="flex items-center gap-2 text-sm">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-teal" />
          ) : (
            <TrendingDown className="h-4 w-4 text-coral" />
          )}
          <span className={trend > 0 ? "text-teal" : "text-coral"}>
            {trend > 0 ? "+" : ""}{trend}% from last month
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

function AreaRiskCards() {
  const areas = [
    { name: "Andheri West", risk: 85, issues: 12, trend: "up" },
    { name: "Bandra East", risk: 62, issues: 8, trend: "stable" },
    { name: "Dadar", risk: 45, issues: 5, trend: "down" },
    { name: "Worli", risk: 72, issues: 9, trend: "up" },
    { name: "Goregaon", risk: 55, issues: 6, trend: "stable" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {areas.map((area, idx) => (
        <motion.div
          key={area.name}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + idx * 0.06, duration: 0.3 }}
        >
          <GlassCard hover className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{area.name}</span>
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-2xl font-bold ${
                area.risk >= 70 ? "text-coral" : area.risk >= 50 ? "text-amber" : "text-teal"
              }`}>
                {area.risk}
              </span>
              <span className="text-xs text-muted-foreground mb-1">risk score</span>
            </div>
            <Progress value={area.risk}>
              <ProgressTrack>
                <ProgressIndicator className={
                  area.risk >= 70 ? "bg-coral" : area.risk >= 50 ? "bg-amber" : "bg-teal"
                } />
              </ProgressTrack>
            </Progress>
            <p className="text-xs text-muted-foreground mt-2">{area.issues} active issues</p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}

function PredictionsPanel() {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Predicted Hotspots</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_PREDICTIONS.map((pred, idx) => (
          <motion.div
            key={pred.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.08, duration: 0.3 }}
          >
            <GlassCard hover>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">{pred.category}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  pred.riskScore >= 80 ? "bg-coral/10 text-coral" :
                  pred.riskScore >= 60 ? "bg-amber/10 text-amber" : "bg-teal/10 text-teal"
                }`}>
                  {pred.riskScore}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{pred.reason}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  {pred.confidence}% confidence
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {pred.timeframe}
                </span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const issues = useAppStore((s) => s.issues);

  return (
    <div className="min-h-screen bg-[#F6F9FC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Public Analytics</h1>
          <p className="text-muted-foreground mt-1">Transparency and insights into civic issue resolution</p>
        </motion.div>

        {/* City Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <CityHealthScore />
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IssueTrendsChart />
            <DepartmentEfficiencyChart departments={MOCK_DEPARTMENTS} />
            <StatusDistributionChart issues={issues} />
            <EngagementChart />
            <SeverityDistributionChart issues={issues} />
            <GlassCard className="h-[340px] flex flex-col">
              <h4 className="text-sm font-semibold text-foreground mb-4">Resolution Metrics</h4>
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                {(() => {
                  const total = issues.length;
                  const resolved = issues.filter((i) => i.status === "Resolved" || i.status === "Verified").length;
                  const inProgress = issues.filter((i) => i.status === "In_Progress").length;
                  const pending = issues.filter((i) => !["Resolved", "Verified", "In_Progress"].includes(i.status)).length;
                  const avgDays = Math.round(
                    issues.reduce((sum, i) => {
                      const days = Math.floor((Date.now() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                      return sum + days;
                    }, 0) / total
                  );
                  return (
                    <>
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="rounded-xl bg-muted/50 p-4 text-center">
                          <p className="text-2xl font-bold text-teal">{resolved}</p>
                          <p className="text-xs text-muted-foreground mt-1">Resolved</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-4 text-center">
                          <p className="text-2xl font-bold text-purple">{inProgress}</p>
                          <p className="text-xs text-muted-foreground mt-1">In Progress</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-4 text-center">
                          <p className="text-2xl font-bold text-amber">{pending}</p>
                          <p className="text-xs text-muted-foreground mt-1">Pending</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-4 text-center">
                          <p className="text-2xl font-bold text-foreground">{avgDays}d</p>
                          <p className="text-xs text-muted-foreground mt-1">Avg Age</p>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Area Risk Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-semibold text-foreground">Area Risk Scores</h2>
          <AreaRiskCards />
        </motion.div>

        {/* Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <PredictionsPanel />
        </motion.div>
      </div>
    </div>
  );
}
