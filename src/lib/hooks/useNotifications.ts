"use client";

import { useState, useEffect, useCallback } from "react";
import type { Notification } from "@/types";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const res = await globalThis.fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      setNotifications(data.notifications ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await globalThis.fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
  }

  async function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    await globalThis.fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
  }

  return { notifications, loading, unreadCount, refetch: fetch, markAllRead, markRead };
}
