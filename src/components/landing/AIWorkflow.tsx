"use client";

import { motion } from "framer-motion";
import { MessageSquare, Webhook, Brain, Database, Bell, LucideIcon } from "lucide-react";
import SectionHeader from "./SectionHeader";

const steps: {
  icon: LucideIcon;
  title: string;
  description: string;
  detail: string;
  time: string;
}[] = [
  {
    icon: MessageSquare,
    title: "Lead capture",
    description: "WhatsApp inquiries and website leads land in one unified intake flow.",
    detail: '"3BHK in Chennai under ₹90L near metro"',
    time: "0s",
  },
  {
    icon: Webhook,
    title: "AI extraction",
    description: "Intent, budget, location and urgency are extracted automatically for every lead.",
    detail: "Intent: high · Stage: interested",
    time: "1.2s",
  },
  {
    icon: Brain,
    title: "Smart matching",
    description: "Leads are matched to listings, agents and follow-up workflows in real time.",
    detail: "4 matching properties found",
    time: "1.8s",
  },
  {
    icon: Database,
    title: "CRM sync",
    description: "Structured lead profiles are stored with lead score, notes and property context.",
    detail: "Lead created · assigned to senior agent",
    time: "2.2s",
  },
  {
    icon: Bell,
    title: "Agent action",
    description: "Your team receives instant alerts with recommended next steps for hot leads.",
    detail: "Respond within 30 minutes",
    time: "2.4s",
  },
];

export default function AIWorkflow() {
  return (
    <section id="workflow" className="landing-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              label="How it works"
              title="From WhatsApp message to sales-ready lead in under 3 seconds"
              description="Every enquiry is classified, scored and routed so your agents can engage faster and close more deals."
            />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[var(--success-muted)] text-[var(--success)] border border-[rgba(16,185,129,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
              Buyer intent scoring and recommendations delivered instantly
            </div>
          </div>

          <div className="space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                {i < steps.length - 1 && (
                  <div
                    className="absolute left-[23px] top-11 w-px bottom-0 bg-gradient-to-b from-[var(--accent)]/40 to-transparent"
                    aria-hidden
                  />
                )}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 bg-[var(--accent-muted)] border border-[var(--border-accent)]">
                  <step.icon size={20} className="text-[var(--accent-light)]" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[var(--surface-3)] text-[var(--accent-light)] border border-[var(--border)]">
                      {step.time}
                    </span>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <code className="block text-xs font-mono px-3 py-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground-muted)] truncate">
                    {step.detail}
                  </code>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
