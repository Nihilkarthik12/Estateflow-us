"use client";

import { useState, type ReactNode } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { useAuth } from "@/lib/auth/provider";
import { useDashboard } from "./DashboardShell";
import NotificationsPanel from "./NotificationsPanel";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const { profile } = useAuth();
  const { toggleMobile } = useDashboard();

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 glass border-b border-[var(--border)]">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleMobile}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] border border-[var(--border)] transition-all"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-[var(--foreground)] tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[var(--foreground-subtle)] mt-0.5 truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {actions && <div className="flex items-center gap-2 mr-2">{actions}</div>}
        <button
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] border border-transparent hover:border-[var(--border-strong)] transition-all"
          aria-label="Search"
        >
          <Search size={15} />
        </button>

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] border border-transparent hover:border-[var(--border-strong)] transition-all relative"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent-glow)" }}
              />
            )}
          </button>
          <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold ml-1 shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)",
            boxShadow: "0 2px 8px var(--accent-glow)",
          }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
