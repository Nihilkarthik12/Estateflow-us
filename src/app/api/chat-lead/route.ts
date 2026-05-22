import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, conversationSummary, organizationId } = await req.json();

    if (!name || !phone || !organizationId) {
      return NextResponse.json({ error: "name, phone, and organizationId are required" }, { status: 400 });
    }

    const supabase = await createClient();

    const raw_message = conversationSummary || `Chat lead: ${name}, ${phone}`;

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        organization_id: organizationId,
        name,
        phone,
        raw_message,
        source: "ai_chat",
        status: "new",
        urgency: "medium",
        buyer_intent: "researching",
        ai_analyzed: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Notify admins in-app
    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("role", "admin");

    if (admins && admins.length > 0) {
      await supabase.from("notifications").insert(
        admins.map((a) => ({
          user_id: a.id,
          organization_id: organizationId,
          message: `New chat lead: ${name} — requested a site visit`,
          type: "lead",
          link: `/dashboard/leads/${lead.id}`,
          read: false,
        }))
      );
    }

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
