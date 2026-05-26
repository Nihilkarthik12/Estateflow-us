import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SB_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, agencyName, city, fullName } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if organization needs to be created
    let organizationId;

    if (agencyName) {
      // Create organization if provided
      const { data: org, error: orgError } = await supabaseAdmin
        .from("organizations")
        .insert({ name: agencyName, city: city ?? "" })
        .select()
        .single();

      if (orgError) {
        return NextResponse.json({ error: orgError.message }, { status: 500 });
      }
      organizationId = org.id;
    }

    // Create or update profile using service role (bypasses RLS)
    const profileData: any = {
      id: userId,
      role: "admin",
    };

    if (fullName) profileData.full_name = fullName;
    if (organizationId) profileData.organization_id = organizationId;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(profileData);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Profile fixed successfully",
      organizationId
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}