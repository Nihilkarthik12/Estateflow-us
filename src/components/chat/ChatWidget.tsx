"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, ChevronRight, Building2 } from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  action?: string;
}

interface Props {
  orgId?: string;
}

const WELCOME = "Hi! I'm the EstateFlow AI assistant. How can I help you today? You can ask me about available properties, pricing, or book a site visit.";

export default function ChatWidget({ orgId }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedOrgId = orgId ?? process.env.NEXT_PUBLIC_ORG_ID ?? undefined;

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
          organizationId: resolvedOrgId,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Sorry, I couldn't understand that.", action: data.action },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden"
          style={{ background: "var(--surface)", height: "520px" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }}
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Building2 size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-none">EstateFlow AI</p>
              <p className="text-[11px] text-white/70 mt-0.5">Property Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "text-[var(--foreground)] bg-[var(--surface-2)] border border-[var(--border)] rounded-bl-sm"
                  }`}
                  style={msg.role === "user" ? { background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" } : undefined}
                >
                  {msg.content}
                </div>
                {msg.action === "book_visit" && (
                  <Link
                    href="/submit-lead"
                    className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] bg-[var(--accent-muted)] px-3 py-1.5 rounded-lg hover:bg-[var(--accent)]/20 transition-colors"
                  >
                    Submit Enquiry <ChevronRight size={12} />
                  </Link>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start">
                <div className="px-3 py-2 rounded-2xl rounded-bl-sm bg-[var(--surface-2)] border border-[var(--border)]">
                  <Loader2 size={14} className="animate-spin text-[var(--accent)]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 shrink-0 border-t border-[var(--border)]">
            <div className="flex gap-2 items-center bg-[var(--surface-2)] border border-[var(--border-strong)] rounded-xl px-3 py-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about properties…"
                className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" }}
              >
                <Send size={13} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
          boxShadow: "0 8px 32px var(--accent-glow)",
        }}
        aria-label="Open chat"
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>
    </>
  );
}
