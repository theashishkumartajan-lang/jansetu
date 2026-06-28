"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap, Users, Brain, Shield, TrendingUp, MessageSquare,
  Camera, Mic, MapPin, ChevronRight, ArrowRight, Play
} from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useCountUp } from "@/hooks/useCountUp";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  const reportsCount = useCountUp(1247);
  const resolvedCount = useCountUp(986);
  const citizensCount = useCountUp(5420);
  const departmentsCount = useCountUp(12);

  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-hero pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[#00D4AA]/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-[#635BFF]/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00D4AA]/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[#00D4AA] backdrop-blur-sm border border-white/10">
              <Zap className="h-4 w-4" />
              AI-Powered Civic Operating System
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              From Complaint to{" "}
              <span className="text-gradient">Resolution</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-300"
            >
              Jan Setu transforms passive issue reporting into an autonomous civic operating system where AI actively helps communities solve problems rather than merely reporting them.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/citizen/report"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#635BFF] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#00D4AA]/25 transition-all hover:shadow-xl hover:shadow-[#00D4AA]/30 hover:-translate-y-0.5"
              >
                <Camera className="h-5 w-5" />
                Report an Issue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-white/15 hover:-translate-y-0.5"
              >
                <Play className="h-5 w-5" />
                View City Dashboard
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {[
              { label: "Reports Filed", value: reportsCount, icon: MessageSquare },
              { label: "Issues Resolved", value: resolvedCount, icon: Shield },
              { label: "Active Citizens", value: citizensCount, icon: Users },
              { label: "Departments", value: departmentsCount, icon: Brain },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-6 text-center"
              >
                <stat.icon className="mx-auto h-6 w-6 text-[#00D4AA] mb-2" />
                <div className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-[#0A2540] sm:text-4xl">
              10 AI Agents Working For You
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Not just reporting — autonomous resolution. Every issue is processed by a chain of intelligent AI agents.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { icon: Camera, title: "Report Agent", desc: "Analyzes photos, videos, and voice to understand the issue instantly", color: "from-blue-500 to-cyan-500" },
              { icon: Brain, title: "Category Agent", desc: "Classifies issues into 10+ categories with confidence scores", color: "from-purple-500 to-violet-500" },
              { icon: TrendingUp, title: "Severity Agent", desc: "Calculates risk, urgency, and public impact automatically", color: "from-red-500 to-orange-500" },
              { icon: MapPin, title: "Route Agent", desc: "Routes to the correct department with expected response time", color: "from-green-500 to-emerald-500" },
              { icon: Shield, title: "Trust & Fraud", desc: "Detects spam, verifies reputation, prevents abuse", color: "from-amber-500 to-yellow-500" },
              { icon: Zap, title: "Escalation Agent", desc: "Auto-escalates unresolved issues to supervisors and regional authorities", color: "from-pink-500 to-rose-500" },
            ].map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <GlassCard className="h-full border border-slate-200/50" hover>
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0A2540]">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-[#0A2540]/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-[#0A2540] sm:text-4xl">
              How It Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-600">
              From report to resolution in 4 simple steps
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 sm:grid-cols-4"
          >
            {[
              { step: "01", title: "Report", desc: "Snap a photo, record voice, or describe the issue. No forms needed.", icon: Camera },
              { step: "02", title: "AI Analyzes", desc: "Gemini Vision analyzes the issue, categorizes it, and calculates severity.", icon: Brain },
              { step: "03", title: "Auto-Routes", desc: "AI assigns to the correct department with priority and expected timeline.", icon: MapPin },
              { step: "04", title: "Track & Resolve", desc: "Track progress, verify repairs, earn points, and see the city improve.", icon: Shield },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="relative">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00D4AA] to-[#635BFF] shadow-lg shadow-[#00D4AA]/20 mb-4">
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-sm font-bold text-[#00D4AA] mb-2">Step {item.step}</div>
                  <h3 className="text-lg font-semibold text-[#0A2540]">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* VOICE DEMO */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="rounded-3xl bg-gradient-to-br from-[#0A2540] to-[#1A365D] p-8 sm:p-12"
          >
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              <motion.div variants={fadeInUp}>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#00D4AA]/20 px-4 py-2 text-sm font-medium text-[#00D4AA] mb-6">
                  <Mic className="h-4 w-4" />
                  Voice Copilot
                </div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  Just Say It. We Handle Everything.
                </h2>
                <p className="mt-4 text-lg text-slate-300">
                  "There is a water leak near the bus stand." — The system automatically transcribes, detects the issue, creates a report, finds the location, and routes the complaint. No forms. No typing.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  {["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali"].map((lang) => (
                    <span key={lang} className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-300 border border-white/10">
                      {lang}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="relative">
                <div className="glass rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00D4AA] to-[#635BFF] flex items-center justify-center">
                      <Mic className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Voice Input</div>
                      <div className="text-xs text-slate-400">Tap to speak</div>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                    <div className="flex items-center gap-2 text-[#00D4AA] mb-2">
                      <div className="h-2 w-2 rounded-full bg-[#00D4AA] animate-pulse" />
                      <span className="text-xs font-medium">Listening...</span>
                    </div>
                    <p className="text-sm text-slate-300 italic">
                      "There is a water leak near the bus stand causing traffic..."
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: "Transcribed", status: "done" },
                      { label: "Issue Detected: Water Leak", status: "done" },
                      { label: "Location Found: Bus Stand", status: "done" },
                      { label: "Routed to: Water Board", status: "done" },
                      { label: "Ticket Created: ISS-2047", status: "done" },
                    ].map((step) => (
                      <div key={step.label} className="flex items-center gap-2 text-sm">
                        <div className={`h-2 w-2 rounded-full ${step.status === "done" ? "bg-[#00D4AA]" : "bg-slate-500"}`} />
                        <span className={step.status === "done" ? "text-[#00D4AA]" : "text-slate-400"}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-[#0A2540] sm:text-4xl">
              Ready to Transform Your City?
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Join thousands of citizens and government officials using AI to make our communities better, faster, and smarter.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/citizen"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#635BFF] px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-[#00D4AA]/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <Users className="h-5 w-5" />
                Citizen Portal
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/government"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0A2540] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#0A2540]/90 hover:-translate-y-0.5"
              >
                <Shield className="h-5 w-5" />
                Government Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
