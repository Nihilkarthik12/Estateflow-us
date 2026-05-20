"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface DailyVolume { date: string; leads: number; }
export interface StageCount { stage: string; count: number; color: string; }
export interface SourceCount { source: string; count: number; }
export interface LocationCount { location: string; count: number; pct: number; }
export interface AgentRow { name: string; leads: number; closed: number; rate: string; }

export interface AnalyticsData {
  totalLeads: number;
  totalProperties: number;
  conversionRate: number;
  aiAnalyzedPct: number;
  dailyVolume: DailyVolume[];
  byStage: StageCount[];
  bySource: SourceCount[];
  topLocations: LocationCount[];
  agentPerformance: AgentRow[];
}

const stageColor: Record<string, string> = {
  new: "#7c3aed",
  contacted: "#818cf8",
  qualified: "#a78bfa",
  site_visit: "#f59e0b",
  negotiation: "#fb923c",
  closed: "#22c55e",
  lost: "#ef4444",
};

const stageLabel: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified",
  site_visit: "Site Visit", negotiation: "Negotiation",
  closed: "Closed", lost: "Lost",
};

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const [
      { data: leads },
      { data: properties },
      { data: profiles },
    ] = await Promise.all([
      supabase
        .from("leads")
        .select("id, status, source, location, urgency, assigned_to, created_at, ai_analyzed")
        .order("created_at", { ascending: false }),
      supabase.from("properties").select("id, status"),
      supabase.from("profiles").select("id, full_name, role"),
    ]);

    const allLeads = leads ?? [];
    const allProperties = properties ?? [];
    const allProfiles = profiles ?? [];

    // Total counts
    const totalLeads = allLeads.length;
    const totalProperties = allProperties.filter((p) => p.status === "available").length;
    const closedLeads = allLeads.filter((l) => l.status === "closed").length;
    const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;
    const analyzedLeads = allLeads.filter((l) => l.ai_analyzed).length;
    const aiAnalyzedPct = totalLeads > 0 ? Math.round((analyzedLeads / totalLeads) * 100) : 0;

    // Daily volume — last 30 days
    const now = new Date();
    const days: DailyVolume[] = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (29 - i));
      const key = d.toISOString().slice(0, 10);
      return { date: key, leads: 0 };
    });
    const dayMap = new Map(days.map((d) => [d.date, d]));
    allLeads.forEach((l) => {
      const key = new Date(l.created_at).toISOString().slice(0, 10);
      const entry = dayMap.get(key);
      if (entry) entry.leads++;
    });

    // By stage
    const stageMap: Record<string, number> = {};
    allLeads.forEach((l) => { stageMap[l.status] = (stageMap[l.status] ?? 0) + 1; });
    const byStage: StageCount[] = Object.entries(stageMap).map(([stage, count]) => ({
      stage: stageLabel[stage] ?? stage,
      count,
      color: stageColor[stage] ?? "#7c3aed",
    }));

    // By source
    const sourceMap: Record<string, number> = {};
    allLeads.forEach((l) => {
      const s = l.source ?? "unknown";
      sourceMap[s] = (sourceMap[s] ?? 0) + 1;
    });
    const bySource: SourceCount[] = Object.entries(sourceMap)
      .map(([source, count]) => ({ source: source.replace("_", " "), count }))
      .sort((a, b) => b.count - a.count);

    // Top locations
    const locMap: Record<string, number> = {};
    allLeads.forEach((l) => {
      if (!l.location) return;
      const loc = l.location.split(",")[0].trim();
      if (loc) locMap[loc] = (locMap[loc] ?? 0) + 1;
    });
    const sortedLocs = Object.entries(locMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxLoc = sortedLocs[0]?.[1] ?? 1;
    const topLocations: LocationCount[] = sortedLocs.map(([location, count]) => ({
      location,
      count,
      pct: Math.round((count / maxLoc) * 100),
    }));

    // Agent performance
    const agentLeads: Record<string, { leads: number; closed: number }> = {};
    allLeads.forEach((l) => {
      if (!l.assigned_to) return;
      if (!agentLeads[l.assigned_to]) agentLeads[l.assigned_to] = { leads: 0, closed: 0 };
      agentLeads[l.assigned_to].leads++;
      if (l.status === "closed") agentLeads[l.assigned_to].closed++;
    });
    const profileMap = new Map(allProfiles.map((p) => [p.id, p.full_name ?? "Agent"]));
    const agentPerformance: AgentRow[] = Object.entries(agentLeads)
      .map(([id, stats]) => ({
        name: profileMap.get(id) ?? "Agent",
        leads: stats.leads,
        closed: stats.closed,
        rate: stats.leads > 0 ? `${Math.round((stats.closed / stats.leads) * 100)}%` : "0%",
      }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 6);

    setData({
      totalLeads,
      totalProperties,
      conversionRate,
      aiAnalyzedPct,
      dailyVolume: days,
      byStage,
      bySource,
      topLocations,
      agentPerformance,
    });
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, refetch: fetch };
}
