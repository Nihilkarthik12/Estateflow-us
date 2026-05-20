"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tenant } from "@/types";

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = useCallback(async (search = "") => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase.from("tenants").select("*").order("created_at", { ascending: false });
    if (search) query = query.ilike("name", `%${search}%`);
    const { data, error: err } = await query;
    if (err) setError(err.message);
    else setTenants((data as Tenant[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

  async function addTenant(payload: Omit<Tenant, "id" | "created_at" | "organization_id">) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };
    const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single();
    if (!profile) return { error: "Profile not found" };
    const { data, error: err } = await supabase.from("tenants").insert({ ...payload, organization_id: profile.organization_id }).select().single();
    if (!err && data) setTenants((prev) => [data as Tenant, ...prev]);
    return { data, error: err?.message };
  }

  async function updateTenant(id: string, payload: Partial<Tenant>) {
    const supabase = createClient();
    const { data, error: err } = await supabase.from("tenants").update(payload).eq("id", id).select().single();
    if (!err && data) setTenants((prev) => prev.map((t) => t.id === id ? data as Tenant : t));
    return { data, error: err?.message };
  }

  async function deleteTenant(id: string) {
    const supabase = createClient();
    const { error: err } = await supabase.from("tenants").delete().eq("id", id);
    if (!err) setTenants((prev) => prev.filter((t) => t.id !== id));
    return { error: err?.message };
  }

  return { tenants, loading, error, fetchTenants, addTenant, updateTenant, deleteTenant };
}
