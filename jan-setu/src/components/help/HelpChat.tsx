"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Loader2, Send, User } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const topicCopy: Record<string, { title: string; intro: string; starter: string[] }> = {
  report: {
    title: "Report Support",
    intro: "Ask me how to submit a strong civic issue report with photo, voice, text, and GPS verification.",
    starter: ["How do I report a pothole?", "What photo should I upload?", "How do I mark an issue urgent?"],
  },
  location: {
    title: "Location Help",
    intro: "Ask me about GPS permissions, exact address entry, photo-location checks, and duplicate detection.",
    starter: ["GPS is not working", "Why is exact location required?", "How do I change the address?"],
  },
  status: {
    title: "Status Questions",
    intro: "Ask me about ticket IDs, assigned departments, response deadlines, escalation, and repair verification.",
    starter: ["How do I track my report?", "What does escalated mean?", "When will my issue be fixed?"],
  },
};

export function HelpChat({ topic }: { topic: string }) {
  const selectedTopic = topicCopy[topic] ? topic : "report";
  const copy = topicCopy[selectedTopic];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: copy.intro },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const canSend = input.trim().length > 0 && !isSending;
  const visibleMessages = useMemo(() => messages.slice(-12), [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages, isSending]);

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/help-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: selectedTopic, messages: nextMessages }),
      });
      const data = await response.json() as { reply?: string };
      setMessages([...nextMessages, {
        role: "assistant",
        content: data.reply || "I can help, but I need one more detail. Are you asking about reporting, GPS verification, or ticket status?",
      }]);
    } catch {
      setMessages([...nextMessages, {
        role: "assistant",
        content: "I could not connect to the help assistant. Please try again in a moment.",
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC] pb-12">
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/customer-help" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0A2540]">
            <ArrowLeft className="h-4 w-4" /> Back to Customer Help
          </Link>
          <h1 className="text-3xl font-bold text-[#0A2540]">{copy.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">{copy.intro}</p>
        </div>
      </section>

      <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0A2540]">
              <Bot className="h-4 w-4 text-[#00D4AA]" />
              Jan Setu Help Desk
            </div>
          </div>

          <div className="h-[440px] space-y-4 overflow-y-auto px-4 py-5">
            {visibleMessages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div key={`${message.role}-${index}`} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00D4AA]/10 text-[#00A987]">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    isUser ? "bg-[#0A2540] text-white" : "bg-slate-100 text-slate-700"
                  }`}>
                    {message.content}
                  </div>
                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
            {isSending && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-[#00D4AA]" />
                Help desk is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-100 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {copy.starter.map((starter) => (
                <button
                  key={starter}
                  disabled={isSending}
                  onClick={() => sendMessage(starter)}
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[#00D4AA] hover:text-[#0A2540] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {starter}
                </button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type your question..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#00D4AA] focus:ring-2 focus:ring-[#00D4AA]/15"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex items-center gap-2 rounded-xl bg-[#00D4AA] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00B896] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
