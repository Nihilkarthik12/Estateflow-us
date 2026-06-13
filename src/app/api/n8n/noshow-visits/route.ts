import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// n8n calls this at 2PM and 7PM — returns visits scheduled today that are 2+ hours past their time with no stage update
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
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  // Leads with a visit_date today that is 2+ hours in the past and still in "site_visit" stage
  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, email, visit_date, location, property_type, budget")
    .eq("status", "site_visit")
    .not("phone", "is", null)
    .not("visit_date", "is", null)
    .gte("visit_date", todayStart.toISOString())
    .lte("visit_date", twoHoursAgo.toISOString());

  return NextResponse.json({ leads: leads ?? [], count: (leads ?? []).length });
}
