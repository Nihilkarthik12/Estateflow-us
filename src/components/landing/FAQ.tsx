"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";

const FAQ_IMG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80";
const FAQ_BG = "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=1920&q=60";

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
    <section id="faq" className="relative py-20 sm:py-28 px-5 sm:px-8 border-y border-slate-100 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Image src={FAQ_BG} alt="" fill className="object-cover object-center opacity-[0.30]" sizes="100vw" />
      </div>
      <div className="relative max-w-7xl mx-auto">

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] gap-0 lg:gap-x-10 lg:gap-y-0">
          {/* Left accordion */}
          <div className="border-t border-slate-200">
            {faqs.slice(0, half).map((f, i) => (
              <FAQItem key={f.q} {...f} index={i} />
            ))}
          </div>
          {/* Right accordion */}
          <div className="border-t border-slate-200">
            {faqs.slice(half).map((f, i) => (
              <FAQItem key={f.q} {...f} index={i + half} />
            ))}
          </div>
          {/* Photo CTA card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col rounded-2xl overflow-hidden border border-slate-200 sticky top-28 self-start"
          >
            <div className="relative h-44">
              <Image
                src={FAQ_IMG}
                alt="Luxury American home"
                fill
                className="object-cover object-center"
                sizes="300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
            </div>
            <div className="bg-white p-5 flex flex-col gap-4">
              <p className="text-[15px] font-bold text-slate-900 leading-snug">Ready to stop losing leads?</p>
              <p className="text-[13px] text-slate-500 leading-relaxed">10-minute setup. No credit card. Cancel anytime.</p>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center gap-1 px-4 py-3 rounded-xl bg-blue-600 text-white text-[13.5px] font-semibold hover:bg-blue-500 transition-colors"
              >
                Get Started Free →
              </Link>
              <a
                href="https://wa.me/917598470890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25d366]/10 border border-[#25d366]/30 text-[#16a34a] text-[13px] font-semibold hover:bg-[#25d366]/20 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.528 5.854L0 24l6.305-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.682-.497-5.228-1.367l-.374-.22-3.742.894.948-3.657-.244-.389A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
