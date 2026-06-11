"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/917598470890";

const WA_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.122 1.528 5.854L0 24l6.305-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.682-.497-5.228-1.367l-.374-.22-3.742.894.948-3.657-.244-.389A9.938 9.938 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

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
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#25d366] text-white text-[13.5px] font-semibold hover:bg-[#20bd5a] transition-colors"
          >
            {WA_ICON}
            WhatsApp
          </a>
          <Link
            href="#contact"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-[13.5px] font-semibold hover:bg-blue-500 transition-colors"
          >
            Get a Demo
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
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25d366] text-white text-[14px] font-semibold">
            {WA_ICON}
            Chat on WhatsApp
          </a>
          <Link href="#contact" onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 text-white text-[14px] font-semibold">
            Get a Demo
          </Link>
        </div>
      )}
    </header>
  );
}
