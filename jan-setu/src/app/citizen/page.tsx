"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus, Camera, MapPin,
  Clock, FileText, ChevronRight,
  Star, Award, Flame, Bell, Shield
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TrustScoreRing } from "@/components/gamification/TrustScoreRing";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function CitizenDashboard() {
  const { currentUser, issues, notifications, markNotificationRead } = useAppStore();
  const [activeTab, setActiveTab] = useState("reports");

  const myIssues = issues.filter((i) => i.userId === currentUser?.id);
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0A2540] to-[#1A365D] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#00D4AA]/10 blur-3xl" />
            <div className="relative">
              <h1 className="text-3xl font-bold">Welcome back, {currentUser?.name?.split(" ")[0] || "Citizen"}!</h1>
              <p className="mt-2 text-slate-300">Your reports help the city act faster. {myIssues.filter((i) => i.status === "Resolved" || i.status === "Verified").length} issues resolved so far.</p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/citizen/report" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#635BFF] px-6 py-3 font-semibold shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
                  <Plus className="h-5 w-5" /> Report Issue
                </Link>
                <Link href="/analytics" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold backdrop-blur-sm border border-white/10 transition-all hover:bg-white/15">
                  <MapPin className="h-5 w-5" /> View Map
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Trust Score", value: currentUser?.trustScore || 0, icon: Shield, color: "text-blue-600", suffix: "" },
            { label: "Points", value: currentUser?.points || 0, icon: Star, color: "text-amber-500", suffix: "" },
            { label: "Streak", value: currentUser?.streak || 0, icon: Flame, color: "text-orange-500", suffix: " days" },
            { label: "Reports", value: currentUser?.reportsCount || 0, icon: FileText, color: "text-teal-600", suffix: "" },
          ].map((stat) => (
            <GlassCard key={stat.label} className="text-center" hover>
              <stat.icon className={`mx-auto h-6 w-6 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-[#0A2540]">{stat.value}{stat.suffix}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-1">
              {[
                { id: "reports", label: "My Reports", icon: FileText },
                { id: "notifications", label: `Notifications ${unreadNotifications.length > 0 ? `(${unreadNotifications.length})` : ""}`, icon: Bell },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? "text-[#0A2540] border-b-2 border-[#00D4AA]"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "reports" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {myIssues.length === 0 ? (
                  <GlassCard className="text-center py-12">
                    <Camera className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-[#0A2540]">No reports yet</h3>
                    <p className="text-slate-500 mt-1">Report a local issue and track it here.</p>
                    <Link href="/citizen/report" className="mt-4 inline-flex items-center gap-2 text-[#00D4AA] font-medium hover:underline">
                      <Plus className="h-4 w-4" /> Report Now
                    </Link>
                  </GlassCard>
                ) : (
                  myIssues.map((issue) => (
                    <GlassCard key={issue.id} className="flex flex-col sm:flex-row sm:items-center gap-4" hover>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-mono text-slate-400">#{issue.id}</span>
                          <StatusBadge severity={issue.severity} size="sm" />
                          <StatusBadge status={issue.status} size="sm" />
                        </div>
                        <h4 className="font-semibold text-[#0A2540]">{issue.category}</h4>
                        <p className="text-sm text-slate-600 line-clamp-1">{issue.aiSummary}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {issue.location.address}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {issue.department && (
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">{issue.department}</span>
                        )}
                        <Link href={`/analytics?issue=${issue.id}`} className="text-[#00D4AA] hover:text-[#00D4AA]/80">
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </GlassCard>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {notifications.map((n) => (
                  <GlassCard
                    key={n.id}
                    className={`cursor-pointer transition-all ${!n.read ? "border-l-4 border-l-[#00D4AA]" : ""}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-2 w-2 rounded-full ${!n.read ? "bg-[#00D4AA]" : "bg-slate-300"}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-[#0A2540] text-sm">{n.title}</h4>
                          <span className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trust Score */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Trust Score</h3>
              <div className="flex items-center gap-4">
                <TrustScoreRing score={currentUser?.trustScore || 0} size={80} />
                <div>
                  <div className="text-2xl font-bold text-[#0A2540]">{currentUser?.trustScore}</div>
                  <div className="text-sm text-slate-500">of 100</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-slate-600">Verified Reports</span><span className="font-medium">{currentUser?.verifiedCount}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">Total Reports</span><span className="font-medium">{currentUser?.reportsCount}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-600">Current Streak</span><span className="font-medium text-orange-500">{currentUser?.streak} days</span></div>
              </div>
            </GlassCard>

            {/* Badges */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser?.badges.map((badge) => (
                  <span key={badge} className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#00D4AA]/20 to-[#635BFF]/20 px-3 py-1.5 text-xs font-medium text-[#0A2540] border border-[#00D4AA]/20">
                    <Award className="h-3 w-3 text-[#00D4AA]" /> {badge}
                  </span>
                ))}
                {(!currentUser?.badges || currentUser.badges.length === 0) && (
                  <p className="text-sm text-slate-500">No badges yet.</p>
                )}
              </div>
            </GlassCard>

            {/* Quick Stats */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Pending</span>
                  <span className="font-semibold text-amber-600">{myIssues.filter((i) => i.status !== "Resolved" && i.status !== "Verified").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Resolved</span>
                  <span className="font-semibold text-green-600">{myIssues.filter((i) => i.status === "Resolved" || i.status === "Verified").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Escalated</span>
                  <span className="font-semibold text-red-600">{myIssues.filter((i) => i.status === "Escalated").length}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
