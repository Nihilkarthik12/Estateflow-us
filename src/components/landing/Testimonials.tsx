"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;
const TESTIMONIALS_IMG = "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1600&q=80";

const testimonials = [
  {
    metric: "90 sec",
    headline: "Our response time went from 3 hours to 90 seconds.",
    body: "Before EstateFlow, weekend leads sat until Monday and half of them had already signed with someone else. Now the AI answers instantly, books the showing, and my agents walk in with a full buyer profile. We stopped losing deals we never knew we were losing.",
    author: "Broker-Owner",
    team: "12-agent team, Brooklyn",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    metric: "0 missed",
    headline: "The midnight leads close just like the 2pm ones.",
    body: "Buyers browse Zillow at 11pm — that's just reality. EstateFlow's voice agent and chat handle every after-hours inquiry, qualify them, and queue the follow-ups. Monday morning my pipeline is already sorted by who's serious. It's like having a night shift that never bills overtime.",
    author: "Team Lead",
    team: "Manhattan residential",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    metric: "5×",
    headline: "The follow-up automation pays for itself.",
    body: "Every agent knows deals close on the fifth follow-up. Nobody actually does five follow-ups — until it's automated. The sequences run over text and email, sound human, and re-engage leads I'd written off months ago. Two closings last quarter came straight from the re-engagement flow.",
    author: "Managing Agent",
    team: "Queens & Long Island",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 px-5 sm:px-8 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-3"
          >
            What agents say
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
            >
              Don&apos;t take our word for it
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-[15px] text-slate-500"
          >
            Brokers and team leads on what actually changed after switching.
          </motion.p>
        </div>

        {/* Photo strip with social proof numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="relative h-44 sm:h-56 rounded-2xl overflow-hidden mb-10"
        >
          <Image
            src={TESTIMONIALS_IMG}
            alt="Beautiful American home"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/30" />
          <div className="absolute inset-0 flex items-center px-8 sm:px-12">
            <div className="flex gap-10 sm:gap-16">
              {[
                { stat: "200+", label: "agents across 14 states" },
                { stat: "23×", label: "avg leads recovered/month" },
                { stat: "4.9★", label: "average rating" },
              ].map((s) => (
                <div key={s.stat}>
                  <p className="text-3xl sm:text-4xl font-extrabold text-white leading-none">{s.stat}</p>
                  <p className="mt-1.5 text-[12px] text-white/60 max-w-[100px] leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease }}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="rounded-2xl border border-slate-200 bg-white p-7 flex flex-col gap-5 hover:shadow-[0_14px_48px_rgba(15,23,38,0.09)] hover:border-blue-200 transition-shadow transition-colors duration-300"
            >
              <p className="text-3xl font-bold tracking-tight text-blue-600">{t.metric}</p>

              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-slate-900 mb-3 leading-snug">
                  &ldquo;{t.headline}&rdquo;
                </h3>
                <p className="text-[13.5px] text-slate-500 leading-relaxed">{t.body}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.author}
                    fill
                    className="object-cover object-center"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-900">{t.author}</p>
                  <p className="text-[11px] text-slate-400">{t.team}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div>
            <p className="text-[15px] font-bold text-slate-900">
              See what EstateFlow can do for your brokerage
            </p>
            <p className="text-[13px] text-slate-500 mt-1">
              Book a live demo — we&apos;ll walk you through the full platform on your own listings.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-[13.5px] font-semibold hover:bg-blue-700 transition-colors"
          >
            Get a Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
