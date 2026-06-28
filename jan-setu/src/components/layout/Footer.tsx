"use client";

import Link from "next/link";
import { Globe2, MessageCircle, PlayCircle, Users, Zap } from "lucide-react";

const demoSocialLinks = [
  { label: "Instagram", href: "https://instagram.com/jansetu", icon: Globe2 },
  { label: "YouTube", href: "https://youtube.com/@jansetu", icon: PlayCircle },
  { label: "Twitter", href: "https://x.com/jansetu", icon: MessageCircle },
  { label: "LinkedIn", href: "https://linkedin.com/company/jansetu", icon: Users },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A2540]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4AA] to-[#635BFF]">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                JAN <span className="text-[#00D4AA]">SETU</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-slate-400 leading-relaxed">
              Report civic issues, track progress, and keep departments accountable.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/citizen" className="text-sm text-slate-400 hover:text-[#00D4AA]">Citizen Portal</Link></li>
              <li><Link href="/government" className="text-sm text-slate-400 hover:text-[#00D4AA]">Government Portal</Link></li>
              <li><Link href="/analytics" className="text-sm text-slate-400 hover:text-[#00D4AA]">Public Analytics</Link></li>
              <li><Link href="/community" className="text-sm text-slate-400 hover:text-[#00D4AA]">Community</Link></li>
              <li><Link href="/customer-help" className="text-sm text-slate-400 hover:text-[#00D4AA]">Customer Help</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Details</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/how-it-works" className="text-sm text-slate-400 hover:text-[#00D4AA]">Complete Guide</Link></li>
              <li><Link href="/customer-help/chat?topic=status" className="text-sm text-slate-400 hover:text-[#00D4AA]">Track Help Chat</Link></li>
              <li><Link href="/customer-help" className="text-sm text-slate-400 hover:text-[#00D4AA]">Feedback Desk</Link></li>
              <li><Link href="/terms-of-use" className="text-sm text-slate-400 hover:text-[#00D4AA]">Terms of Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 sm:flex-row">
          <span className="font-semibold text-white">Jan Setu</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {demoSocialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open Jan Setu demo ${item.label}`}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-slate-300 transition-colors hover:border-[#00D4AA]/50 hover:text-[#00D4AA]"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
