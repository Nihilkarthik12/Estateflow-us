"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({ open, onClose, title, description, children, size = "md" }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative z-10 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] w-full",
              {
                "max-w-sm": size === "sm",
                "max-w-lg": size === "md",
                "max-w-2xl": size === "lg",
                "max-w-4xl": size === "xl",
              }
            )}
          >
            <div className="flex items-start justify-between px-6 py-5 border-b border-[var(--border)] shrink-0">
              <div>
                <h2 id="modal-title" className="text-base font-semibold text-[var(--foreground)]">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-[var(--foreground-muted)] mt-0.5">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors ml-4 shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
