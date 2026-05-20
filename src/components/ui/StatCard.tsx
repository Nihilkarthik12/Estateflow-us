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
}

export default function StatCard({
  title,
  value,
  change,
  positive,
  icon: Icon,
  className,
  gradient = "from-[var(--accent)] to-[var(--accent-hover)]",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5",
        "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-medium text-[var(--foreground-muted)] tracking-wide uppercase">
          {title}
        </p>
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0",
            gradient
          )}
        >
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-[var(--foreground)] tracking-tight leading-none">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "text-xs font-medium mb-0.5 px-1.5 py-0.5 rounded-md",
              positive
                ? "text-[var(--success)] bg-[var(--success-muted)]"
                : "text-[var(--danger)] bg-[var(--danger-muted)]"
            )}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
