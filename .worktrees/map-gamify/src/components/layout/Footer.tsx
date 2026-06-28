"use client";

import Link from "next/link";
import { Zap, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A2540]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4AA] to-[#635BFF]">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                JAN <span className="text-[#00D4AA]">SETU</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Bridge to the People. From Complaint to Resolution. An AI-powered civic operating system transforming how communities solve problems together.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/citizen" className="text-sm text-slate-400 hover:text-[#00D4AA]">Citizen Portal</Link></li>
              <li><Link href="/government" className="text-sm text-slate-400 hover:text-[#00D4AA]">Government Portal</Link></li>
              <li><Link href="/analytics" className="text-sm text-slate-400 hover:text-[#00D4AA]">Public Analytics</Link></li>
              <li><Link href="/community" className="text-sm text-slate-400 hover:text-[#00D4AA]">Community</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Connect</h3>
            <div className="mt-4 flex gap-4">
              <a href="#" className="text-slate-400 hover:text-[#00D4AA]"><Github className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-[#00D4AA]"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-slate-400 hover:text-[#00D4AA]"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-slate-500">
          Built with AI for the People. Hackathon 2024.
        </div>
      </div>
    </footer>
  );
}
