"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, Trash2, Droplets, Lightbulb, Waves, Palette, Footprints, TreePine,
  AlertTriangle, TrafficCone, FileQuestion, MapPin, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IssueCategory, SeverityLevel, IssueStatus } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  Pothole: <Car className="w-3.5 h-3.5" />,
  Garbage: <Trash2 className="w-3.5 h-3.5" />,
  "Water Leak": <Droplets className="w-3.5 h-3.5" />,
  "Broken Streetlight": <Lightbulb className="w-3.5 h-3.5" />,
  "Drainage Issue": <Waves className="w-3.5 h-3.5" />,
  Graffiti: <Palette className="w-3.5 h-3.5" />,
  "Broken Sidewalk": <Footprints className="w-3.5 h-3.5" />,
  "Fallen Tree": <TreePine className="w-3.5 h-3.5" />,
  "Public Safety Hazard": <AlertTriangle className="w-3.5 h-3.5" />,
  "Traffic Signal Failure": <TrafficCone className="w-3.5 h-3.5" />,
  Other: <FileQuestion className="w-3.5 h-3.5" />,
};

interface MapMarkerProps {
  lat: number;
  lng: number;
  category: IssueCategory;
  severity: SeverityLevel;
  status: IssueStatus;
  issueId?: string;
  isPrediction?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  label?: string;
}

export function MapMarker({
  category,
  severity,
  status,
  issueId,
  isPrediction = false,
  isSelected = false,
  onClick,
  label,
}: MapMarkerProps) {
  const [hovered, setHovered] = useState(false);

  const isResolved = status === "Resolved" || status === "Verified";
  const isCritical = severity === "Critical" && !isResolved;

  const getColor = () => {
    if (isResolved) return "#00D4AA";
    if (isPrediction) return "#635BFF";
    if (severity === "Critical") return "#FF6B6B";
    if (severity === "High") return "#FF8C42";
    if (severity === "Medium") return "#FFB800";
    return "#94A3B8";
  };

  const color = getColor();

  return (
    <div
      className="absolute"
      style={{ transform: "translate(-50%, -50%)", zIndex: isSelected ? 50 : isCritical ? 40 : 20 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* Pulse ring for critical */}
      {isCritical && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Marker dot */}
      <motion.div
        className={cn(
          "relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 border-white",
          isSelected && "ring-4 ring-white/30"
        )}
        style={{ backgroundColor: color }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-white">{iconMap[category] || <MapPin className="w-3.5 h-3.5" />}</span>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {(hovered || isSelected) && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 bottom-full mb-2 whitespace-nowrap rounded-xl px-3 py-2 text-xs shadow-xl border backdrop-blur-xl z-50",
              "bg-white/90 border-white/40"
            )}
          >
            <div className="flex items-center gap-1.5">
              <Info className="w-3 h-3 text-muted-foreground" />
              <span className="font-semibold text-[#0A2540]">{issueId || label}</span>
            </div>
            <p className="text-muted-foreground mt-0.5">{category}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[10px] text-muted-foreground">
                {isPrediction ? "Predicted" : isResolved ? "Resolved" : severity}
              </span>
            </div>
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-white/90 rotate-45 border-r border-b border-white/40 -mt-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
