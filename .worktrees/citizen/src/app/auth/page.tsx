"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Mail, LogIn, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/shared/GlassCard";
import { useAppStore } from "@/stores/app-store";
import { MOCK_USERS } from "@/data/mock";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const { setCurrentUser } = useAppStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const guest = MOCK_USERS[0];
      setCurrentUser(guest);
      toast.success(`Welcome back, ${guest.name}!`);
      router.push("/citizen");
    }, 600);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      toast.error("Please enter both name and email");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.email === email) || {
        ...MOCK_USERS[0],
        name,
        email,
      };
      setCurrentUser(user);
      toast.success(`Welcome, ${user.name}!`);
      router.push("/citizen");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F9FC] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4AA] to-[#635BFF]">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0A2540]">Welcome to JAN SETU</h1>
          <p className="mt-2 text-sm text-slate-500">
            Bridge to the People. Report issues, track progress, earn rewards.
          </p>
        </div>

        <GlassCard glow className="mb-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-[#0A2540]">
                Full Name
              </Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-[#0A2540]">
                Email Address
              </Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-[#0A2540] text-white hover:bg-[#0A2540]/90"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in..." : "Continue"}
            </Button>
          </form>
        </GlassCard>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#F6F9FC] px-2 text-slate-400">or</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => toast("Google OAuth integration coming soon")}
          >
            <Globe className="h-4 w-4" />
            Continue with Google
          </Button>
          <Button
            variant="ghost"
            className="w-full gap-2 text-slate-600 hover:text-[#0A2540]"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            <User className="h-4 w-4" />
            Continue as Guest
          </Button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
