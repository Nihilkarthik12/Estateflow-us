import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { tenant_id, title, description, category } = await req.json();
    if (!tenant_id || !title) return NextResponse.json({ error: "tenant_id and title required" }, { status: 400 });

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SB_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: tenant } = await supabase
      .from("tenants")
      .select("organization_id, property_id")
      .eq("id", tenant_id)
      .single();

    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    const { data, error } = await supabase
      .from("maintenance_tickets")
      .insert({
        organization_id: tenant.organization_id,
        tenant_id,
        property_id: tenant.property_id ?? null,
        title,
        description: description || null,
        category: category || "general",
        status: "open",
        priority: "medium",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Notify admins
    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .eq("organization_id", tenant.organization_id)
      .eq("role", "admin");

    if (admins && admins.length > 0) {
      await supabase.from("notifications").insert(
        admins.map((a) => ({
          user_id: a.id,
          organization_id: tenant.organization_id,
          message: `New maintenance request from tenant: "${title}"`,
          type: "maintenance",
          link: `/dashboard/maintenance`,
          read: false,
        }))
      );
    }

    return NextResponse.json({ success: true, ticket: data }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
