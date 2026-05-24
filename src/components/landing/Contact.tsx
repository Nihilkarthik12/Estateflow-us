"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="landing-section px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="cta-banner px-6 py-16 sm:px-14 sm:py-20 text-center"
        >
          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="section-label mb-4">Ready to grow?</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-[var(--foreground)] mb-5 leading-tight">
              Your next big deal is already in your inbox.{" "}
              <span className="gradient-text">Don&apos;t miss it.</span>
            </h2>
            <p className="text-base sm:text-lg text-[var(--foreground-muted)] leading-relaxed mb-10 max-w-lg mx-auto">
              Set up in minutes. No credit card. No long-term contract.
              Just more leads closed, automatically.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold rounded-xl text-sm px-8 py-3.5 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-[0.98] transition-all shadow-[0_0_24px_var(--accent-glow)] hover:shadow-[0_0_32px_var(--accent-glow)] sm:min-w-[220px]"
              >
                Start free trial
                <ArrowRight size={15} />
              </Link>
              <a
                href="mailto:nihilkaarthikeyan@gmail.com"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-medium rounded-xl text-sm px-6 py-3.5 border border-[var(--border-strong)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/[0.04] transition-colors"
              >
                <MessageCircle size={15} />
                Talk to us
              </a>
            </div>
            <p className="mt-6 text-xs text-[var(--foreground-subtle)]">
              14-day free trial · No setup fees · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
