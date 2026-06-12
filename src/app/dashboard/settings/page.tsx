"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, MessageCircle, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/provider";

export default function SettingsPage() {
  const { user, profile } = useAuth();

  // Profile form
  const [profileForm, setProfileForm] = useState({ full_name: "", phone: "", whatsapp: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (profile) setProfileForm({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      whatsapp: profile.whatsapp ?? "",
    });
  }, [profile]);

  async function saveProfile() {
    if (!user?.id) return;
    setProfileSaving(true);
    const supabase = createClient();
    await supabase.from("profiles").update({
      full_name: profileForm.full_name,
      phone: profileForm.phone,
      whatsapp: profileForm.whatsapp,
    }).eq("id", user.id);
    setProfileSaving(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  const initials = (name: string | null) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Settings" subtitle="Manage your profile and integrations" />

      <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto">
        <div className="max-w-3xl flex flex-col gap-5">

          {/* Profile */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User size={15} className="text-[var(--accent)]" />
                  <CardTitle>Your Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xl font-bold shrink-0">
                      {initials(profile?.full_name ?? null)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{profile?.full_name ?? "—"}</p>
                      <p className="text-xs text-[var(--foreground-muted)]">Owner</p>
                      <p className="text-xs text-[var(--foreground-subtle)]">{user?.email}</p>
                    </div>
                  </div>
                  <Input
                    label="Full Name"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm(f => ({ ...f, full_name: e.target.value }))}
                    placeholder="Your full name"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Phone size={11} className="text-[var(--accent)]" />
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-subtle)]">Phone (for tenants)</label>
                      </div>
                      <Input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+1 555 000 0000"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <MessageCircle size={11} style={{ color: "#25D366" }} />
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--foreground-subtle)]">WhatsApp (for tenants)</label>
                      </div>
                      <Input
                        value={profileForm.whatsapp}
                        onChange={(e) => setProfileForm(f => ({ ...f, whatsapp: e.target.value }))}
                        placeholder="+1 555 000 0000"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[var(--foreground-subtle)]">Tenants see these numbers on their portal to contact you.</p>
                  <div className="flex items-center gap-3">
                    <Button size="sm" onClick={saveProfile} disabled={profileSaving}>
                      {profileSaving ? <><Loader2 size={13} className="animate-spin" /> Saving…</> : "Save Profile"}
                    </Button>
                    {profileSaved && (
                      <span className="flex items-center gap-1.5 text-xs text-[var(--success)]">
                        <CheckCircle2 size={13} /> Saved
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Integrations / Quick Links */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardHeader>
                <CardTitle>Integrations &amp; Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Public Lead Capture Form", href: "/submit-lead", desc: "Share this URL to capture leads from your website or social bio" },
                    { label: "Book a Showing (Public)", href: "/book-visit", desc: "Share this URL so buyers can book property showings themselves" },
                    { label: "Tenant Portal", href: "/tenant-portal", desc: "Share this URL with tenants — they can view lease, raise maintenance requests" },
                    { label: "Property Listings (Public)", href: "/listings", desc: "Public page showing all available properties with filters" },
                    { label: "n8n Automation Setup Guide", href: "https://github.com", desc: "See n8n/SETUP.md in your project for step-by-step automation setup" },
                    { label: "Supabase Dashboard", href: "https://supabase.com/dashboard", desc: "Manage your database, storage, and authentication" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="flex items-start justify-between gap-4 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors group"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{link.label}</p>
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{link.desc}</p>
                      </div>
                      <ExternalLink size={13} className="text-[var(--foreground-subtle)] shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
