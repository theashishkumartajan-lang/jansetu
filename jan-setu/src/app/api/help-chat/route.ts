import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface HelpMessage {
  role: "user" | "assistant";
  content: string;
}

const topicGuidance: Record<string, string> = {
  report: "Help the citizen submit a civic issue report with photo, voice, description, GPS location, category, and severity.",
  location: "Help the citizen fix GPS permission, exact address, photo metadata, and duplicate report checks.",
  status: "Help the citizen understand request ID tracking, department assignment, SLA deadlines, escalation, and repair verification.",
};

function getFallbackReply(topic: string, latestMessage: string) {
  const lower = latestMessage.toLowerCase();

  if (topic === "location" || lower.includes("gps") || lower.includes("location")) {
    return "I can help with location verification. First, allow browser location access, then enter the nearest landmark or road name. If GPS is blocked, open site settings and allow location for Jan Setu. The app checks GPS lock, photo-location match, and nearby duplicate reports before submission.";
  }

  if (topic === "status" || lower.includes("status") || lower.includes("sla") || lower.includes("ticket")) {
    return "To track a report, use the ticket ID shown after submission, such as ISS-1234. Jan Setu shows the assigned department, priority, expected response time, and escalation level. Critical issues target 2 days, high priority around 4 days, and normal cases around 7 days.";
  }

  return "I can help you submit a strong report. Add a clear photo, describe what happened, include the exact location, and verify GPS. If the issue affects safety, mention blocked roads, flooding, open wires, or accident risk so the system can prioritize it correctly.";
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { topic?: string; messages?: HelpMessage[] };
    const topic = body.topic || "report";
    const messages = Array.isArray(body.messages) ? body.messages.slice(-8) : [];
    const latestMessage = messages[messages.length - 1]?.content || "";

    if (!latestMessage.trim()) {
      return NextResponse.json({ reply: "Tell me what you need help with and I will guide you step by step." });
    }

    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("your_")) {
      return NextResponse.json({ reply: getFallbackReply(topic, latestMessage), source: "fallback" });
    }

    const conversation = messages
      .map((message) => `${message.role === "user" ? "Citizen" : "Jan Setu Assistant"}: ${message.content}`)
      .join("\n");

    const prompt = [
      "You are Jan Setu Help Desk for a civic issue reporting platform in India.",
      "Be concise, practical, friendly, and action-oriented.",
      "Do not invent real government phone numbers or claim a report was submitted.",
      "Guide users through reporting, GPS verification, status tracking, SLAs, escalation, and repair verification.",
      topicGuidance[topic] || topicGuidance.report,
      "",
      conversation,
      "",
      "Reply in 2-5 short sentences. If helpful, give numbered steps.",
    ].join("\n");

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 350 },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ reply: getFallbackReply(topic, latestMessage), source: "fallback" });
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return NextResponse.json({
      reply: reply || getFallbackReply(topic, latestMessage),
      source: reply ? "gemini" : "fallback",
    });
  } catch {
    return NextResponse.json(
      { reply: "I could not process that message right now. Please try again with your report ID, location issue, or report question." },
      { status: 200 }
    );
  }
}
