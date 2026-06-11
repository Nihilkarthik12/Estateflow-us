import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 px-5 sm:px-8 pt-14 pb-8">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-[15px] tracking-tight text-slate-900">
                EstateFlow<span className="text-blue-600"> AI</span>
              </span>
            </Link>
            <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-xs">
              The AI-powered CRM built for modern US real estate brokerages. Close more. Work less.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5">Platform</p>
            <ul className="space-y-3">
              {[
                { label: "AI Lead Scoring",     href: "#features" },
                { label: "Instant Lead Capture", href: "#features" },
                { label: "Voice AI Agent",       href: "#features" },
                { label: "How It Works",         href: "#workflow" },
                { label: "Automations",          href: "#automations" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-[13.5px] text-slate-500 hover:text-slate-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5">Explore</p>
            <ul className="space-y-3">
              {[
                { label: "Property Listings",  href: "/listings" },
                { label: "Submit Requirement", href: "/submit-lead" },
                { label: "Book a Showing",     href: "/book-visit" },
                { label: "Tenant Portal",      href: "/tenant-portal" },
                { label: "Agent Login",        href: "/login" },
              ].map(link => (
                <li key={link.label}>
                  <Link href={link.href}
                    className="text-[13.5px] text-slate-500 hover:text-slate-900 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-5">Contact</p>
            <div className="space-y-3">
              <a href="mailto:nihilkaarthikeyan@gmail.com"
                className="flex items-center gap-2 text-[13.5px] text-slate-500 hover:text-slate-900 transition-colors">
                <Mail size={13} className="shrink-0" />
                nihilkaarthikeyan@gmail.com
              </a>
            </div>
            <div className="mt-6">
              <a href="#contact"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors">
                Get a Demo →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8 border-t border-slate-200">
          <p className="text-[12px] text-slate-400">
            © {new Date().getFullYear()} EstateFlow AI. All rights reserved.
          </p>
          <p className="text-[12px] text-slate-400">
            Built for US real estate · Equal Housing Opportunity
          </p>
        </div>
      </div>
    </footer>
  );
}
