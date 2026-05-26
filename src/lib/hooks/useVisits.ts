"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Visit } from "@/types";

export interface VisitFilters {
  search: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show" | "";
  date_from: string;
  date_to: string;
}

export const defaultVisitFilters: VisitFilters = {
  search: "",
  status: "",
  date_from: "",
  date_to: "",
};

export function useVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = useCallback(async (filters: VisitFilters = defaultVisitFilters) => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    let query = supabase
      .from("visits")
      .select("*")
      .order("visit_date", { ascending: false });

    if (filters.search) {
      query = query.or(
        `visitor_name.ilike.%${filters.search}%,visitor_phone.ilike.%${filters.search}%`
      );
    }
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.date_from) query = query.gte("visit_date", filters.date_from);
    if (filters.date_to) query = query.lte("visit_date", filters.date_to);

    const { data, error } = await query;
    if (error) setError(error.message);
    else setVisits((data as Visit[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  async function addVisit(payload: Omit<Visit, "id" | "created_at">) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data, error } = await supabase
      .from("visits")
      .insert(payload)
      .select()
      .single();

    if (!error) setVisits((prev) => [data as Visit, ...prev]);
    return { data, error: error?.message };
  }

  async function updateVisit(id: string, payload: Partial<Visit>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("visits")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (!error) {
      setVisits((prev) => prev.map((v) => (v.id === id ? (data as Visit) : v)));
    }
    return { data, error: error?.message };
  }

  async function deleteVisit(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("visits").delete().eq("id", id);
    if (!error) setVisits((prev) => prev.filter((v) => v.id !== id));
    return { error: error?.message };
  }

  return { visits, loading, error, fetchVisits, addVisit, updateVisit, deleteVisit };
}