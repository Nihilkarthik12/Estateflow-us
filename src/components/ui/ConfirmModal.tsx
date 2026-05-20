"use client";

import { Loader2, AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Delete", loading }: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-5">
        <div className="flex gap-3">
          <div className="p-2 bg-[var(--danger)]/10 rounded-lg shrink-0 h-fit">
            <AlertTriangle size={18} className="text-[var(--danger)]" />
          </div>
          <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} disabled={loading}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
