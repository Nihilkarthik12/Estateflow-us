"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
});

const trustedBy = ["Prestige Group", "Brigade", "Sobha", "Mahindra"];

const stats = [
  { label: "Faster response", value: "+46%" },
  { label: "Lead coverage", value: "99.8%" },
  { label: "Automation ROI", value: "3x" },
  { label: "Agent adoption", value: "92%" },
];

export default function Hero() {
  return (
    <section className="relative pt-24 sm:pt-28 pb-24 sm:pb-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,960px)] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(91,110,245,0.2)_0%,transparent_70%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="max-w-2xl">
            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-[0.18em] uppercase text-[var(--accent-light)] bg-white/[0.05] border border-white/[0.08] mb-7">
              <Sparkles size={14} className="text-[var(--accent)]" />
              Built for Indian brokerages & property teams
            </motion.div>

            <motion.h1
              {...fadeUp(0.05)}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)]"
            >
              Sell faster with the AI CRM that turns WhatsApp leads into closed deals.
            </motion.h1>

            <motion.p
              {...fadeUp(0.1)}
              className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--foreground-muted)] max-w-2xl"
            >
              EstateFlow captures every inquiry, extracts buyer intent, matches properties and automates follow-up workflows — so your team stays focused on showings, offers and closings.
            </motion.p>

            <motion.div
              {...fadeUp(0.15)}
              className="mt-10 flex flex-col sm:flex-row items-center gap-3"
            >
              <Link href="/signup" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none text-sm px-6 py-3 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-[0.98] shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_28px_var(--accent-glow)] sm:min-w-[200px]">
                Start free trial
                <ArrowRight size={16} />
              </Link>
              <Link href="#workflow" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none text-sm px-6 py-3 bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border-strong)] hover:bg-[var(--surface-3)] hover:border-[var(--border-accent)] active:scale-[0.98] sm:min-w-[200px]">
                See the workflow
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/[0.08] bg-white/[0.04] px-5 py-4">
                  <p className="text-3xl font-semibold text-[var(--foreground)]">{item.value}</p>
                  <p className="mt-2 text-sm text-[var(--foreground-muted)]">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            {...fadeUp(0.25)}
            className="rounded-[2rem] border border-white/[0.08] bg-[var(--surface)] shadow-[0_40px_80px_-32px_rgba(0,0,0,0.75)] overflow-hidden"
          >
            <div className="bg-[var(--surface-2)] p-4 border-b border-white/[0.08] flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--foreground-subtle)]">EstateFlow dashboard</p>
                <p className="text-sm font-semibold text-[var(--foreground)]">Live activity, lead scoring, and property matches</p>
              </div>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)] bg-[var(--accent-muted)]">Beta</span>
            </div>
            <div className="p-5 sm:p-6 space-y-4">
              <div className="rounded-3xl bg-[var(--surface-3)] p-5 border border-white/[0.06]">
                <div className="flex items-center justify-between gap-3 text-sm text-[var(--foreground-muted)] mb-4">
                  <span>Incoming lead</span>
                  <span className="font-semibold text-[var(--foreground)]">High intent</span>
                </div>
                <div className="rounded-3xl bg-[rgba(16,185,129,0.1)] p-4 text-[var(--success)] text-sm font-semibold">
                  WhatsApp enquiry • ₹1.1Cr • South Bangalore • 2BHK resale
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-white/[0.06] bg-[var(--surface-3)] p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--foreground-subtle)] mb-1">Lead score</p>
                  <p className="text-2xl font-semibold text-[var(--foreground)]">92</p>
                </div>
                <div className="rounded-3xl border border-white/[0.06] bg-[var(--surface-3)] p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--foreground-subtle)] mb-1">Matched properties</p>
                  <p className="text-2xl font-semibold text-[var(--foreground)]">4</p>
                </div>
              </div>

              <div className="rounded-3xl bg-[var(--surface-3)] p-5 border border-white/[0.06] text-[var(--foreground-muted)]">
                <p className="text-sm font-semibold text-[var(--foreground)] mb-2">Suggested next steps</p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Call the lead within 15 minutes</li>
                  <li>Send property brochure and site visit link</li>
                  <li>Assign to senior sales agent</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div {...fadeUp(0.3)} className="mt-16 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground-subtle)] mb-4">
            Trusted by growth-focused real estate teams across India
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {trustedBy.map((name) => (
              <span key={name} className="text-sm font-semibold text-[var(--foreground-muted)]/90">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
