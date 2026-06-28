"use client";

import { GlassCard } from "@/components/shared/GlassCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Issue, Department } from "@/types";

const ISSUE_TRENDS = [
  { month: "Jan", Pothole: 12, Garbage: 8, Water: 5, Streetlight: 3, Traffic: 2 },
  { month: "Feb", Pothole: 15, Garbage: 10, Water: 7, Streetlight: 4, Traffic: 3 },
  { month: "Mar", Pothole: 22, Garbage: 14, Water: 9, Streetlight: 6, Traffic: 5 },
  { month: "Apr", Pothole: 28, Garbage: 18, Water: 12, Streetlight: 8, Traffic: 6 },
  { month: "May", Pothole: 35, Garbage: 22, Water: 15, Streetlight: 10, Traffic: 8 },
  { month: "Jun", Pothole: 42, Garbage: 28, Water: 18, Streetlight: 12, Traffic: 10 },
];

const ENGAGEMENT_DATA = [
  { month: "Jan", activeCitizens: 120, reports: 45 },
  { month: "Feb", activeCitizens: 145, reports: 58 },
  { month: "Mar", activeCitizens: 180, reports: 72 },
  { month: "Apr", activeCitizens: 210, reports: 95 },
  { month: "May", activeCitizens: 250, reports: 120 },
  { month: "Jun", activeCitizens: 310, reports: 155 },
];

const COLORS = ["#00D4AA", "#635BFF", "#0A2540", "#FF6B6B", "#FFB800"];

interface AnalyticsChartsProps {
  issues: Issue[];
  departments: Department[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-white/90 backdrop-blur px-3 py-2 text-xs shadow-lg">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function IssueTrendsChart() {
  return (
    <GlassCard className="h-[340px] flex flex-col">
      <h4 className="text-sm font-semibold text-foreground mb-4">Issue Trends by Category</h4>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ISSUE_TRENDS} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPothole" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGarbage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#635BFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A2540" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0A2540" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,37,64,0.08)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="Pothole" stroke="#00D4AA" fillOpacity={1} fill="url(#colorPothole)" />
            <Area type="monotone" dataKey="Garbage" stroke="#635BFF" fillOpacity={1} fill="url(#colorGarbage)" />
            <Area type="monotone" dataKey="Water" stroke="#0A2540" fillOpacity={1} fill="url(#colorWater)" />
            <Area type="monotone" dataKey="Streetlight" stroke="#FF6B6B" fillOpacity={1} fill="transparent" />
            <Area type="monotone" dataKey="Traffic" stroke="#FFB800" fillOpacity={1} fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function DepartmentEfficiencyChart({ departments }: { departments: Department[] }) {
  const data = departments.map((d) => ({
    name: d.name,
    efficiency: d.efficiency,
    assigned: d.assignedIssues,
  }));

  return (
    <GlassCard className="h-[340px] flex flex-col">
      <h4 className="text-sm font-semibold text-foreground mb-4">Department Efficiency</h4>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,37,64,0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94A3B8" angle={-20} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="efficiency" fill="#00D4AA" radius={[4, 4, 0, 0]} name="Efficiency %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function StatusDistributionChart({ issues }: { issues: Issue[] }) {
  const counts = issues.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(counts).map(([name, value]) => ({ name: name.replace("_", " "), value }));

  return (
    <GlassCard className="h-[340px] flex flex-col">
      <h4 className="text-sm font-semibold text-foreground mb-4">Status Distribution</h4>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function EngagementChart() {
  return (
    <GlassCard className="h-[340px] flex flex-col">
      <h4 className="text-sm font-semibold text-foreground mb-4">Community Engagement</h4>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={ENGAGEMENT_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,37,64,0.08)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="activeCitizens" stroke="#00D4AA" strokeWidth={2} dot={{ r: 3 }} name="Active Citizens" />
            <Line type="monotone" dataKey="reports" stroke="#635BFF" strokeWidth={2} dot={{ r: 3 }} name="Reports" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function SeverityDistributionChart({ issues }: { issues: Issue[] }) {
  const counts = issues.reduce((acc, i) => {
    acc[i.severity] = (acc[i.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
  const severityColors: Record<string, string> = {
    Low: "#00D4AA",
    Medium: "#FFB800",
    High: "#FF6B6B",
    Critical: "#0A2540",
  };

  return (
    <GlassCard className="h-[340px] flex flex-col">
      <h4 className="text-sm font-semibold text-foreground mb-4">Severity Distribution</h4>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,37,64,0.08)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94A3B8" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Count">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={severityColors[entry.name] || COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function AnalyticsCharts({ issues, departments }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <IssueTrendsChart />
      <DepartmentEfficiencyChart departments={departments} />
      <StatusDistributionChart issues={issues} />
      <EngagementChart />
      <SeverityDistributionChart issues={issues} />
    </div>
  );
}
