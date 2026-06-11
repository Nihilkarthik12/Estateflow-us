"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, CheckCircle2, MessageCircle, Brain, Bell, Calendar, TrendingUp } from "lucide-react";

const CALLOUT_IMG = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80";

const ease = [0.22, 1, 0.36, 1] as const;

const timeline = [
  {
    time: "7:02 AM",
    event: "Buyer texts at midnight",
    without: { text: "You see it at 9:30 AM. Buyer already signed with a competitor at 8 AM.", sub: "Lead lost. $18K commission gone." },
    with:    { text: "AI replied in 4 seconds. Scored 94/100. 2 matching properties sent. Follow-up queued.", sub: "You wake up to a warm lead ready for a showing." },
    icon: MessageCircle,
  },
  {
    time: "9:00 AM",
    event: "3 more inquiries come in",
    without: { text: "Agent manually copies each into a spreadsheet. 45 minutes wasted. 1 inquiry missed.", sub: "$0 revenue from 45 minutes of data entry." },
    with:    { text: "All 3 auto-imported, scored, and prioritized. Jason at top: 87/100, call him first.", sub: "Agent spends 45 min on calls instead. 2 showings booked." },
    icon: Brain,
  },
  {
    time: "11:30 AM",
    event: "Yesterday's lead goes cold",
    without: { text: "Lead goes cold. You forget. They sign elsewhere after the 5th follow-up from someone else.", sub: "Research shows 80% of deals close after 5+ follow-ups." },
    with:    { text: "EstateFlow sends follow-up 2, 3, 4, 5 automatically at the right intervals via text and email.", sub: "Lead re-engages. Showing scheduled. Deal progressing." },
    icon: Bell,
  },
  {
    time: "4:00 PM",
    event: "Showing is today",
    without: { text: "Scrambling through text threads for budget and requirements. Looks unprepared.", sub: "Buyer loses confidence. Deal falls through." },
    with:    { text: "AI brief ready: budget $650K, prefers top floor, near good schools, mortgage pre-approved.", sub: "You walk in confident. Buyer impressed. Deal moves to an offer." },
    icon: Calendar,
  },
  {
    time: "6:00 PM",
    event: "End of day",
    without: { text: "3 hours on data entry. 2 leads gone cold. 0 new showings. 1 deal lost at 7 AM.", sub: "Revenue opportunity lost: $22K+ in commission." },
    with:    { text: "4 showings booked. 2 deals progressing. 1 offer accepted. AI running follow-ups overnight.", sub: "Revenue in pipeline: $60K+ commission. You leave at 6 PM." },
    icon: TrendingUp,
  },
];

export default function DayInLife() {
  return (
    <section className="py-20 sm:py-28 px-5 sm:px-8 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-3">
            A day in your life
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            The exact hours you&apos;re losing money —{" "}
            <span className="text-blue-600">and how to get them back</span>
          </h2>
          <p className="mt-4 text-[15px] text-slate-500 max-w-xl mx-auto">
            This is a real estate agent&apos;s day. You&apos;ve lived this. Let&apos;s change it.
          </p>
        </motion.div>

        {/* Column headers */}
        <div className="grid grid-cols-[90px_1fr_1fr] sm:grid-cols-[120px_1fr_1fr] gap-3 mb-4">
          <div />
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <X size={12} className="text-red-500" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-red-600">Without EstateFlow</p>
              <p className="text-[10px] text-red-400 hidden sm:block">How most agents work today</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={12} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-emerald-700">With EstateFlow</p>
              <p className="text-[10px] text-emerald-500 hidden sm:block">Your new reality</p>
            </div>
          </div>
        </div>

        {/* Timeline rows */}
        <div className="space-y-3">
          {timeline.map((row, i) => (
            <motion.div
              key={row.time}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5, ease }}
              className="grid grid-cols-[90px_1fr_1fr] sm:grid-cols-[120px_1fr_1fr] gap-3 items-start"
            >
              {/* Time */}
              <div className="pt-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <row.icon size={11} className="text-blue-600" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-600">{row.time}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-snug pl-6 hidden sm:block">{row.event}</p>
              </div>

              {/* Without */}
              <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-100">
                <p className="text-[12px] leading-relaxed text-slate-600 mb-1.5">{row.without.text}</p>
                <p className="text-[11px] font-semibold text-red-500">{row.without.sub}</p>
              </div>

              {/* With */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <p className="text-[12px] leading-relaxed text-slate-600 mb-1.5">{row.with.text}</p>
                <p className="text-[11px] font-semibold text-emerald-600">{row.with.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 overflow-hidden grid grid-cols-1 sm:grid-cols-[1fr_240px] items-stretch"
        >
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[18px] font-bold text-slate-900 mb-1">
                The difference isn&apos;t talent. It&apos;s the system.
              </p>
              <p className="text-[14px] text-slate-500">
                Top agents aren&apos;t working harder — they&apos;re working smarter. EstateFlow is the unfair advantage your competitors don&apos;t want you to have.
              </p>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <p className="text-5xl font-extrabold text-blue-600 leading-none">$60K+</p>
              <p className="text-[12px] text-slate-500 mt-1.5">Extra commission in pipeline<br/>per agent, per month</p>
            </div>
          </div>
          {/* House photo */}
          <div className="relative min-h-[160px] sm:min-h-full hidden sm:block">
            <Image
              src={CALLOUT_IMG}
              alt="American home"
              fill
              className="object-cover object-center"
              sizes="240px"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
