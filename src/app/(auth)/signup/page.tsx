"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Building2,
  User,
  Mail,
  Lock,
  MapPin,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    agencyName: "",
    city: "",
    fullName: "",
    email: "",
    password: "",
  });
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

      // Use server API to create org + update profile (avoids RLS 401)
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: authData.user.id,
          agencyName: form.agencyName,
          city: form.city,
          fullName: form.fullName,
        }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);

      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      if (message.toLowerCase().includes("failed to fetch")) {
        setError(
          "Cannot reach Supabase. Check your internet connection and that NEXT_PUBLIC_SUPABASE_URL is set in .env.local."
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
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

      <div className="flex items-center gap-2 mb-7">
        {([1, 2] as const).map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0"
              style={
                step > s
                  ? { background: "var(--success)", color: "white" }
                  : step === s
                    ? {
                        background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
                        color: "white",
                        boxShadow: "0 0 12px var(--accent-glow)",
                      }
                    : {
                        background: "var(--surface-3)",
                        color: "var(--foreground-subtle)",
                        border: "1px solid var(--border-strong)",
                      }
              }
            >
              {step > s ? <Check size={13} /> : s}
            </div>
            <span
              className="text-xs font-medium"
              style={{ color: step >= s ? "var(--foreground)" : "var(--foreground-subtle)" }}
            >
              {s === 1 ? "Agency" : "Account"}
            </span>
            {s < 2 && (
              <div
                className="flex-1 h-px mx-1 rounded-full transition-all duration-500"
                style={{ background: step > s ? "var(--accent)" : "var(--border-strong)" }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-6 border border-[var(--border-strong)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%), var(--surface-2)",
        }}
      >
        <form
          onSubmit={
            step === 1
              ? (e) => {
                  e.preventDefault();
                  setStep(2);
                }
              : handleSubmit
          }
        >
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col gap-4"
              >
                <Input
                  label="Agency Name"
                  placeholder="Prestige Real Estate"
                  value={form.agencyName}
                  onChange={set("agencyName")}
                  required
                  autoFocus
                  leftIcon={<Building2 size={15} />}
                />
                <Input
                  label="City"
                  placeholder="Chennai"
                  value={form.city}
                  onChange={set("city")}
                  required
                  leftIcon={<MapPin size={15} />}
                />
                <Button type="submit" size="lg" className="w-full mt-1">
                  Continue <ArrowRight size={15} />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col gap-4"
              >
                <Input
                  label="Full Name"
                  placeholder="Arjun Kumar"
                  value={form.fullName}
                  onChange={set("fullName")}
                  required
                  autoFocus
                  leftIcon={<User size={15} />}
                />
                <Input
                  label="Work Email"
                  type="email"
                  placeholder="arjun@yourcompany.com"
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

                <div className="flex gap-3 mt-1">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className={cn("flex-[2]")}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Creating…
                      </>
                    ) : (
                      <>
                        Create Account <ArrowRight size={14} />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <p className="text-center text-xs mt-5 text-[var(--foreground-subtle)]">
        By signing up, you agree to our Terms & Privacy Policy.
      </p>
    </motion.div>
  );
}
