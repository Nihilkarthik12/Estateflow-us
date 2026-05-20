"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lease } from "@/types";

export function useLeases(tenantId?: string) {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeases = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from("leases").select("*").order("created_at", { ascending: false });
    if (tenantId) query = query.eq("tenant_id", tenantId);
    const { data } = await query;
    setLeases((data as Lease[]) ?? []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchLeases(); }, [fetchLeases]);

  async function addLease(payload: Omit<Lease, "id" | "created_at" | "organization_id">) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single();
    if (!profile) return { error: "Profile not found" };
    const { data, error: err } = await supabase.from("leases").insert({ ...payload, organization_id: profile.organization_id }).select().single();
    if (!err && data) setLeases((prev) => [data as Lease, ...prev]);
    return { data, error: err?.message };
  }

  async function updateLease(id: string, payload: Partial<Lease>) {
    const supabase = createClient();
    const { data, error: err } = await supabase.from("leases").update(payload).eq("id", id).select().single();
    if (!err && data) setLeases((prev) => prev.map((l) => l.id === id ? data as Lease : l));
    return { data, error: err?.message };
  }

  async function deleteLease(id: string) {
    const supabase = createClient();
    const { error: err } = await supabase.from("leases").delete().eq("id", id);
    if (!err) setLeases((prev) => prev.filter((l) => l.id !== id));
    return { error: err?.message };
  }

  return { leases, loading, fetchLeases, addLease, updateLease, deleteLease };
}
