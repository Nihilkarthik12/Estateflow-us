import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { sanitizeField } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  const { allowed } = rateLimit(`demo-request:${getIP(req)}`, 5, 10 * 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await req.json();

    const name      = sanitizeField(body.name,      150);
    const email     = sanitizeField(body.email,     200);
    const phone     = sanitizeField(body.phone,     20);
    const brokerage = sanitizeField(body.brokerage, 200);

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "name, email and phone are required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        name,
        email,
        phone,
        raw_message: `Demo request from ${brokerage || "unknown brokerage"} — ${name} (${email})`,
        notes:       brokerage ? `Brokerage: ${brokerage}` : undefined,
        source:      "web_form",
        status:      "new",
        urgency:     "high",
        buyer_intent: "serious",
        ai_analyzed: false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Notify dashboard users
    const { data: users } = await supabase.from("profiles").select("id");
    if (users && users.length > 0) {
      await supabase.from("notifications").insert(
        users.map((u) => ({
          user_id: u.id,
          message: `🔥 Demo request: ${name}${brokerage ? " · " + brokerage : ""} (${phone})`,
          type:    "lead",
          link:    `/dashboard/leads/${lead.id}`,
          read:    false,
        }))
      );
    }

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
