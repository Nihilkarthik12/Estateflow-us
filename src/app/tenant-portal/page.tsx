"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, Phone, Loader2, FileText, Wrench, CalendarCheck,
  CheckCircle2, Plus, Send, MessageCircle, DollarSign,
  Clock, AlertTriangle, Download, X,
} from "lucide-react";
import Link from "next/link";

interface TenantData {
  tenant: { id: string; name: string; email: string; phone: string; unit_number: string; status: string };
  lease: {
    start_date: string; end_date: string; monthly_rent: number; status: string;
    documents?: { name: string; url: string }[];
  } | null;
  tickets: { id: string; title: string; status: string; priority: string; created_at: string }[];
  property: { title: string; location: string; city: string; phone?: string; whatsapp?: string } | null;
  agent: { phone: string | null; whatsapp: string | null; name: string | null } | null;
}

interface RentPayment {
  id: string; amount: number; due_date: string; paid_date: string | null; status: string;
}

function getNextDueDate(lease: TenantData["lease"]): { date: Date; daysLeft: number } | null {
  if (!lease) return null;
  const start = new Date(lease.start_date);
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), start.getDate());
  if (next <= now) next.setMonth(next.getMonth() + 1);
  const daysLeft = Math.ceil((next.getTime() - now.getTime()) / 86400000);
  return { date: next, daysLeft };
}

export default function TenantPortalPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TenantData | null>(null);
  const [tab, setTab] = useState<"overview" | "maintenance" | "payments">("overview");
  const [ticketForm, setTicketForm] = useState({ title: "", description: "", category: "general" });
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [payments, setPayments] = useState<RentPayment[]>([]);

  useEffect(() => {
    if (!data) return;
    fetch(`/api/tenant-portal/rent-payments?tenant_id=${data.tenant.id}`)
      .then(r => r.json())
      .then(j => setPayments(j.payments ?? []));
  }, [data]);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true); setError("");
    const res = await fetch(`/api/tenant-portal/lookup?phone=${encodeURIComponent(phone.trim())}`);
    const json = await res.json();
    setLoading(false);
    if (!res.ok || json.error) { setError(json.error ?? "Tenant not found. Please check your phone number."); return; }
    setData(json);
  }

  async function handleTicketSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ticketForm.title || !data) return;
    setTicketLoading(true);
    const res = await fetch("/api/tenant-portal/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...ticketForm, tenant_id: data.tenant.id }),
    });
    setTicketLoading(false);
    if (res.ok) {
      setTicketSuccess(true);
      setTicketForm({ title: "", description: "", category: "general" });
      setTimeout(() => setTicketSuccess(false), 3000);
      const json = await fetch(`/api/tenant-portal/lookup?phone=${encodeURIComponent(phone)}`).then(r => r.json());
      if (!json.error) setData(json);
    }
  }

  const nextDue = data?.lease ? getNextDueDate(data.lease) : null;
  const daysLeft = data?.lease?.end_date
    ? Math.ceil((new Date(data.lease.end_date).getTime() - Date.now()) / 86400000)
    : null;

  const statusColor = (s: string) =>
    s === "paid" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : s === "overdue" ? "text-red-400 bg-red-500/10 border-red-500/20"
    : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  const ticketStatusColor = (s: string) =>
    s === "resolved" ? "bg-emerald-500/10 text-emerald-400"
    : s === "in_progress" ? "bg-[var(--accent)]/10 text-[var(--accent)]"
    : "bg-amber-500/10 text-amber-400";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=60"
        alt="" className="fixed inset-0 w-full h-full object-cover opacity-[0.06] pointer-events-none" />

      <header className="relative z-10 sticky top-0"
        style={{ background: "rgba(10,14,22,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #5b8def, #3b82f6)", boxShadow: "0 4px 14px rgba(91,141,239,0.4)" }}>
              <Building2 size={15} className="text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
              Estate<span style={{ background: "linear-gradient(135deg,#5b8def,#85aef5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Flow</span>
            </span>
          </Link>
          {data ? (
            <div className="flex items-center gap-3">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Tenant Portal</span>
              <button onClick={() => setData(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <X size={13} />
              </button>
            </div>
          ) : (
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Tenant Portal</span>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-5 py-10">
        <AnimatePresence mode="wait">

          {/* ── LOGIN ── */}
          {!data ? (
            <motion.div key="login" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                  style={{ background: "linear-gradient(135deg, #5b8def, #3b82f6)", boxShadow: "0 8px 32px rgba(91,141,239,0.35)" }}>
                  <Building2 size={28} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: "rgba(255,255,255,0.92)" }}>Tenant Portal</h1>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Enter your registered phone number to access your portal.
                </p>
              </div>
              <form onSubmit={handleLookup}
                className="flex flex-col gap-4 max-w-sm mx-auto p-6 rounded-2xl"
                style={{ background: "rgba(15,21,32,0.8)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" required
                      className="w-full pl-9 rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }} />
                  </div>
                </div>
                {error && (
                  <p className="text-xs flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
                    <AlertTriangle size={12} /> {error}
                  </p>
                )}
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #5b8def, #3b82f6)", boxShadow: "0 4px 14px rgba(91,141,239,0.3)" }}>
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Phone size={15} />}
                  {loading ? "Looking up…" : "Access My Portal"}
                </button>
              </form>
            </motion.div>

          ) : (

            /* ── PORTAL ── */
            <motion.div key="portal" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">

              {/* Profile card */}
              <div className="rounded-2xl p-5 flex items-center gap-4"
                style={{ background: "rgba(15,21,32,0.8)", border: "1px solid rgba(91,141,239,0.18)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                  style={{ background: "linear-gradient(135deg, #5b8def, #3b82f6)", boxShadow: "0 4px 14px rgba(91,141,239,0.35)" }}>
                  {data.tenant.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: "rgba(255,255,255,0.9)" }}>{data.tenant.name}</p>
                  {data.tenant.unit_number && (
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Unit {data.tenant.unit_number}</p>
                  )}
                  {data.property && (
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{data.property.title}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400">Active</span>
                </div>
              </div>

              {/* Next rent due banner */}
              {nextDue && data.lease && (
                <div className="rounded-2xl p-4 flex items-center gap-4"
                  style={{
                    background: nextDue.daysLeft <= 3 ? "rgba(248,113,113,0.08)" : nextDue.daysLeft <= 7 ? "rgba(251,191,36,0.08)" : "rgba(91,141,239,0.08)",
                    border: `1px solid ${nextDue.daysLeft <= 3 ? "rgba(248,113,113,0.25)" : nextDue.daysLeft <= 7 ? "rgba(251,191,36,0.25)" : "rgba(91,141,239,0.2)"}`,
                  }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: nextDue.daysLeft <= 3 ? "rgba(248,113,113,0.15)" : nextDue.daysLeft <= 7 ? "rgba(251,191,36,0.15)" : "rgba(91,141,239,0.15)",
                    }}>
                    <DollarSign size={18}
                      style={{ color: nextDue.daysLeft <= 3 ? "#f87171" : nextDue.daysLeft <= 7 ? "#fbbf24" : "#5b8def" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>NEXT RENT DUE</p>
                    <p className="text-lg font-bold" style={{ color: "rgba(255,255,255,0.9)" }}>
                      ${data.lease.monthly_rent.toLocaleString("en-US")}
                    </p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {nextDue.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{
                      color: nextDue.daysLeft <= 3 ? "#f87171" : nextDue.daysLeft <= 7 ? "#fbbf24" : "#5b8def",
                    }}>{nextDue.daysLeft}d</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>remaining</p>
                  </div>
                </div>
              )}

              {/* Lease summary */}
              {data.lease && (
                <div className="rounded-2xl p-5"
                  style={{ background: "rgba(15,21,32,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={14} style={{ color: "#5b8def" }} />
                    <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>Active Lease</h2>
                    {daysLeft !== null && daysLeft <= 30 && daysLeft >= 0 && (
                      <span className="text-xs ml-auto flex items-center gap-1" style={{ color: "#fbbf24" }}>
                        <AlertTriangle size={10} /> Expires in {daysLeft} days
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Monthly Rent", value: `$${data.lease.monthly_rent.toLocaleString("en-US")}` },
                      { label: "Lease Start", value: new Date(data.lease.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                      { label: "Lease End", value: new Date(data.lease.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl p-3"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</p>
                        <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Documents */}
                  {data.lease.documents && data.lease.documents.length > 0 && (
                    <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Documents</p>
                      <div className="flex flex-col gap-2">
                        {data.lease.documents.map((doc) => (
                          <a key={doc.name} href={doc.url} target="_blank" rel="noreferrer"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors"
                            style={{ background: "rgba(91,141,239,0.07)", border: "1px solid rgba(91,141,239,0.15)" }}>
                            <Download size={12} style={{ color: "#5b8def" }} />
                            <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{doc.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Contact agent */}
              <div className="rounded-2xl p-4 flex items-center justify-between gap-3"
                style={{ background: "rgba(15,21,32,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>Need help?</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Reach your property manager directly</p>
                </div>
                <div className="flex gap-2">
                  {(data.agent?.phone || data.property?.phone) && (
                    <a href={`tel:${data.agent?.phone ?? data.property?.phone}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                      style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }}>
                      <Phone size={12} /> Call
                    </a>
                  )}
                  {(data.agent?.whatsapp || data.property?.whatsapp) && (
                    <a href={`https://wa.me/${(data.agent?.whatsapp ?? data.property?.whatsapp ?? "").replace(/\D/g, "")}?text=Hi%2C+I%27m+a+tenant+and+need+help`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                      style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", color: "#25D366" }}>
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                  )}
                  {!data.agent?.phone && !data.property?.phone && !data.agent?.whatsapp && !data.property?.whatsapp && (
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Contact details coming soon</span>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-xl"
                style={{ background: "rgba(15,21,32,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {([
                  { key: "overview", label: "My Tickets", icon: Wrench },
                  { key: "maintenance", label: "New Request", icon: Plus },
                  { key: "payments", label: "Payments", icon: DollarSign },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setTab(key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      tab === key ? "text-white" : "hover:text-white"
                    }`}
                    style={tab === key ? { background: "linear-gradient(135deg, #5b8def, #3b82f6)" } : { color: "rgba(255,255,255,0.4)" }}>
                    <Icon size={12} /> {label}
                  </button>
                ))}
              </div>

              {/* Tickets list */}
              {tab === "overview" && (
                <div className="flex flex-col gap-2.5">
                  {data.tickets.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl"
                      style={{ background: "rgba(15,21,32,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <CalendarCheck size={28} className="mx-auto mb-2" style={{ color: "rgba(255,255,255,0.2)" }} />
                      <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>No maintenance requests yet.</p>
                    </div>
                  ) : data.tickets.map((t) => (
                    <div key={t.id} className="rounded-xl p-4"
                      style={{ background: "rgba(15,21,32,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{t.title}</p>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${ticketStatusColor(t.status)}`}>
                          {t.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                        <Clock size={10} />
                        {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit request */}
              {tab === "maintenance" && (
                <form onSubmit={handleTicketSubmit} className="rounded-2xl p-5 flex flex-col gap-4"
                  style={{ background: "rgba(15,21,32,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h2 className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>Submit Maintenance Request</h2>
                  {ticketSuccess && (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm px-3 py-2 rounded-xl"
                      style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                      <CheckCircle2 size={14} /> Request submitted successfully!
                    </div>
                  )}
                  {(["Issue Title *", "Category", "Description"] as const).map((_, i) => {
                    if (i === 0) return (
                      <div key="title">
                        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Issue Title *</label>
                        <input value={ticketForm.title} onChange={(e) => setTicketForm(f => ({ ...f, title: e.target.value }))}
                          placeholder="e.g. Water leakage in bathroom" required
                          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" }} />
                      </div>
                    );
                    if (i === 1) return (
                      <div key="cat">
                        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Category</label>
                        <select value={ticketForm.category} onChange={(e) => setTicketForm(f => ({ ...f, category: e.target.value }))}
                          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }}>
                          {["general","plumbing","electrical","carpentry","cleaning","security"].map(c => (
                            <option key={c} value={c} className="bg-[#0f1520] capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    );
                    return (
                      <div key="desc">
                        <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Description</label>
                        <textarea rows={3} value={ticketForm.description} onChange={(e) => setTicketForm(f => ({ ...f, description: e.target.value }))}
                          placeholder="Describe the issue in detail…" className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors resize-none"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }} />
                      </div>
                    );
                  })}
                  <button type="submit" disabled={ticketLoading || !ticketForm.title}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, #5b8def, #3b82f6)", boxShadow: "0 4px 14px rgba(91,141,239,0.3)" }}>
                    {ticketLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    Submit Request
                  </button>
                </form>
              )}

              {/* Rent payment history */}
              {tab === "payments" && (
                <div className="flex flex-col gap-3">
                  {payments.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl"
                      style={{ background: "rgba(15,21,32,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <DollarSign size={28} className="mx-auto mb-2" style={{ color: "rgba(255,255,255,0.2)" }} />
                      <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>No payment records yet</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Your rent history will appear here once recorded</p>
                    </div>
                  ) : payments.map((p) => (
                    <div key={p.id} className="rounded-xl p-4 flex items-center gap-3"
                      style={{ background: "rgba(15,21,32,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: p.status === "paid" ? "rgba(74,222,128,0.12)" : p.status === "overdue" ? "rgba(248,113,113,0.12)" : "rgba(251,191,36,0.12)",
                        }}>
                        <DollarSign size={15}
                          style={{ color: p.status === "paid" ? "#4ade80" : p.status === "overdue" ? "#f87171" : "#fbbf24" }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>${p.amount.toLocaleString("en-US")}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                          Due: {new Date(p.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {p.paid_date && ` · Paid: ${new Date(p.paid_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                        </p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColor(p.status)}`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
