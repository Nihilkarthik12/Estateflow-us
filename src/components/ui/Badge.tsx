import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "accent";
  className?: string;
}

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full tracking-wide",
        {
          "bg-[var(--surface-3)] text-[var(--foreground-muted)] border border-[var(--border-strong)]":
            variant === "default",
          "bg-[var(--success-muted)] text-[var(--success)] border border-[rgba(16,185,129,0.2)]":
            variant === "success",
          "bg-[var(--warning-muted)] text-[var(--warning)] border border-[rgba(245,158,11,0.2)]":
            variant === "warning",
          "bg-[var(--danger-muted)] text-[var(--danger)] border border-[rgba(239,68,68,0.2)]":
            variant === "danger",
          "bg-[var(--accent-muted)] text-[var(--accent-hover)] border border-[var(--border-accent)]":
            variant === "accent",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
