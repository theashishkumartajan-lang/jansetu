"use client";

import { cn } from "@/lib/utils";
import { SEVERITY_COLORS, STATUS_COLORS } from "@/data/mock";

interface StatusBadgeProps {
  status?: string;
  severity?: string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, severity, size = "md" }: StatusBadgeProps) {
  const value = status || severity || "";
  const colors = status ? STATUS_COLORS[value] || "bg-gray-100 text-gray-700" : SEVERITY_COLORS[value] || "bg-gray-100 text-gray-700";
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span className={cn("inline-flex items-center rounded-full font-medium border", colors, sizeClasses[size])}>
      {value}
    </span>
  );
}
