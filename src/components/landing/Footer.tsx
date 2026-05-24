import Link from "next/link";
import { Building2 } from "lucide-react";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#workflow" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Contact", href: "#contact" },
      { label: "Sign in", href: "/login" },
      { label: "Sign up", href: "/signup" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-4 sm:px-6 pt-16 pb-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[var(--accent)]">
                <Building2 size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-[var(--foreground)]">
                EstateFlow <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[var(--foreground-muted)] max-w-xs">
              The AI-powered CRM built for modern real estate agencies in India.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--foreground-subtle)] mb-4">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--foreground-subtle)]">
            © {new Date().getFullYear()} EstateFlow AI. All rights reserved.
          </p>
          <p className="text-xs text-[var(--foreground-subtle)]">
            Built with Next.js · Supabase · OpenAI
          </p>
        </div>
      </div>
    </footer>
  );
}
