"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Visitor } from "@/types";

export function useVisitors(tenantId?: string) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from("visitors").select("*").order("created_at", { ascending: false });
    if (tenantId) query = query.eq("tenant_id", tenantId);
    const { data } = await query;
    setVisitors((data as Visitor[]) ?? []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchVisitors(); }, [fetchVisitors]);

  async function addVisitor(payload: Omit<Visitor, "id" | "created_at" | "organization_id">) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single();
    if (!profile) return { error: "Profile not found" };
    const { data, error: err } = await supabase.from("visitors").insert({ ...payload, organization_id: profile.organization_id }).select().single();
    if (!err && data) setVisitors((prev) => [data as Visitor, ...prev]);
    return { data, error: err?.message };
  }

  async function updateVisitor(id: string, payload: Partial<Visitor>) {
    const supabase = createClient();
    const { data, error: err } = await supabase.from("visitors").update(payload).eq("id", id).select().single();
    if (!err && data) setVisitors((prev) => prev.map((v) => v.id === id ? data as Visitor : v));
    return { data, error: err?.message };
  }

  async function deleteVisitor(id: string) {
    const supabase = createClient();
    const { error: err } = await supabase.from("visitors").delete().eq("id", id);
    if (!err) setVisitors((prev) => prev.filter((v) => v.id !== id));
    return { error: err?.message };
  }

  return { visitors, loading, fetchVisitors, addVisitor, updateVisitor, deleteVisitor };
}
