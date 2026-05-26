"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MaintenanceTicket, TicketStatus } from "@/types";

export function useMaintenance(tenantId?: string) {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async (filters?: { status?: TicketStatus | ""; priority?: string; category?: string }) => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from("maintenance_tickets").select("*").order("created_at", { ascending: false });
    if (tenantId) query = query.eq("tenant_id", tenantId);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.priority) query = query.eq("priority", filters.priority);
    if (filters?.category) query = query.eq("category", filters.category);
    const { data } = await query;
    setTickets((data as MaintenanceTicket[]) ?? []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  async function addTicket(payload: Omit<MaintenanceTicket, "id" | "created_at" | "updated_at">) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data, error: err } = await supabase.from("maintenance_tickets").insert(payload).select().single();
    if (!err && data) setTickets((prev) => [data as MaintenanceTicket, ...prev]);
    return { data, error: err?.message };
  }

  async function updateTicket(id: string, payload: Partial<MaintenanceTicket>) {
    const supabase = createClient();
    const { data, error: err } = await supabase.from("maintenance_tickets").update(payload).eq("id", id).select().single();
    if (!err && data) setTickets((prev) => prev.map((t) => t.id === id ? data as MaintenanceTicket : t));
    return { data, error: err?.message };
  }

  async function deleteTicket(id: string) {
    const supabase = createClient();
    const { error: err } = await supabase.from("maintenance_tickets").delete().eq("id", id);
    if (!err) setTickets((prev) => prev.filter((t) => t.id !== id));
    return { error: err?.message };
  }

  return { tickets, loading, fetchTickets, addTicket, updateTicket, deleteTicket };
}