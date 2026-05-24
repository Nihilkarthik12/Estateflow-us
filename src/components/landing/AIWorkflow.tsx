"use client";

import { motion } from "framer-motion";
import { MessageSquare, Brain, Database, Bell, Rocket, LucideIcon } from "lucide-react";
import SectionHeader from "./SectionHeader";

const steps: {
  icon: LucideIcon;
  title: string;
  description: string;
  visual: React.ReactNode;
  time: string;
}[] = [
  {
    icon: MessageSquare,
    title: "Lead walks in",
    description: "A buyer messages your website, calls your agent, or fills a form. All channels land in one place.",
    time: "0s",
    visual: (
      <div className="px-3 py-2 rounded-xl bg-[var(--surface-3)] border border-white/[0.06] text-xs text-[var(--foreground-muted)]">
        💬 &quot;Looking for 3BHK in Chennai under ₹90L near metro, need it within 3 months&quot;
      </div>
    ),
  },
  {
    icon: Brain,
    title: "AI reads between the lines",
    description: "Budget, location, property type, urgency and buyer intent are extracted automatically — no manual data entry.",
    time: "1.2s",
    visual: (
      <div className="flex flex-wrap gap-1.5">
        {["₹90L", "3BHK", "Chennai", "Near metro", "High urgency", "Serious buyer"].map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--accent-muted)] text-[var(--accent-light)] border border-[var(--border-accent)]">
            {tag}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: Rocket,
    title: "Best properties matched",
    description: "The system instantly ranks your listings by fit — your agent gets the top 3 options ready to share.",
    time: "1.8s",
    visual: (
      <div className="space-y-1.5">
        {[{ n: "Prestige Eden Garden", p: "₹87L", m: "98%" }, { n: "Brigade Utopia", p: "₹91L", m: "94%" }].map((p) => (
          <div key={p.n} className="flex items-center justify-between text-[10px] px-2.5 py-1.5 rounded-lg bg-[var(--surface-3)] border border-white/[0.05]">
            <span className="text-[var(--foreground-muted)]">{p.n} · {p.p}</span>
            <span className="font-bold text-[var(--success)]">{p.m} match</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Database,
    title: "Saved & scored in your CRM",
    description: "A complete lead profile is created — score, tags, conversation history, and assigned agent.",
    time: "2.1s",
    visual: (
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--success-muted)] border border-[rgba(16,185,129,0.2)]">
        <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
        <span className="text-xs font-medium text-[var(--success)]">Lead created · Score 88 · Assigned to Ravi</span>
      </div>
    ),
  },
  {
    icon: Bell,
    title: "Agent gets the full picture",
    description: "Your agent receives an instant alert with everything they need — buyer profile, matched listings, recommended next step.",
    time: "2.4s",
    visual: (
      <div className="px-3 py-2 rounded-xl bg-[var(--surface-3)] border border-white/[0.06] text-[11px] text-[var(--foreground-muted)] leading-relaxed">
        🔴 <strong className="text-[var(--foreground)]">High intent lead — Arjun Mehta</strong><br />
        Call within 15 min · 3 properties ready to share
      </div>
    ),
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
              title="From first message to follow-up — in under 3 seconds"
              description="Your competitors take hours to respond. With EstateFlow, your agent has everything they need before they even know the lead arrived."
            />
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-[var(--success-muted)] text-[var(--success)] border border-[rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
              Fully automated · Zero manual input needed
            </div>

            {/* Time badge */}
            <div className="mt-8 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <p className="text-3xl font-bold text-[var(--foreground)]">2.4s</p>
              <p className="text-sm text-[var(--foreground-muted)] mt-1">Average time from lead to agent-ready profile</p>
            </div>
          </div>

          <div className="space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                {i < steps.length - 1 && (
                  <div className="absolute left-[23px] top-12 w-px bottom-0 bg-gradient-to-b from-[var(--accent)]/40 to-transparent" aria-hidden />
                )}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 bg-[var(--accent-muted)] border border-[var(--border-accent)]">
                  <step.icon size={19} className="text-[var(--accent-light)]" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[var(--surface-3)] text-[var(--accent-light)] border border-[var(--border)]">
                      t={step.time}
                    </span>
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">{step.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--foreground-muted)] leading-relaxed mb-3">{step.description}</p>
                  {step.visual}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
