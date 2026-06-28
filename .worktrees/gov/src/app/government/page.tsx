"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";
import { IssuesTable } from "@/components/dashboard/IssuesTable";
import { EscalationTimeline } from "@/components/dashboard/EscalationTimeline";
import { DepartmentMetrics } from "@/components/dashboard/DepartmentMetrics";
import { useAppStore } from "@/stores/app-store";
import { DEPARTMENTS as MOCK_DEPARTMENTS, MOCK_ESCALATIONS, MOCK_PREDICTIONS } from "@/data/mock";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Timer,
  TrendingUp,
  MapPin,
  Send,
  Users,
  Bot,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function OverviewCard({
  label,
  value,
  icon,
  color,
  delay,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <GlassCard hover>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function GovernmentPage() {
  const issues = useAppStore((s) => s.issues);
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkTarget, setBulkTarget] = useState("all");

  const totalPending = issues.filter((i) => !["Resolved", "Verified"].includes(i.status)).length;
  const criticalIssues = issues.filter((i) => i.severity === "Critical" && i.status !== "Resolved").length;
  const overdue = issues.filter((i) => {
    const days = Math.floor((Date.now() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return days > 3 && i.status !== "Resolved";
  }).length;
  const resolvedToday = issues.filter((i) => {
    if (!i.resolvedAt) return false;
    const resolved = new Date(i.resolvedAt);
    const now = new Date();
    return resolved.toDateString() === now.toDateString();
  }).length;

  return (
    <div className="min-h-screen bg-[#F6F9FC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Government Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time civic issue monitoring and management</p>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <OverviewCard
            label="Total Pending"
            value={totalPending}
            icon={<Clock className="h-5 w-5 text-white" />}
            color="bg-purple"
            delay={0}
          />
          <OverviewCard
            label="Critical Issues"
            value={criticalIssues}
            icon={<AlertTriangle className="h-5 w-5 text-white" />}
            color="bg-coral"
            delay={0.1}
          />
          <OverviewCard
            label="Overdue"
            value={overdue}
            icon={<Timer className="h-5 w-5 text-white" />}
            color="bg-amber"
            delay={0.2}
          />
          <OverviewCard
            label="Resolved Today"
            value={resolvedToday}
            icon={<CheckCircle2 className="h-5 w-5 text-white" />}
            color="bg-teal"
            delay={0.3}
          />
        </div>

        {/* Issues Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">Issues</h2>
          <IssuesTable issues={issues} />
        </motion.div>

        {/* Escalation + AI Recommendations row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <EscalationTimeline escalations={MOCK_ESCALATIONS} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-foreground">AI Recommendations</h2>
            {MOCK_PREDICTIONS.slice(0, 3).map((pred, idx) => (
              <motion.div
                key={pred.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + idx * 0.1, duration: 0.3 }}
              >
                <GlassCard hover className="border-l-4 border-l-teal">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-teal/10 text-teal">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm text-foreground">{pred.category} Hotspot</h4>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal/10 text-teal">
                          {pred.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{pred.reason}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          Risk score: {pred.riskScore}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3.5 w-3.5" />
                          {pred.timeframe}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Department Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">Department Metrics</h2>
          <DepartmentMetrics departments={MOCK_DEPARTMENTS} />
        </motion.div>

        {/* Communication Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">Bulk Communication</h2>
          <GlassCard>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">Message</Label>
                  <Textarea
                    placeholder="Type your notification message here..."
                    value={bulkMessage}
                    onChange={(e) => setBulkMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button className="gap-2">
                    <Send className="h-4 w-4" />
                    Send Notification
                  </Button>
                  <span className="text-xs text-muted-foreground">{bulkMessage.length} characters</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground mb-1.5 block">Target Audience</Label>
                  <div className="space-y-2">
                    {[
                      { id: "all", label: "All Citizens", icon: <Users className="h-4 w-4" /> },
                      { id: "affected", label: "Affected Areas", icon: <MapPin className="h-4 w-4" /> },
                      { id: "staff", label: "Department Staff", icon: <Lightbulb className="h-4 w-4" /> },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setBulkTarget(opt.id)}
                        className={`w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          bulkTarget === opt.id
                            ? "border-teal bg-teal/5 text-foreground"
                            : "border-border bg-transparent text-muted-foreground hover:bg-muted/50"
                        }`}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
