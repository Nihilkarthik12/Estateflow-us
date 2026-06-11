"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, User, Mail, Lock, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.fullName } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Sign up failed.");

      // Create profile row via admin API
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authData.user.id, fullName: form.fullName }),
      });

      // No session means email confirmation is required
      if (!authData.session) {
        setError("__confirm__");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      if (message.toLowerCase().includes("failed to fetch")) {
        setError("Cannot reach Supabase. Check your internet connection and that NEXT_PUBLIC_SB_URL is set.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  // Email confirmation required — show success state
  if (error === "__confirm__") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex flex-col items-center text-center gap-5 py-8"
      >
        <CheckCircle size={48} className="text-[var(--success)]" />
        <div>
          <p className="text-xl font-bold text-[var(--foreground)] mb-2">Check your email</p>
          <p className="text-sm text-[var(--foreground-muted)] max-w-xs">
            We sent a confirmation link to <strong>{form.email}</strong>. Click it to activate your account.
          </p>
        </div>
        <Link href="/login" className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors">
          Back to sign in →
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full"
    >
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-1.5">
          Already a member?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div
        className="rounded-2xl p-6 border border-[var(--border-strong)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%), var(--surface-2)",
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="Your name"
            value={form.fullName}
            onChange={set("fullName")}
            required
            autoFocus
            leftIcon={<User size={15} />}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={set("email")}
            required
            autoComplete="email"
            leftIcon={<Mail size={15} />}
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={set("password")}
            minLength={8}
            required
            autoComplete="new-password"
            leftIcon={<Lock size={15} />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl text-sm text-[var(--danger)] bg-[var(--danger-muted)] border border-[rgba(239,68,68,0.2)]"
            >
              {error}
            </motion.div>
          )}

          <Button type="submit" size="lg" className="w-full mt-1" disabled={loading}>
            {loading ? (
              <><Loader2 size={14} className="animate-spin" /> Creating account…</>
            ) : (
              <>Create Account <ArrowRight size={14} /></>
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-xs mt-5 text-[var(--foreground-subtle)]">
        By signing up, you agree to our Terms &amp; Privacy Policy.
      </p>
    </motion.div>
  );
}
