import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch aggregated lead data for the org
    const { data: leads } = await supabase
      .from("leads")
      .select("status, source, location, urgency, buyer_intent, created_at")
      .order("created_at", { ascending: false });

    if (!leads || leads.length === 0) {
      return NextResponse.json({
        insights: [
          "No lead data yet. Add your first leads to start seeing AI-powered insights.",
        ],
      });
    }

    // Aggregate stats to send to OpenAI (not raw data — just summaries)
    const total = leads.length;
    const closed = leads.filter((l) => l.status === "closed").length;
    const high = leads.filter((l) => l.urgency === "high").length;
    const serious = leads.filter((l) => l.buyer_intent === "serious").length;
    const inactive = leads.filter((l) => {
      const diff = Date.now() - new Date(l.created_at).getTime();
      return diff > 5 * 24 * 60 * 60 * 1000 && !["closed", "lost"].includes(l.status);
    }).length;

    const stageMap: Record<string, number> = {};
    leads.forEach((l) => { stageMap[l.status] = (stageMap[l.status] ?? 0) + 1; });

    const sourceMap: Record<string, number> = {};
    leads.forEach((l) => { sourceMap[l.source ?? "unknown"] = (sourceMap[l.source ?? "unknown"] ?? 0) + 1; });

    const locMap: Record<string, number> = {};
    leads.forEach((l) => {
      if (l.location) {
        const loc = l.location.split(",")[0].trim();
        locMap[loc] = (locMap[loc] ?? 0) + 1;
      }
    });
    const topLocs = Object.entries(locMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

    // Leads this week
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = leads.filter((l) => new Date(l.created_at).getTime() > weekAgo).length;

    const context = `
Real estate agency lead data summary:
- Total leads: ${total}
- Leads this week: ${thisWeek}
- Closed/converted: ${closed} (${total > 0 ? Math.round((closed / total) * 100) : 0}% conversion rate)
- High urgency leads: ${high}
- Serious buyers: ${serious}
- Inactive leads (5+ days): ${inactive}
- Pipeline breakdown: ${JSON.stringify(stageMap)}
- Lead sources: ${JSON.stringify(sourceMap)}
- Top locations: ${topLocs.map(([loc, count]) => `${loc} (${count})`).join(", ")}
`;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a business intelligence assistant for a real estate CRM.
Analyze the provided lead data and return exactly 4 actionable, specific insights.

Return ONLY a JSON object with an "insights" array of strings.
Each insight must be:
- Specific and data-driven (reference actual numbers)
- Actionable (suggest what the team should do)
- Under 20 words
- Conversational, not robotic`,
        },
        {
          role: "user",
          content: context,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const result = JSON.parse(completion.choices[0].message.content ?? "{}");
    const insights: string[] = Array.isArray(result.insights)
      ? result.insights.slice(0, 5)
      : ["Unable to generate insights. Check your lead data."];

    return NextResponse.json({ insights });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
