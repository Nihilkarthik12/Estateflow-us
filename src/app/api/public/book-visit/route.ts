import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitor_name, visitor_phone, visitor_email, property_id, visit_date, visit_time, organization_id } = body;

    if (!visitor_name || !visitor_phone || !visit_date) {
      return NextResponse.json({ error: "Name, phone and date are required." }, { status: 400 });
    }

    const orgId = organization_id ?? process.env.NEXT_PUBLIC_ORG_ID;
    if (!orgId) return NextResponse.json({ error: "Organization not configured." }, { status: 400 });

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: visit, error } = await supabase
      .from("visits")
      .insert({
        organization_id: orgId,
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

    // Notify admins in-app
    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .eq("organization_id", orgId)
      .eq("role", "admin");

    if (admins && admins.length > 0) {
      await supabase.from("notifications").insert(
        admins.map((a) => ({
          user_id: a.id,
          organization_id: orgId,
          message: `New site visit booked: ${visitor_name} (${visitor_phone}) on ${visit_date} at ${visit_time}`,
          type: "visit",
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
