"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, Check } from "lucide-react";

const COMPARE_IMG = "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=900&q=80";

const rows = [
  { label: "Lead response time",    before: "2–3 hours (if lucky)",        after: "Under 90 seconds, automated" },
  { label: "Data entry",            before: "Manual, full of errors",       after: "AI extracts everything instantly" },
  { label: "Follow-ups",            before: "Forgotten 60% of the time",    after: "Never missed — fully automated" },
  { label: "After-hours inquiries", before: "Missed completely",            after: "AI handles 24/7, qualifies live" },
  { label: "Property matching",     before: "Manual search, takes hours",   after: "AI-matched in under 2 seconds" },
  { label: "Lead scoring",          before: "Gut feeling only",             after: "AI score 0–100, with reasoning" },
  { label: "Agent workload",        before: "Drowning in texts & emails",   after: "Focus only on hot, ready leads" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Comparison() {
  return (
    <section className="py-20 sm:py-28 px-5 sm:px-8 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center mb-14">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-3"
            >
              The difference
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
            >
              Your competitors are still using{" "}
              <span className="line-through text-slate-400">spreadsheets & sticky notes</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="relative h-40 rounded-2xl overflow-hidden hidden lg:block"
          >
            <Image
              src={COMPARE_IMG}
              alt="Modern American home"
              fill
              className="object-cover object-center"
              sizes="320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
          </motion.div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-3 md:hidden">
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <p className="text-[12px] font-bold text-slate-700 uppercase tracking-wide">{row.label}</p>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-3 border-r border-slate-100 flex items-start gap-2">
                  <X size={12} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-slate-500 leading-relaxed">{row.before}</p>
                </div>
                <div className="px-4 py-3 bg-emerald-50/50 flex items-start gap-2">
                  <Check size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                  <p className="text-[12px] text-slate-700 font-medium leading-relaxed">{row.after}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="hidden md:block rounded-2xl border border-slate-200 overflow-hidden"
        >
          {/* Table header */}
          <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-slate-50">
            <div className="px-6 py-4 border-b border-r border-slate-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Situation</p>
            </div>
            <div className="px-6 py-4 border-b border-r border-slate-200 flex items-center gap-2">
              <X size={13} className="text-red-500" />
              <p className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Without EstateFlow</p>
            </div>
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2 bg-emerald-50/50">
              <Check size={13} className="text-emerald-600" />
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">With EstateFlow</p>
            </div>
          </div>

          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="grid grid-cols-[1.2fr_1fr_1fr] hover:bg-slate-50/60 transition-colors"
            >
              <div className="px-6 py-4 border-b border-r border-slate-100 flex items-center">
                <span className="text-[14px] font-semibold text-slate-800">{row.label}</span>
              </div>
              <div className="px-6 py-4 border-b border-r border-slate-100 flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mt-0.5 shrink-0">
                  <X size={9} className="text-red-500" />
                </div>
                <span className="text-[13.5px] text-slate-500">{row.before}</span>
              </div>
              <div className="px-6 py-4 border-b border-slate-100 flex items-start gap-2.5 bg-emerald-50/30">
                <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mt-0.5 shrink-0">
                  <Check size={9} className="text-emerald-600" />
                </div>
                <span className="text-[13.5px] text-slate-800 font-medium">{row.after}</span>
              </div>
            </motion.div>
          ))}

          <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-slate-50">
            <div className="px-6 py-4 border-r border-slate-200" />
            <div className="px-6 py-4 border-r border-slate-200">
              <span className="text-[13.5px] text-red-500 font-semibold">Deals slipping away daily</span>
            </div>
            <div className="px-6 py-4 bg-emerald-50/50">
              <span className="text-[13.5px] text-emerald-700 font-semibold">More closed deals, less effort</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
