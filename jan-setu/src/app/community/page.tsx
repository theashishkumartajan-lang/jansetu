"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Trophy, Award, Star, Zap, Medal,
  Lock, Shield, Droplets, Car, Brain,
  FileText, CheckCircle, Clock, AlertTriangle, MapPin
} from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/stores/app-store";
import { GlassCard } from "@/components/shared/GlassCard";
import { BADGE_INFO, MOCK_LEADERBOARD } from "@/data/mock";
import { TrustScoreRing } from "@/components/gamification/TrustScoreRing";
import { Badge } from "@/types";

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

export default function CommunityPage() {
  const router = useRouter();
  const { currentUser } = useAppStore();

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-12">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#0A2540] to-[#1A365D] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#FFB800]/10 blur-3xl" />
            <div className="relative">
              <h1 className="text-3xl font-bold">Community Portal</h1>
              <p className="mt-2 text-slate-300">Celebrate civic heroes. Earn badges. Grow your Civic Score.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Leaderboard */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="h-5 w-5 text-[#FFB800]" />
                <h3 className="text-lg font-bold text-[#0A2540]">Leaderboard</h3>
              </div>
              <div className="space-y-3">
                {MOCK_LEADERBOARD.map((entry, idx) => (
                  <button
                    type="button"
                    key={entry.userId}
                    onClick={() => router.push(`/community/profile/${entry.userId}`)}
                    className={`flex w-full items-center gap-4 rounded-xl p-3 text-left transition-all ${
                      entry.userId === currentUser?.id
                        ? "bg-gradient-to-r from-[#00D4AA]/10 to-[#635BFF]/10 border border-[#00D4AA]/20"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm">
                      {idx === 0 ? <Medal className="h-6 w-6 text-yellow-500" /> : idx === 1 ? <Medal className="h-6 w-6 text-slate-400" /> : idx === 2 ? <Medal className="h-6 w-6 text-amber-600" /> : <span className="text-slate-400">{idx + 1}</span>}
                    </div>
                    <Image src={entry.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&background=random`} alt={entry.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold text-[#0A2540] text-sm">{entry.name}</div>
                      <div className="text-xs text-slate-500">{entry.area} • {entry.reports} reports</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#0A2540]">{entry.points.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">Civic Score</div>
                    </div>
                  </button>
                ))}
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
            {/* My Stats */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">My Stats</h3>
              <div className="flex items-center gap-4 mb-6">
                <TrustScoreRing score={currentUser?.trustScore || 0} size={80} />
                <div>
                  <div className="text-2xl font-bold text-[#0A2540]">{currentUser?.trustScore}</div>
                  <div className="text-sm text-slate-500">Trust Score</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <div className="text-lg font-bold text-[#0A2540]">{currentUser?.reportsCount}</div>
                  <div className="text-xs text-slate-500">Reports</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <div className="text-lg font-bold text-[#0A2540]">{currentUser?.verifiedCount}</div>
                  <div className="text-xs text-slate-500">Verified</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <div className="text-lg font-bold text-[#0A2540]">{currentUser?.points}</div>
                  <div className="text-xs text-slate-500">Civic Score</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 text-center">
                  <div className="text-lg font-bold text-orange-500">{currentUser?.streak}</div>
                  <div className="text-xs text-slate-500">Day Streak</div>
                </div>
              </div>
            </GlassCard>

            {/* Activity Feed */}
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Activity</h3>
              <div className="space-y-3">
                {[
                  { icon: FileText, text: "Reported Pothole issue", time: "2 hours ago", color: "text-blue-500" },
                  { icon: CheckCircle, text: "Verified water leak fix", time: "1 day ago", color: "text-green-500" },
                  { icon: Award, text: "Earned Community Champion badge", time: "2 days ago", color: "text-amber-500" },
                  { icon: Zap, text: "Earned 25 Civic Score for verified report", time: "3 days ago", color: "text-[#00D4AA]" },
                  { icon: Star, text: "Streak reached 12 days!", time: "4 days ago", color: "text-orange-500" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 h-2 w-2 rounded-full ${activity.color.replace("text-", "bg-")}`} />
                    <div>
                      <p className="text-sm text-[#0A2540]">{activity.text}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
