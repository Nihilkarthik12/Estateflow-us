"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Star, Zap } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

// Dramatic US luxury home at dusk — full-bleed hero background
const HERO_IMG = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Full-bleed property photo ── */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="Luxury American home"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark gradient so the headline reads clearly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(7,12,24,0.92)] via-[rgba(7,12,24,0.7)] to-[rgba(7,12,24,0.35)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,12,24,0.85)] via-transparent to-[rgba(7,12,24,0.4)]" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-16">
        <div className="max-w-2xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-medium text-white/90 tracking-wide">Built for US real estate teams</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight text-white leading-[1.02]"
          >
            Never lose another
            <br />
            <span className="text-blue-400">hot lead</span> again.
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="mt-6 text-[16px] sm:text-[19px] text-white/80 leading-relaxed max-w-xl"
          >
            EstateFlow answers every text, call, and Zillow inquiry in seconds — scores
            buyer intent with AI, books the showing, and runs the follow-ups while your
            agents focus on closing.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
            className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <Link href="#contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 text-white text-[15px] font-semibold hover:bg-blue-500 shadow-[0_8px_30px_rgba(37,99,235,0.45)] transition-all">
              Get a Demo
            </Link>
            <Link href="#workflow"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 text-white text-[15px] font-semibold border border-white/25 backdrop-blur-sm hover:bg-white/20 transition-all">
              See How It Works
            </Link>
          </motion.div>

          {/* Social proof row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-[13px] text-white/70 ml-1">Loved by modern brokerages</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-white/60">
              <Zap size={14} className="text-blue-400" />
              <span>Replies in under 90 seconds</span>
            </div>
          </motion.div>

          {/* Integrations */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 pt-7 border-t border-white/15"
          >
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-3">Works with</p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
              {["Zillow", "Realtor.com", "MLS", "Gmail", "Twilio SMS"].map((n) => (
                <span key={n} className="text-[15px] font-semibold text-white/55">{n}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
