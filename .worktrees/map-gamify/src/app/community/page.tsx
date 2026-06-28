"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Shield, Star, Zap, TrendingUp, Users, FileCheck, Award,
  Flame, Activity, Bell, ChevronRight, BarChart3, Medal, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { BadgeGallery } from "@/components/gamification/BadgeGallery";
import { TrustScoreRing } from "@/components/gamification/TrustScoreRing";
import { PointsAnimation } from "@/components/gamification/PointsAnimation";
import { RewardCard } from "@/components/gamification/RewardCard";
import { useAppStore } from "@/stores/app-store";
import { MOCK_LEADERBOARD, MOCK_ISSUES, MOCK_NOTIFICATIONS, MOCK_USERS } from "@/data/mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapComponent } from "@/components/map/MapComponent";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function CommunityPage() {
  const { currentUser, showReward, rewardData, setShowReward } = useAppStore();
  const user = currentUser || MOCK_USERS[0];

  const activities = [
    { id: 1, type: "report" as const, title: "New Report Submitted", detail: "Pothole at Andheri West (ISS-001)", time: "2 hours ago", icon: FileCheck, color: "#635BFF" },
    { id: 2, type: "points" as const, title: "Points Earned", detail: "+25 points for verified issue", time: "5 hours ago", icon: Star, color: "#FFB800" },
    { id: 3, type: "badge" as const, title: "New Badge Unlocked", detail: "Community Champion badge earned", time: "1 day ago", icon: Award, color: "#00D4AA" },
    { id: 4, type: "verification" as const, title: "Issue Verified", detail: "Water leak at Dadar resolved (ISS-003)", time: "2 days ago", icon: Shield, color: "#00D4AA" },
    { id: 5, type: "points" as const, title: "Streak Bonus", detail: "+15 points for 12-day streak", time: "3 days ago", icon: Flame, color: "#FF6B6B" },
    { id: 6, type: "report" as const, title: "Report Escalated", detail: "Open manhole at Worli (ISS-005)", time: "4 days ago", icon: TrendingUp, color: "#FF6B6B" },
  ];

  const topThree = MOCK_LEADERBOARD.slice(0, 3);

  return (
    <div className="min-h-full bg-[#F6F9FC]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0A2540] via-[#1A365D] to-[#0A2540] py-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 mb-4">
              <Users className="w-4 h-4 text-[#00D4AA]" />
              <span className="text-xs font-medium text-white/80">Community Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Civic Champions
            </h1>
            <p className="text-white/50 max-w-xl mx-auto text-sm">
              Join Mumbai&apos;s most active citizens. Report issues, earn points, unlock badges, and climb the leaderboard.
            </p>
          </motion.div>

          {/* Top Contributors Avatars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex items-center justify-center"
          >
            <div className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl px-6 py-4">
              <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Top Contributors</span>
              <div className="flex -space-x-3">
                {topThree.map((entry, i) => (
                  <div key={entry.userId} className="relative">
                    <Avatar className="w-10 h-10 border-2 border-[#0A2540] shadow-lg">
                      <AvatarImage src={entry.avatar} alt={entry.name} />
                      <AvatarFallback className="bg-[#0A2540] text-white text-xs">{entry.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    {i === 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                        <Crown className="w-3 h-3 text-yellow-800" />
                      </div>
                    )}
                  </div>
                ))}
                {MOCK_LEADERBOARD.slice(3, 6).map((entry) => (
                  <Avatar key={entry.userId} className="w-10 h-10 border-2 border-[#0A2540] shadow-lg">
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                    <AvatarFallback className="bg-[#0A2540] text-white text-xs">{entry.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-white">{topThree[0].points.toLocaleString()}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Highest Score</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 pb-12"
        >
          {/* My Stats Row */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <GlassCard className="p-5 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 flex items-center justify-center mb-2">
                  <FileCheck className="w-5 h-5 text-[#635BFF]" />
                </div>
                <span className="text-2xl font-bold text-[#0A2540]">{user.reportsCount}</span>
                <span className="text-xs text-muted-foreground mt-0.5">Reports</span>
              </GlassCard>

              <GlassCard className="p-5 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[#00D4AA]/10 flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-[#00D4AA]" />
                </div>
                <span className="text-2xl font-bold text-[#0A2540]">{user.verifiedCount}</span>
                <span className="text-xs text-muted-foreground mt-0.5">Verified</span>
              </GlassCard>

              <GlassCard className="p-5 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[#FFB800]/10 flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-[#FFB800]" />
                </div>
                <span className="text-2xl font-bold text-[#0A2540]">{user.points.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground mt-0.5">Points</span>
              </GlassCard>

              <GlassCard className="p-5 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center mb-2">
                  <Flame className="w-5 h-5 text-[#FF6B6B]" />
                </div>
                <span className="text-2xl font-bold text-[#0A2540]">{user.streak}</span>
                <span className="text-xs text-muted-foreground mt-0.5">Day Streak</span>
              </GlassCard>

              <GlassCard className="p-5 flex flex-col items-center justify-center" glow>
                <TrustScoreRing score={user.trustScore} size={100} strokeWidth={8} />
              </GlassCard>
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#00D4AA]" />
              <h2 className="text-lg font-bold text-[#0A2540]">Digital Twin Map</h2>
              <span className="text-xs text-muted-foreground ml-2">Live issue tracker across Mumbai</span>
            </div>
            <MapComponent />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leaderboard */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <GlassCard className="h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#FFB800]" />
                    <h2 className="text-lg font-bold text-[#0A2540]">Leaderboard</h2>
                  </div>
                  <span className="text-xs text-muted-foreground">{MOCK_LEADERBOARD.length} contributors</span>
                </div>
                <Leaderboard entries={MOCK_LEADERBOARD} currentUserId={user.id} />
              </GlassCard>
            </motion.div>

            {/* Activity Feed */}
            <motion.div variants={itemVariants}>
              <GlassCard className="h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-[#00D4AA]" />
                  <h2 className="text-lg font-bold text-[#0A2540]">Activity Feed</h2>
                </div>
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.08 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors group"
                    >
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${activity.color}15` }}
                      >
                        <activity.icon className="w-4 h-4" style={{ color: activity.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0A2540]">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{activity.detail}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Badge Gallery */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <div className="flex items-center gap-2 mb-6">
                <Medal className="w-5 h-5 text-[#635BFF]" />
                <h2 className="text-lg font-bold text-[#0A2540]">Badge Gallery</h2>
                <span className="text-xs text-muted-foreground ml-2">
                  {user.badges.length} of 6 earned
                </span>
              </div>
              <BadgeGallery earnedBadges={user.badges} />
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Reward Popup */}
      <AnimatePresence>
        {showReward && rewardData && (
          <RewardCard
            points={rewardData.points}
            badge={rewardData.badge}
            message={rewardData.message}
            onDismiss={() => setShowReward(false)}
          />
        )}
      </AnimatePresence>

      {/* Demo Points Animation (for visual flair) */}
      <PointsAnimation points={25} message="First visit bonus!" onComplete={() => {}} />
    </div>
  );
}
