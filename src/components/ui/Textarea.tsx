import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-[var(--foreground-muted)] tracking-wide uppercase">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full bg-[var(--surface-2)] border text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]",
            "rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none resize-none min-h-[100px]",
            "border-[var(--border-strong)]",
            "hover:border-[rgba(255,255,255,0.16)]",
            "focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-muted)] focus:bg-[var(--surface-3)]",
            error && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger-muted)]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <span className="text-xs text-[var(--foreground-subtle)]">{hint}</span>
        )}
        {error && <span className="text-xs text-[var(--danger)]">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
