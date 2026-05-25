"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

function CountUp({ end, suffix = "", duration = 1800 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});

const tags = ["₹90L budget", "3BHK", "Near metro", "Serious buyer"];
const properties = [
  { name: "Prestige Eden Garden", price: "₹87L", match: "98%" },
  { name: "Brigade Utopia", price: "₹91L", match: "94%" },
  { name: "Sobha City", price: "₹88L", match: "91%" },
];
const pipeline = [
  { stage: "New", count: 12, color: "var(--accent)" },
  { stage: "Contacted", count: 7, color: "#818cf8" },
  { stage: "Site Visit", count: 4, color: "var(--warning)" },
  { stage: "Closed", count: 2, color: "var(--success)" },
];

export default function Hero() {
  return (
    <section className="relative pt-28 sm:pt-32 pb-20 sm:pb-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(91,110,245,0.22)_0%,transparent_65%)]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse,rgba(34,211,238,0.07)_0%,transparent_70%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] items-center">

          {/* Left — copy */}
          <div className="max-w-2xl">
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.16em] uppercase text-[var(--accent-light)] bg-[var(--accent-muted)] border border-[var(--border-accent)] mb-8"
            >
              <Sparkles size={13} className="text-[var(--accent)]" />
              AI-powered real estate CRM for India
            </motion.div>

            <motion.h1
              {...fadeUp(0.06)}
              className="text-[2.75rem] sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-[-0.035em] text-[var(--foreground)]"
            >
              Turn every WhatsApp lead into a{" "}
              <span className="gradient-text">closed deal</span>, automatically.
            </motion.h1>

            <motion.p
              {...fadeUp(0.12)}
              className="mt-5 text-base sm:text-lg leading-relaxed text-[var(--foreground-muted)] max-w-xl"
            >
              EstateFlow captures every enquiry, scores buyer intent with AI,
              matches properties and sends follow-ups — before your competitor
              even picks up the phone.
            </motion.p>

            <motion.div
              {...fadeUp(0.17)}
              className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <Link
                href="/signup"
                className="glow-border inline-flex items-center justify-center gap-2 font-semibold rounded-xl text-sm px-7 py-3.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all shadow-[0_0_24px_var(--accent-glow)] hover:shadow-[0_0_40px_var(--accent-glow)]"
              >
                Start free — no card needed
                <ArrowRight size={15} />
              </Link>
              <Link
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 font-medium rounded-xl text-sm px-6 py-3.5 border border-[var(--border-strong)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/[0.04] transition-all"
              >
                See how it works
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              {...fadeUp(0.22)}
              className="mt-10 flex flex-wrap gap-x-8 gap-y-4"
            >
              {[
                { display: <><CountUp end={3} suffix="×" /></>, label: "more leads converted" },
                { display: <>{"< 2s"}</>, label: "AI analysis time" },
                { display: <><CountUp end={99} suffix=".8%" /></>, label: "uptime guaranteed" },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-bold text-[var(--foreground)] leading-none">{s.display}</p>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — live dashboard mockup */}
          <motion.div {...fadeUp(0.28)} className="relative">
            {/* Glow behind card */}
            <div className="absolute -inset-4 bg-[radial-gradient(ellipse,rgba(91,110,245,0.15)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative rounded-[1.75rem] border border-white/[0.1] bg-[var(--surface)] shadow-[0_40px_80px_-16px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07] bg-[var(--surface-2)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-2 h-5 rounded-md bg-[var(--surface-3)] flex items-center justify-center">
                  <span className="text-[9px] text-[var(--foreground-subtle)]">estateflow.app / dashboard / leads</span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* New lead alert */}
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[var(--success-muted)] border border-[rgba(16,185,129,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse shrink-0" />
                  <span className="text-xs font-medium text-[var(--success)]">New lead · AI analyzed in 1.2s</span>
                  <span className="ml-auto text-[10px] text-[var(--foreground-subtle)]">Just now</span>
                </div>

                {/* Lead card */}
                <div className="rounded-2xl bg-[var(--surface-2)] border border-white/[0.07] p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--cyan)] flex items-center justify-center text-xs font-bold text-white shrink-0">A</div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">Arjun Mehta</p>
                        <p className="text-[11px] text-[var(--foreground-muted)]">+91 98765 43210 · Chennai</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/20 shrink-0">
                      🔴 HIGH
                    </span>
                  </div>

                  {/* AI tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--accent-muted)] text-[var(--accent-light)] border border-[var(--border-accent)]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Score bar */}
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] text-[var(--foreground-subtle)] shrink-0">Lead score</p>
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
                      <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--cyan)]" />
                    </div>
                    <span className="text-xs font-bold text-[var(--foreground)] tabular-nums shrink-0">88/100</span>
                  </div>
                </div>

                {/* Matched properties */}
                <div className="rounded-2xl bg-[var(--surface-2)] border border-white/[0.07] p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-semibold text-[var(--foreground)]">Matched properties</p>
                    <span className="text-xs font-bold text-[var(--accent)]">{properties.length} found</span>
                  </div>
                  <div className="space-y-2">
                    {properties.map((p) => (
                      <div key={p.name} className="flex items-center justify-between">
                        <span className="text-[11px] text-[var(--foreground-muted)] truncate">{p.name}</span>
                        <div className="flex items-center gap-2.5 shrink-0 ml-2">
                          <span className="text-[11px] text-[var(--foreground-subtle)]">{p.price}</span>
                          <span className="text-[11px] font-bold text-[var(--success)]">{p.match}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pipeline mini */}
                <div className="rounded-2xl bg-[var(--surface-2)] border border-white/[0.07] p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-semibold text-[var(--foreground)]">Live pipeline</p>
                    <div className="flex items-center gap-1 text-[var(--success)]">
                      <TrendingUp size={11} />
                      <span className="text-[10px] font-semibold">+18% this week</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {pipeline.map((p) => (
                      <div key={p.stage} className="text-center">
                        <p className="text-lg font-bold text-[var(--foreground)]" style={{ color: p.color }}>{p.count}</p>
                        <p className="text-[9px] text-[var(--foreground-subtle)] mt-0.5">{p.stage}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA button */}
                <button className="w-full py-2.5 rounded-xl text-xs font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-colors">
                  Send AI follow-up →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
