"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          variant === "primary" && [
            "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-[0.98]",
            "shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_28px_var(--accent-glow)]",
          ],
          variant === "secondary" && [
            "bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border-strong)]",
            "hover:bg-[var(--surface-3)] hover:border-[var(--border-accent)] active:scale-[0.98]",
          ],
          variant === "ghost" && [
            "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]",
          ],
          variant === "danger" && [
            "bg-[var(--danger)] text-white hover:opacity-90 active:scale-[0.98]",
          ],
          size === "sm" && "text-xs px-3.5 py-2 rounded-lg",
          size === "md" && "text-sm px-4 py-2.5",
          size === "lg" && "text-sm px-6 py-3",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
