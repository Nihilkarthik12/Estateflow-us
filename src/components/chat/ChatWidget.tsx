"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Building2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle2,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  action?: string;
}

const WELCOME =
  "Hi! I'm the EstateFlow AI assistant. Ask me about listings, pricing, mortgage estimates, or book a showing — type or tap the mic to speak.";

const QUICK_CHIPS = [
  "Show homes under $500K",
  "How does AI follow-up work?",
  "Explain closing costs",
  "Book a showing",
];

// Render **bold**, bullet lists, and numbered lists from AI replies
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  function flushList() {
    if (!listBuffer.length) return;
    if (listType === "ul") {
      elements.push(
        <ul key={elements.length} className="mt-1 mb-1 flex flex-col gap-0.5">
          {listBuffer.map((item, i) => (
            <li key={i} className="flex gap-1.5 items-start">
              <span className="mt-[3px] w-1 h-1 rounded-full bg-blue-400 shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={elements.length} className="mt-1 mb-1 flex flex-col gap-0.5 list-decimal list-inside">
          {listBuffer.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    }
    listBuffer = [];
    listType = null;
  }

  for (const line of lines) {
    const ulMatch = line.match(/^[-*•]\s+(.*)/);
    const olMatch = line.match(/^\d+[.)]\s+(.*)/);

    if (ulMatch) {
      if (listType === "ol") flushList();
      listType = "ul";
      listBuffer.push(ulMatch[1]);
    } else if (olMatch) {
      if (listType === "ul") flushList();
      listType = "ol";
      listBuffer.push(olMatch[1]);
    } else {
      flushList();
      if (line.trim()) {
        elements.push(<p key={elements.length} className="leading-relaxed">{renderInline(line)}</p>);
      }
    }
  }
  flushList();
  return <div className="flex flex-col gap-1 text-sm">{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chipsVisible, setChipsVisible] = useState(true);

  // Voice state
  const [recording, setRecording] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const lastInputWasVoice = useRef(false);

  // Lead capture state
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFormReason, setLeadFormReason] = useState<"save_lead" | "book_visit">("save_lead");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, showLeadForm]);

  // ── Voice input ───────────────────────────────────────────────────────────

  function toggleRecording() {
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setRecording(true);
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const transcript: string = e.results[0][0].transcript;
      lastInputWasVoice.current = true;
      sendMessage(transcript);
    };
    rec.start();
    recognitionRef.current = rec;
  }

  // ── Voice output (OpenAI TTS) ─────────────────────────────────────────────

  async function speakText(text: string, idx: number) {
    try {
      setSpeakingIdx(idx);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) { setSpeakingIdx(null); return; }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setSpeakingIdx(null); URL.revokeObjectURL(url); };
      audio.onerror = () => setSpeakingIdx(null);
      audio.play();
    } catch {
      setSpeakingIdx(null);
    }
  }

  function stopSpeaking() {
    audioRef.current?.pause();
    setSpeakingIdx(null);
  }

  // ── Send message ──────────────────────────────────────────────────────────

  async function sendMessage(overrideText?: string) {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    setChipsVisible(false);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.reply ?? "Sorry, something went wrong.";
      const assistantMsg: Message = { role: "assistant", content: reply, action: data.action };

      setMessages((prev) => {
        const next = [...prev, assistantMsg];
        if (lastInputWasVoice.current) {
          lastInputWasVoice.current = false;
          setTimeout(() => speakText(reply, next.length - 1), 100);
        }
        return next;
      });

      if ((data.action === "book_visit" || data.action === "save_lead") && !leadSaved) {
        setLeadFormReason(data.action);
        setShowLeadForm(true);
      }
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
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  // ── Lead capture ──────────────────────────────────────────────────────────

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail.trim());

  async function submitLead() {
    if (!leadName.trim() || !leadPhone.trim() || !emailValid) return;
    setLeadSubmitting(true);

    const conversationSummary = messages
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join(" | ");

    try {
      await fetch("/api/chat-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName.trim(),
          phone: leadPhone.trim(),
          email: leadEmail.trim(),
          conversationSummary,
        }),
      });
      setLeadSaved(true);
      setShowLeadForm(false);
      const firstName = leadName.split(" ")[0];
      const confirmMsg = leadFormReason === "book_visit"
        ? `Perfect, ${firstName}! Your showing request is saved. Our team will call you at ${leadPhone} to confirm the time. Talk soon!`
        : `Got it, ${firstName}! I've saved your details and an agent will follow up at ${leadPhone}. Is there anything else I can help you with?`;
      setMessages((prev) => [...prev, { role: "assistant", content: confirmMsg }]);
    } catch {
      // silently fail — don't break the chat experience
    } finally {
      setLeadSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: "var(--surface)",
            border: "1px solid rgba(91,141,239,0.18)",
            height: "540px",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0"
            style={{ background: "linear-gradient(135deg, #1b2d55 0%, #162240 100%)", borderBottom: "1px solid rgba(91,141,239,0.2)" }}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
              <Building2 size={16} className="text-blue-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-none">EstateFlow AI</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[11px] text-emerald-400">Online · Replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[88%] px-3 py-2 rounded-2xl ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm text-sm leading-relaxed"
                      : "text-[var(--foreground)] bg-[var(--surface-2)] rounded-bl-sm"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)" }
                      : { border: "1px solid rgba(255,255,255,0.07)" }
                  }
                >
                  {msg.role === "assistant" ? renderMarkdown(msg.content) : msg.content}
                </div>

                {/* Listen button on AI messages */}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => speakingIdx === i ? stopSpeaking() : speakText(msg.content, i)}
                    className="mt-1 flex items-center gap-1 text-[10px] text-[var(--foreground-subtle)] hover:text-blue-400 transition-colors"
                  >
                    {speakingIdx === i
                      ? <><VolumeX size={11} /> Stop</>
                      : <><Volume2 size={11} /> Listen</>
                    }
                  </button>
                )}
              </div>
            ))}

            {/* Quick-reply chips — only before first user message */}
            {chipsVisible && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all hover:bg-blue-500/10 hover:border-blue-400/40 hover:text-blue-300"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "var(--foreground-muted)",
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-start">
                <div
                  className="px-3 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5"
                  style={{ background: "var(--surface-2)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Inline lead capture form */}
            {showLeadForm && !leadSaved && (
              <div
                className="rounded-2xl p-3 flex flex-col gap-2"
                style={{ background: "var(--surface-2)", border: "1px solid rgba(91,141,239,0.25)" }}
              >
                <p className="text-xs font-semibold text-blue-400">
                  {leadFormReason === "book_visit" ? "Book your showing" : "Get agent follow-up"}
                </p>
                <p className="text-[11px] text-[var(--foreground-subtle)]">
                  {leadFormReason === "book_visit"
                    ? "Leave your details and we'll confirm the time."
                    : "Drop your number and an agent will reach out shortly."}
                </p>
                <input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none focus:border-blue-400/60 transition-colors"
                  style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <input
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="WhatsApp number"
                  type="tel"
                  className="w-full rounded-lg px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none focus:border-blue-400/60 transition-colors"
                  style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <input
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="Email address"
                  type="email"
                  className="w-full rounded-lg px-3 py-1.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none focus:border-blue-400/60 transition-colors"
                  style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitLead}
                    disabled={leadSubmitting || !leadName.trim() || !leadPhone.trim() || !emailValid}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50 transition-opacity flex items-center justify-center gap-1"
                    style={{ background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)" }}
                  >
                    {leadSubmitting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                    {leadFormReason === "book_visit" ? "Confirm Showing" : "Save & Connect"}
                  </button>
                  <button
                    onClick={() => setShowLeadForm(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Later
                  </button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="px-3 pb-3 pt-2 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div
              className="flex gap-2 items-center rounded-xl px-3 py-2"
              style={{ background: "var(--surface-2)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {speechSupported && (
                <button
                  onClick={toggleRecording}
                  title={recording ? "Stop recording" : "Speak your query"}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    recording
                      ? "bg-red-500/20 text-red-400 animate-pulse"
                      : "text-[var(--foreground-subtle)] hover:text-blue-400"
                  }`}
                >
                  {recording ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={recording ? "Listening…" : "Ask about listings…"}
                disabled={recording}
                className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] outline-none disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105 active:scale-95 shrink-0"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)" }}
              >
                <Send size={13} className="text-white" />
              </button>
            </div>
            {recording && (
              <p className="text-[10px] text-red-400 mt-1 text-center animate-pulse">
                Recording… speak now
              </p>
            )}
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
          boxShadow: "0 8px 32px rgba(37,99,235,0.45)",
        }}
        aria-label="Open chat"
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>
    </>
  );
}
