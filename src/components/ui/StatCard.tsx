"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  className?: string;
  gradient?: string;
  accentColor?: string;
}

function useCountUp(target: string) {
  const num = parseFloat(target.replace(/[^0-9.]/g, ""));
  const suffix = target.replace(/[0-9.]/g, "");
  const isNumeric = !isNaN(num) && num > 0;
  const [display, setDisplay] = useState(isNumeric ? "0" : target);
  const ran = useRef(false);

  useEffect(() => {
    if (!isNumeric || ran.current) return;
    ran.current = true;
    const dur = 900;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(eased * num);
      setDisplay(val + suffix);
      if (p < 1) requestAnimationFrame(tick);
      else setDisplay(target);
    };
    requestAnimationFrame(tick);
  }, [isNumeric, num, suffix, target]);

  return isNumeric ? display : target;
}

export default function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  className,
  gradient = "from-[#5b8def] to-[#3b82f6]",
  accentColor = "rgba(91,141,239,0.2)",
}: StatCardProps) {
  const animated = useCountUp(value);

  return (
    <div
      className={cn("stat-card-premium rounded-2xl p-5 relative overflow-hidden", className)}
    >
      {/* Subtle corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${accentColor}, transparent 70%)` }} />

      <div className="flex items-start justify-between mb-5">
        <div
          className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0 relative", gradient)}
          style={{ boxShadow: `0 4px 16px ${accentColor}` }}
        >
          <Icon size={17} className="text-white" />
          {/* Icon shine */}
          <div className="absolute inset-0 rounded-xl"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)" }} />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-right leading-tight mt-0.5"
          style={{ color: "rgba(255,255,255,0.3)" }}>
          {title}
        </p>
      </div>

      <div className="flex items-end gap-2.5">
        <span className="text-[28px] font-bold leading-none tracking-tight"
          style={{ color: "rgba(255,255,255,0.92)" }}>
          {animated}
        </span>
        {change && (
          <span
            className={cn(
              "text-[11px] font-semibold mb-0.5 px-2 py-0.5 rounded-md",
              positive
                ? "text-emerald-400 bg-emerald-500/10"
                : "text-red-400 bg-red-500/10"
            )}
          >
            {change}
          </span>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
    </div>
  );
}
