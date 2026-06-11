"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Inbox, Brain, Send, Home, PhoneCall, KanbanSquare, LucideIcon,
} from "lucide-react";

const FEATURES_IMG = "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1920&q=80";

const ease = [0.22, 1, 0.36, 1] as const;

const features: { icon: LucideIcon; title: string; body: string; stat: string; statLabel: string }[] = [
  {
    icon: Inbox,
    title: "Instant Lead Capture",
    body: "Every buyer who texts, calls, or inquires on Zillow, Realtor.com, or your site is captured, replied to instantly, and logged in your CRM — even at midnight. You wake up to warm, qualified leads.",
    stat: "< 2s",
    statLabel: "AI reply time",
  },
  {
    icon: Brain,
    title: "AI Lead Scoring",
    body: "Budget, location, property type, urgency, and buyer intent — extracted automatically from every message and scored 0–100, so your agents always know exactly who to call first.",
    stat: "0–100",
    statLabel: "intent score on every lead",
  },
  {
    icon: Send,
    title: "Automated Follow-Ups",
    body: "80% of deals close after 5+ follow-ups — yet most agents stop at one. EstateFlow sends perfectly-timed follow-ups by text and email so no lead goes cold while you're at a showing.",
    stat: "5×",
    statLabel: "touchpoints per lead",
  },
  {
    icon: Home,
    title: "Smart Property Matching",
    body: "The moment a lead is analyzed, the system ranks your listings by fit and hands your agent the top three options — ready to send in one tap.",
    stat: "Top 3",
    statLabel: "listings surfaced per lead",
  },
  {
    icon: PhoneCall,
    title: "24/7 Voice AI Agent",
    body: "An AI voice agent answers every call to your office number, qualifies the buyer, captures requirements, and books showings — while you're in a meeting or asleep.",
    stat: "24/7",
    statLabel: "always answering",
  },
  {
    icon: KanbanSquare,
    title: "Full Pipeline Visibility",
    body: "Every lead staged across your funnel — new, contacted, qualified, showing, under contract, closed. Know where deals stall and which agents need support.",
    stat: "6",
    statLabel: "pipeline stages tracked",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-20 sm:py-28 px-5 sm:px-8">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Image src={FEATURES_IMG} alt="" fill className="object-cover object-center opacity-[0.30]" sizes="100vw" />
      </div>
      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-3"
          >
            The platform
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
            >
              Everything your team needs to close more deals
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-[15px] text-slate-500"
          >
            Not just a CRM — a full AI engine built for how US real estate teams actually work.
          </motion.p>
        </div>

        {/* Banner image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-12"
        >
          <Image
            src={FEATURES_IMG}
            alt="Modern American real estate"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.5, ease }}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="group rounded-2xl border border-slate-200 bg-white p-7 hover:shadow-[0_14px_48px_rgba(15,23,38,0.09)] hover:border-blue-200 transition-shadow transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <f.icon size={19} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900 tracking-tight leading-none">{f.stat}</p>
                  <p className="text-[10.5px] text-slate-400 mt-1">{f.statLabel}</p>
                </div>
              </div>
              <h3 className="text-[16px] font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-[13.5px] text-slate-500 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
