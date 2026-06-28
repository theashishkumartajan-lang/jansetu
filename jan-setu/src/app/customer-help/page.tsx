"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, Mail, MapPin, MessageSquare, Phone, ShieldCheck, Send, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { toast } from "sonner";

const helpOptions = [
  {
    title: "Report Support",
    desc: "Get help submitting photos, descriptions, voice notes, or location details.",
    icon: MessageSquare,
    href: "/customer-help/chat?topic=report",
  },
  {
    title: "Location Help",
    desc: "Fix GPS permission issues and understand why exact location checks are required.",
    icon: MapPin,
    href: "/customer-help/chat?topic=location",
  },
  {
    title: "Status Questions",
    desc: "Understand assigned departments, SLAs, escalation levels, and repair verification.",
    icon: ShieldCheck,
    href: "/customer-help/chat?topic=status",
  },
];

export default function CustomerHelpPage() {
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setFeedbackSent(true);
    toast.success("Thank you! Your feedback has been received.");
    setFeedback("");
    setTimeout(() => setFeedbackSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-16">
      <section className="border-b border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#00D4AA]/10 text-[#00D4AA]">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#0A2540]">Customer Help</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Quick support for citizens, officials, reports, location checks, and account questions.
          </p>
        </div>
      </section>

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {helpOptions.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] focus-visible:ring-offset-4"
            >
              <GlassCard className="h-full border border-slate-100 bg-white transition-all group-hover:-translate-y-1 group-hover:border-[#00D4AA]/40 group-hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00D4AA]/10 text-[#00D4AA]">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold text-[#0A2540]">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </GlassCard>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlassCard className="border border-slate-100 bg-white">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[#0A2540]">Need direct help?</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Reach the Jan Setu support desk for account access, report corrections, and department follow-ups.
              </p>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#00D4AA]" />
                <span>1800-000-JANSETU</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#00D4AA]" />
                <span>help@jansetu.gov.in</span>
              </div>
              <Link href="/how-it-works" className="inline-flex items-center text-sm font-semibold text-[#00A987] hover:text-[#0A2540]">
                View complete guide
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Feedback Section */}
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlassCard className="border border-slate-100 bg-white">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-[#0A2540]">Share Your Feedback</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Tell us what works, what needs improvement, or suggest new features. Your feedback helps us build a better platform.
              </p>
            </div>
            <div>
              {feedbackSent ? (
                <div className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 p-4 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <div>
                    <p className="font-semibold text-sm">Feedback sent!</p>
                    <p className="text-xs">We appreciate your time.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Describe your experience, report a bug, or share an idea..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-[#00D4AA] focus:outline-none focus:ring-2 focus:ring-[#00D4AA]/20 resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!feedback.trim()}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#635BFF] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" /> Send Feedback
                  </button>
                </form>
              )}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
