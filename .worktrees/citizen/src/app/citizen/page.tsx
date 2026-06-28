"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  MapPin,
  Mic,
  Bell,
  Trophy,
  Flame,
  Shield,
  CheckCircle2,
  ChevronRight,
  Clock,
  Star,
  FileText,
  Zap,
  Award,
  Droplets,
  Car,
  Brain,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAppStore } from "@/stores/app-store";
import { useCountUp } from "@/hooks/useCountUp";
import { BADGE_INFO } from "@/data/mock";
import { Issue, Notification } from "@/types";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CitizenPage() {
  const { currentUser, issues, notifications, markNotificationRead } = useAppStore();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "resolved">("all");

  const userIssues = issues.filter((i) => i.userId === currentUser?.id);
  const activeIssues = userIssues.filter((i) => i.status !== "Resolved" && i.status !== "Verified");
  const resolvedIssues = userIssues.filter((i) => i.status === "Resolved" || i.status === "Verified");

  const displayedIssues =
    activeTab === "all" ? userIssues : activeTab === "active" ? activeIssues : resolvedIssues;

  const unreadNotifications = notifications.filter((n) => !n.read && n.userId === currentUser?.id);
  const readNotifications = notifications.filter((n) => n.read && n.userId === currentUser?.id);

  const pointsCount = useCountUp(currentUser?.points || 0, 2000);
  const trustCount = useCountUp(currentUser?.trustScore || 0, 2000);
  const streakCount = useCountUp(currentUser?.streak || 0, 1500);

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    toast("Marked as read");
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          {/* Welcome Banner */}
          <motion.div variants={itemVariants}>
            <GlassCard dark className="mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-64 w-64 opacity-10">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-[#00D4AA] to-[#635BFF] blur-3xl" />
              </div>
              <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar size="lg">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback className="bg-[#00D4AA]/20 text-[#0A2540] font-bold">
                      {currentUser?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-bold text-white">
                      Welcome back, {currentUser?.name?.split(" ")[0] || "Citizen"}!
                    </h1>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Shield className="h-3 w-3" />
                        Trust {trustCount}
                      </Badge>
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Star className="h-3 w-3" />
                        {pointsCount} pts
                      </Badge>
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Flame className="h-3 w-3 text-orange-400" />
                        {streakCount} day streak
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href="/citizen/report">
                    <Button className="gap-2 bg-[#00D4AA] text-[#0A2540] hover:bg-[#00D4AA]/90 shadow-lg shadow-[#00D4AA]/20">
                      <Plus className="h-4 w-4" />
                      Report Issue
                    </Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link href="/citizen/report" className="group">
                <GlassCard hover className="flex items-center gap-4 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00D4AA]/10 text-[#00D4AA] group-hover:bg-[#00D4AA] group-hover:text-white transition-all">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A2540]">Report Issue</p>
                    <p className="text-xs text-slate-500">Photo, voice, or text</p>
                  </div>
                </GlassCard>
              </Link>
              <Link href="/map" className="group">
                <GlassCard hover className="flex items-center gap-4 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#635BFF]/10 text-[#635BFF] group-hover:bg-[#635BFF] group-hover:text-white transition-all">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A2540]">View Map</p>
                    <p className="text-xs text-slate-500">Issues around you</p>
                  </div>
                </GlassCard>
              </Link>
              <Link href="/citizen/report?mode=voice" className="group">
                <GlassCard hover className="flex items-center gap-4 h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B6B]/10 text-[#FF6B6B] group-hover:bg-[#FF6B6B] group-hover:text-white transition-all">
                    <Mic className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A2540]">Voice Report</p>
                    <p className="text-xs text-slate-500">Hands-free reporting</p>
                  </div>
                </GlassCard>
              </Link>
            </div>
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Reports & Notifications */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Reports */}
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#0A2540]">My Reports</h2>
                    <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
                      {(["all", "active", "resolved"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                            activeTab === tab
                              ? "bg-white text-[#0A2540] shadow-sm"
                              : "text-slate-500 hover:text-[#0A2540]"
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {displayedIssues.length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-400">
                        No reports in this category yet.
                      </div>
                    ) : (
                      displayedIssues.map((issue) => (
                        <IssueRow key={issue.id} issue={issue} />
                      ))
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* Notifications Panel */}
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#0A2540]">Notifications</h2>
                    {unreadNotifications.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadNotifications.length} new
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-3">
                    {unreadNotifications.length === 0 && readNotifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-slate-400">No notifications yet.</div>
                    ) : (
                      <>
                        {unreadNotifications.map((n) => (
                          <NotificationRow
                            key={n.id}
                            notification={n}
                            onMarkRead={() => handleMarkRead(n.id)}
                          />
                        ))}
                        {readNotifications.slice(0, 3).map((n) => (
                          <NotificationRow
                            key={n.id}
                            notification={n}
                            onMarkRead={() => {}}
                            read
                          />
                        ))}
                      </>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Right Column - Stats & Rewards */}
            <div className="space-y-6">
              {/* Trust Score Card */}
              <motion.div variants={itemVariants}>
                <GlassCard glow>
                  <h2 className="text-lg font-bold text-[#0A2540] mb-4">Trust Score</h2>
                  <div className="flex items-center justify-center">
                    <div className="relative flex h-32 w-32 items-center justify-center">
                      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="#00D4AA"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${(trustCount / 100) * 264} 264`}
                          initial={{ strokeDasharray: "0 264" }}
                          animate={{ strokeDasharray: `${(trustCount / 100) * 264} 264` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-2xl font-bold text-[#0A2540]">{trustCount}</span>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">out of 100</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <ScoreBar label="Accuracy" value={95} />
                    <ScoreBar label="Consistency" value={88} />
                    <ScoreBar label="Community" value={92} />
                  </div>
                </GlassCard>
              </motion.div>

              {/* Rewards Card */}
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <h2 className="text-lg font-bold text-[#0A2540] mb-2">Rewards</h2>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gradient">{pointsCount}</span>
                      <span className="text-sm text-slate-500">points</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-[#0A2540]">{currentUser?.streak || 0} day streak</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {currentUser?.badges?.map((badge) => {
                        const info = BADGE_INFO[badge];
                        return (
                          <motion.div
                            key={badge}
                            whileHover={{ scale: 1.05 }}
                            className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r ${info?.color || "from-slate-500 to-slate-600"} px-3 py-1.5 text-xs font-medium text-white`}
                          >
                            <BadgeIcon name={info?.icon || "Award"} />
                            {badge}
                          </motion.div>
                        );
                      }) || (
                        <span className="text-xs text-slate-400">No badges yet</span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Quick Stats */}
              <motion.div variants={itemVariants}>
                <GlassCard>
                  <div className="grid grid-cols-2 gap-4">
                    <StatItem
                      icon={<FileText className="h-4 w-4 text-[#635BFF]" />}
                      label="Reports"
                      value={currentUser?.reportsCount || 0}
                    />
                    <StatItem
                      icon={<CheckCircle2 className="h-4 w-4 text-[#00D4AA]" />}
                      label="Verified"
                      value={currentUser?.verifiedCount || 0}
                    />
                    <StatItem
                      icon={<TrendingUp className="h-4 w-4 text-[#FFB800]" />}
                      label="Impact"
                      value={activeIssues.length}
                    />
                    <StatItem
                      icon={<MessageSquare className="h-4 w-4 text-[#FF6B6B]" />}
                      label="Votes"
                      value={userIssues.reduce((sum, i) => sum + i.votes, 0)}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function IssueRow({ issue }: { issue: Issue }) {
  const progress = getIssueProgress(issue.status);
  const statusLabel = issue.status.replace(/_/g, " ");

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-xl border border-slate-200 bg-white/60 p-4 transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-400">{issue.id}</span>
            <StatusBadge status={statusLabel} size="sm" />
            <StatusBadge severity={issue.severity} size="sm" />
          </div>
          <p className="text-sm font-medium text-[#0A2540] truncate">{issue.aiSummary}</p>
          <p className="text-xs text-slate-500 mt-1">
            {issue.location.address} &middot; {new Date(issue.createdAt).toLocaleDateString()}
          </p>
        </div>
        {issue.imageUrl && (
          <img
            src={issue.imageUrl}
            alt="Issue"
            className="h-14 w-14 rounded-lg object-cover shrink-0"
          />
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-500">Progress</span>
          <span className="font-medium text-[#0A2540]">{progress}%</span>
        </div>
        <Progress value={progress}>
          <ProgressTrack className="h-1.5">
            <ProgressIndicator
              className={
                progress >= 80
                  ? "bg-[#00D4AA]"
                  : progress >= 50
                  ? "bg-[#FFB800]"
                  : "bg-[#635BFF]"
              }
            />
          </ProgressTrack>
        </Progress>
      </div>
    </motion.div>
  );
}

function NotificationRow({
  notification,
  onMarkRead,
  read = false,
}: {
  notification: Notification;
  onMarkRead: () => void;
  read?: boolean;
}) {
  const typeColors: Record<string, string> = {
    success: "bg-[#00D4AA]/10 text-[#00D4AA]",
    reward: "bg-[#FFB800]/10 text-[#FFB800]",
    escalation: "bg-[#FF6B6B]/10 text-[#FF6B6B]",
    info: "bg-[#635BFF]/10 text-[#635BFF]",
    warning: "bg-[#FF6B6B]/10 text-[#FF6B6B]",
  };

  const typeIcon: Record<string, React.ReactNode> = {
    success: <CheckCircle2 className="h-4 w-4" />,
    reward: <Trophy className="h-4 w-4" />,
    escalation: <Zap className="h-4 w-4" />,
    info: <Bell className="h-4 w-4" />,
    warning: <AlertTriangle className="h-4 w-4" />,
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-3 transition-all ${
        read ? "border-slate-100 bg-white/40 opacity-70" : "border-slate-200 bg-white/70"
      }`}
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColors[notification.type] || typeColors.info}`}>
        {typeIcon[notification.type] || <Bell className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${read ? "text-slate-500" : "text-[#0A2540]"}`}>
          {notification.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{notification.message}</p>
        <p className="text-[10px] text-slate-400 mt-1">
          {new Date(notification.createdAt).toLocaleDateString()}
        </p>
      </div>
      {!read && (
        <button
          onClick={onMarkRead}
          className="shrink-0 rounded-md p-1 text-slate-400 hover:text-[#0A2540] hover:bg-slate-100 transition-colors"
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-[#0A2540]">{value}</span>
      </div>
      <Progress value={value}>
        <ProgressTrack className="h-1">
          <ProgressIndicator className="bg-[#00D4AA]" />
        </ProgressTrack>
      </Progress>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-[#0A2540]">{value}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

function BadgeIcon({ name }: { name: string }) {
  const props = { className: "h-3 w-3" };
  switch (name) {
    case "Shield":
      return <Shield {...props} />;
    case "Car":
      return <Car {...props} />;
    case "Droplets":
      return <Droplets {...props} />;
    case "Trophy":
      return <Trophy {...props} />;
    case "Brain":
      return <Brain {...props} />;
    case "Zap":
      return <Zap {...props} />;
    default:
      return <Award {...props} />;
  }
}

function getIssueProgress(status: string): number {
  const map: Record<string, number> = {
    Submitted: 10,
    AI_Processing: 25,
    Validated: 35,
    Routed: 45,
    Assigned: 55,
    In_Progress: 70,
    Resolved: 90,
    Verified: 100,
    Escalated: 60,
  };
  return map[status] || 0;
}
