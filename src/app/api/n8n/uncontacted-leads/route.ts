import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// n8n calls this every 30 min — returns leads created 1-3 hours ago still in "new" status (no outbound contact yet)
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

  // Leads created 1–3 hours ago that are still "new"
  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, email, budget, location, property_type, urgency, source, created_at")
    .eq("status", "new")
    .not("phone", "is", null)
    .gte("created_at", threeHoursAgo.toISOString())
    .lte("created_at", oneHourAgo.toISOString());

  if (!leads || leads.length === 0) {
    return NextResponse.json({ leads: [], count: 0 });
  }

  // Filter out any that already have an outbound message
  const uncontacted = [];
  for (const lead of leads) {
    const { data: msg } = await supabase
      .from("conversations")
      .select("id")
      .eq("lead_id", lead.id)
      .eq("direction", "outbound")
      .limit(1)
      .single();

    if (!msg) uncontacted.push(lead);
  }

  return NextResponse.json({ leads: uncontacted, count: uncontacted.length });
}
