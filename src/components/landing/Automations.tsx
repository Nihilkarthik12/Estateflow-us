"use client";

import { motion } from "framer-motion";
import {
  MessageSquare, PhoneMissed, BellRing, CalendarCheck, CalendarClock,
  RefreshCcw, Star, FileText, Zap, LucideIcon,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const automations: { icon: LucideIcon; title: string; body: string; trigger: string }[] = [
  {
    icon: MessageSquare,
    title: "Instant Lead Capture & Reply",
    body: "Every text, call, web form and portal inquiry is captured, AI-analyzed, and answered in seconds — with a personal-sounding reply, not a canned autoresponder.",
    trigger: "Real-time",
  },
  {
    icon: Zap,
    title: "AI Follow-Up Sequences",
    body: "Five perfectly-timed follow-ups per lead over text and email, written by AI in your voice. 80% of deals close after the 5th touch — now none are skipped.",
    trigger: "Daily · 9 AM",
  },
  {
    icon: CalendarCheck,
    title: "Showing Confirmations",
    body: "The moment a buyer books a showing, they get an instant text confirmation with the time, address, and agent details. No-shows drop immediately.",
    trigger: "On booking",
  },
  {
    icon: CalendarClock,
    title: "Showing Reminders",
    body: "Every buyer with a showing tomorrow gets a friendly reminder text the morning before — and your agent gets the day's schedule in one ping.",
    trigger: "Daily · 8 AM",
  },
  {
    icon: PhoneMissed,
    title: "Missed-Call Text-Back",
    body: "Office missed a call? The caller instantly receives a text — 'Sorry we missed you, how can we help?' — and their reply lands in the CRM as a scored lead.",
    trigger: "Real-time",
  },
  {
    icon: BellRing,
    title: "Hot-Lead Agent Alerts",
    body: "When the AI scores a lead high-urgency, your agent's phone buzzes within seconds: who they are, their budget, and why they need a call right now.",
    trigger: "Real-time",
  },
  {
    icon: RefreshCcw,
    title: "Cold-Lead Re-Engagement",
    body: "Leads quiet for 60+ days get a thoughtful AI-written check-in. Deals you'd written off walk back in the door — on autopilot.",
    trigger: "Weekly · Mon",
  },
  {
    icon: Star,
    title: "Reviews & Referrals",
    body: "30 days after closing, happy clients get a referral request; 7 days after, a Google review link. Your reputation compounds without you lifting a finger.",
    trigger: "Post-closing",
  },
  {
    icon: FileText,
    title: "Lease Renewal Alerts",
    body: "Leases expiring in 90 days trigger a renewal conversation with the tenant and an in-app alert for your team — no renewal slips through again.",
    trigger: "Daily · 9 AM",
  },
];

export default function Automations() {
  return (
    <section id="automations" className="py-20 sm:py-28 px-5 sm:px-8 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-3"
          >
            The automation suite
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
          >
            Nine automations. Zero busywork.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-[15px] text-slate-500 leading-relaxed"
          >
            Everything below runs hands-free over text and email, around the clock —
            so your team spends their hours with clients, not keyboards.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {automations.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.06, duration: 0.5, ease }}
              className="group rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-[0_8px_30px_rgba(15,23,38,0.06)] hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <a.icon size={17} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wide">
                  {a.trigger}
                </span>
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-2 leading-snug">{a.title}</h3>
              <p className="text-[13.5px] text-slate-500 leading-relaxed">{a.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <p className="text-[14px] text-slate-700">
            <span className="font-bold text-slate-900">Every automation is included on every plan.</span>{" "}
            Configured for your brokerage during onboarding — live the same day.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Running 24/7</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
