"use client";

import { motion } from "framer-motion";
import { Brain, Phone, BarChart3, Bell, Building2, Zap } from "lucide-react";
import SectionHeader from "./SectionHeader";

const leads = [
  { name: "Priya Nair", score: 94, urgency: "high", tag: "3BHK · ₹1.2Cr" },
  { name: "Rohit Verma", score: 78, urgency: "medium", tag: "2BHK · ₹65L" },
  { name: "Sneha Iyer", score: 61, urgency: "low", tag: "Plot · ₹40L" },
];

const urgencyColor: Record<string, string> = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-[var(--foreground-subtle)] bg-white/[0.04] border-white/[0.08]",
};

const kanban = [
  { label: "New", count: 11, color: "var(--accent)" },
  { label: "Contacted", count: 6, color: "#818cf8" },
  { label: "Qualified", count: 4, color: "#a78bfa" },
  { label: "Closed", count: 3, color: "var(--success)" },
];

const barData = [40, 65, 52, 78, 90, 70, 88];
const barLabels = ["M", "T", "W", "T", "F", "S", "S"];

export default function Features() {
  return (
    <section id="features" className="landing-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          label="Capabilities"
          title="Every tool your agency needs to win more deals"
          description="Not just a CRM — a full AI engine built specifically for how Indian real estate teams work."
        />

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">

          {/* Card 1 — AI Lead Scoring (wide) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 overflow-hidden relative card-glow"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(ellipse,rgba(91,110,245,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--accent-muted)] border border-[var(--border-accent)]">
                <Brain size={18} className="text-[var(--accent-light)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)]">AI Lead Qualification</h3>
                <p className="text-xs text-[var(--foreground-muted)]">Every lead scored instantly — budget, intent, urgency.</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {leads.map((lead) => (
                <div key={lead.name} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-2)] border border-white/[0.06]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--cyan)] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {lead.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[var(--foreground)] truncate">{lead.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border ${urgencyColor[lead.urgency]}`}>
                        {lead.urgency}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-[var(--surface-3)] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--cyan)]"
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[var(--foreground)] tabular-nums shrink-0">{lead.score}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--foreground-subtle)] shrink-0">{lead.tag}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 2 — Voice AI Agent */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-500/[0.06] to-transparent pointer-events-none" />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <Phone size={18} className="text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Voice AI Agent</h3>
            <p className="text-xs text-[var(--foreground-muted)] mb-5">Answers calls 24/7, qualifies leads and captures details automatically.</p>

            {/* Call UI preview */}
            <div className="rounded-xl bg-[var(--surface-2)] border border-white/[0.06] p-3 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm">🏠</div>
                <div>
                  <p className="text-xs font-semibold text-[var(--foreground)]">EstateFlow AI</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400">Speaking…</span>
                  </div>
                </div>
                <span className="ml-auto font-mono text-[10px] text-[var(--foreground-subtle)]">01:24</span>
              </div>
              <div className="flex gap-1 items-end h-5">
                {[3, 6, 9, 5, 8, 4, 7, 6, 3, 5, 8, 4].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-emerald-400/60"
                    style={{ height: `${h * 8}%`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3 — Kanban Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-500/10 border border-violet-500/20 mb-4">
              <Zap size={18} className="text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Visual Sales Pipeline</h3>
            <p className="text-xs text-[var(--foreground-muted)] mb-5">Drag leads through stages. See your pipeline at a glance.</p>
            <div className="grid grid-cols-4 gap-2">
              {kanban.map((col) => (
                <div key={col.label} className="text-center">
                  <div
                    className="w-full rounded-xl py-3 mb-1.5 flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: `${col.color}18`, color: col.color }}
                  >
                    {col.count}
                  </div>
                  <p className="text-[9px] text-[var(--foreground-subtle)] leading-tight">{col.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 4 — Instant Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/10 border border-orange-500/20 mb-4">
              <Bell size={18} className="text-orange-400" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Instant Lead Alerts</h3>
            <p className="text-xs text-[var(--foreground-muted)] mb-4">Your agent gets notified the second a hot lead lands.</p>
            <div className="space-y-2">
              {[
                { msg: "🔴 HIGH — Arjun Mehta wants 3BHK, ₹90L, needs response in 15 min", time: "now" },
                { msg: "New lead from website — Priya Nair, budget ₹1.2Cr, South Chennai", time: "3m" },
              ].map((n, i) => (
                <div key={i} className="flex gap-2 p-2.5 rounded-xl bg-[var(--surface-2)] border border-white/[0.06]">
                  <p className="text-[10px] text-[var(--foreground-muted)] flex-1 leading-relaxed">{n.msg}</p>
                  <span className="text-[9px] text-[var(--foreground-subtle)] shrink-0">{n.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 5 — Property Matching */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--accent-muted)] border border-[var(--border-accent)] mb-4">
              <Building2 size={18} className="text-[var(--accent-light)]" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">Smart Property Match</h3>
            <p className="text-xs text-[var(--foreground-muted)] mb-4">AI matches every lead to your best listings instantly.</p>
            <div className="space-y-2">
              {[
                { name: "Prestige Eden Garden", pct: 98 },
                { name: "Brigade Utopia", pct: 91 },
                { name: "Sobha City Tower", pct: 84 },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <p className="text-[10px] text-[var(--foreground-muted)] w-32 truncate shrink-0">{p.name}</p>
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--cyan)]" style={{ width: `${p.pct}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-[var(--foreground)] tabular-nums">{p.pct}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 6 — Analytics (wide) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.14, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-64 h-40 bg-[radial-gradient(ellipse,rgba(34,211,238,0.06)_0%,transparent_70%)] pointer-events-none" />
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--cyan-muted)] border border-[rgba(34,211,238,0.2)]">
                  <BarChart3 size={18} className="text-[var(--cyan)]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">Agency Analytics</h3>
                  <p className="text-xs text-[var(--foreground-muted)]">Leads closed this week — real-time.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[var(--foreground)]">₹2.4Cr</p>
                <p className="text-[10px] text-[var(--success)]">↑ 23% vs last week</p>
              </div>
            </div>
            {/* Mini bar chart */}
            <div className="flex items-end gap-1.5 h-16">
              {barData.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md"
                    style={{
                      height: `${h}%`,
                      background: i === 4 ? "linear-gradient(to top, var(--accent), var(--cyan))" : "var(--surface-3)",
                    }}
                  />
                  <span className="text-[8px] text-[var(--foreground-subtle)]">{barLabels[i]}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
