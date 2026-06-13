"use client";

import { motion } from "framer-motion";

const integrations = [
  {
    name: "Zillow",
    color: "#006AFF",
    logo: (
      <svg viewBox="0 0 60 24" fill="none" className="h-5 w-auto">
        <text x="0" y="19" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="22" fill="#006AFF">Z</text>
        <text x="16" y="19" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="16" fill="#006AFF">illow</text>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    color: "#25D366",
    logo: (
      <svg viewBox="0 0 120 28" fill="none" className="h-5 w-auto">
        <rect x="0" y="2" width="24" height="24" rx="6" fill="#25D366" />
        <path d="M12 5.5C8.41 5.5 5.5 8.41 5.5 12c0 1.17.32 2.27.87 3.21L5.5 18.5l3.37-.85A6.47 6.47 0 0012 18.5c3.59 0 6.5-2.91 6.5-6.5S15.59 5.5 12 5.5zm3.18 8.97c-.13.37-.77.71-1.07.75-.27.04-.62.05-.99-.06-.23-.07-.52-.16-.89-.31-1.56-.67-2.58-2.25-2.66-2.35-.08-.1-.65-.87-.65-1.66 0-.79.41-1.18.56-1.34.15-.16.32-.2.43-.2h.31c.1 0 .24-.04.37.28.14.33.46 1.12.5 1.2.04.08.07.18.01.29-.06.11-.09.17-.17.27-.08.1-.17.22-.24.3-.08.09-.17.18-.07.36.1.17.44.73.95 1.18.65.58 1.2.76 1.37.84.17.08.27.07.37-.04.1-.11.43-.5.54-.67.11-.17.22-.14.37-.08.15.06.95.45 1.11.53.16.08.27.12.31.19.04.07.04.41-.09.78z" fill="white"/>
        <text x="30" y="19" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="14" fill="#075E54">WhatsApp</text>
      </svg>
    ),
  },
  {
    name: "OpenAI",
    color: "#10a37f",
    logo: (
      <svg viewBox="0 0 100 28" fill="none" className="h-5 w-auto">
        <circle cx="12" cy="14" r="10" fill="#10a37f" />
        <path d="M12 6.5l2.6 4.5H9.4L12 6.5zM12 21.5l-2.6-4.5h5.2L12 21.5zM6.5 12l4.5 2.6v-5.2L6.5 12zM17.5 12l-4.5 2.6v-5.2L17.5 12z" fill="white" fillOpacity="0.9"/>
        <text x="28" y="19" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="14" fill="#111">OpenAI</text>
      </svg>
    ),
  },
  {
    name: "Gmail",
    color: "#EA4335",
    logo: (
      <svg viewBox="0 0 80 28" fill="none" className="h-5 w-auto">
        <rect x="0" y="4" width="22" height="18" rx="3" fill="white" stroke="#ddd" strokeWidth="1"/>
        <path d="M1 5.5L11 14l10-8.5" stroke="#EA4335" strokeWidth="2" fill="none"/>
        <path d="M1 5.5V22h5V12.5l5 4 5-4V22h5V5.5" fill="#4285F4" fillOpacity="0.1"/>
        <text x="27" y="19" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="15" fill="#444">Gmail</text>
      </svg>
    ),
  },
  {
    name: "Realtor.com",
    color: "#D92228",
    logo: (
      <svg viewBox="0 0 110 28" fill="none" className="h-5 w-auto">
        <rect x="0" y="4" width="20" height="20" rx="4" fill="#D92228"/>
        <text x="2" y="19" fontFamily="Arial Black" fontWeight="900" fontSize="14" fill="white">R</text>
        <text x="26" y="19" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="13" fill="#D92228">Realtor.com</text>
      </svg>
    ),
  },
  {
    name: "MLS",
    color: "#1a3c6b",
    logo: (
      <svg viewBox="0 0 70 28" fill="none" className="h-5 w-auto">
        <rect x="0" y="4" width="28" height="20" rx="4" fill="#1a3c6b"/>
        <text x="3" y="19" fontFamily="Arial Black" fontWeight="900" fontSize="13" fill="white">MLS</text>
        <text x="34" y="19" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="13" fill="#1a3c6b">Listings</text>
      </svg>
    ),
  },
  {
    name: "Vapi",
    color: "#7c3aed",
    logo: (
      <svg viewBox="0 0 60 28" fill="none" className="h-5 w-auto">
        <rect x="0" y="4" width="22" height="20" rx="5" fill="#7c3aed"/>
        <path d="M7 10h8M7 14h6M7 18h4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <text x="27" y="19" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="15" fill="#7c3aed">Vapi</text>
      </svg>
    ),
  },
  {
    name: "Supabase",
    color: "#3ecf8e",
    logo: (
      <svg viewBox="0 0 96 28" fill="none" className="h-5 w-auto">
        <rect x="0" y="4" width="22" height="20" rx="5" fill="#1C1C1C"/>
        <path d="M6 20L13 8l7 12H6z" fill="#3ecf8e"/>
        <text x="28" y="19" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="14" fill="#1C1C1C">Supabase</text>
      </svg>
    ),
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Integrations() {
  return (
    <section className="py-16 px-5 sm:px-8 bg-white border-y border-slate-100">
      <div className="max-w-6xl mx-auto">

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-center text-[13px] font-semibold text-slate-400 uppercase tracking-widest mb-10"
        >
          Works with the tools your team already uses
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-8">
          {integrations.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease, delay: i * 0.07 }}
              className="flex items-center opacity-70 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0"
            >
              {item.logo}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
