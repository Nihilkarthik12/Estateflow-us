"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ShieldCheck, Clock, Zap } from "lucide-react";

const CONTACT_IMG = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80";

const ease = [0.22, 1, 0.36, 1] as const;

const trust = [
  { icon: Clock,         label: "We respond within the hour" },
  { icon: Zap,           label: "14-day free trial included" },
  { icon: ShieldCheck,   label: "No credit card required" },
  { icon: CheckCircle,   label: "Cancel anytime, no lock-in" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", brokerage: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setSent(true);
    setLoading(false);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-5 sm:px-8 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[13px] font-semibold text-blue-600 uppercase tracking-wider mb-3"
          >
            Get started
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
          >
            Close more deals. Work fewer hours.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-[15px] text-slate-500 max-w-lg mx-auto"
          >
            Book a private demo and see the full platform — AI lead capture, voice agent, and every automation — running on your own listings.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left — trust panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col justify-between"
          >
            {/* Property photo header */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={CONTACT_IMG}
                alt="Modern American home"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-semibold text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live on your listings
                </span>
              </div>
            </div>

            <div className="p-8">
              <p className="text-[22px] font-bold text-slate-900 leading-snug mb-3">
                See EstateFlow live on your own listings
              </p>
              <p className="text-[14px] text-slate-500 leading-relaxed mb-8">
                Schedule a 30-minute demo. We&apos;ll show you AI lead capture, scoring, and follow-up automation — customized for your brokerage.
              </p>

              <ul className="space-y-4">
                {trust.map((t) => (
                  <li key={t.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <t.icon size={15} className="text-blue-600" />
                    </div>
                    <span className="text-[14px] font-medium text-slate-700">{t.label}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-6 border-t border-slate-200">
                <p className="text-[12px] text-slate-400 uppercase tracking-wider font-semibold mb-3">Works with</p>
                <div className="flex flex-wrap gap-2">
                  {["Zillow", "Realtor.com", "MLS", "Gmail", "Twilio"].map(n => (
                    <span key={n} className="px-3 py-1 rounded-full bg-white border border-slate-200 text-[12px] font-semibold text-slate-500">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="rounded-2xl border border-slate-200 bg-white p-8"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
                  <CheckCircle size={26} className="text-emerald-600" />
                </div>
                <p className="text-[22px] font-bold text-slate-900 mb-2">We&apos;ll be in touch.</p>
                <p className="text-[14px] text-slate-500">Expect an email from our team within the hour.</p>
              </div>
            ) : (
              <>
                <h3 className="text-[20px] font-bold text-slate-900 mb-1">Book your private demo</h3>
                <p className="text-[13px] text-slate-500 mb-7">Our team will set you up within the hour.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { field: "name",      label: "Full Name",      type: "text",  placeholder: "Michael Carter",        required: true },
                    { field: "email",     label: "Work Email",     type: "email", placeholder: "michael@brokerage.com", required: true },
                    { field: "phone",     label: "Phone",          type: "tel",   placeholder: "(212) 555-0148",        required: true },
                    { field: "brokerage", label: "Brokerage Name", type: "text",  placeholder: "Carter Realty Group",   required: false },
                  ].map(({ field, label, type, placeholder, required }) => (
                    <div key={field}>
                      <label className="block text-[12px] font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
                      </label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[field as keyof typeof form]}
                        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                        required={required}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[14px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-blue-600 text-white text-[14px] font-bold hover:bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all disabled:opacity-60 mt-2"
                  >
                    {loading ? "Sending…" : "Request Demo →"}
                  </button>
                </form>

                <p className="text-[11px] text-slate-400 mt-4 text-center">
                  By submitting, you agree to our privacy policy.{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">Already have an account?</Link>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
