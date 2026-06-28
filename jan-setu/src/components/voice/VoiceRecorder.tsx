"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
}

const WAVEFORM_BARS = 12;
const waveformData = Array.from({ length: WAVEFORM_BARS }, (_, index) => ({
  height: 24 + ((index * 7) % 16),
  duration: 0.5 + ((index % 4) * 0.08),
}));

export function VoiceRecorder({ onTranscript }: VoiceRecorderProps) {
  const { isRecording, transcript, error, startRecording, stopRecording, resetTranscript } = useVoiceRecorder();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (transcript) {
      onTranscript(transcript);
      setConfirmed(true);
    }
  };

  const handleReset = () => {
    resetTranscript();
    setConfirmed(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[#0A2540]">Voice Report</h3>
        {confirmed && <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Confirmed</span>}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        {/* Mic Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all ${
            isRecording
              ? "bg-red-500 shadow-lg shadow-red-500/30 animate-pulse"
              : "bg-gradient-to-br from-[#00D4AA] to-[#635BFF] shadow-lg shadow-[#00D4AA]/30 hover:shadow-xl hover:scale-105"
          }`}
        >
          {isRecording ? <MicOff className="h-8 w-8 text-white" /> : <Mic className="h-8 w-8 text-white" />}
          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-30" />
              <span className="absolute -inset-4 rounded-full border-2 border-red-500/30 animate-pulse" />
            </>
          )}
        </button>

        <div className="text-sm font-medium text-[#0A2540]">
          {isRecording ? "Listening..." : confirmed ? "Voice captured" : "Tap to speak"}
        </div>

        {/* Waveform Animation */}
        {isRecording && (
          <div className="flex items-center gap-1 h-8">
            {waveformData.map((bar, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-[#00D4AA]"
                animate={{
                  height: [8, bar.height, 8],
                }}
                transition={{
                  duration: bar.duration,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        )}

        {/* Transcript */}
        {transcript && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-xl bg-slate-50 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-[#00D4AA]" />
              <span className="text-xs font-medium text-slate-500">Transcript</span>
            </div>
            <p className="text-sm text-[#0A2540]">{transcript}</p>
          </motion.div>
        )}

        {/* Actions */}
        {transcript && !isRecording && !confirmed && (
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              className="rounded-xl bg-[#00D4AA] px-4 py-2 text-sm font-medium text-white hover:bg-[#00D4AA]/90 transition-colors"
            >
              Use This
            </button>
            <button
              onClick={handleReset}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
