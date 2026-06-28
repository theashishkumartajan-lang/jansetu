"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  AlertTriangle,
  Navigation,
  Shield,
  Eye,
  CheckCircle2,
  Loader2,
  Clock,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5" />,
  Navigation: <Navigation className="h-5 w-5" />,
  Shield: <Shield className="h-5 w-5" />,
  Eye: <Eye className="h-5 w-5" />,
};

interface AgentProcessingCardProps {
  name: string;
  icon: string;
  description: string;
  status: "pending" | "processing" | "completed" | "failed";
  confidence: number;
  reasoning: string;
  output: Record<string, any>;
  index: number;
}

export function AgentProcessingCard({
  name,
  icon,
  description,
  status,
  confidence,
  reasoning,
  output,
  index,
}: AgentProcessingCardProps) {
  const isVisible = status !== "pending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, height: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0.4,
        y: isVisible ? 0 : 10,
        height: "auto",
      }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "rounded-xl border p-4 transition-all",
        status === "completed"
          ? "border-[#00D4AA]/30 bg-[#00D4AA]/5"
          : status === "processing"
          ? "border-[#635BFF]/30 bg-[#635BFF]/5"
          : status === "failed"
          ? "border-[#FF6B6B]/30 bg-[#FF6B6B]/5"
          : "border-slate-200 bg-white/50"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
            status === "completed"
              ? "bg-[#00D4AA]/10 text-[#00D4AA]"
              : status === "processing"
              ? "bg-[#635BFF]/10 text-[#635BFF]"
              : status === "failed"
              ? "bg-[#FF6B6B]/10 text-[#FF6B6B]"
              : "bg-slate-100 text-slate-400"
          )}
        >
          {ICON_MAP[icon] || <Sparkles className="h-5 w-5" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#0A2540]">{name}</h3>
            <StatusIcon status={status} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>

          {/* Progress bar when processing */}
          {status === "processing" && (
            <div className="mt-3">
              <Progress value={undefined}>
                <ProgressTrack className="h-1.5 bg-slate-200">
                  <ProgressIndicator className="bg-[#635BFF] animate-pulse" />
                </ProgressTrack>
              </Progress>
            </div>
          )}

          {/* Completed details */}
          {status === "completed" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="mt-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#00D4AA]">Confidence</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={cn(
                      "h-full rounded-full",
                      confidence >= 90
                        ? "bg-[#00D4AA]"
                        : confidence >= 70
                        ? "bg-[#FFB800]"
                        : "bg-[#FF6B6B]"
                    )}
                  />
                </div>
                <span className="text-xs font-bold text-[#0A2540]">{confidence}%</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{reasoning}</p>

              {Object.keys(output).length > 0 && (
                <div className="rounded-lg bg-white/70 p-2 text-xs">
                  {Object.entries(output).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-0.5">
                      <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="font-medium text-[#0A2540]">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {status === "failed" && (
            <p className="mt-2 text-xs text-[#FF6B6B]">Processing failed. Will retry automatically.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <CheckCircle2 className="h-5 w-5 text-[#00D4AA]" />
        </motion.div>
      );
    case "processing":
      return <Loader2 className="h-5 w-5 animate-spin text-[#635BFF]" />;
    case "failed":
      return <XCircle className="h-5 w-5 text-[#FF6B6B]" />;
    default:
      return <Clock className="h-5 w-5 text-slate-300" />;
  }
}
