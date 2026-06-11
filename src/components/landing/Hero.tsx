"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Star, Zap } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const WA_ICON_SM = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.528 5.854L0 24l6.305-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.682-.497-5.228-1.367l-.374-.22-3.742.894.948-3.657-.244-.389A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

const WHATSAPP_URL = "https://wa.me/917598470890";

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
            {/* Primary — outcome-focused */}
            <Link href="#contact"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl bg-blue-600 text-white text-[16px] font-bold hover:bg-blue-500 shadow-[0_8px_32px_rgba(37,99,235,0.5)] transition-all group">
              Recover My Lost Leads
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
            {/* Secondary — low-commitment */}
            <Link href="#workflow"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/10 text-white text-[15px] font-semibold border border-white/25 backdrop-blur-sm hover:bg-white/18 transition-all">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="white" aria-hidden><path d="M0 0l10 6-10 6V0z"/></svg>
              </span>
              Watch 2-Min Demo
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="mt-3.5 text-[12.5px] text-white/40"
          >
            10-minute setup · No credit card · Cancel anytime
          </motion.p>

          {/* Social proof row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-[13px] text-white/65 ml-1">Avg. agent recovers 23 leads/month</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-white/55">
              <Zap size={13} className="text-blue-400" />
              <span>12 agents in your area went live this month</span>
            </div>
            {/* WhatsApp as organic pill */}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25d366]/20 border border-[#25d366]/40 text-[#4ade80] text-[12.5px] font-semibold hover:bg-[#25d366]/30 transition-all">
              {WA_ICON_SM}
              Quick chat
            </a>
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
