"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const PAIN_IMG = "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80";
const PAIN_BG = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=60";

const ease = [0.22, 1, 0.36, 1] as const;

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1400;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{n}{suffix}</span>;
}

const pains = [
  {
    target: 78, suffix: "%",
    statLabel: "of leads sign with the first agent who responds",
    title: "You respond in 3 hours. They signed elsewhere in 2.",
    body: "A buyer texted at 11pm asking about a 3-bed listing. Your agent saw it at 9am. The lead had already signed with the competitor who replied at 11:04pm — with an AI.",
  },
  {
    target: 750, suffix: "+",
    statLabel: "hours per year lost to manual data entry, per agent",
    title: "3 hours a day copying texts into spreadsheets.",
    body: "Name, phone, budget, location — typed into a spreadsheet, then your CRM, then a follow-up message. Every single lead. That's 750+ hours a year. Wasted.",
  },
  {
    target: 80, suffix: "%",
    statLabel: "of deals close after 5+ follow-ups",
    title: "You follow up once. The deal closes on the 5th.",
    body: "Research shows 80% of real estate deals close after five or more follow-ups. Most agents stop after the first. Leads go cold. Revenue disappears.",
  },
];

export default function Pain() {
  return (
    <section className="relative py-20 sm:py-28 px-5 sm:px-8 bg-white border-y border-slate-100 overflow-hidden">
      {/* Faint property photo behind the whole section */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Image src={PAIN_BG} alt="" fill className="object-cover object-center opacity-[0.05]" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white" />
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
            The real problem
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
            >
              Your brokerage is silently losing{" "}
              <span className="text-red-500">$50K+ every month</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-[15px] text-slate-500"
          >
            Not because the leads are bad. Because the process is broken.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pains.map((p, i) => (
            <motion.div
              key={p.statLabel}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease }}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-7 hover:shadow-[0_14px_48px_rgba(15,23,38,0.09)] hover:bg-white hover:border-slate-300 transition-shadow transition-colors duration-300"
            >
              <p className="text-4xl font-bold tracking-tight text-red-500">
                <CountUp target={p.target} suffix={p.suffix} />
              </p>
              <p className="mt-1.5 text-[12px] text-slate-400 font-medium">{p.statLabel}</p>
              <h3 className="mt-5 text-[15px] font-bold text-slate-900 leading-snug">{p.title}</h3>
              <p className="mt-2.5 text-[13.5px] text-slate-500 leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Photo banner with bridge text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          className="mt-8 relative rounded-2xl overflow-hidden min-h-[180px] flex items-center"
        >
          <Image
            src={PAIN_IMG}
            alt="American home for sale"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/55 to-transparent" />
          <div className="relative px-8 sm:px-12 py-8">
            <p className="text-[18px] sm:text-[22px] font-bold text-white leading-snug max-w-md">
              EstateFlow fixes all three —{" "}
              <span className="text-blue-300">automatically.</span>
            </p>
            <p className="mt-2 text-[13.5px] text-slate-200 max-w-sm">
              Same leads, same market — a process that actually closes them.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
