import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightElement, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-[var(--foreground-muted)] tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-[var(--surface-2)] border text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]",
              "rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none",
              "border-[var(--border-strong)]",
              "hover:border-[rgba(255,255,255,0.16)]",
              "focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-muted)] focus:bg-[var(--surface-3)]",
              leftIcon && "pl-10",
              rightElement && "pr-11",
              error && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger-muted)]",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
          )}
        </div>
        {hint && !error && (
          <span className="text-xs text-[var(--foreground-subtle)]">{hint}</span>
        )}
        {error && <span className="text-xs text-[var(--danger)]">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
