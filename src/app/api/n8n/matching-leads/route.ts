import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

// n8n calls this when a new property is listed — returns leads that match budget/location/type
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const propertyId = req.nextUrl.searchParams.get("property_id");
  if (!propertyId) return NextResponse.json({ error: "property_id required" }, { status: 400 });

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SB_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch the property
  const { data: property } = await supabase
    .from("properties")
    .select("title, price, location, city, property_type, bedrooms")
    .eq("id", propertyId)
    .single();

  if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });

  // Fetch active leads (not closed/lost) with phone numbers
  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, budget, location, property_type, urgency, status")
    .not("phone", "is", null)
    .not("status", "in", '("closed","lost")');

  if (!leads || leads.length === 0) {
    return NextResponse.json({ leads: [], count: 0, property });
  }

  // Match leads against property
  const matched = leads.filter((lead) => {
    let score = 0;

    // Location match (city or area keyword)
    if (lead.location && property.city) {
      const leadLoc = lead.location.toLowerCase();
      const propCity = property.city.toLowerCase();
      const propLoc = property.location?.toLowerCase() ?? "";
      if (leadLoc.includes(propCity) || propCity.includes(leadLoc) || leadLoc.includes(propLoc)) {
        score += 2;
      }
    }

    // Property type match
    if (lead.property_type && property.property_type) {
      if (lead.property_type.toLowerCase() === property.property_type.toLowerCase()) {
        score += 2;
      }
    }

    // Budget match — parse budget string like "$300k-$500k" or "500000"
    if (lead.budget && property.price) {
      const budget = lead.budget.replace(/[^0-9\-k]/gi, "").toLowerCase();
      const maxBudgetStr = budget.includes("-") ? budget.split("-")[1] : budget;
      const maxBudget = parseFloat(maxBudgetStr.replace("k", "")) * (maxBudgetStr.includes("k") ? 1000 : 1);
      if (!isNaN(maxBudget) && property.price <= maxBudget * 1.1) {
        score += 3;
      }
    }

    return score >= 2; // At least one strong match
  });

  return NextResponse.json({ leads: matched, count: matched.length, property });
}
