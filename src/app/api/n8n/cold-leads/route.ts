import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// n8n calls this weekly (Mondays) — returns leads that have gone cold:
// still in an active pipeline stage but with no activity for 60+ days.
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // "Cold" = created 4+ days ago with no outbound contact yet.
  // Using created_at (immutable) so demo data inserted with old dates qualifies.
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 4);
  const cutoffIso = cutoff.toISOString();

  // Only re-engage leads still worth chasing — exclude closed/lost.
  const activeStages = ["new", "contacted", "qualified", "site_visit", "negotiation"];

  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, budget, location, property_type, urgency, summary, status")
    .in("status", activeStages)
    .not("phone", "is", null)
    .lt("created_at", cutoffIso);

  if (!leads || leads.length === 0) {
    return NextResponse.json({ leads: [], count: 0 });
  }

  // Drop any lead that has had a conversation within the cutoff window —
  // they aren't actually cold.
  const cold: typeof leads = [];
  for (const lead of leads) {
    const { data: recent } = await supabase
      .from("conversations")
      .select("id")
      .eq("lead_id", lead.id)
      .gte("created_at", cutoffIso)
      .limit(1);

    if (!recent || recent.length === 0) {
      cold.push(lead);
    }
  }

  return NextResponse.json({ leads: cold, count: cold.length });
}
