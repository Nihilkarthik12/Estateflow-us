"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Our response time dropped from 3 hours to under a minute. The AI reads the lead and tells my agent exactly what to say. We closed 6 extra deals in the first month alone.",
    name: "Rajesh Menon",
    role: "Sr. Sales Manager",
    agency: "Prestige Homes",
    city: "Bangalore",
    gradient: "from-[#5b6ef5] to-[#818cf8]",
    initials: "RM",
  },
  {
    quote:
      "The AI chatbot handles enquiries at midnight. I literally wake up to qualified leads every morning, fully analysed with budget and location already extracted. My team loves it.",
    name: "Kavitha Subramaniam",
    role: "Director",
    agency: "KVS Properties",
    city: "Chennai",
    gradient: "from-[#06b6d4] to-[#22d3ee]",
    initials: "KS",
  },
  {
    quote:
      "I was sceptical about AI. But EstateFlow actually understands real estate. The property matching is scary accurate and the voice agent on our website books site visits on its own.",
    name: "Aditya Shah",
    role: "Founder",
    agency: "Prime Estates",
    city: "Mumbai",
    gradient: "from-[#a855f7] to-[#c084fc]",
    initials: "AS",
  },
];

export default function Testimonials() {
  return (
    <section className="landing-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="section-label mb-4">Real results</p>
          <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-tight tracking-tight text-[var(--foreground)]">
            Agents across India trust EstateFlow
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl mx-auto">
            Real teams. Real numbers. Not marketing fluff.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="testimonial-card p-7 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote mark */}
              <div
                className="text-5xl font-serif leading-none -mt-2 bg-gradient-to-br bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--accent), var(--cyan))`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                &ldquo;
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed text-[var(--foreground-muted)] flex-1 -mt-4">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.07]">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{t.name}</p>
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {t.role} · {t.agency}, {t.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "2,400+", label: "Leads processed" },
            { value: "₹18Cr+", label: "Deals closed" },
            { value: "94%", label: "Agent satisfaction" },
            { value: "< 90s", label: "Avg. response time" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center px-4 py-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] card-glow"
            >
              <p className="text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
