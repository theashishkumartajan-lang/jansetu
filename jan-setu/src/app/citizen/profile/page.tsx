"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Mail, Shield, Star, Flame, Award, LogOut, ArrowLeft,
  Calendar, MapPin, FileText, CheckCircle, Zap
} from "lucide-react";
import { useAppStore } from "@/stores/app-store";
import { GlassCard } from "@/components/shared/GlassCard";
import { TrustScoreRing } from "@/components/gamification/TrustScoreRing";
import { signOutUser } from "@/services/firebase/auth";
import { toast } from "sonner";
import Image from "next/image";
const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();

  const handleLogout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setIsAuthenticated(false);
      toast.success("Signed out successfully");
      router.push("/");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Sign out failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-12">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0A2540] mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          {/* Header Card */}
          <div className="rounded-3xl bg-gradient-to-r from-[#0A2540] to-[#1A365D] p-8 text-white relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#00D4AA]/10 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                {currentUser?.avatar ? (
                  <Image src={currentUser.avatar} alt="" width={96} height={96} className="h-24 w-24 rounded-full object-cover border-4 border-white/20" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#00D4AA] to-[#635BFF] border-4 border-white/20">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
                {!isAuthenticated && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    DEMO
                  </span>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold">{currentUser?.name || "Guest User"}</h1>
                <p className="text-slate-300 mt-1">{currentUser?.email || "Sign in to manage your account"}</p>
                <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs border border-white/10">
                    <MapPin className="h-3 w-3" /> {currentUser?.area || "Mumbai"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs border border-white/10">
                    <Calendar className="h-3 w-3" /> Joined {currentUser?.joinedAt ? new Date(currentUser.joinedAt).toLocaleDateString() : "Recently"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs border border-white/10">
                    <Shield className="h-3 w-3" /> {currentUser?.role === "government" ? "Government" : "Citizen"}
                  </span>
                </div>
              </div>
              <div className="sm:ml-auto">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium text-white border border-white/10 hover:bg-white/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/auth")}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#635BFF] px-5 py-2.5 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Zap className="h-4 w-4" /> Sign In
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
            <GlassCard className="text-center">
              <TrustScoreRing score={currentUser?.trustScore || 0} size={80} />
              <div className="mt-3">
                <div className="text-lg font-bold text-[#0A2540]">{currentUser?.trustScore || 0}</div>
                <div className="text-sm text-slate-500">Trust Score</div>
              </div>
            </GlassCard>
            <GlassCard className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
                <Star className="h-10 w-10 text-amber-500" />
              </div>
              <div className="mt-3">
                <div className="text-lg font-bold text-[#0A2540]">{(currentUser?.points || 0).toLocaleString()}</div>
                <div className="text-sm text-slate-500">Points</div>
              </div>
            </GlassCard>
            <GlassCard className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
                <Flame className="h-10 w-10 text-orange-500" />
              </div>
              <div className="mt-3">
                <div className="text-lg font-bold text-[#0A2540]">{currentUser?.streak || 0} days</div>
                <div className="text-sm text-slate-500">Current Streak</div>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Activity Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0A2540]">Total Reports</div>
                      <div className="text-xs text-slate-500">Issues you have reported</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-[#0A2540]">{currentUser?.reportsCount || 0}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0A2540]">Verified Reports</div>
                      <div className="text-xs text-slate-500">Issues confirmed and resolved</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-[#0A2540]">{currentUser?.verifiedCount || 0}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                      <Award className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0A2540]">Badges Earned</div>
                      <div className="text-xs text-slate-500">Achievements unlocked</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-[#0A2540]">{currentUser?.badges.length || 0}</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Account Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase">Name</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-[#0A2540]">{currentUser?.name || "Not set"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-[#0A2540]">{currentUser?.email || "Not set"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase">Area</label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-[#0A2540]">{currentUser?.area || "Mumbai"}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase">Role</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-medium text-[#0A2540] capitalize">{currentUser?.role || "Citizen"}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Badges */}
          <GlassCard>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2">
              {currentUser?.badges && currentUser.badges.length > 0 ? (
                currentUser.badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#00D4AA]/20 to-[#635BFF]/20 px-3 py-1.5 text-xs font-medium text-[#0A2540] border border-[#00D4AA]/20"
                  >
                    <Award className="h-3 w-3 text-[#00D4AA]" /> {badge}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">No badges yet. Start reporting issues to earn your first badge!</p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
