"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Property, PropertyStatus } from "@/types";

export interface PropertyFilters {
  search: string;
  city: string;
  status: PropertyStatus | "";
  property_type: string;
  min_beds: number | "";
  max_price: number | "";
}

export const defaultFilters: PropertyFilters = {
  search: "",
  city: "",
  status: "",
  property_type: "",
  min_beds: "",
  max_price: "",
};

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async (filters: PropertyFilters = defaultFilters) => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    let query = supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,location.ilike.%${filters.search}%,city.ilike.%${filters.search}%`
      );
    }
    if (filters.city) query = query.ilike("city", `%${filters.city}%`);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.property_type) query = query.eq("property_type", filters.property_type);
    if (filters.min_beds !== "") query = query.gte("bedrooms", filters.min_beds);
    if (filters.max_price !== "") query = query.lte("price", filters.max_price);

    const { data, error } = await query;
    if (error) setError(error.message);
    else setProperties((data as Property[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  async function addProperty(payload: Omit<Property, "id" | "created_at" | "organization_id">) {
    const supabase = createClient();

    // Get org_id from profile
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) return { error: "No organization found" };

    const { data, error } = await supabase
      .from("properties")
      .insert({ ...payload, organization_id: profile.organization_id, created_by: user.id })
      .select()
      .single();

    if (!error) setProperties((prev) => [data as Property, ...prev]);
    return { data, error: error?.message };
  }

  async function updateProperty(id: string, payload: Partial<Property>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("properties")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (!error) {
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? (data as Property) : p))
      );
    }
    return { data, error: error?.message };
  }

  async function deleteProperty(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (!error) setProperties((prev) => prev.filter((p) => p.id !== id));
    return { error: error?.message };
  }

  return { properties, loading, error, fetchProperties, addProperty, updateProperty, deleteProperty };
}
