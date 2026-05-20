"use client";

import { motion } from "framer-motion";
import { Brain, Building2, Users, BarChart3, Zap, Bell, LucideIcon } from "lucide-react";
import SectionHeader from "./SectionHeader";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Brain,
    title: "AI Lead Qualification",
    description: "Automatically score every WhatsApp and web lead by intent, budget, timeline and urgency.",
  },
  {
    icon: Building2,
    title: "Property Inventory",
    description: "Manage listings with images, amenities, pricing and match score in one searchable portfolio.",
  },
  {
    icon: Users,
    title: "Sales Pipeline",
    description: "Move leads from enquiry to offer with a visual Kanban custom-built for real estate.",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate follow-ups, reminders, agent alerts and lead routing with n8n workflows.",
  },
  {
    icon: BarChart3,
    title: "Agency Insights",
    description: "Track conversion, city performance and agent productivity in real time.",
  },
  {
    icon: Bell,
    title: "Lead Alerts",
    description: "Get instant alerts for new leads, hot prospects and stalled deals with recommended actions.",
  },
];

export default function Features() {
  return (
    <section id="features" className="landing-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Capabilities"
          title="Everything your agency needs, from first contact to closing"
          description="Centralize leads, properties, agents and AI workflows in a platform built for high-volume real estate operations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="feature-card p-7"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-[var(--accent-muted)] border border-[var(--border-accent)]">
                <f.icon size={20} className="text-[var(--accent-light)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
                {f.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
