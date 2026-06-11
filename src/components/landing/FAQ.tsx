"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What is EstateFlow AI?",
    a: "EstateFlow is an AI-first real estate platform for US brokerages, teams and individual agents. It automates lead capture, qualification, property matching and follow-ups — and runs your full pipeline from one dashboard.",
  },
  {
    q: "How does the AI lead analysis work?",
    a: "Leads from your website, Zillow, Realtor.com, texts and calls are parsed by AI to extract budget, location, property type, urgency and intent. The platform scores each lead 0–100 and tells your agent exactly who to call first.",
  },
  {
    q: "What automations are included?",
    a: "Instant lead capture and auto-reply, AI follow-up sequences over text and email, showing confirmations and reminders, missed-call text-back, cold-lead re-engagement, post-sale referral and review requests, and lease renewal alerts — all running hands-free.",
  },
  {
    q: "Does it capture leads from Zillow and Realtor.com?",
    a: "Yes. Portal inquiries, texts, and calls are processed exactly like website leads — full AI analysis, scoring, and CRM sync. No copy-pasting from emails ever again.",
  },
  {
    q: "What is the Voice AI agent?",
    a: "A real-time phone assistant that answers calls to your office number or website 24/7. It answers questions, qualifies the buyer, captures their requirements and books showings — even at 2am on a Sunday.",
  },
  {
    q: "Can multiple agents use it?",
    a: "Yes. Add your full team, assign leads to specific agents, and track performance across the whole pipeline with centralized reporting.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Bank-grade encryption in transit and at rest, with row-level security on every record. Your data is never shared with third parties.",
  },
  {
    q: "How long does setup take?",
    a: "Under 10 minutes. Sign up, add your brokerage details, and your AI chatbot, voice agent and lead capture are live immediately. No technical setup needed.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="border-b border-slate-200"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span className={`text-[14px] font-semibold leading-relaxed transition-colors ${open ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"}`}>
          {q}
        </span>
        <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${open ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-100 border-slate-200 text-slate-400"}`}>
          {open ? <Minus size={13} /> : <Plus size={13} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[13.5px] leading-relaxed text-slate-500">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const half = Math.ceil(faqs.length / 2);

  return (
    <section id="faq" className="py-20 sm:py-28 px-5 sm:px-8 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-3"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
          >
            Everything you need to know
          </motion.h2>
          <p className="mt-4 text-[14px] text-slate-500">
            Still have questions?{" "}
            <a href="mailto:nihilkaarthikeyan@gmail.com" className="text-blue-600 hover:underline font-medium">
              Email us →
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12">
          <div className="border-t border-slate-200">
            {faqs.slice(0, half).map((f, i) => (
              <FAQItem key={f.q} {...f} index={i} />
            ))}
          </div>
          <div className="border-t border-slate-200">
            {faqs.slice(half).map((f, i) => (
              <FAQItem key={f.q} {...f} index={i + half} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
