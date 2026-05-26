import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitor_name, visitor_phone, visitor_email, property_id, visit_date, visit_time } = body;

    if (!visitor_name || !visitor_phone || !visit_date) {
      return NextResponse.json({ error: "Name, phone and date are required." }, { status: 400 });
    }

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: visit, error } = await supabase
      .from("visits")
      .insert({
        property_id: property_id || null,
        visitor_name,
        visitor_phone,
        visitor_email: visitor_email || null,
        visit_date,
        visit_time: visit_time ?? "10:00",
        status: "scheduled",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Notify all users (since single-user system)
    const { data: users } = await supabase
      .from("profiles")
      .select("id");

    if (users && users.length > 0) {
      await supabase.from("notifications").insert(
        users.map((u) => ({
          user_id: u.id,
          message: `New site visit booked: ${visitor_name} (${visitor_phone}) on ${visit_date} at ${visit_time}`,
          type: "info",
          link: `/dashboard/visits`,
          read: false,
        }))
      );
    }

    // Trigger n8n visit confirmation webhook if configured
    if (process.env.N8N_VISIT_CONFIRMATION_WEBHOOK) {
      fetch(process.env.N8N_VISIT_CONFIRMATION_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visit, visitor_name, visitor_phone, visit_date, visit_time }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, visit }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}