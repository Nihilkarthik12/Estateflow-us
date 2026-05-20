"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#workflow" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const linkClass =
  "px-3.5 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-white/5 transition-colors";

const ctaPrimary =
  "inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-[0_0_20px_var(--accent-glow)] transition-all";

const ctaGhost =
  "inline-flex items-center justify-center px-3.5 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-white/5 transition-colors";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-3 sm:pt-4">
        <div
          className={cn(
            "rounded-2xl border transition-all duration-300",
            scrolled
              ? "glass border-[var(--border)] shadow-lg shadow-black/30"
              : "border-transparent bg-[rgba(4,6,14,0.6)] backdrop-blur-md"
          )}
        >
          {/* 3-column grid keeps nav centered and prevents overlap with hero */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 h-14 px-4 sm:px-5">
            <Link href="/" className="flex items-center gap-2.5 min-w-0 justify-self-start">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                  boxShadow: "0 4px 12px var(--accent-glow)",
                }}
              >
                <Building2 size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-[var(--foreground)] truncate">
                EstateFlow <span className="gradient-text">AI</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center justify-center gap-0.5 justify-self-center">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2 justify-self-end">
              <Link href="/login" className={ctaGhost}>
                Sign in
              </Link>
              <Link href="/signup" className={ctaPrimary}>
                Get Started
              </Link>
            </div>

            <button
              type="button"
              className="md:hidden justify-self-end col-start-3 w-9 h-9 flex items-center justify-center rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mt-2 rounded-2xl glass overflow-hidden md:hidden"
            >
              <div className="p-3 flex flex-col gap-0.5">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-xl hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex gap-2 pt-2 mt-1 border-t border-[var(--border)]">
                  <Link
                    href="/login"
                    className={cn(ctaGhost, "flex-1 text-center py-2.5")}
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className={cn(ctaPrimary, "flex-1 text-center py-2.5")}
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
