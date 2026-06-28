"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Brain,
  Camera,
  CheckCircle,
  Clock,
  FileCheck,
  Lock,
  MapPin,
  Shield,
  ShieldCheck,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const guideSteps = [
  {
    step: "01",
    title: "Report & Pin Location",
    desc: "Upload a photo or description, then verify the exact location.",
    icon: Camera,
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    step: "02",
    title: "Verification Scan",
    desc: "Coordinates, photo location, and nearby duplicates are checked.",
    icon: ShieldCheck,
    color: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    step: "03",
    title: "Department Routing",
    desc: "The report goes to the right department with a clear deadline.",
    icon: MapPin,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    step: "04",
    title: "Resolution & Confirm",
    desc: "Track progress, confirm repairs, and earn community points.",
    icon: CheckCircle,
    color: "bg-green-50 text-green-600 border-green-100",
  },
];

const systemFlow = [
  { title: "Report Processor", desc: "Builds a structured report from photo, voice, or text.", icon: Camera },
  { title: "Category Classifier", desc: "Identifies the civic issue type for routing.", icon: Brain },
  { title: "Routing Engine", desc: "Assigns the ticket to the right department queue.", icon: Workflow },
  { title: "Escalation Monitor", desc: "Moves overdue tickets up the chain.", icon: Bell },
  { title: "Verification Compare", desc: "Checks before and after repair evidence.", icon: FileCheck },
  { title: "Risk Forecaster", desc: "Highlights future maintenance hotspots.", icon: TrendingUp },
];

const locationChecks = [
  "GPS device lock confirms coordinates are received directly from hardware sensors.",
  "Photo location alignment validates that captured media matches the reported GPS area.",
  "Duplicate scan checks nearby ward records for matching complaints within 50 meters.",
  "Spam controls block reports with repeated fake locations or mismatched evidence.",
];

const monitorRoles = [
  {
    role: "Department Heads & Field Officers",
    desc: "Monitor assigned tickets, dispatch field teams, and submit before/after repair proof.",
  },
  {
    role: "City Analytics Officers",
    desc: "Review city health, department response times, trends, and staffing requirements.",
  },
  {
    role: "Escalation Officers & Supervisors",
    desc: "Investigate delayed complaints, resolve bottlenecks, and coordinate with field engineers.",
  },
];

const slaRules = [
  { title: "Initial SLA Assignment", detail: "Critical issues receive a 2-day SLA. High and medium priority reports receive 4-7 days." },
  { title: "Warning Alert", detail: "If work has not started, reminders flag the department head dashboard." },
  { title: "Level 2 Escalation", detail: "Overdue tickets move to the supervisor and affect department efficiency scores." },
  { title: "Level 3 Escalation", detail: "Long-pending tickets move to regional officers with visible transparency logs." },
];

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-16">
      <section className="relative bg-white pt-10 pb-12 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/")}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition-colors hover:border-[#00D4AA] hover:text-[#0A2540]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="text-4xl font-bold tracking-tight text-[#0A2540] sm:text-5xl">
            Jan Setu Complete Guide
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            User guide, system flow, location checks, and government SLAs in one clean reference.
          </p>
        </div>
      </section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mx-auto mt-8 max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8"
      >
        <motion.section variants={fadeInUp}>
          <GlassCard className="border border-slate-100 bg-white">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wide text-[#00D4AA]">User Guide</p>
              <h2 className="mt-1 text-2xl font-bold text-[#0A2540]">Resolving Issues in 4 Steps</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {guideSteps.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                    <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-xs font-bold text-[#00D4AA]">Step {item.step}</div>
                    <h3 className="mt-1 text-base font-bold text-[#0A2540]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.section>

        <motion.section variants={fadeInUp}>
          <GlassCard className="border border-slate-100 bg-white">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wide text-[#00D4AA]">System Flow</p>
              <h2 className="mt-1 text-2xl font-bold text-[#0A2540]">How Reports Move Through the Platform</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {systemFlow.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 rounded-xl border border-slate-100 bg-white p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00D4AA]/10 text-[#00D4AA]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0A2540]">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </motion.section>

        <motion.section variants={fadeInUp} className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <GlassCard className="h-full border border-slate-100 bg-white">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-[#0A2540]">
              <Lock className="h-5 w-5 text-[#00D4AA]" /> Location Checks
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Every report uses location validation so field teams can reach the right place quickly and avoid duplicate work.
            </p>
            <div className="mt-5 space-y-3">
              {locationChecks.map((check) => (
                <div key={check} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">✓</span>
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="h-full border border-slate-100 bg-white">
            <h2 className="flex items-center gap-2 text-2xl font-bold text-[#0A2540]">
              <Shield className="h-5 w-5 text-[#635BFF]" /> Government SLAs
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Deadlines are tied to issue severity and escalation history, keeping departments accountable without hiding delays.
            </p>
            <div className="mt-5 space-y-4">
              {slaRules.map((rule, index) => (
                <div key={rule.title} className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00D4AA]/15 text-xs font-bold text-[#00A987]">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0A2540]">{rule.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{rule.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>

        <motion.section variants={fadeInUp}>
          <GlassCard className="border border-slate-100 bg-white">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-[#0A2540]">Who Monitors the Portals?</h2>
                <div className="mt-5 space-y-4">
                  {monitorRoles.map((item) => (
                    <div key={item.role} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                      <h3 className="text-sm font-bold text-[#0A2540]">{item.role}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5">
                <h3 className="flex items-center gap-2 text-base font-bold text-[#0A2540]">
                  <Clock className="h-5 w-5 text-[#00D4AA]" /> Transparency Promise
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Citizens can see the assigned department, expected response time, current status, and repair verification path for every report.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.section>
      </motion.div>
    </div>
  );
}
