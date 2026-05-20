"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Contact() {
  return (
    <section id="contact" className="landing-section px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="cta-banner px-6 py-14 sm:px-12 sm:py-16 text-center"
        >
          <div className="relative z-10 max-w-xl mx-auto">
            <p className="section-label mb-4">Get started</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--foreground)] mb-4">
              Ready to transform your lead flow into revenue?
            </h2>
            <p className="text-base sm:text-lg text-[var(--foreground-muted)] leading-relaxed mb-8">
              EstateFlow helps agencies convert more WhatsApp leads, match buyers to properties faster, and keep every team member aligned.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:min-w-[200px]">
                  Start free trial
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <a
                href="mailto:hello@estateflow.ai"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-xl border border-[var(--border-strong)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/[0.04] transition-colors"
              >
                Email us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
