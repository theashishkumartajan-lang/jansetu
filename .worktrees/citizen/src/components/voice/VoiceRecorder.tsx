"use client";

import { motion } from "framer-motion";
import {
  Mic,
  Square,
  RotateCcw,
  AlertCircle,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  transcript: string;
}

export function VoiceRecorder({ onTranscript, transcript }: VoiceRecorderProps) {
  const { isRecording, transcript: hookTranscript, error, startRecording, stopRecording, resetTranscript } = useVoiceRecorder();

  // Sync hook transcript to parent
  if (hookTranscript && hookTranscript !== transcript) {
    onTranscript(hookTranscript);
  }

  const handleToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleClear = () => {
    resetTranscript();
    onTranscript("");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mic Button with Waveform */}
      <div className="relative flex items-center justify-center">
        {/* Animated rings when recording */}
        {isRecording && (
          <>
            <motion.div
              className="absolute rounded-full bg-[#00D4AA]/20"
              initial={{ width: 80, height: 80, opacity: 0.5 }}
              animate={{ width: 160, height: 160, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute rounded-full bg-[#00D4AA]/15"
              initial={{ width: 80, height: 80, opacity: 0.4 }}
              animate={{ width: 140, height: 140, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
          </>
        )}

        <button
          onClick={handleToggle}
          className={cn(
            "relative z-10 flex h-20 w-20 items-center justify-center rounded-full transition-all shadow-lg",
            isRecording
              ? "bg-[#FF6B6B] text-white shadow-[#FF6B6B]/30"
              : "bg-[#00D4AA] text-[#0A2540] hover:bg-[#00D4AA]/90 shadow-[#00D4AA]/30"
          )}
        >
          {isRecording ? (
            <Square className="h-8 w-8 fill-current" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Waveform Animation */}
      {isRecording && (
        <div className="flex h-8 items-center gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 rounded-full bg-[#00D4AA]"
              animate={{
                height: [8, 24 + Math.random() * 16, 8],
              }}
              transition={{
                duration: 0.6 + Math.random() * 0.4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      )}

      {/* Recording status */}
      {isRecording && (
        <p className="text-xs font-medium text-[#FF6B6B] animate-pulse">
          Recording... tap to stop
        </p>
      )}

      {!isRecording && !transcript && !error && (
        <p className="text-xs text-slate-500">Tap the mic to start recording</p>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-[#FF6B6B]/10 px-3 py-2 text-xs text-[#FF6B6B]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-xl bg-slate-50 p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Waves className="h-4 w-4 text-[#00D4AA]" />
            <span className="text-xs font-semibold text-[#0A2540]">Transcript</span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{transcript}</p>
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleClear} className="gap-1 text-xs text-slate-500">
              <RotateCcw className="h-3 w-3" />
              Clear
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
