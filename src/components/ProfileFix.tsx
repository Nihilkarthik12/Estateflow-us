"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProfileFix() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    agencyName: "",
    city: "",
    fullName: "",
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleFix() {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated");
        return;
      }

      const response = await fetch("/api/fix-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          agencyName: form.agencyName,
          city: form.city,
          fullName: form.fullName,
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        // Refresh the page after a short delay
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="p-4 bg-[var(--success)]/10 border border-[var(--success)] rounded-lg">
        <div className="flex items-center gap-2 text-[var(--success)]">
          <CheckCircle size={16} />
          <span className="font-medium">Profile fixed successfully!</span>
        </div>
        <p className="text-sm text-[var(--foreground-muted)] mt-1">
          Your profile has been created. The page will refresh automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[var(--danger)]/10 border border-[var(--danger)] rounded-lg">
      <div className="flex items-center gap-2 text-[var(--danger)] mb-3">
        <AlertTriangle size={16} />
        <span className="font-medium">Profile Setup Required</span>
      </div>

      <p className="text-sm text-[var(--foreground-muted)] mb-4">
        Your user profile needs to be set up before you can add tenants or manage properties.
      </p>

      <div className="space-y-3">
        <Input
          label="Agency Name"
          placeholder="Your real estate agency"
          value={form.agencyName}
          onChange={set("agencyName")}
          required
        />
        <Input
          label="City"
          placeholder="Your city"
          value={form.city}
          onChange={set("city")}
        />
        <Input
          label="Full Name"
          placeholder="Your full name"
          value={form.fullName}
          onChange={set("fullName")}
        />

        {error && (
          <div className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <Button
          onClick={handleFix}
          disabled={loading || !form.agencyName}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Fixing Profile...
            </>
          ) : (
            "Fix Profile"
          )}
        </Button>
      </div>
    </div>
  );
}