import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SB_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, agencyName, city, fullName } = await req.json();

    if (!userId || !agencyName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert org using service role (bypasses RLS)
    const { data: org, error: orgError } = await supabaseAdmin
      .from("organizations")
      .insert({ name: agencyName, city: city ?? "" })
      .select()
      .single();

    if (orgError) {
      return NextResponse.json({ error: orgError.message }, { status: 500 });
    }

    // Update profile using service role (bypasses RLS)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ organization_id: org.id, role: "admin", full_name: fullName })
      .eq("id", userId);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ organizationId: org.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
