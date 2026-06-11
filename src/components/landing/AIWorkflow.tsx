"use client";

import { motion } from "framer-motion";
import { MessageSquare, Brain, Database, Bell, Rocket, LucideIcon } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

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
    description: "A buyer texts your number, calls your office, or fills a form. Every channel lands in one place.",
    time: "0s",
    visual: (
      <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[13px] text-slate-600">
        💬 &quot;Looking for a 3-bed in Austin under $650K near downtown, need to close within 3 months&quot;
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
        {["$650K", "3 Bed", "Austin, TX", "Near downtown", "High urgency", "Serious buyer"].map((tag) => (
          <span key={tag} className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            {tag}
          </span>
        ))}
      </div>
    ),
  },
  {
    icon: Rocket,
    title: "Best properties matched",
    description: "The system instantly ranks your listings by fit — your agent gets the top options ready to share.",
    time: "1.8s",
    visual: (
      <div className="space-y-1.5">
        {[{ n: "2412 Oak Ridge Dr", p: "$639K", m: "98%" }, { n: "188 Lakeview Terrace", p: "$648K", m: "94%" }].map((p) => (
          <div key={p.n} className="flex items-center justify-between text-[12px] px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-600 font-medium">{p.n} · {p.p}</span>
            <span className="font-bold text-emerald-600">{p.m} match</span>
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
      <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[13px] font-semibold text-emerald-700">Lead created · Score 88 · Assigned to Sarah</span>
      </div>
    ),
  },
  {
    icon: Bell,
    title: "Agent gets the full picture",
    description: "Your agent receives an instant alert with everything they need — buyer profile, matched listings, recommended next step.",
    time: "2.4s",
    visual: (
      <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[12.5px] text-slate-600 leading-relaxed">
        🔴 <strong className="text-slate-900">High intent lead — Michael Carter</strong><br />
        Call within 15 min · 3 properties ready to share
      </div>
    ),
  },
];

export default function AIWorkflow() {
  return (
    <section id="workflow" className="py-20 sm:py-28 px-5 sm:px-8 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Sticky intro */}
          <div className="lg:sticky lg:top-28">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-3"
            >
              How it works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
            >
              From first message to follow-up — in under 3 seconds
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-4 text-[15px] text-slate-500 leading-relaxed"
            >
              Your competitors take hours to respond. With EstateFlow, your agent has
              everything they need before they even know the lead arrived.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 inline-block"
            >
              <p className="text-5xl font-bold tracking-tight text-blue-600">2.4s</p>
              <p className="text-[13px] text-slate-500 mt-2 max-w-[220px] leading-relaxed">
                Average time from lead arrival to agent-ready profile
              </p>
            </motion.div>
          </div>

          {/* Timeline */}
          <div>
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45, ease }}
                className="relative flex gap-4 pb-9 last:pb-0"
              >
                {i < steps.length - 1 && (
                  <div className="absolute left-[22px] top-12 w-px bottom-0 bg-gradient-to-b from-blue-200 to-transparent" aria-hidden />
                )}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 z-10 bg-blue-50 border border-blue-100">
                  <step.icon size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-[10.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-blue-600 border border-slate-200">
                      t={step.time}
                    </span>
                    <h3 className="text-[14.5px] font-bold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="text-[13.5px] text-slate-500 leading-relaxed mb-3">{step.description}</p>
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
