"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { GlassCard } from "@/components/shared/GlassCard";
import MapComponent from "@/components/map/MapComponent";
import { DEPARTMENTS } from "@/data/mock";
import {
  AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from "recharts";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const COLORS = ["#00D4AA", "#635BFF", "#FF6B6B", "#FFB800", "#0A2540", "#3B82F6", "#EC4899", "#10B981"];

export default function AnalyticsPage() {
  const { issues, predictions } = useAppStore();
  const total = issues.length;
  const resolved = issues.filter((i) => i.status === "Resolved" || i.status === "Verified").length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const critical = issues.filter((i) => i.severity === "Critical").length;
  const healthScore = Math.min(100, Math.round((resolved / total) * 80 + 20 - critical * 2));

  const categoryData = Object.entries(
    issues.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const statusData = Object.entries(
    issues.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const trendData = [
    { month: "Jan", reports: 45, resolved: 38 },
    { month: "Feb", reports: 52, resolved: 48 },
    { month: "Mar", reports: 61, resolved: 55 },
    { month: "Apr", reports: 58, resolved: 54 },
    { month: "May", reports: 72, resolved: 65 },
    { month: "Jun", reports: 84, resolved: 76 },
  ];

  const deptData = DEPARTMENTS.map((d) => ({
    name: d.name.split(" ")[0],
    efficiency: d.efficiency,
    assigned: d.assignedIssues,
  }));

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A2540]">City Analytics</h1>
          <p className="text-slate-500 mt-1">Real-time insights into city health, issue trends, and department performance.</p>
        </motion.div>

        {/* City Health Score */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0A2540] to-[#1A365D] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#00D4AA]/10 blur-3xl" />
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
              <div>
                <div className="text-sm text-slate-300 mb-2">City Health Score</div>
                <div className="text-6xl font-bold">{healthScore}</div>
                <div className="text-sm text-slate-300 mt-2">
                  {healthScore > 80 ? "Excellent" : healthScore > 60 ? "Good" : "Needs Attention"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold">{total}</div>
                  <div className="text-xs text-slate-300">Total Issues</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold">{resolutionRate}%</div>
                  <div className="text-xs text-slate-300">Resolution Rate</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-red-400">{critical}</div>
                  <div className="text-xs text-slate-300">Critical</div>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold">3.2d</div>
                  <div className="text-xs text-slate-300">Avg Resolution</div>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-400">
                  <ArrowUpRight className="h-4 w-4" /> +12% this month
                </div>
                <p className="text-xs text-slate-400 mt-2">Based on {total} reported issues</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Row 1 */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Issue Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635BFF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="reports" stroke="#00D4AA" fillOpacity={1} fill="url(#colorReports)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#635BFF" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Department Efficiency</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} stroke="#94a3b8" width={80} />
                <Tooltip />
                <Bar dataKey="efficiency" fill="#00D4AA" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Charts Row 2 */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">By Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Engagement</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="reports" stroke="#635BFF" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>

        {/* Civic Map */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0A2540]">Civic Map</h3>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[#00D4AA] animate-pulse" /> Active
            </span>
          </div>
          <MapComponent />
        </motion.div>

        {/* Predictions */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h3 className="text-lg font-bold text-[#0A2540] mb-4">Predictions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {predictions.map((pred) => (
              <GlassCard key={pred.id} className="border-l-4 border-l-[#635BFF]" hover>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#0A2540]">{pred.category}</span>
                  <span className="text-xs font-medium bg-[#635BFF]/10 text-[#635BFF] px-2 py-1 rounded-full">
                    {pred.confidence}% confidence
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-2 w-2 rounded-full ${pred.riskScore > 80 ? "bg-red-500" : pred.riskScore > 60 ? "bg-amber-500" : "bg-green-500"}`} />
                  <span className="text-xs text-slate-500">Risk Score: {pred.riskScore}/100</span>
                </div>
                <p className="text-xs text-slate-600 mb-2">{pred.reason}</p>
                <div className="text-xs text-slate-400">Expected: {pred.timeframe}</div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
