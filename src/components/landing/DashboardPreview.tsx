"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  BarChart3,
  Bell,
  TrendingUp,
  Flame,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Leads" },
  { icon: Building2, label: "Properties" },
  { icon: Calendar, label: "Showings" },
  { icon: BarChart3, label: "Analytics" },
];

const stats = [
  { label: "New Leads", value: "47", trend: "+12%" },
  { label: "Hot Leads", value: "13", trend: "+5" },
  { label: "Showings Booked", value: "9", trend: "+3" },
  { label: "Pipeline", value: "$4.2M", trend: "+22%" },
];

const leads = [
  { name: "Michael Torres", area: "Austin, TX · 3BR", budget: "$640K", score: 94, tag: "Hot" },
  { name: "Jessica Chen", area: "Denver, CO · Condo", budget: "$420K", score: 81, tag: "Warm" },
  { name: "David Miller", area: "Miami, FL · Waterfront", budget: "$2.1M", score: 97, tag: "Pre-approved" },
  { name: "Ashley Rivera", area: "Phoenix, AZ · Townhome", budget: "$310K", score: 63, tag: "New" },
];

function scoreColor(score: number) {
  if (score >= 90) return "#ef4444"; // red-500 — hot
  if (score >= 75) return "#f59e0b"; // amber-500 — warm
  return "#64748b"; // slate-500 — new
}

export default function DashboardPreview() {
  return (
    <section id="product" className="relative py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-14 sm:mb-16 text-center max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-3"
          >
            Inside EstateFlow
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
          >
            One dashboard for your{" "}
            <span className="text-blue-600">entire pipeline</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-[15px] text-slate-500 max-w-md mx-auto leading-relaxed"
          >
            Every lead from Zillow, Realtor.com, and your website — scored, staged, and
            ready for your agents. This is what your team sees every morning.
          </motion.p>
        </div>

        {/* Dashboard mock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease }}
          className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden"
          style={{ boxShadow: "0 30px 80px -28px rgba(15,23,38,0.28)" }}
        >
          {/* Browser top bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100 bg-slate-50">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-4 text-[11px] text-slate-400 font-mono">
              app.estateflow.com/dashboard
            </span>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col gap-1 w-48 shrink-0 border-r border-slate-100 p-4 bg-slate-50/60">
              <div className="flex items-center gap-2 px-2 mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-600">
                  <Building2 size={14} className="text-white" />
                </div>
                <span className="text-sm font-bold text-slate-900">EstateFlow</span>
              </div>
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                    item.active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500"
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Main panel */}
            <div className="flex-1 p-5 sm:p-6 min-w-0">
              {/* Greeting row */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-sm font-bold text-slate-900">Good morning, Jordan 👋</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    You have 13 hot leads waiting
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell size={16} className="text-slate-400" />
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-[8px] font-bold text-white flex items-center justify-center">
                      5
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                    JM
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="rounded-xl border border-slate-200 bg-white p-3.5"
                  >
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.08em]">
                      {s.label}
                    </p>
                    <div className="flex items-end justify-between mt-1.5">
                      <p className="text-lg font-bold text-slate-900 leading-none">{s.value}</p>
                      <span className="flex items-center gap-0.5 text-[10px] text-emerald-600">
                        <TrendingUp size={10} />
                        {s.trend}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Leads table */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Recent Leads</p>
                  <span className="text-[10px] text-blue-600 font-medium">AI-scored · live</span>
                </div>
                {leads.map((lead, i) => (
                  <motion.div
                    key={lead.name}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      i < leads.length - 1 ? "border-b border-slate-100" : ""
                    }`}
                  >
                    {/* Score ring */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{
                        color: scoreColor(lead.score),
                        border: `2px solid ${scoreColor(lead.score)}`,
                      }}
                    >
                      {lead.score}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{lead.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{lead.area}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-slate-900">{lead.budget}</p>
                      <span
                        className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.06em] mt-0.5"
                        style={{ color: scoreColor(lead.score) }}
                      >
                        {lead.tag === "Hot" && <Flame size={9} />}
                        {lead.tag}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-slate-400 mt-6"
        >
          Live demo · Your brokerage&apos;s version is fully branded and customized
        </motion.p>
      </div>
    </section>
  );
}
