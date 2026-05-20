"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-sm"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Reset password</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          We&apos;ll send a reset link to your email.
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-7">
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 text-center py-4"
          >
            <CheckCircle size={40} className="text-[var(--success)]" />
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)] mb-1">Check your email</p>
              <p className="text-xs text-[var(--foreground-muted)]">
                We sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
            <Link href="/login">
              <Button variant="secondary" size="sm">
                <ArrowLeft size={13} /> Back to login
              </Button>
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@agency.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            {error && (
              <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={15} className="animate-spin" /> : "Send Reset Link"}
            </Button>

            <Link href="/login" className="flex items-center justify-center gap-1.5 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors mt-1">
              <ArrowLeft size={12} /> Back to login
            </Link>
          </form>
        )}
      </div>
    </motion.div>
  );
}
