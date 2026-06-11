"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Features",     href: "#features" },
  { label: "How it Works", href: "#workflow" },
  { label: "Automations",  href: "#automations" },
  { label: "Listings",     href: "/listings" },
  { label: "FAQ",          href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_12px_rgba(15,23,38,0.04)]"
          : "bg-transparent"
      }`}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className={`font-bold text-[15px] tracking-tight transition-colors ${scrolled ? "text-slate-900" : "text-white"}`}>
            EstateFlow<span className="text-blue-400"> AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`text-[13.5px] font-medium transition-colors ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={`text-[13.5px] font-medium transition-colors px-3 py-2 ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white"}`}
          >
            Agent Login
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-[13.5px] font-semibold hover:bg-blue-500 transition-colors group"
          >
            Recover My Leads
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden p-2 ${scrolled ? "text-slate-700" : "text-white"}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-slate-200 px-5 py-4 flex flex-col gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-[15px] font-medium text-slate-700 hover:text-slate-900"
            >
              {l.label}
            </Link>
          ))}
          <div className="h-px bg-slate-200 my-2" />
          <Link href="/login" onClick={() => setOpen(false)}
            className="py-2.5 text-[15px] font-medium text-slate-700">
            Agent Login
          </Link>
          <Link href="#contact" onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-blue-600 text-white text-[14px] font-semibold">
            Recover My Leads →
          </Link>
        </div>
      )}
    </header>
  );
}
