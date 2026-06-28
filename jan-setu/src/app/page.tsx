"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap, Users, Shield, TrendingUp, MessageSquare,
  Camera, MapPin, ChevronRight, ArrowRight, Play,
  Eye, CheckCircle
} from "lucide-react";
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
              Smart Civic Operating System
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
              Jan Setu connects citizens and government to solve community problems faster. Report issues in seconds, track them in real-time, and see your city improve.
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
                View City Data
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
              { label: "Departments", value: departmentsCount, icon: TrendingUp },
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

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-28 bg-[#F6F9FC]">
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
              { step: "01", title: "Report", desc: "Snap a photo, record your voice, or describe the issue. Share your exact location so we can verify and route it correctly.", icon: Camera },
              { step: "02", title: "Review", desc: "Our system instantly understands your report, identifies the problem type, and checks severity based on public safety and traffic impact.", icon: Eye },
              { step: "03", title: "Route", desc: "Your report is automatically sent to the correct city department with priority level and expected response time.", icon: MapPin },
              { step: "04", title: "Resolve", desc: "Track progress in real-time. Once fixed, upload a photo to confirm the repair. Earn points and help your community.", icon: CheckCircle },
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

      {/* CTA SECTION */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-[#0A2540] sm:text-4xl">
              Choose Your Portal
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Citizens can report and track issues. Officials can manage queues and SLAs.
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
