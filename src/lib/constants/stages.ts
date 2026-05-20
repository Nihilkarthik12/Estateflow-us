import type { LeadStage } from "@/types";

export const stageConfig: Record<
  LeadStage,
  { label: string; color: string; bg: string }
> = {
  new: { label: "New", color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
  contacted: { label: "Contacted", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  qualified: { label: "Qualified", color: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
  site_visit: { label: "Site Visit", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  negotiation: { label: "Negotiation", color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
  closed: { label: "Closed", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  lost: { label: "Lost", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
};
