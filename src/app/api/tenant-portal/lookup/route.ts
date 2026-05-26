import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Find tenant by phone (try exact and without +91 prefix)
  const cleaned = phone.replace(/\s+/g, "").replace(/^\+91/, "");
  const { data: tenant } = await supabase
    .from("tenants")
    .select("*")
    .or(`phone.eq.${phone},phone.eq.+91${cleaned},phone.eq.${cleaned}`)
    .single();

  if (!tenant) return NextResponse.json({ error: "No tenant found with this phone number." }, { status: 404 });

  // Get lease
  const { data: lease } = await supabase
    .from("leases")
    .select("start_date, end_date, monthly_rent, status")
    .eq("tenant_id", tenant.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Get maintenance tickets
  const { data: tickets } = await supabase
    .from("maintenance_tickets")
    .select("id, title, status, priority, created_at")
    .eq("tenant_id", tenant.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Get linked property
  const property = tenant.property_id
    ? (await supabase.from("properties").select("title, location, city").eq("id", tenant.property_id).single()).data
    : null;

  return NextResponse.json({ tenant, lease: lease ?? null, tickets: tickets ?? [], property });
}
