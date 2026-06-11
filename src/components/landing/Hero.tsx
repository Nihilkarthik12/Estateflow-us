"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

// Traditional American craftsman home — warm, aspirational, recognisably US
const HERO_HOME = "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85";
const WHATSAPP_URL = "https://wa.me/917598470890?text=Hi%2C%20I%27d%20like%20to%20see%20a%20demo%20of%20EstateFlow.";

const WA_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.528 5.854L0 24l6.305-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.682-.497-5.228-1.367l-.374-.22-3.742.894.948-3.657-.244-.389A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const photoY   = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex overflow-hidden bg-[#070c14]">

      {/* subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
        backgroundSize: "72px 72px",
      }} />

      {/* ── LEFT editorial panel ── */}
      <motion.div
        style={{ opacity: leftOpacity }}
        className="relative z-10 flex flex-col justify-center w-full lg:w-[56%] px-8 sm:px-14 xl:px-20 pt-28 pb-20"
      >
        <div className="max-w-[520px]">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2.5 mb-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-white/35 uppercase tracking-[0.2em]">
              AI-Powered Lead Recovery
            </span>
          </motion.div>

          {/* Headline — clip-reveal per line */}
          <div className="mb-8">
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.08 }}
                className="text-[21px] sm:text-[26px] text-white/45 leading-none mb-1"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontStyle: "italic" }}
              >
                The agent who replies first
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.18 }}
                className="text-[58px] sm:text-[72px] lg:text-[82px] font-black tracking-[-0.04em] text-white leading-[0.92]"
              >
                wins the deal.
              </motion.h1>
            </div>
          </div>

          {/* Body */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38, ease }}
            className="text-[15.5px] sm:text-[17px] text-white/50 leading-relaxed mb-10 max-w-[420px]"
          >
            EstateFlow replies to every text, Zillow inquiry, and missed call in
            under 90 seconds — AI-scored and agent-ready, 24/7.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.48, ease }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12"
          >
            {/* Primary — shimmer on hover */}
            <Link
              href="#contact"
              className="hero-cta-primary group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 text-white text-[15px] font-bold hover:bg-blue-500 transition-colors overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="relative">See it on your listings</span>
              <ArrowRight size={16} className="relative transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {/* WhatsApp ghost */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-white/12 text-white/60 text-[14px] font-medium hover:border-white/28 hover:text-white/85 transition-all"
            >
              {WA_ICON}
              Quick chat
            </a>
          </motion.div>

          {/* Agent quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="pl-4 border-l-2 border-blue-500/40"
          >
            <p
              className="text-[13.5px] text-white/45 leading-relaxed italic"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              &ldquo;We stopped losing after-hours leads the day we turned it on.&rdquo;
            </p>
            <p className="text-[11px] text-white/28 mt-1.5 font-semibold tracking-wide">
              — Sarah M., Broker-Owner · Chicago
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* ── RIGHT photo panel (desktop only) ── */}
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[46%] overflow-hidden">
        {/* Feather edge to the left */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#070c14] to-transparent z-10 pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#070c14]/70 to-transparent z-10 pointer-events-none" />

        {/* Parallax image */}
        <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-0 origin-center">
          <Image
            src={HERO_HOME}
            alt="Beautiful American home"
            fill
            priority
            className="object-cover object-center"
            sizes="46vw"
          />
        </motion.div>

        {/* Floating AI lead card */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.65, ease }}
          className="absolute bottom-12 left-8 z-20 w-[260px] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
          style={{
            background: "rgba(7,12,20,0.88)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">AI replied · 4 seconds ago</span>
          </div>
          <div className="px-4 py-3">
            <p className="text-[12px] text-white/70 leading-relaxed mb-3">
              &ldquo;3-bed near downtown Austin, budget $640K, need to close in 60 days.&rdquo;
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/35 mb-0.5">Michael C. · Intent score</p>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "94%" }}
                      transition={{ delay: 1.6, duration: 1.2, ease: "easeOut" }}
                      className="h-full rounded-full bg-emerald-400"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400">94</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md bg-blue-500/10">
                High intent
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 left-8 sm:left-14 xl:left-20 z-20 flex items-center gap-3"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent"
        />
        <span className="text-[9.5px] text-white/20 uppercase tracking-[0.2em]">Scroll to explore</span>
      </motion.div>

    </section>
  );
}
