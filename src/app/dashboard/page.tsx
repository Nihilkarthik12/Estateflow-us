"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users, Home, TrendingUp, Brain,
  ArrowRight, Loader2, RefreshCw, Lightbulb, Sparkles,
  Clock,
} from "lucide-react";
import Link from "next/link";
import TopBar from "@/components/dashboard/TopBar";
import StatCard from "@/components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Lead, LeadUrgency, LeadStage } from "@/types";
import { stageConfig } from "@/lib/constants/stages";
import { timeAgo } from "@/lib/utils/time";

const urgencyVariant: Record<LeadUrgency, "danger" | "warning" | "default"> = {
  high: "danger", medium: "warning", low: "default",
};

const todayLabel = new Date().toLocaleDateString("en-US", {
  weekday: "long", day: "numeric", month: "long",
});

interface Stats { totalLeads: number; activeProperties: number; conversionRate: number; aiAnalyzedPct: number; }
interface PipelineStage { stage: LeadStage; label: string; count: number; }

const PIPELINE_STAGES: { stage: LeadStage; label: string }[] = [
  { stage: "new", label: "New" },
  { stage: "contacted", label: "Contacted" },
  { stage: "qualified", label: "Qualified" },
  { stage: "site_visit", label: "Showing" },
  { stage: "negotiation", label: "Under Contract" },
  { stage: "closed", label: "Closed" },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsGenerated, setInsightsGenerated] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: leads }, { data: properties }] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("properties").select("id, status"),
    ]);
    const allLeads = (leads ?? []) as Lead[];
    const allProps = properties ?? [];
    const totalLeads = allLeads.length;
    const activeProperties = allProps.filter((p) => p.status === "available").length;
    const closed = allLeads.filter((l) => l.status === "closed").length;
    const conversionRate = totalLeads > 0 ? Math.round((closed / totalLeads) * 100) : 0;
    const analyzed = allLeads.filter((l) => l.ai_analyzed).length;
    const aiAnalyzedPct = totalLeads > 0 ? Math.round((analyzed / totalLeads) * 100) : 0;
    setStats({ totalLeads, activeProperties, conversionRate, aiAnalyzedPct });
    setRecentLeads(allLeads.slice(0, 5));
    const stageMap = new Map<LeadStage, number>();
    allLeads.forEach((l) => stageMap.set(l.status as LeadStage, (stageMap.get(l.status as LeadStage) ?? 0) + 1));
    setPipeline(PIPELINE_STAGES.map((s) => ({ ...s, count: stageMap.get(s.stage) ?? 0 })));
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  async function generateInsights() {
    setInsightsLoading(true);
    const res = await fetch("/api/generate-insights", { method: "POST" });
    const json = await res.json();
    if (json.insights) { setInsights(json.insights); setInsightsGenerated(true); }
    setInsightsLoading(false);
  }

  const maxPipelineCount = Math.max(...pipeline.map((s) => s.count), 1);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar title="Overview" subtitle={todayLabel} />

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">

        {/* Welcome banner */}
        <motion.div {...fade(-0.05)} className="relative overflow-hidden rounded-2xl"
          style={{ border: "1px solid rgba(91,141,239,0.15)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=60"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-[0.15]"
          />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(105deg, rgba(7,12,24,0.97) 0%, rgba(7,12,24,0.85) 50%, rgba(7,12,24,0.4) 100%)" }} />
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(91,141,239,0.5), transparent)" }} />

          <div className="relative flex items-center justify-between px-6 py-5 gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-1.5"
                style={{ color: "rgba(133,174,245,0.7)" }}>
                {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening"}
              </p>
              <p className="text-[17px] font-bold leading-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
                Your pipeline is live
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{todayLabel}</p>
            </div>

            <div className="hidden sm:flex items-center gap-4 shrink-0">
              {/* Live pulse badges */}
              <div className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl"
                style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)" }}>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-400">AI Active</span>
                </div>
                <span className="text-[9.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>All channels</span>
              </div>
              <div className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl"
                style={{ background: "rgba(91,141,239,0.07)", border: "1px solid rgba(91,141,239,0.18)" }}>
                <span className="text-[13px] font-bold" style={{ color: "#85aef5" }}>24/7</span>
                <span className="text-[9.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Response</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div {...fade(0)} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl shimmer" />
            ))
          ) : (
            <>
              <StatCard title="Total Leads" value={String(stats?.totalLeads ?? 0)} icon={Users}
                gradient="from-[#5b8def] to-[#3b82f6]"
                accentColor="rgba(91,141,239,0.25)" />
              <StatCard title="Active Listings" value={String(stats?.activeProperties ?? 0)} icon={Home}
                gradient="from-[#06b6d4] to-[#0891b2]"
                accentColor="rgba(6,182,212,0.2)" />
              <StatCard title="Conversion Rate" value={`${stats?.conversionRate ?? 0}%`} icon={TrendingUp}
                positive={(stats?.conversionRate ?? 0) > 0}
                gradient="from-[#10b981] to-[#059669]"
                accentColor="rgba(16,185,129,0.2)" />
              <StatCard title="AI Analyzed" value={`${stats?.aiAnalyzedPct ?? 0}%`} icon={Brain}
                positive={(stats?.aiAnalyzedPct ?? 0) > 50}
                gradient="from-[#f59e0b] to-[#d97706]"
                accentColor="rgba(245,158,11,0.2)" />
            </>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent Leads */}
          <motion.div {...fade(0.08)} className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: "var(--accent-muted)" }}>
                      <Users size={12} style={{ color: "var(--accent)" }} />
                    </div>
                    <CardTitle>Recent Leads</CardTitle>
                  </div>
                  <Link href="/dashboard/leads"
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[var(--accent-hover)]"
                    style={{ color: "var(--accent)" }}>
                    View all <ArrowRight size={11} />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl shimmer" />
                          <div className="flex flex-col gap-1.5">
                            <div className="h-3.5 w-28 rounded-lg shimmer" />
                            <div className="h-3 w-48 rounded-lg shimmer" />
                          </div>
                        </div>
                        <div className="h-5 w-14 rounded-full shimmer" />
                      </div>
                    ))}
                  </div>
                ) : recentLeads.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                      style={{ background: "var(--surface-2)", border: "1px solid var(--border-strong)" }}>
                      <Users size={20} style={{ color: "var(--foreground-subtle)" }} />
                    </div>
                    <p className="text-sm font-medium" style={{ color: "var(--foreground-muted)" }}>No leads yet</p>
                    <Link href="/dashboard/leads">
                      <button className="text-xs mt-1.5 transition-colors hover:text-[var(--accent-hover)]"
                        style={{ color: "var(--accent)" }}>
                        Add your first lead →
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {recentLeads.map((lead, i) => (
                      <Link key={lead.id} href={`/dashboard/leads/${lead.id}`}>
                        <motion.div
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 py-3 -mx-6 px-6 transition-colors rounded-xl hover:bg-[var(--surface-2)] cursor-pointer"
                          style={{ borderBottom: i < recentLeads.length - 1 ? "1px solid var(--border)" : "none" }}
                        >
                          {/* Avatar */}
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ background: `linear-gradient(135deg, ${stageConfig[lead.status as LeadStage]?.color ?? "var(--accent)"}99, ${stageConfig[lead.status as LeadStage]?.color ?? "var(--accent)"}44)` }}>
                            {(lead.name ?? "?")[0].toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>
                              {lead.name ?? "Unknown"}
                            </p>
                            <p className="text-xs truncate mt-0.5" style={{ color: "var(--foreground-muted)" }}>
                              {lead.summary || lead.raw_message || "No details"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2.5 shrink-0">
                            {lead.urgency && (
                              <Badge variant={urgencyVariant[lead.urgency as LeadUrgency]}>
                                {lead.urgency}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-xs" style={{ color: "var(--foreground-subtle)" }}>
                              <Clock size={10} />
                              {timeAgo(lead.created_at)}
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Insights */}
          <motion.div {...fade(0.16)}>
            <Card className="h-full flex flex-col" glow>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: "var(--accent-muted)" }}>
                      <Brain size={12} style={{ color: "var(--accent)" }} />
                    </div>
                    <CardTitle>AI Insights</CardTitle>
                  </div>
                  {insightsGenerated && (
                    <button
                      onClick={generateInsights}
                      disabled={insightsLoading}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--surface-2)] disabled:opacity-40"
                      style={{ color: "var(--foreground-muted)" }}
                    >
                      <RefreshCw size={12} className={insightsLoading ? "animate-spin" : ""} />
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {insightsLoading ? (
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 rounded-xl shimmer" />
                    ))}
                  </div>
                ) : insightsGenerated && insights.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {insights.map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex gap-2.5 p-3 rounded-xl"
                        style={{ background: "var(--surface-2)", border: "1px solid var(--border-strong)" }}
                      >
                        <Lightbulb size={12} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                        <p className="text-xs leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                          {insight}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "var(--accent-muted)",
                        border: "1px solid var(--border-accent)",
                      }}>
                      <Sparkles size={22} style={{ color: "var(--accent)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        Generate AI insights
                      </p>
                      <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--foreground-muted)" }}>
                        Get actionable analysis from your live pipeline data
                      </p>
                    </div>
                    <Button size="sm" onClick={generateInsights} disabled={insightsLoading}>
                      {insightsLoading
                        ? <><Loader2 size={12} className="animate-spin" /> Analyzing…</>
                        : <><Brain size={12} /> Generate Insights</>
                      }
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Pipeline Snapshot */}
        <motion.div {...fade(0.24)}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--accent-muted)" }}>
                    <TrendingUp size={12} style={{ color: "var(--accent)" }} />
                  </div>
                  <CardTitle>Lead Pipeline</CardTitle>
                </div>
                <Link href="/dashboard/leads"
                  className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[var(--accent-hover)]"
                  style={{ color: "var(--accent)" }}>
                  Manage <ArrowRight size={11} />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col gap-2.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-9 rounded-xl shimmer" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {pipeline.map((s) => {
                    const cfg = stageConfig[s.stage];
                    const pct = maxPipelineCount > 0 ? Math.round((s.count / maxPipelineCount) * 100) : 0;
                    return (
                      <Link key={s.stage} href={`/dashboard/leads?stage=${s.stage}`}>
                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group transition-colors"
                          style={{ background: `${cfg.color}08`, border: `1px solid ${cfg.color}18` }}
                        >
                          <span className="text-[12px] font-semibold w-[90px] shrink-0 truncate"
                            style={{ color: `${cfg.color}cc` }}>
                            {cfg.label}
                          </span>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                            style={{ background: `${cfg.color}15` }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.9, delay: 0.2 }}
                              className="h-full rounded-full"
                              style={{ background: `linear-gradient(90deg, ${cfg.color}99, ${cfg.color})` }}
                            />
                          </div>
                          <span className="text-[13px] font-bold w-6 text-right shrink-0"
                            style={{ color: cfg.color }}>
                            {s.count}
                          </span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
