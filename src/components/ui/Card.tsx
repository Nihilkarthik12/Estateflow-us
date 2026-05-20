import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[var(--shadow-sm)]",
        hover && "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] transition-all duration-200",
        glow && "border-[var(--border-accent)] shadow-[0_0_24px_var(--accent-muted)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 pt-5 pb-0", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-sm font-semibold text-[var(--foreground)] tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs text-[var(--foreground-muted)] mt-1 leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-5", className)}>{children}</div>;
}
