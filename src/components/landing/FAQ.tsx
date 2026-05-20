"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import SectionHeader from "./SectionHeader";

const faqs = [
  {
    q: "What is EstateFlow AI?",
    a: "EstateFlow is an AI-first real estate CRM for agencies, developers and brokerages. It automates lead capture, qualification, property matching and follow-ups from one dashboard.",
  },
  {
    q: "How does AI lead analysis work?",
    a: "WhatsApp and web leads are parsed by AI to extract budget, location, property type, urgency and intent. The platform then scores each lead and suggests the best next step.",
  },
  {
    q: "Can multiple agents and branches use it?",
    a: "Yes. You can add your team, define roles, assign agents and manage leads across offices with centralized reporting.",
  },
  {
    q: "Is my agency data secure?",
    a: "Yes. EstateFlow uses Supabase security best practices, row-level access controls and encrypted transport so each agency’s data remains isolated and protected.",
  },
  {
    q: "Does EstateFlow support WhatsApp leads?",
    a: "Yes. On Pro and Enterprise plans, WhatsApp enquiries are captured automatically and processed just like form leads.",
  },
  {
    q: "Can I try it before committing?",
    a: "Absolutely. Every plan includes a 14-day trial with full access and no credit card required."
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[var(--border)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span
          className={`text-sm font-medium transition-colors ${open ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}
        >
          {q}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
            open
              ? "bg-[var(--accent-muted)] border-[var(--border-accent)] text-[var(--accent-light)]"
              : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--foreground-subtle)]"
          }`}
        >
          {open ? <Minus size={14} /> : <Plus size={14} />}
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
            <p className="pb-5 text-sm leading-relaxed text-[var(--foreground-muted)]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="landing-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <SectionHeader
              label="FAQ"
              title="Your top questions answered"
              description="Everything you need to know about deployment, WhatsApp integration, data security and team onboarding."
            />
          </div>
          <div className="lg:col-span-3 border-t border-[var(--border)]">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
