"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Brain, Phone, Mail, MapPin, Wallet,
  Home, Clock, Send, Pencil, Trash2, Loader2,
  AlertCircle, CheckCircle2, User, RefreshCw, Building2,
  BedDouble, Maximize2, Sparkles, CalendarDays, UserCheck,
  MessageCircle, BellRing, DollarSign, Activity,
  PhoneCall, FileText, Plus,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import TopBar from "@/components/dashboard/TopBar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Select from "@/components/ui/Select";
import LeadFormModal from "@/components/leads/LeadFormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import type { Lead, LeadStage, LeadUrgency, BuyerIntent } from "@/types";

interface Message { id: string; message: string; direction: "inbound" | "outbound"; created_at: string; }
interface Activity { id: string; type: string; content: string; created_at: string; }

interface PropertyRecommendation {
  id: string;
  title: string;
  price: number;
  location: string;
  city?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  property_type?: string;
  images?: string[];
  match_reasons: string[];
  score: number;
}

const stageOptions = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Showing", value: "site_visit" },
  { label: "Under Contract", value: "negotiation" },
  { label: "Closed", value: "closed" },
  { label: "Lost", value: "lost" },
];

const stageColor: Record<LeadStage, string> = {
  new: "var(--accent)", contacted: "#818cf8", qualified: "#a78bfa",
  site_visit: "var(--warning)", negotiation: "#fb923c",
  closed: "var(--success)", lost: "var(--danger)",
};

const urgencyVariant: Record<LeadUrgency, "danger" | "warning" | "default"> = {
  high: "danger", medium: "warning", low: "default",
};

const intentLabel: Record<BuyerIntent, string> = {
  serious: "Serious Buyer", researching: "Researching", comparing: "Comparing Options",
};

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatPrice(p: number) {
  if (p >= 1e6) return `$${(p / 1e6).toFixed(p % 1e6 === 0 ? 0 : 1)}M`;
  if (p >= 1e3) return `$${(p / 1e3).toFixed(0)}K`;
  return `$${p.toLocaleString("en-US")}`;
}

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingLead, setLoadingLead] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [updatingStage, setUpdatingStage] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [generatingFollowup, setGeneratingFollowup] = useState(false);

  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [teamMembers, setTeamMembers] = useState<{ id: string; full_name?: string }[]>([]);
  const [assigningAgent, setAssigningAgent] = useState(false);

  const [visitDate, setVisitDate] = useState("");
  const [savingVisit, setSavingVisit] = useState(false);
  const [visitSaved, setVisitSaved] = useState(false);

  // Follow-up reminder
  const [followUpAt, setFollowUpAt] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);
  const [followUpSaved, setFollowUpSaved] = useState(false);

  // Commission
  const [commission, setCommission] = useState("");
  const [savingCommission, setSavingCommission] = useState(false);
  const [commissionSaved, setCommissionSaved] = useState(false);

  // Activity log
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityNote, setActivityNote] = useState("");
  const [activityType, setActivityType] = useState("note");
  const [savingActivity, setSavingActivity] = useState(false);

  const msgEndRef = useRef<HTMLDivElement>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoadingRecs(true);
    const res = await fetch("/api/recommend-properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: id }),
    });
    const data = await res.json();
    if (data.recommendations) setRecommendations(data.recommendations);
    setLoadingRecs(false);
  }, [id]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: leadData }, { data: convData }] = await Promise.all([
        supabase.from("leads").select("*").eq("id", id).single(),
        supabase.from("conversations").select("*").eq("lead_id", id).order("created_at"),
      ]);
      setLead(leadData as Lead);
      setMessages((convData as Message[]) ?? []);
      if (leadData?.visit_date) {
        const dt = new Date(leadData.visit_date);
        const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setVisitDate(local);
      }
      if (leadData?.follow_up_at) {
        const dt = new Date(leadData.follow_up_at);
        const local = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setFollowUpAt(local);
      }
      if (leadData?.commission_amount) setCommission(String(leadData.commission_amount));
      setTeamMembers([]);
      setLoadingLead(false);
      // Load activities
      const res = await fetch(`/api/lead-activity?lead_id=${id}`);
      const json = await res.json();
      setActivities(json.activities ?? []);
    }
    load();
    fetchRecommendations();
  }, [id, fetchRecommendations]);

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleStageChange(stage: string) {
    if (!lead) return;
    setUpdatingStage(true);
    const supabase = createClient();
    const { data } = await supabase.from("leads").update({ status: stage }).eq("id", id).select().single();
    setLead(data as Lead);
    setUpdatingStage(false);
  }

  async function runAIAnalysis() {
    if (!lead?.raw_message) return;
    setAnalyzing(true);
    setAnalyzeError("");
    const res = await fetch("/api/analyze-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: id, rawMessage: lead.raw_message }),
    });
    const data = await res.json();
    if (data.error) {
      setAnalyzeError(data.error);
    } else {
      setLead(data.lead as Lead);
      await fetchRecommendations();
    }
    setAnalyzing(false);
  }

  async function generateFollowup() {
    setGeneratingFollowup(true);
    const res = await fetch("/api/generate-followup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: id }),
    });
    const data = await res.json();
    if (data.message) setNewMsg(data.message);
    setGeneratingFollowup(false);
  }

  async function sendMessage() {
    if (!newMsg.trim()) return;
    setSendingMsg(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("conversations")
      .insert({ lead_id: id, message: newMsg.trim(), direction: "outbound" })
      .select()
      .single();
    if (data) setMessages((prev) => [...prev, data as Message]);
    setNewMsg("");
    setSendingMsg(false);
  }

  async function handleAgentAssign(agentId: string) {
    if (!lead) return;
    setAssigningAgent(true);
    const supabase = createClient();
    const { data } = await supabase.from("leads").update({ assigned_to: agentId || null }).eq("id", id).select().single();
    setLead(data as Lead);
    setAssigningAgent(false);
  }

  async function saveVisitDate() {
    if (!visitDate) return;
    setSavingVisit(true);
    const supabase = createClient();
    const { data } = await supabase.from("leads").update({ visit_date: new Date(visitDate).toISOString() }).eq("id", id).select().single();
    setLead(data as Lead);
    setVisitSaved(true);
    setSavingVisit(false);
    setTimeout(() => setVisitSaved(false), 2500);
  }

  async function handleUpdate(payload: Omit<Lead, "id" | "created_at" | "ai_analyzed">) {
    const supabase = createClient();
    const { data, error } = await supabase.from("leads").update(payload).eq("id", id).select().single();
    if (!error) setLead(data as Lead);
    return { error: error?.message };
  }

  async function handleDelete() {
    setDeleteLoading(true);
    const supabase = createClient();
    await supabase.from("leads").delete().eq("id", id);
    router.push("/dashboard/leads");
  }

  async function saveFollowUp() {
    if (!followUpAt) return;
    setSavingFollowUp(true);
    const supabase = createClient();
    const { data } = await supabase.from("leads").update({ follow_up_at: new Date(followUpAt).toISOString() }).eq("id", id).select().single();
    setLead(data as Lead);
    setFollowUpSaved(true);
    setSavingFollowUp(false);
    setTimeout(() => setFollowUpSaved(false), 2500);
  }

  async function saveCommission() {
    if (!commission) return;
    setSavingCommission(true);
    const supabase = createClient();
    const { data } = await supabase.from("leads").update({ commission_amount: parseFloat(commission) }).eq("id", id).select().single();
    setLead(data as Lead);
    setCommissionSaved(true);
    setSavingCommission(false);
    setTimeout(() => setCommissionSaved(false), 2500);
  }

  async function addActivity() {
    if (!activityNote.trim()) return;
    setSavingActivity(true);
    const res = await fetch("/api/lead-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id: id, type: activityType, content: activityNote.trim() }),
    });
    const json = await res.json();
    if (json.activity) setActivities((prev) => [json.activity, ...prev]);
    setActivityNote("");
    setSavingActivity(false);
  }

  if (loadingLead) {
    return (
      <div className="flex flex-col flex-1">
        <TopBar title="Lead Details" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col flex-1">
        <TopBar title="Lead Not Found" />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-[var(--foreground-muted)]">This lead doesn&apos;t exist or was deleted.</p>
          <Link href="/dashboard/leads">
            <Button variant="secondary" size="sm"><ArrowLeft size={14} /> Back to Leads</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title={lead.name ?? "Lead Detail"} subtitle={lead.phone ?? ""} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Back + Actions */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <Link href="/dashboard/leads">
            <Button variant="ghost" size="sm"><ArrowLeft size={14} /> Leads</Button>
          </Link>
          <div className="flex gap-2 flex-wrap">
            {lead?.phone && (
              <a href={`tel:${lead.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                <PhoneCall size={13} /> Call
              </a>
            )}
            {lead?.phone && (
              <a href={`https://wa.me/${lead.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle size={13} /> WhatsApp
              </a>
            )}
            {lead?.email && (
              <a href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
                <Mail size={13} /> Email
              </a>
            )}
            <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil size={13} /> Edit
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={13} /> Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

          {/* LEFT column */}
          <div className="flex flex-col gap-4">

            {/* Contact card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-muted)] flex items-center justify-center">
                  <User size={18} className="text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{lead.name ?? "Unknown"}</p>
                  {lead.source && (
                    <p className="text-xs text-[var(--foreground-muted)] capitalize">{lead.source.replace("_", " ")}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-2.5 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors">
                    <Phone size={14} className="text-[var(--accent)]" /> {lead.phone}
                  </a>
                )}
                {lead.email && (
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2.5 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors">
                    <Mail size={14} className="text-[var(--accent)]" /> {lead.email}
                  </a>
                )}
                {lead.location && (
                  <div className="flex items-center gap-2.5 text-sm text-[var(--foreground-muted)]">
                    <MapPin size={14} className="text-[var(--accent)]" /> {lead.location}
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-sm text-[var(--foreground-muted)]">
                  <Clock size={14} className="text-[var(--accent)]" /> {timeAgo(lead.created_at)}
                </div>
              </div>
            </motion.div>

            {/* Pipeline stage */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
            >
              <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
                Pipeline Stage
              </p>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: stageColor[lead.status as LeadStage] }}
                />
                <span className="text-sm font-semibold text-[var(--foreground)]">
                  {stageOptions.find((s) => s.value === lead.status)?.label ?? lead.status}
                </span>
                {updatingStage && <Loader2 size={12} className="animate-spin text-[var(--foreground-muted)]" />}
              </div>
              <Select
                value={lead.status}
                onChange={(e) => handleStageChange(e.target.value)}
                options={stageOptions}
                className="text-sm"
              />
            </motion.div>

            {/* Agent Assignment */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <UserCheck size={14} className="text-[var(--accent)]" />
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider flex-1">
                  Assigned Agent
                </p>
                {assigningAgent && <Loader2 size={12} className="animate-spin text-[var(--foreground-muted)]" />}
              </div>
              <select
                value={lead.assigned_to ?? ""}
                onChange={(e) => handleAgentAssign(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>{m.full_name ?? m.id}</option>
                ))}
              </select>
            </motion.div>

            {/* Site Visit Scheduling */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.09 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays size={14} className="text-[var(--accent)]" />
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider flex-1">
                  Site Visit
                </p>
                {visitSaved && <CheckCircle2 size={12} className="text-[var(--success)]" />}
              </div>
              {lead.visit_date && !visitSaved && (
                <p className="text-xs text-[var(--success)] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={11} />
                  Scheduled: {new Date(lead.visit_date).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              )}
              <input
                type="datetime-local"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors mb-2"
              />
              <button
                onClick={saveVisitDate}
                disabled={!visitDate || savingVisit}
                className="w-full py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
              >
                {savingVisit ? <Loader2 size={13} className="animate-spin" /> : <CalendarDays size={13} />}
                {lead.visit_date ? "Reschedule Visit" : "Schedule Visit"}
              </button>
            </motion.div>

            {/* Follow-up Reminder */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.095 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <BellRing size={14} className="text-[var(--accent)]" />
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider flex-1">
                  Follow-up Reminder
                </p>
                {followUpSaved && <CheckCircle2 size={12} className="text-[var(--success)]" />}
              </div>
              {lead.follow_up_at && !followUpSaved && (
                <p className="text-xs text-[var(--warning)] mb-2 flex items-center gap-1.5">
                  <BellRing size={11} />
                  Set: {new Date((lead as Lead & { follow_up_at?: string }).follow_up_at!).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              )}
              <input
                type="datetime-local"
                value={followUpAt}
                onChange={(e) => setFollowUpAt(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors mb-2"
              />
              <button
                onClick={saveFollowUp}
                disabled={!followUpAt || savingFollowUp}
                className="w-full py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
              >
                {savingFollowUp ? <Loader2 size={13} className="animate-spin" /> : <BellRing size={13} />}
                Set Reminder
              </button>
            </motion.div>

            {/* Commission (shown when stage = closed) */}
            {(lead.status === "closed" || commission) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.098 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign size={14} className="text-emerald-400" />
                  <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider flex-1">
                    Commission Earned
                  </p>
                  {commissionSaved && <CheckCircle2 size={12} className="text-[var(--success)]" />}
                </div>
                <div className="relative mb-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--foreground-muted)]">$</span>
                  <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
                <button
                  onClick={saveCommission}
                  disabled={!commission || savingCommission}
                  className="w-full py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                >
                  {savingCommission ? <Loader2 size={13} className="animate-spin" /> : <DollarSign size={13} />}
                  Save Commission
                </button>
              </motion.div>
            )}

            {/* AI Intelligence */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain size={14} className="text-[var(--accent)]" />
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider flex-1">
                  AI Analysis
                </p>
                {lead.ai_analyzed ? (
                  <CheckCircle2 size={12} className="text-[var(--success)]" />
                ) : (
                  <AlertCircle size={12} className="text-[var(--foreground-subtle)]" />
                )}
              </div>

              {analyzeError && (
                <p className="text-xs text-[var(--danger)] bg-[var(--danger)]/10 rounded-lg px-3 py-2 mb-3">
                  {analyzeError}
                </p>
              )}

              {lead.summary && (
                <p className="text-xs text-[var(--foreground-muted)] mb-3 leading-relaxed bg-[var(--accent-muted)] border border-[var(--accent)]/20 rounded-lg p-3">
                  {lead.summary}
                </p>
              )}

              {!lead.summary && lead.ai_analyzed && (
                <p className="text-xs text-[var(--foreground-subtle)] mb-3 italic">No summary extracted.</p>
              )}

              <div className="flex flex-col gap-2.5">
                {[
                  { icon: Wallet, label: "Budget", value: lead.budget },
                  { icon: MapPin, label: "Location", value: lead.location },
                  { icon: Home, label: "Property", value: lead.property_type },
                ].map(({ icon: Icon, label, value }) => value ? (
                  <div key={label} className="flex items-center gap-2.5">
                    <Icon size={13} className="text-[var(--foreground-subtle)] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[var(--foreground-subtle)] leading-none">{label}</p>
                      <p className="text-xs text-[var(--foreground)] font-medium">{value}</p>
                    </div>
                  </div>
                ) : null)}

                {lead.urgency && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--foreground-muted)]">Urgency</span>
                    <Badge variant={urgencyVariant[lead.urgency as LeadUrgency]}>{lead.urgency}</Badge>
                  </div>
                )}
                {lead.buyer_intent && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--foreground-muted)]">Intent</span>
                    <span className="text-xs font-medium text-[var(--foreground)]">
                      {intentLabel[lead.buyer_intent as BuyerIntent]}
                    </span>
                  </div>
                )}
              </div>

              {lead.raw_message && (
                <Button
                  size="sm"
                  variant={lead.ai_analyzed ? "secondary" : "primary"}
                  className="w-full mt-4"
                  onClick={runAIAnalysis}
                  disabled={analyzing}
                >
                  {analyzing
                    ? <><Loader2 size={13} className="animate-spin" /> Analyzing…</>
                    : lead.ai_analyzed
                    ? <><RefreshCw size={13} /> Re-analyze</>
                    : <><Brain size={13} /> Run AI Analysis</>
                  }
                </Button>
              )}
            </motion.div>

            {/* Notes */}
            {lead.notes && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
              >
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">Notes</p>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed whitespace-pre-wrap">{lead.notes}</p>
              </motion.div>
            )}
          </div>

          {/* MIDDLE → Activity Log (col-span 1 on large) */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
                <Activity size={14} className="text-[var(--accent)]" />
                <p className="text-sm font-semibold text-[var(--foreground)] flex-1">Activity Log</p>
              </div>
              {/* Add activity */}
              <div className="px-4 pt-3 pb-2 border-b border-[var(--border)]">
                <div className="flex gap-2 mb-2">
                  {([
                    { type: "note", icon: FileText, label: "Note" },
                    { type: "call", icon: PhoneCall, label: "Call" },
                    { type: "whatsapp", icon: MessageCircle, label: "WA" },
                    { type: "email", icon: Mail, label: "Email" },
                  ] as const).map(({ type, icon: Icon, label }) => (
                    <button key={type} onClick={() => setActivityType(type)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        activityType === type
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--surface-2)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      }`}>
                      <Icon size={10} /> {label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={activityNote}
                    onChange={(e) => setActivityNote(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addActivity()}
                    placeholder={activityType === "call" ? "Call outcome…" : activityType === "email" ? "Email summary…" : "Add a note…"}
                    className="flex-1 bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[var(--accent)] transition-colors"
                  />
                  <button onClick={addActivity} disabled={!activityNote.trim() || savingActivity}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
                    style={{ background: "var(--accent)" }}>
                    {savingActivity ? <Loader2 size={11} className="animate-spin" /> : <Plus size={13} />}
                  </button>
                </div>
              </div>
              {/* Timeline */}
              <div className="px-4 py-3 flex flex-col gap-2.5 max-h-[340px] overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-xs text-[var(--foreground-subtle)] text-center py-6">No activities logged yet</p>
                ) : activities.map((a) => {
                  const icons: Record<string, React.ReactNode> = {
                    call: <PhoneCall size={11} className="text-emerald-400" />,
                    email: <Mail size={11} className="text-blue-400" />,
                    whatsapp: <MessageCircle size={11} className="text-[#25D366]" />,
                    note: <FileText size={11} className="text-[var(--accent)]" />,
                    stage_change: <Activity size={11} className="text-amber-400" />,
                  };
                  return (
                    <div key={a.id} className="flex gap-2.5 items-start">
                      <div className="w-5 h-5 rounded-full bg-[var(--surface-2)] flex items-center justify-center shrink-0 mt-0.5 border border-[var(--border)]">
                        {icons[a.type] ?? icons.note}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-[var(--foreground)] leading-snug">{a.content}</p>
                        <p className="text-[10px] text-[var(--foreground-subtle)] mt-0.5">{timeAgo(a.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* RIGHT column */}
          <div className="lg:col-span-2 flex flex-col gap-4 min-w-0">

            {/* Raw message */}
            {lead.raw_message && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
              >
                <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
                  Original Message
                </p>
                <p className="text-sm text-[var(--foreground)] leading-relaxed bg-[var(--surface-2)] rounded-lg p-4 border border-[var(--border)] whitespace-pre-wrap">
                  &ldquo;{lead.raw_message}&rdquo;
                </p>
              </motion.div>
            )}

            {/* Property Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-[var(--accent)]" />
                  <p className="text-sm font-semibold text-[var(--foreground)]">Matching Properties</p>
                </div>
                <button
                  onClick={fetchRecommendations}
                  disabled={loadingRecs}
                  className="p-1.5 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <RefreshCw size={13} className={loadingRecs ? "animate-spin" : ""} />
                </button>
              </div>

              {loadingRecs ? (
                <div className="flex flex-col gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-[var(--surface-2)] rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 size={24} className="text-[var(--foreground-subtle)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {lead.ai_analyzed
                      ? "No matching properties found. Add properties to see recommendations."
                      : "Run AI Analysis first to get property recommendations."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recommendations.map((prop, i) => (
                    <Link href={`/dashboard/properties/${prop.id}`} key={prop.id}>
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/40 hover:bg-[var(--surface-3)] transition-all group"
                      >
                        {/* Image or placeholder */}
                        <div className="w-12 h-12 rounded-lg bg-[var(--surface-3)] shrink-0 overflow-hidden flex items-center justify-center">
                          {prop.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 size={18} className="text-[var(--foreground-subtle)]" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)] truncate group-hover:text-[var(--accent)] transition-colors">
                            {prop.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs font-semibold text-[var(--accent)]">{formatPrice(prop.price)}</span>
                            <span className="text-[10px] text-[var(--foreground-subtle)] flex items-center gap-1">
                              <BedDouble size={9} /> {prop.bedrooms}
                            </span>
                            <span className="text-[10px] text-[var(--foreground-subtle)] flex items-center gap-1">
                              <Maximize2 size={9} /> {prop.area} sqft
                            </span>
                            <span className="text-[10px] text-[var(--foreground-subtle)] flex items-center gap-1">
                              <MapPin size={9} /> {prop.city ?? prop.location}
                            </span>
                          </div>
                        </div>

                        {/* Match badges */}
                        <div className="flex flex-col gap-1 shrink-0">
                          {prop.match_reasons.slice(0, 2).map((r) => (
                            <span key={r} className="text-[9px] bg-[var(--accent-muted)] text-[var(--accent)] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                              {r}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Conversation thread */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl flex flex-col flex-1 min-h-[400px]"
            >
              <div className="px-5 py-4 border-b border-[var(--border)]">
                <p className="text-sm font-semibold text-[var(--foreground)]">Conversation</p>
                <p className="text-xs text-[var(--foreground-muted)]">{messages.length} message{messages.length !== 1 ? "s" : ""}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[280px]">
                {messages.length === 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-[var(--foreground-subtle)]">No messages yet. Start the conversation.</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.direction === "outbound"
                          ? "bg-[var(--accent)] text-white rounded-br-sm"
                          : "bg-[var(--surface-2)] text-[var(--foreground)] border border-[var(--border)] rounded-bl-sm"
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p className={`text-[10px] mt-1 ${msg.direction === "outbound" ? "text-white/60" : "text-[var(--foreground-subtle)]"}`}>
                        {timeAgo(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={msgEndRef} />
              </div>

              {/* AI generate follow-up */}
              <div className="px-4 pt-2 flex justify-end">
                <button
                  onClick={generateFollowup}
                  disabled={generatingFollowup}
                  className="flex items-center gap-1.5 text-[10px] text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors disabled:opacity-50"
                >
                  {generatingFollowup
                    ? <Loader2 size={10} className="animate-spin" />
                    : <Sparkles size={10} />
                  }
                  {generatingFollowup ? "Generating…" : "AI Draft Follow-up"}
                </button>
              </div>

              <div className="px-4 pb-3 pt-1.5 flex items-center gap-2">
                <input
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type a message or follow-up note…"
                  className="flex-1 bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] transition-colors"
                />
                <Button size="sm" onClick={sendMessage} disabled={!newMsg.trim() || sendingMsg}>
                  {sendingMsg ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <LeadFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
        initial={lead}
      />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Lead"
        message={`Delete "${lead.name}"? All conversations will also be removed.`}
        confirmLabel="Delete Lead"
      />
    </div>
  );
}
