import { NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let query = supabase
    .from("properties")
    .select("id, title, location, city, price, bedrooms, property_type")
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: properties } = await query;
  return NextResponse.json({ properties: properties ?? [] });
}