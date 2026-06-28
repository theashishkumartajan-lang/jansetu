"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Clock, AlertTriangle, CheckCircle,
  Search, ArrowUpDown, Zap
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DEPARTMENTS, MOCK_ESCALATIONS } from "@/data/mock";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function GovernmentDashboard() {
  const { issues } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [now] = useState(() => Date.now());
  const [today] = useState(() => new Date().toDateString());

  const pendingIssues = issues.filter((i) => i.status !== "Resolved" && i.status !== "Verified");
  const criticalIssues = issues.filter((i) => i.severity === "Critical");
  const overdueIssues = issues.filter((i) => {
    const days = Math.floor((now - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return days > 3 && i.status !== "Resolved" && i.status !== "Verified";
  });
  const resolvedToday = issues.filter((i) => i.status === "Resolved" && new Date(i.updatedAt).toDateString() === today);

  const filteredIssues = issues
    .filter((i) => {
      if (searchTerm && !i.id.toLowerCase().includes(searchTerm.toLowerCase()) && !i.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filterSeverity !== "all" && i.severity !== filterSeverity) return false;
      if (filterStatus !== "all" && i.status !== filterStatus) return false;
      if (filterDept !== "all" && i.department !== filterDept) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "severity") {
        const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return (severityOrder[a.severity] || 0) - (severityOrder[b.severity] || 0);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0A2540] to-[#1A365D] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#635BFF]/10 blur-3xl" />
            <div className="relative">
              <h1 className="text-3xl font-bold">Government Dashboard</h1>
              <p className="mt-2 text-slate-300">Manage city issues, track escalations, and monitor department efficiency.</p>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Pending", value: pendingIssues.length, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Critical", value: criticalIssues.length, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
            { label: "Overdue", value: overdueIssues.length, icon: Shield, color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Resolved Today", value: resolvedToday.length, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
          ].map((stat) => (
            <GlassCard key={stat.label} className="text-center" hover>
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} mb-2`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-[#0A2540]">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Issues Table */}
            <GlassCard>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-bold text-[#0A2540]">All Issues</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-2 text-sm focus:border-[#00D4AA] focus:outline-none w-48"
                    />
                  </div>
                  <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#00D4AA] focus:outline-none">
                    <option value="all">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#00D4AA] focus:outline-none">
                    <option value="all">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="In_Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                  <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-[#00D4AA] focus:outline-none">
                    <option value="all">All Depts</option>
                    {DEPARTMENTS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                  <button onClick={() => setSortBy(sortBy === "date" ? "severity" : "date")} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-500">Category</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-500">Severity</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-500">Dept</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-500">Days</th>
                      <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.slice(0, 20).map((issue) => {
                      const days = Math.floor((now - new Date(issue.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <tr key={issue.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          <td className="py-2 px-3 font-mono text-xs text-slate-500">{issue.id}</td>
                          <td className="py-2 px-3 text-[#0A2540]">{issue.category}</td>
                          <td className="py-2 px-3"><StatusBadge severity={issue.severity} size="sm" /></td>
                          <td className="py-2 px-3 text-xs text-slate-600">{issue.department}</td>
                          <td className="py-2 px-3 text-xs">{days}</td>
                          <td className="py-2 px-3"><StatusBadge status={issue.status} size="sm" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Escalation Timeline */}
            <GlassCard>
              <h3 className="text-lg font-bold text-[#0A2540] mb-6">Escalation Timeline</h3>
              <div className="space-y-4">
                {MOCK_ESCALATIONS.map((esc) => {
                  const levelColors = ["bg-yellow-400", "bg-orange-400", "bg-red-500", "bg-red-800"];
                  return (
                    <div key={esc.id} className="flex items-start gap-4">
                      <div className={`mt-1 h-3 w-3 rounded-full ${levelColors[esc.level - 1] || "bg-slate-400"} ring-4 ring-white`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#0A2540] text-sm">{esc.issueId}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${esc.level >= 3 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                            Level {esc.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{esc.department} → {esc.supervisor}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{esc.notes}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Department Metrics */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Departments</h3>
              <div className="space-y-4">
                {DEPARTMENTS.map((dept) => (
                  <div key={dept.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#0A2540]">{dept.name}</span>
                      <span className={`text-xs font-semibold ${dept.efficiency > 90 ? "text-green-600" : dept.efficiency > 70 ? "text-amber-600" : "text-red-600"}`}>
                        {dept.efficiency}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className={`h-2 rounded-full ${dept.efficiency > 90 ? "bg-green-500" : dept.efficiency > 70 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${dept.efficiency}%` }} />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-slate-400">
                      <span>{dept.assignedIssues} pending</span>
                      <span>{dept.avgResolutionTime}d avg</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* AI Recommendations */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">System Recommendations</h3>
              <div className="space-y-3">
                <div className="rounded-xl bg-gradient-to-r from-[#00D4AA]/10 to-[#635BFF]/10 p-4 border border-[#00D4AA]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-[#00D4AA]" />
                    <span className="text-sm font-semibold text-[#0A2540]">Resource Allocation</span>
                  </div>
                  <p className="text-xs text-slate-600">Shift 2 crews from Sanitation to Public Works. Pothole reports up 40% this week.</p>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-semibold text-[#0A2540]">Predicted Hotspot</span>
                  </div>
                  <p className="text-xs text-slate-600">High probability of water leak in Dadar area within 7 days. Pre-position repair team.</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
