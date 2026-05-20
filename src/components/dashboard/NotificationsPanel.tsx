"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Brain, Users, Calendar, Info, CheckCheck, X } from "lucide-react";
import Link from "next/link";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const typeIcon: Record<Notification["type"], React.ElementType> = {
  lead: Users,
  ai: Brain,
  follow_up: Calendar,
  info: Info,
};

const typeColor: Record<Notification["type"], string> = {
  lead: "var(--accent)",
  ai: "#a78bfa",
  follow_up: "var(--warning)",
  info: "var(--foreground-muted)",
};

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const { notifications, loading, unreadCount, markAllRead, markRead } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-[var(--foreground-muted)]" />
              <span className="text-sm font-semibold text-[var(--foreground)]">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-[var(--accent)] text-white px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
                  title="Mark all read"
                >
                  <CheckCheck size={13} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-0">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0">
                    <div className="w-7 h-7 rounded-full bg-[var(--surface-3)] animate-pulse shrink-0" />
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="h-3 bg-[var(--surface-3)] rounded animate-pulse w-4/5" />
                      <div className="h-2.5 bg-[var(--surface-3)] rounded animate-pulse w-2/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-10">
                <Bell size={20} className="text-[var(--foreground-subtle)]" />
                <p className="text-xs text-[var(--foreground-muted)]">No notifications yet</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((n) => {
                  const Icon = typeIcon[n.type] ?? Info;
                  const color = typeColor[n.type] ?? "var(--foreground-muted)";
                  const inner = (
                    <div
                      onClick={() => !n.read && markRead(n.id)}
                      className={cn(
                        "flex gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 transition-colors cursor-pointer",
                        !n.read
                          ? "bg-[var(--accent-muted)] hover:bg-[var(--surface-2)]"
                          : "hover:bg-[var(--surface-2)]"
                      )}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${color}18` }}
                      >
                        <Icon size={13} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-xs leading-relaxed",
                          !n.read ? "text-[var(--foreground)] font-medium" : "text-[var(--foreground-muted)]"
                        )}>
                          {n.message}
                        </p>
                        <p className="text-[10px] text-[var(--foreground-subtle)] mt-0.5">{timeAgo(n.created_at)}</p>
                      </div>
                      {!n.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0 mt-1.5" />
                      )}
                    </div>
                  );

                  return n.link ? (
                    <Link key={n.id} href={n.link} onClick={onClose}>{inner}</Link>
                  ) : (
                    <div key={n.id}>{inner}</div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
