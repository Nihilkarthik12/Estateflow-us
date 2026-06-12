import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get("lead_id");
  if (!leadId) return NextResponse.json({ error: "lead_id required" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activities: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { lead_id, type, content } = body;
  if (!lead_id || !type) return NextResponse.json({ error: "lead_id and type required" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_activities")
    .insert({ lead_id, type, content: content ?? "" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ activity: data }, { status: 201 });
}
