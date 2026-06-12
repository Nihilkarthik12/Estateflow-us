"use client";

import { motion } from "framer-motion";
import { Zap, Clock, Bot, RefreshCw, CalendarCheck, BarChart2, MessageSquare, PhoneCall } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const capabilities = [
  {
    icon: Zap,
    metric: "< 2 sec",
    title: "Every lead scored instantly",
    body: "When a Zillow inquiry, text, or missed call comes in, EstateFlow's AI reads it, scores buyer intent, extracts budget and location, and queues your agent with a full profile — before anyone picks up the phone.",
  },
  {
    icon: Clock,
    metric: "24 / 7",
    title: "No lead slips through after hours",
    body: "Buyers browse listings at midnight. EstateFlow's chat and voice agents handle every after-hours inquiry, respond instantly, and deliver a sorted, qualified pipeline to your agents every morning.",
  },
  {
    icon: RefreshCw,
    metric: "8 flows",
    title: "Automations running hands-free",
    body: "Follow-up sequences, rent reminders, visit confirmations, lease renewal alerts, and cold-lead re-engagement — all running automatically so your team focuses on closing, not chasing.",
  },
];

const realFeatures = [
  { icon: Bot,           label: "AI lead scoring",          desc: "Budget, location & intent extracted automatically" },
  { icon: MessageSquare, label: "Text & chat follow-up",    desc: "Automated sequences over SMS and web chat" },
  { icon: PhoneCall,     label: "Voice AI agent",           desc: "Answers calls and qualifies leads via Vapi" },
  { icon: CalendarCheck, label: "Visit confirmation",       desc: "Sends reminders 24 hrs before every showing" },
  { icon: RefreshCw,     label: "Cold-lead re-engagement",  desc: "Revives leads inactive 4+ days automatically" },
  { icon: BarChart2,     label: "Pipeline analytics",       desc: "Stage breakdown, source tracking, agent performance" },
];

export default function Testimonials() {
  return (
    <section id="results" className="py-20 sm:py-28 px-5 sm:px-8 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-3"
          >
            What changes from day one
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
            >
              Built to close more deals,<br />not add more work.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-[15px] text-slate-500"
          >
            Every feature ships ready to use — no setup calls, no spreadsheets to import.
          </motion.p>
        </div>

        {/* Capability cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="rounded-2xl border border-slate-200 bg-white p-7 flex flex-col gap-4 hover:shadow-[0_14px_48px_rgba(15,23,38,0.09)] hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <c.icon size={17} className="text-blue-600" />
                </div>
                <p className="text-2xl font-extrabold tracking-tight text-blue-600">{c.metric}</p>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-2 leading-snug">{c.title}</h3>
                <p className="text-[13.5px] text-slate-500 leading-relaxed">{c.body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Real feature grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          <p className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-6">
            Everything included
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {realFeatures.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <f.icon size={15} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-slate-900">{f.label}</p>
                  <p className="text-[12px] text-slate-400 mt-0.5 leading-snug">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div>
            <p className="text-[15px] font-bold text-slate-900">
              See EstateFlow running on your actual listings
            </p>
            <p className="text-[13px] text-slate-500 mt-1">
              Book a live demo — we&apos;ll walk through the full platform with your own data.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-[13.5px] font-semibold hover:bg-blue-700 transition-colors"
          >
            Get a Demo
          </a>
        </motion.div>

      </div>
    </section>
  );
}
