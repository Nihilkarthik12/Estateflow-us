import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "leadId is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch the lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("organization_id, budget, location, property_type, urgency")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Query available properties in same org
    let query = supabase
      .from("properties")
      .select("id, title, price, location, city, bedrooms, bathrooms, area, property_type, status, images")
      .eq("organization_id", lead.organization_id)
      .eq("status", "available")
      .limit(20);

    // Filter by location (city match)
    if (lead.location) {
      const locationKeyword = lead.location.split(",")[0].trim();
      query = query.or(`location.ilike.%${locationKeyword}%,city.ilike.%${locationKeyword}%`);
    }

    const { data: properties, error: propError } = await query;

    if (propError) {
      return NextResponse.json({ error: propError.message }, { status: 500 });
    }

    if (!properties || properties.length === 0) {
      return NextResponse.json({ recommendations: [] });
    }

    // Score each property based on how well it matches
    interface ScoredProperty {
      score: number;
      match_reasons: string[];
      id: string;
      title: string;
      price: number;
      location: string;
      city?: string;
      bedrooms: number;
      bathrooms: number;
      area: number;
      property_type?: string;
      status: string;
      images?: string[];
    }

    const scored: ScoredProperty[] = properties.map((p) => {
      let score = 0;
      const reasons: string[] = [];

      // Budget match (parse numeric values)
      if (lead.budget && p.price) {
        const budgetNum = parseBudgetToNumber(lead.budget);
        if (budgetNum) {
          if (p.price <= budgetNum) { score += 3; reasons.push("Within budget"); }
          else if (p.price <= budgetNum * 1.15) { score += 1; reasons.push("Slightly above budget"); }
        }
      }

      // Location match
      if (lead.location && p.location) {
        const keyword = lead.location.split(",")[0].trim().toLowerCase();
        if (p.location.toLowerCase().includes(keyword) || p.city?.toLowerCase().includes(keyword)) {
          score += 3;
          reasons.push("Location match");
        }
      }

      // Property type match
      if (lead.property_type && p.property_type) {
        const leadType = lead.property_type.toLowerCase();
        const propType = p.property_type.toLowerCase();
        if (propType.includes(leadType) || leadType.includes(propType)) {
          score += 2;
          reasons.push("Property type match");
        }
        // BHK match
        const bhkMatch = leadType.match(/(\d)bhk/)?.[1];
        if (bhkMatch && p.bedrooms === parseInt(bhkMatch)) {
          score += 2;
          reasons.push(`${bhkMatch}BHK match`);
        }
      }

      return { ...p, score, match_reasons: reasons };
    });

    // Sort by score, take top 3
    const recommendations = scored
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // If fewer than 3 matches, pad with next best
    if (recommendations.length < 3) {
      const remaining = scored
        .filter((p) => !recommendations.find((r) => r.id === p.id))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3 - recommendations.length);
      recommendations.push(...remaining);
    }

    return NextResponse.json({ recommendations: recommendations.slice(0, 3) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function parseBudgetToNumber(budget: string): number | null {
  const b = budget.toLowerCase().replace(/[₹,\s]/g, "");
  const croreMatch = b.match(/([\d.]+)\s*(?:cr|crore)/);
  if (croreMatch) return parseFloat(croreMatch[1]) * 1e7;
  const lakhMatch = b.match(/([\d.]+)\s*(?:l|lakh|lakhs)/);
  if (lakhMatch) return parseFloat(lakhMatch[1]) * 1e5;
  const num = parseFloat(b);
  return isNaN(num) ? null : num;
}
