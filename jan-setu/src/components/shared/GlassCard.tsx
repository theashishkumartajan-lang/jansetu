"use client";

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  dark?: boolean;
}

export function GlassCard({ children, className, hover = true, glow = false, dark = false, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300",
        dark
          ? "bg-slate-900/60 border-slate-700/50 text-white"
          : "bg-white/70 border-white/40 shadow-lg",
        hover && "hover:shadow-2xl hover:-translate-y-1",
        glow && "shadow-[0_0_40px_rgba(0,212,170,0.15)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
