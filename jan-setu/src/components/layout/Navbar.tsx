"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home, Users, BarChart3, MessageSquare, Bell, User, Menu, X, Shield, Zap, LogOut, HelpCircle
} from "lucide-react";
import Image from "next/image";
import { useAppStore } from "@/stores/app-store";
import { signOutUser } from "@/services/firebase/auth";
import { toast } from "sonner";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/citizen", label: "Citizen", icon: Users },
  { href: "/government", label: "Government", icon: Shield },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/community", label: "Community", icon: MessageSquare },
  { href: "/customer-help", label: "Customer Help", icon: HelpCircle },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { currentUser, setCurrentUser, unreadCount } = useAppStore();
  const unread = unreadCount();
  const isLoggedIn = currentUser !== null && currentUser.email !== "";

  const handleLogout = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      toast.success("Signed out successfully");
      router.push("/");
    } catch (err: unknown) {
      toast.error((err as Error).message || "Sign out failed");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A2540]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4AA] to-[#635BFF]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            JAN <span className="text-[#00D4AA]">SETU</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/citizen" className="relative rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6B6B] text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/15 transition-colors"
            >
              {currentUser?.avatar ? (
                <Image src={currentUser.avatar} alt="" width={24} height={24} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <User className="h-4 w-4" />
              )}
              <span className="hidden sm:inline max-w-[120px] truncate">
                {currentUser?.name || "Sign In"}
              </span>
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-[#0A2540]/95 backdrop-blur-xl p-2 z-50 shadow-2xl">
                  {isLoggedIn ? (
                    <>
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-semibold text-white">{currentUser?.name}</p>
                        <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
                      </div>
                      <Link
                        href="/citizen"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4" /> My Dashboard
                      </Link>
                      <Link
                        href="/citizen/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4" /> My Profile
                      </Link>
                      <div className="border-t border-white/10 my-1" />
                      <button
                        onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4" /> Sign In
                      </Link>
                      <Link
                        href="/auth"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#00D4AA] hover:bg-white/5 transition-colors"
                      >
                        <Zap className="h-4 w-4" /> Create Account
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/5 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0A2540]/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#00D4AA]"
              >
                <User className="h-4 w-4" /> Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
