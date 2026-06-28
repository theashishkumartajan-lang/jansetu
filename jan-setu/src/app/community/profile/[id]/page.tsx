"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Trophy, Shield, Droplets, Car, Brain,
  FileText, CheckCircle, Clock, AlertTriangle, MapPin, CalendarDays,
  Award, Star, Zap, Lock, Medal
} from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/stores/app-store";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BADGE_INFO, MOCK_ISSUES, MOCK_LEADERBOARD } from "@/data/mock";
import { Badge, Issue, IssueCategory, IssueStatus, LeaderboardEntry, SeverityLevel } from "@/types";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const BADGE_ICONS: Record<string, typeof Trophy> = {
  "Civic Hero": Shield,
  "Road Guardian": Car,
  "Water Warrior": Droplets,
  "Community Champion": Trophy,
  "Smart Reporter": Brain,
  "First Responder": Zap,
  "Clean Street Captain": Award,
  "Night Safety Watch": Star,
  "Drain Defender": Droplets,
  "Tree Protector": Shield,
  "Escalation Expert": AlertTriangle,
  "Verification Pro": CheckCircle,
  "Local Mapper": MapPin,
  "Civic Streak Master": Clock,
};

type CommunityReport = Pick<Issue, "id" | "category" | "severity" | "status" | "location" | "description" | "department" | "createdAt" | "resolvedAt" | "votes" | "escalationLevel">;

const demoCategories: IssueCategory[] = ["Pothole", "Garbage", "Water Leak", "Broken Streetlight", "Drainage Issue", "Broken Sidewalk", "Traffic Signal Failure"];
const demoDepartments = ["Public Works", "Sanitation Dept", "Water Board", "Electrical Dept", "Drainage Board", "Traffic Police"];
const demoAreas = ["Andheri West", "Bandra East", "Dadar", "Juhu", "Worli", "Goregaon", "Sion", "Kurla"];
const demoSeverity: SeverityLevel[] = ["Critical", "High", "Medium", "Low"];
const pendingStatuses: IssueStatus[] = ["Assigned", "In_Progress", "Validated", "Routed", "Submitted"];

function isSolved(report: CommunityReport) {
  return report.status === "Resolved" || report.status === "Verified";
}

function isDue(report: CommunityReport) {
  return !isSolved(report) && (report.status === "Escalated" || report.escalationLevel > 0);
}

function getReportSummary(reports: CommunityReport[]) {
  const solved = reports.filter(isSolved).length;
  const due = reports.filter(isDue).length;
  const pending = reports.length - solved - due;
  return { total: reports.length, solved, pending, due };
}

function generateReport(entry: LeaderboardEntry, index: number, status: IssueStatus): CommunityReport {
  const category = demoCategories[(index + entry.userId.length) % demoCategories.length];
  const area = demoAreas[(index + entry.area.length) % demoAreas.length];
  const createdAt = new Date(2024, 5, Math.max(1, 24 - (index % 20)));
  const resolvedAt = status === "Resolved" || status === "Verified" ? new Date(2024, 5, Math.max(2, 25 - (index % 18))) : undefined;

  return {
    id: `${entry.userId.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    category,
    severity: demoSeverity[index % demoSeverity.length],
    status,
    location: {
      lat: 19.05 + index * 0.002,
      lng: 72.83 + index * 0.002,
      address: `${area}, Ward ${String.fromCharCode(65 + (index % 6))}`,
    },
    description: `${category} reported near ${area} by ${entry.name}.`,
    department: demoDepartments[index % demoDepartments.length],
    createdAt,
    resolvedAt,
    votes: 3 + (index % 21),
    escalationLevel: status === "Escalated" ? 1 + (index % 3) : 0,
  };
}

function getMemberReports(entry: LeaderboardEntry): CommunityReport[] {
  const realReports = MOCK_ISSUES
    .filter((issue) => issue.userId === entry.userId)
    .map((issue) => ({
      id: issue.id,
      category: issue.category,
      severity: issue.severity,
      status: issue.status,
      location: issue.location,
      description: issue.description,
      department: issue.department,
      createdAt: issue.createdAt,
      resolvedAt: issue.resolvedAt,
      votes: issue.votes,
      escalationLevel: issue.escalationLevel,
    }));

  const solvedTarget = Math.min(entry.verified, entry.reports);
  const dueTarget = Math.max(0, Math.min(entry.reports - solvedTarget, Math.round((entry.reports - solvedTarget) * 0.25)));
  const statuses: IssueStatus[] = [];

  for (let i = 0; i < solvedTarget; i += 1) statuses.push(i % 2 === 0 ? "Resolved" : "Verified");
  for (let i = 0; i < dueTarget; i += 1) statuses.push("Escalated");
  while (statuses.length < entry.reports) statuses.push(pendingStatuses[statuses.length % pendingStatuses.length]);

  const generatedReports = statuses.map((status, index) => generateReport(entry, index, status));
  const realBySlot = new Map(realReports.map((report, index) => [index, report]));

  return generatedReports.map((report, index) => realBySlot.get(index) || report);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CommunityProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser } = useAppStore();

  const entry = MOCK_LEADERBOARD.find((e) => e.userId === id);
  if (!entry) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#0A2540]">User not found</h2>
          <button onClick={() => router.push("/community")} className="mt-4 text-[#00D4AA] font-medium hover:underline">
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  const reports = getMemberReports(entry);
  const summary = getReportSummary(reports);
  const rank = MOCK_LEADERBOARD.findIndex((e) => e.userId === id) + 1;

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/community")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0A2540] mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Community
        </button>

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0A2540] to-[#1A365D] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#FFB800]/10 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Image
                  src={entry.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&background=random`}
                  alt={entry.name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white/20"
                />
                {rank <= 3 && (
                  <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                    {rank === 1 ? <Medal className="h-5 w-5 text-yellow-400" /> : rank === 2 ? <Medal className="h-5 w-5 text-slate-300" /> : <Medal className="h-5 w-5 text-amber-500" />}
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold">{entry.name}</h1>
                <p className="text-slate-300 mt-1">{entry.area} civic portfolio</p>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs border border-white/10">
                    <Trophy className="h-3 w-3" /> Rank #{rank}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs border border-white/10">
                    <FileText className="h-3 w-3" /> {entry.reports} reports
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs border border-white/10">
                    <CheckCircle className="h-3 w-3" /> {entry.verified} verified
                  </span>
                </div>
              </div>
              <div className="sm:ml-auto text-center sm:text-right">
                <div className="text-4xl font-bold">{entry.points.toLocaleString()}</div>
                <div className="text-sm text-slate-300">Civic Score</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Row */}
            <GlassCard>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <FileText className="h-4 w-4" /> Total
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#0A2540]">{summary.total}</div>
                </div>
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                    <CheckCircle className="h-4 w-4" /> Solved
                  </div>
                  <div className="mt-2 text-2xl font-bold text-green-700">{summary.solved}</div>
                </div>
                <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-yellow-700">
                    <Clock className="h-4 w-4" /> Pending
                  </div>
                  <div className="mt-2 text-2xl font-bold text-yellow-700">{summary.pending}</div>
                </div>
                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-700">
                    <AlertTriangle className="h-4 w-4" /> Due
                  </div>
                  <div className="mt-2 text-2xl font-bold text-red-700">{summary.due}</div>
                </div>
              </div>
            </GlassCard>

            {/* Reported Issues */}
            <GlassCard>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Reported Issues</h3>
                <span className="text-xs text-slate-400">All reports in this member portfolio</span>
              </div>
              <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {reports.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">No reports yet.</p>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="rounded-xl border border-slate-100 bg-white p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-[#0A2540]">{report.id}</span>
                            <StatusBadge status={report.status} size="sm" />
                            <StatusBadge severity={report.severity} size="sm" />
                          </div>
                          <h5 className="mt-2 font-semibold text-[#0A2540]">{report.category}</h5>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">{report.description}</p>
                          <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-[#00A987]" />
                              {report.location.address}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5 text-[#00A987]" />
                              Reported {formatDate(report.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-[140px] rounded-lg bg-slate-50 p-3 text-sm">
                          <div className="font-semibold text-[#0A2540]">{report.department}</div>
                          <div className="mt-1 text-xs text-slate-500">{report.votes} community votes</div>
                          {report.resolvedAt && (
                            <div className="mt-1 text-xs text-green-700">Solved {formatDate(report.resolvedAt)}</div>
                          )}
                          {isDue(report) && (
                            <div className="mt-1 text-xs font-semibold text-red-600">Escalation level {report.escalationLevel}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>

            {/* Badge Gallery */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <Award className="h-5 w-5 text-[#00D4AA]" />
                <h3 className="text-lg font-bold text-[#0A2540]">Badge Gallery</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(BADGE_INFO).map(([badgeName, info]) => {
                  const Icon = BADGE_ICONS[badgeName] || Trophy;
                  const earned = currentUser?.badges.includes(badgeName as Badge);
                  return (
                    <div
                      key={badgeName}
                      className={`rounded-2xl p-4 text-center transition-all ${
                        earned
                          ? "bg-gradient-to-br from-[#00D4AA]/10 to-[#635BFF]/10 border border-[#00D4AA]/20"
                          : "bg-slate-50 border border-slate-200 opacity-60 grayscale"
                      }`}
                    >
                      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${info.color} mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-[#0A2540]">{badgeName}</h4>
                      <p className="text-xs text-slate-500 mt-1">{info.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{info.requirement}</p>
                      {!earned && (
                        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-400">
                          <Lock className="h-3 w-3" /> Locked
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">About</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Area</span>
                  <span className="font-medium">{entry.area}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Reports</span>
                  <span className="font-medium">{entry.reports}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Verified</span>
                  <span className="font-medium">{entry.verified}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Civic Score</span>
                  <span className="font-medium text-[#00D4AA]">{entry.points.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Leaderboard Rank</span>
                  <span className="font-medium">#{rank}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
