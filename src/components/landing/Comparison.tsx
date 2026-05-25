"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const rows = [
  { label: "Lead response time",    before: "2–3 hours (if lucky)",     after: "Under 90 seconds, automated" },
  { label: "Data entry",            before: "Manual, full of errors",    after: "AI extracts everything instantly" },
  { label: "Follow-ups",            before: "Forgotten 60% of the time", after: "Never missed — fully automated" },
  { label: "After-hours enquiries", before: "Missed completely",         after: "AI handles 24/7, qualifies live" },
  { label: "Property matching",     before: "Manual search, takes hours",after: "AI-matched in under 2 seconds" },
  { label: "Lead scoring",          before: "Gut feeling only",          after: "AI score 0–100, with reasoning" },
  { label: "Agent workload",        before: "Drowning in WhatsApp",      after: "Focus only on hot, ready leads" },
];

export default function Comparison() {
  return (
    <section className="landing-section px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">The difference</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-tight tracking-tight text-[var(--foreground)]">
            Your competitors are still using{" "}
            <span className="line-through text-[var(--foreground-subtle)]">Excel & WhatsApp</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl mx-auto">
            See exactly what changes when you switch to EstateFlow.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-[var(--border)] overflow-hidden"
        >
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-[var(--surface-2)]">
            <div className="px-5 py-4 border-b border-r border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--foreground-subtle)] uppercase tracking-widest">Situation</p>
            </div>
            <div className="px-5 py-4 border-b border-r border-[var(--border)] flex items-center gap-2">
              <X size={14} className="text-red-400" />
              <p className="text-xs font-semibold text-red-400 uppercase tracking-widest">Old way</p>
            </div>
            <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2"
              style={{ background: "linear-gradient(90deg, rgba(91,110,245,0.08) 0%, transparent 100%)" }}>
              <Check size={14} className="text-[var(--success)]" />
              <p className="text-xs font-semibold text-[var(--success)] uppercase tracking-widest">EstateFlow</p>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="grid grid-cols-[1fr_1fr_1fr] group hover:bg-white/[0.02] transition-colors"
            >
              <div className="px-5 py-4 border-b border-r border-[var(--border)] flex items-center">
                <span className="text-sm font-medium text-[var(--foreground)]">{row.label}</span>
              </div>
              <div className="px-5 py-4 border-b border-r border-[var(--border)] flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-500/15 border border-red-500/25 flex items-center justify-center mt-0.5 shrink-0">
                  <X size={9} className="text-red-400" />
                </div>
                <span className="text-sm text-[var(--foreground-muted)]">{row.before}</span>
              </div>
              <div
                className="px-5 py-4 border-b border-[var(--border)] flex items-start gap-2.5"
                style={{ background: "linear-gradient(90deg, rgba(91,110,245,0.06) 0%, transparent 100%)" }}
              >
                <div className="w-4 h-4 rounded-full bg-[var(--success-muted)] border border-[rgba(16,185,129,0.25)] flex items-center justify-center mt-0.5 shrink-0">
                  <Check size={9} className="text-[var(--success)]" />
                </div>
                <span className="text-sm font-medium text-[var(--foreground)]">{row.after}</span>
              </div>
            </motion.div>
          ))}

          {/* Footer row */}
          <div className="grid grid-cols-[1fr_1fr_1fr]">
            <div className="px-5 py-4 border-r border-[var(--border)] bg-[var(--surface-2)]" />
            <div className="px-5 py-4 border-r border-[var(--border)] bg-[var(--surface-2)] flex items-center gap-2">
              <span className="text-sm text-red-400 font-semibold">Deals slipping away daily</span>
            </div>
            <div
              className="px-5 py-4 flex items-center gap-2"
              style={{ background: "linear-gradient(90deg, rgba(91,110,245,0.1) 0%, var(--surface-2) 100%)" }}
            >
              <span className="text-sm text-[var(--success)] font-semibold">More closed deals, less effort</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
