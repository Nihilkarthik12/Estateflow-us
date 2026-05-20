"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-14 md:mb-16 max-w-2xl ${centered ? "mx-auto text-center" : ""} ${className}`}
    >
      <p className="section-label mb-4">{label}</p>
      <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-semibold leading-[1.15] tracking-tight text-[var(--foreground)]">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base md:text-lg leading-relaxed text-[var(--foreground-muted)] ${centered ? "max-w-xl mx-auto" : "max-w-lg"}`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
