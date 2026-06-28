"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Mic,
  MapPin,
  Send,
  ChevronRight,
  ChevronLeft,
  ImageIcon,
  X,
  CheckCircle2,
  Share2,
  FileText,
  Sparkles,
  Navigation,
  RotateCcw,
  AlertTriangle,
  Eye,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlassCard } from "@/components/shared/GlassCard";
import { VoiceRecorder } from "@/components/voice/VoiceRecorder";
import { AgentProcessingCard } from "@/components/agents/AgentProcessingCard";
import { useAppStore } from "@/stores/app-store";
import { useCountUp } from "@/hooks/useCountUp";
import { CATEGORIES, CATEGORY_DEPT, POINTS } from "@/data/mock";
import { Issue, IssueCategory, SeverityLevel } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

const AGENTS = [
  { name: "Report Agent", icon: "FileText", description: "Parsing report content" },
  { name: "Category Agent", icon: "Sparkles", description: "Classifying issue type" },
  { name: "Severity Agent", icon: "AlertTriangle", description: "Assessing severity level" },
  { name: "Route Agent", icon: "Navigation", description: "Routing to department" },
  { name: "Trust Agent", icon: "Shield", description: "Evaluating trust score" },
  { name: "Fraud Agent", icon: "Eye", description: "Detecting fraud patterns" },
];

export default function ReportPage() {
  const { currentUser, addIssue, triggerReward } = useAppStore();
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [voiceText, setVoiceText] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [locating, setLocating] = useState(false);
  const [agentResults, setAgentResults] = useState<
    { name: string; status: "pending" | "processing" | "completed" | "failed"; confidence: number; reasoning: string; output: Record<string, any> }[]
  >([]);
  const [category, setCategory] = useState<IssueCategory>("Other");
  const [severity, setSeverity] = useState<SeverityLevel>("Medium");
  const [department, setDepartment] = useState("Public Works");
  const [ticketId, setTicketId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pointsEarned = useCountUp(POINTS.REPORT_ISSUE, 1500);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const detectLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: "Auto-detected location",
          });
          setLocating(false);
        },
        () => {
          // Fallback mock location
          setLocation({ lat: 19.076, lng: 72.8777, address: "Andheri West, Mumbai" });
          setLocating(false);
          toast("Using approximate location");
        }
      );
    } else {
      setLocation({ lat: 19.076, lng: 72.8777, address: "Andheri West, Mumbai" });
      setLocating(false);
    }
  };

  const runAIAnalysis = async () => {
    const baseText = voiceText || description || "Issue reported";
    const results = AGENTS.map((a) => ({
      name: a.name,
      status: "pending" as const,
      confidence: 0,
      reasoning: "",
      output: {},
    }));
    setAgentResults(results);
    setStep(2);

    for (let i = 0; i < AGENTS.length; i++) {
      // processing
      setAgentResults((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], status: "processing" as const };
        return next;
      });
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

      // completed
      const confidence = Math.floor(85 + Math.random() * 14);
      const reasoning = getAgentReasoning(AGENTS[i].name, baseText);
      const output = getAgentOutput(AGENTS[i].name, baseText);
      setAgentResults((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], status: "completed" as const, confidence, reasoning, output };
        return next;
      });
      await new Promise((r) => setTimeout(r, 400));
    }

    // Auto-set derived fields from analysis
    const detectedCategory = detectCategory(baseText);
    setCategory(detectedCategory);
    setDepartment(CATEGORY_DEPT[detectedCategory] || "Public Works");
    const detectedSeverity = detectSeverity(baseText);
    setSeverity(detectedSeverity);

    // Move to review after brief pause
    await new Promise((r) => setTimeout(r, 800));
    setStep(3);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const newIssue: Issue = {
        id: `ISS-${String(Date.now()).slice(-3)}`,
        userId: currentUser?.id || "u1",
        category,
        severity,
        status: "Submitted",
        location: location || { lat: 19.076, lng: 72.8777, address: "Andheri West, Mumbai" },
        description: voiceText || description,
        aiSummary: generateSummary(voiceText || description),
        aiConfidence: 95,
        imageUrl: image || undefined,
        department,
        trustScore: currentUser?.trustScore || 80,
        fraudScore: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        escalationLevel: 0,
        votes: 0,
      };
      addIssue(newIssue);
      setTicketId(newIssue.id);
      triggerReward({
        points: POINTS.REPORT_ISSUE,
        message: `You earned ${POINTS.REPORT_ISSUE} points for your report!`,
      });
      setSubmitting(false);
      setStep(4);
    }, 1500);
  };

  const canProceedToAI = !!(image || voiceText || description);

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                      step >= s
                        ? "border-[#00D4AA] bg-[#00D4AA] text-white"
                        : "border-slate-300 bg-white text-slate-400"
                    }`}
                  >
                    {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
                  </div>
                  <span className={`mt-2 text-xs font-medium ${step >= s ? "text-[#0A2540]" : "text-slate-400"}`}>
                    {s === 1 && "Capture"}
                    {s === 2 && "AI Analysis"}
                    {s === 3 && "Review"}
                    {s === 4 && "Success"}
                  </span>
                </div>
                {s < 4 && (
                  <div className={`mx-2 h-0.5 flex-1 ${step > s ? "bg-[#00D4AA]" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="mb-6" glow>
                <h1 className="text-2xl font-bold text-[#0A2540]">Report an Issue</h1>
                <p className="mt-1 text-sm text-slate-500">Capture a photo, record your voice, or type a description.</p>
              </GlassCard>

              {/* Photo Upload */}
              <GlassCard className="mb-4">
                <Label className="mb-3 block text-sm font-semibold text-[#0A2540]">Photo Evidence</Label>
                {!image ? (
                  <div
                    {...getRootProps()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                      isDragActive
                        ? "border-[#00D4AA] bg-[#00D4AA]/5"
                        : "border-slate-300 hover:border-[#00D4AA] hover:bg-slate-50"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Camera className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-3 text-sm font-medium text-[#0A2540]">
                      {isDragActive ? "Drop the image here" : "Tap to take photo or upload"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Supports JPG, PNG, WEBP</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </GlassCard>

              {/* Voice Recorder */}
              <GlassCard className="mb-4">
                <Label className="mb-3 block text-sm font-semibold text-[#0A2540]">Voice Report</Label>
                <VoiceRecorder
                  onTranscript={setVoiceText}
                  transcript={voiceText}
                />
              </GlassCard>

              {/* Text Description */}
              <GlassCard className="mb-4">
                <Label className="mb-3 block text-sm font-semibold text-[#0A2540]">Or type a description</Label>
                <Textarea
                  placeholder="Describe the issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </GlassCard>

              {/* Location */}
              <GlassCard className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00D4AA]/10">
                      <MapPin className="h-5 w-5 text-[#00D4AA]" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-[#0A2540]">Location</Label>
                      <p className="text-xs text-slate-500">
                        {location ? location.address : locating ? "Detecting..." : "Auto-detect location"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={detectLocation}
                    disabled={locating}
                  >
                    {locating ? (
                      <RotateCcw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                    {locating ? "Locating..." : "Detect"}
                  </Button>
                </div>
              </GlassCard>

              <div className="flex justify-end">
                <Button
                  onClick={runAIAnalysis}
                  disabled={!canProceedToAI}
                  className="gap-2 bg-[#00D4AA] text-[#0A2540] hover:bg-[#00D4AA]/90"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4" />
                  Analyze with AI
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="mb-6" glow>
                <h1 className="text-2xl font-bold text-[#0A2540]">AI Analysis</h1>
                <p className="mt-1 text-sm text-slate-500">Our agents are analyzing your report in real-time...</p>
              </GlassCard>

              <div className="space-y-3">
                {AGENTS.map((agent, i) => {
                  const result = agentResults[i];
                  return (
                    <AgentProcessingCard
                      key={agent.name}
                      name={agent.name}
                      icon={agent.icon}
                      description={agent.description}
                      status={result?.status || "pending"}
                      confidence={result?.confidence || 0}
                      reasoning={result?.reasoning || ""}
                      output={result?.output || {}}
                      index={i}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="mb-6" glow>
                <h1 className="text-2xl font-bold text-[#0A2540]">Review & Confirm</h1>
                <p className="mt-1 text-sm text-slate-500">AI has pre-filled the details. You can edit before submitting.</p>
              </GlassCard>

              <div className="space-y-4">
                <GlassCard>
                  <Label className="mb-2 block text-sm font-semibold text-[#0A2540]">Category</Label>
                  <Select value={category} onValueChange={(v) => {
                    setCategory(v as IssueCategory);
                    setDepartment(CATEGORY_DEPT[v] || "Public Works");
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GlassCard>

                <GlassCard>
                  <Label className="mb-2 block text-sm font-semibold text-[#0A2540]">Severity</Label>
                  <Select value={severity} onValueChange={(v) => setSeverity(v as SeverityLevel)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Low", "Medium", "High", "Critical"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </GlassCard>

                <GlassCard>
                  <Label className="mb-2 block text-sm font-semibold text-[#0A2540]">Description</Label>
                  <Textarea
                    value={voiceText || description}
                    onChange={(e) => {
                      if (voiceText) setVoiceText(e.target.value);
                      else setDescription(e.target.value);
                    }}
                    className="min-h-[100px]"
                  />
                </GlassCard>

                <GlassCard>
                  <Label className="mb-2 block text-sm font-semibold text-[#0A2540]">Location</Label>
                  <Input
                    value={location?.address || "Andheri West, Mumbai"}
                    onChange={(e) =>
                      setLocation((prev) => (prev ? { ...prev, address: e.target.value } : { lat: 19.076, lng: 72.8777, address: e.target.value }))
                    }
                  />
                </GlassCard>

                <GlassCard>
                  <Label className="mb-2 block text-sm font-semibold text-[#0A2540]">Department</Label>
                  <Input value={department} readOnly className="bg-slate-50" />
                </GlassCard>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 gap-2 bg-[#00D4AA] text-[#0A2540] hover:bg-[#00D4AA]/90"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <RotateCcw className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <GlassCard className="mb-6" glow>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#00D4AA]/10"
                >
                  <CheckCircle2 className="h-10 w-10 text-[#00D4AA]" />
                </motion.div>
                <h1 className="text-2xl font-bold text-[#0A2540]">Report Submitted!</h1>
                <p className="mt-2 text-sm text-slate-500">
                  Your issue has been logged and assigned to the relevant department.
                </p>

                <div className="mt-6 rounded-xl bg-[#0A2540]/5 p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ticket ID</p>
                  <p className="mt-1 text-2xl font-mono font-bold text-[#0A2540]">{ticketId}</p>
                </div>

                <div className="mt-4 rounded-xl bg-[#00D4AA]/10 p-4">
                  <p className="text-xs font-medium text-[#00D4AA] uppercase tracking-wide">Estimated Resolution</p>
                  <p className="mt-1 text-lg font-bold text-[#0A2540]">3–5 business days</p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6"
                >
                  <p className="text-sm text-slate-500">Points earned</p>
                  <p className="text-4xl font-bold text-gradient">+{pointsEarned}</p>
                </motion.div>
              </GlassCard>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Link href="/citizen">
                  <Button className="gap-2 bg-[#00D4AA] text-[#0A2540] hover:bg-[#00D4AA]/90">
                    <FileText className="h-4 w-4" />
                    View My Reports
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getAgentReasoning(name: string, text: string): string {
  const reasonings: Record<string, string> = {
    "Report Agent": "Extracted key details from user description and voice transcript. Structured raw input into report format.",
    "Category Agent": `Analyzed description keywords and matched against known categories. Primary indicators found in text.`,
    "Severity Agent": "Evaluated urgency markers, public safety impact, and historical severity baselines for this issue type.",
    "Route Agent": "Cross-referenced category with department jurisdiction and current workload distribution.",
    "Trust Agent": "User has high historical trust score. Consistent reporting pattern verified. No anomalies detected.",
    "Fraud Agent": "Image metadata and location match reported area. No duplicate submissions or suspicious patterns found.",
  };
  return reasonings[name] || "Analysis completed successfully.";
}

function getAgentOutput(name: string, text: string): Record<string, any> {
  const outputs: Record<string, Record<string, any>> = {
    "Report Agent": { summary: text.slice(0, 80) + "...", language: "en-IN", sentiment: "concerned" },
    "Category Agent": { category: detectCategory(text), confidence: 96 },
    "Severity Agent": { severity: detectSeverity(text), confidence: 92 },
    "Route Agent": { department: CATEGORY_DEPT[detectCategory(text)] || "Public Works", sla: "3-5 days" },
    "Trust Agent": { trustScore: 94, verdict: "Trusted" },
    "Fraud Agent": { fraudScore: 2, risk: "Low" },
  };
  return outputs[name] || {};
}

function detectCategory(text: string): IssueCategory {
  const lower = text.toLowerCase();
  if (lower.includes("pothole") || lower.includes("road")) return "Pothole";
  if (lower.includes("garbage") || lower.includes("trash")) return "Garbage";
  if (lower.includes("water") || lower.includes("leak") || lower.includes("pipe")) return "Water Leak";
  if (lower.includes("light") || lower.includes("streetlight")) return "Broken Streetlight";
  if (lower.includes("drain") || lower.includes("sewage")) return "Drainage Issue";
  if (lower.includes("tree") || lower.includes("fallen")) return "Fallen Tree";
  if (lower.includes("signal") || lower.includes("traffic")) return "Traffic Signal Failure";
  if (lower.includes("sidewalk")) return "Broken Sidewalk";
  if (lower.includes("graffiti")) return "Graffiti";
  if (lower.includes("safety") || lower.includes("hazard")) return "Public Safety Hazard";
  return "Other";
}

function detectSeverity(text: string): SeverityLevel {
  const lower = text.toLowerCase();
  if (lower.includes("critical") || lower.includes("emergency") || lower.includes("dangerous") || lower.includes("accident")) return "Critical";
  if (lower.includes("urgent") || lower.includes("broken") || lower.includes("leak")) return "High";
  if (lower.includes("minor") || lower.includes("small") || lower.includes("graffiti")) return "Low";
  return "Medium";
}

function generateSummary(text: string): string {
  return text.length > 100 ? text.slice(0, 100) + "..." : text;
}
