import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-[var(--foreground-muted)] tracking-wide uppercase">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-xl px-4 py-3 text-sm outline-none",
            "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200 cursor-pointer",
            "hover:border-[rgba(255,255,255,0.18)]",
            error && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/20",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" style={{ background: "var(--surface-2)" }}>{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "var(--surface-2)" }}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-[var(--danger)]">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
