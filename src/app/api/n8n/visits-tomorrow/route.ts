import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const { data: visits } = await supabase
    .from("visits")
    .select("*, properties(title, location, city)")
    .eq("visit_date", tomorrowStr)
    .eq("status", "scheduled");

  return NextResponse.json({ visits: visits ?? [], count: (visits ?? []).length });
}
