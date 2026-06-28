"use client";

import { motion } from "framer-motion";
import { Check, Loader2, AlertCircle, Brain, Shield, Zap } from "lucide-react";
import { AgentResult } from "@/types";

interface AgentProcessingCardProps {
  result: AgentResult;
  index: number;
}

const AGENT_ICONS: Record<string, typeof Brain> = {
  "ReportAgent": Brain,
  "CategoryAgent": Brain,
  "SeverityAgent": Shield,
  "RouteAgent": Zap,
  "TrustAgent": Shield,
  "FraudAgent": Shield,
  "EscalationAgent": AlertCircle,
  "VerificationAgent": Check,
  "PredictionAgent": Brain,
  "AnalyticsAgent": Brain,
};

export function AgentProcessingCard({ result, index }: AgentProcessingCardProps) {
  const Icon = AGENT_ICONS[result.agent] || Brain;
  const isCompleted = result.status === "completed";
  const isFailed = result.status === "failed";
  const isProcessing = result.status === "processing";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      className={`rounded-2xl border p-4 transition-all ${
        isCompleted
          ? "border-green-200 bg-green-50/50"
          : isFailed
          ? "border-red-200 bg-red-50/50"
          : isProcessing
          ? "border-[#00D4AA]/30 bg-[#00D4AA]/5"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isCompleted
              ? "bg-green-100 text-green-600"
              : isFailed
              ? "bg-red-100 text-red-600"
              : isProcessing
              ? "bg-[#00D4AA]/10 text-[#00D4AA]"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {isCompleted ? <Check className="h-5 w-5" /> : isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Icon className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#0A2540]">{result.agent}</h4>
            {isCompleted && (
              <span className="text-xs font-medium text-green-600">
                {Math.round(result.confidence)}% confident
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{result.reasoning}</p>
          {isCompleted && result.output && (
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(result.output)
                .filter(([key]) => !["confidence", "score"].includes(key))
                .slice(0, 3)
                .map(([key, value]) => (
                  <span key={key} className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-[#0A2540] border border-slate-200">
                    {key}: {String(value)}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
