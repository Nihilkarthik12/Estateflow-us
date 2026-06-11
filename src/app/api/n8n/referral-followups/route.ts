import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// n8n calls this daily — returns leads that closed exactly 30 days ago,
// so we can ask the happy client for referrals.
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Referral ask fires for deals closed within the last 35 days.
  // Uses updated_at as the close-date proxy (trigger stamps it when status → closed).
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 35);

  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, location, property_type")
    .eq("status", "closed")
    .not("phone", "is", null)
    .gte("updated_at", cutoff.toISOString());

  if (!leads || leads.length === 0) {
    return NextResponse.json({ leads: [], count: 0 });
  }

  return NextResponse.json({ leads, count: leads.length });
}
