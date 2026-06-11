"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { value: "< 2s",  label: "Lead scored by AI",       sub: "Industry avg: 3–6 hrs" },
  { value: "24/7",  label: "Zero missed inquiries",    sub: "Nights, weekends, holidays" },
  { value: "9+",    label: "Automations running",      sub: "Fully hands-free" },
  { value: "5×",    label: "Follow-up touchpoints",    sub: "80% of deals close after 5+" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function StatsBar() {
  return (
    <section className="bg-[#0f172a] py-20 sm:py-28 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-[13px] font-semibold text-blue-400 uppercase tracking-wider mb-10"
        >
          What changes on day one
        </motion.p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
            >
              <p className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-none">
                {s.value}
              </p>
              <p className="mt-3 text-[14px] font-semibold text-slate-200 leading-snug">{s.label}</p>
              <p className="mt-1 text-[12px] text-slate-500">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <p className="text-[15px] text-slate-400 max-w-lg leading-relaxed">
            The platform that works while you sleep —{" "}
            <span className="text-white font-semibold">and closes while you talk.</span>
          </p>
          <Link
            href="#contact"
            className="shrink-0 inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white text-[14px] font-semibold hover:bg-blue-500 transition-colors"
          >
            See it in action →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
