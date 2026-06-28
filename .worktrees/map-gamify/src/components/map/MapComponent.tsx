"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ZoomIn, ZoomOut, Move, Filter, X, Layers, Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { MapMarker } from "./MapMarker";
import { GlassCard } from "@/components/shared/GlassCard";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

const MAP_BOUNDS = {
  minLat: 18.95,
  maxLat: 19.18,
  minLng: 72.75,
  maxLng: 72.95,
};

function latLngToPercent(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}

const FILTERS = [
  { key: "all" as const, label: "All", color: "#0A2540" },
  { key: "critical" as const, label: "Critical", color: "#FF6B6B" },
  { key: "high" as const, label: "High", color: "#FF8C42" },
  { key: "medium" as const, label: "Medium", color: "#FFB800" },
  { key: "low" as const, label: "Low", color: "#94A3B8" },
  { key: "resolved" as const, label: "Resolved", color: "#00D4AA" },
  { key: "predicted" as const, label: "Predicted", color: "#635BFF" },
];

export function MapComponent() {
  const { issues, predictions, mapFilter, setMapFilter, selectedIssue, setSelectedIssue } = useAppStore();
  const [zoom, setZoom] = useState(1.2);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z * 1.3, MAX_ZOOM));
  const handleZoomOut = () => setZoom((z) => Math.max(z / 1.3, MIN_ZOOM));
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z * delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const filteredIssues = useMemo(() => {
    if (mapFilter === "all") return issues;
    if (mapFilter === "resolved") return issues.filter((i) => i.status === "Resolved" || i.status === "Verified");
    if (mapFilter === "predicted") return [];
    return issues.filter((i) => {
      if (i.status === "Resolved" || i.status === "Verified") return false;
      return i.severity.toLowerCase() === mapFilter;
    });
  }, [issues, mapFilter]);

  const predictionsToShow = useMemo(() => {
    return mapFilter === "all" || mapFilter === "predicted" ? predictions : [];
  }, [predictions, mapFilter]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200/50 shadow-xl bg-[#0A2540]" ref={containerRef}>
      {/* Digital Twin Label */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full bg-[#0A2540]/80 backdrop-blur-xl border border-white/10 px-4 py-2">
          <Layers className="w-4 h-4 text-[#00D4AA]" />
          <span className="text-xs font-semibold text-white tracking-wider uppercase">Digital Twin</span>
          <span className="text-[10px] text-white/40">Mumbai</span>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <button onClick={handleZoomIn} className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={handleZoomOut} className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40">
          <Navigation className="w-4 h-4" />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="absolute bottom-4 left-4 z-30 flex flex-wrap gap-1.5 max-w-[70%]">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setMapFilter(f.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all border",
              mapFilter === f.key
                ? "bg-white/20 border-white/30 text-white shadow-lg"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
            )}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
            {f.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-30 rounded-xl bg-[#0A2540]/80 backdrop-blur-xl border border-white/10 px-3 py-2">
        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 font-semibold">Legend</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF6B6B]" /><span className="text-[10px] text-white/60">Critical</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF8C42]" /><span className="text-[10px] text-white/60">High</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FFB800]" /><span className="text-[10px] text-white/60">Medium</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#94A3B8]" /><span className="text-[10px] text-white/60">Low</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00D4AA]" /><span className="text-[10px] text-white/60">Resolved</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#635BFF]" /><span className="text-[10px] text-white/60">Predicted</span></div>
        </div>
      </div>

      {/* Map Content */}
      <div
        className={cn("absolute inset-0", isDragging && "cursor-grabbing")}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0 origin-center transition-transform duration-75 ease-out"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {/* SVG Background */}
          <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Base background */}
            <rect width="800" height="600" fill="#0A2540" />

            {/* Water (Arabian Sea - west side) */}
            <path d="M0,0 Q120,150 80,300 Q60,450 100,600 L0,600 Z" fill="#0d2b4a" opacity="0.6" />
            <path d="M0,200 Q180,280 160,400 Q140,520 200,600 L0,600 Z" fill="#0d2b4a" opacity="0.3" />

            {/* Grid */}
            <rect width="800" height="600" fill="url(#grid)" />

            {/* Major Roads */}
            <g stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none">
              <path d="M0,250 Q200,240 400,260 T800,280" />
              <path d="M0,350 Q250,340 500,360 T800,380" />
              <path d="M200,0 Q220,200 210,400 Q200,600 205,600" />
              <path d="M400,0 Q410,150 390,300 Q380,450 400,600" />
              <path d="M600,0 Q580,200 610,400 Q620,600 605,600" />
            </g>

            {/* Minor Roads */}
            <g stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" fill="none">
              <path d="M100,0 Q110,200 105,400 Q100,600 102,600" />
              <path d="M300,0 Q290,150 310,300 Q320,500 305,600" />
              <path d="M500,0 Q520,100 490,250 Q480,400 510,600" />
              <path d="M700,0 Q690,200 710,400 Q715,600 700,600" />
              <path d="M0,150 Q200,140 400,160 T800,170" />
              <path d="M0,450 Q250,440 500,460 T800,480" />
              <path d="M0,100 Q300,90 600,110 T800,120" />
              <path d="M0,500 Q300,490 600,510 T800,520" />
            </g>

            {/* Area Labels */}
            <text x="280" y="180" fill="rgba(255,255,255,0.08)" fontSize="18" fontWeight="bold" fontFamily="sans-serif">Andheri</text>
            <text x="180" y="280" fill="rgba(255,255,255,0.08)" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Bandra</text>
            <text x="320" y="380" fill="rgba(255,255,255,0.08)" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Dadar</text>
            <text x="480" y="220" fill="rgba(255,255,255,0.08)" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Goregaon</text>
            <text x="240" y="480" fill="rgba(255,255,255,0.08)" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Sion</text>
            <text x="150" y="520" fill="rgba(255,255,255,0.08)" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Kurla</text>
            <text x="420" y="320" fill="rgba(255,255,255,0.08)" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Worli</text>
            <text x="220" y="120" fill="rgba(255,255,255,0.08)" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Juhu</text>

            {/* Coastal line highlight */}
            <path d="M0,0 Q120,150 80,300 Q60,450 100,600" fill="none" stroke="rgba(0,212,170,0.1)" strokeWidth="2" />
          </svg>

          {/* Issue Markers */}
          {filteredIssues.map((issue) => {
            const pos = latLngToPercent(issue.location.lat, issue.location.lng);
            return (
              <div key={issue.id} style={{ left: `${pos.x}%`, top: `${pos.y}%`, position: "absolute" }}>
                <MapMarker
                  lat={issue.location.lat}
                  lng={issue.location.lng}
                  category={issue.category}
                  severity={issue.severity}
                  status={issue.status}
                  issueId={issue.id}
                  isSelected={selectedIssue?.id === issue.id}
                  onClick={() => setSelectedIssue(issue)}
                />
              </div>
            );
          })}

          {/* Prediction Markers */}
          {predictionsToShow.map((pred) => {
            const pos = latLngToPercent(pred.lat, pred.lng);
            return (
              <div key={pred.id} style={{ left: `${pos.x}%`, top: `${pos.y}%`, position: "absolute" }}>
                <MapMarker
                  lat={pred.lat}
                  lng={pred.lng}
                  category={pred.category}
                  severity="Low"
                  status="Submitted"
                  issueId={pred.id}
                  isPrediction={true}
                  isSelected={selectedIssue?.id === pred.id}
                  onClick={() => setSelectedIssue({
                    id: pred.id,
                    userId: "",
                    category: pred.category,
                    severity: "Low",
                    status: "Submitted",
                    location: { lat: pred.lat, lng: pred.lng, address: "Predicted Location" },
                    description: pred.reason,
                    aiSummary: pred.reason,
                    aiConfidence: pred.confidence,
                    department: "",
                    trustScore: 0,
                    fraudScore: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    escalationLevel: 0,
                    votes: 0,
                  } as any)}
                  label={`${pred.riskScore}% Risk`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Issue Panel */}
      <AnimatePresence>
        {selectedIssue && (
          <motion.div
            className="absolute top-16 right-4 z-40 w-72"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <GlassCard className="p-4" dark>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">{selectedIssue.id}</h4>
                  <p className="text-xs text-white/50">{selectedIssue.category}</p>
                </div>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-white/70 leading-relaxed">{selectedIssue.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider"
                    style={{
                      backgroundColor: selectedIssue.status === "Resolved" || selectedIssue.status === "Verified"
                        ? "rgba(0,212,170,0.15)"
                        : selectedIssue.severity === "Critical"
                        ? "rgba(255,107,107,0.15)"
                        : selectedIssue.severity === "High"
                        ? "rgba(255,140,66,0.15)"
                        : "rgba(255,184,0,0.15)",
                      color: selectedIssue.status === "Resolved" || selectedIssue.status === "Verified"
                        ? "#00D4AA"
                        : selectedIssue.severity === "Critical"
                        ? "#FF6B6B"
                        : selectedIssue.severity === "High"
                        ? "#FF8C42"
                        : "#FFB800",
                    }}
                  >
                    {selectedIssue.status === "Resolved" || selectedIssue.status === "Verified"
                      ? "Resolved"
                      : selectedIssue.severity}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50 uppercase tracking-wider">
                    {selectedIssue.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Location</span>
                    <span className="text-white/70 text-right max-w-[140px]">{selectedIssue.location.address}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Department</span>
                    <span className="text-white/70">{selectedIssue.department || "N/A"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Trust Score</span>
                    <span className="text-[#00D4AA]">{selectedIssue.trustScore}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Votes</span>
                    <span className="text-white/70">{selectedIssue.votes}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">AI Confidence</span>
                    <span className="text-[#635BFF]">{selectedIssue.aiConfidence}%</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
