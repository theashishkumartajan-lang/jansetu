"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, User, Mail, Lock, ArrowRight, Globe } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { useAppStore } from "@/stores/app-store";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "@/services/firebase/auth";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const { setCurrentUser } = useAppStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      setCurrentUser(user);
      toast.success(`Welcome, ${user.name}!`);
      router.push("/citizen");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign-in failed";
      console.error(err);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = mode === "signup"
        ? await signUpWithEmail(name, email, password)
        : await signInWithEmail(email, password);
      setCurrentUser(user);
      toast.success(`Welcome, ${user.name}!`);
      router.push("/citizen");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      console.error(err);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2540] via-[#1A365D] to-[#0A2540] flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[#00D4AA]/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-[#635BFF]/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00D4AA] to-[#635BFF] shadow-lg shadow-[#00D4AA]/25 mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">JAN <span className="text-[#00D4AA]">SETU</span></h1>
          <p className="text-slate-300 mt-2">Bridge to the People</p>
        </div>

        <GlassCard dark className="border border-white/10">
          {/* Mode Toggle */}
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === "signin" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === "signup" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium text-slate-300">Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:border-[#00D4AA] focus:outline-none focus:ring-2 focus:ring-[#00D4AA]/20"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-slate-300">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:border-[#00D4AA] focus:outline-none focus:ring-2 focus:ring-[#00D4AA]/20"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:border-[#00D4AA] focus:outline-none focus:ring-2 focus:ring-[#00D4AA]/20"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#635BFF] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
            >
              {isLoading ? "Loading..." : mode === "signup" ? "Create Account" : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#0F172A] px-2 text-slate-400">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50"
          >
            <Globe className="h-4 w-4" /> Sign in with Google
          </button>
        </GlassCard>
      </motion.div>
    </div>
  );
}
