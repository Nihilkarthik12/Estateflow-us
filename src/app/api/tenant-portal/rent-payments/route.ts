import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const tenantId = req.nextUrl.searchParams.get("tenant_id");
  if (!tenantId) return NextResponse.json({ error: "tenant_id required" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rent_payments")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("due_date", { ascending: false })
    .limit(12);

  if (error) {
    // Table may not exist yet — return empty array gracefully
    return NextResponse.json({ payments: [] });
  }
  return NextResponse.json({ payments: data ?? [] });
}
