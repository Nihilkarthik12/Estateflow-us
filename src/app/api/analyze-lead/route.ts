import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `You are a real estate lead analyst. Extract structured information from the customer's message.

Return ONLY valid JSON with exactly these fields:
- summary: A concise, professional one-sentence summary of the customer's requirement
- budget: The budget mentioned (e.g. "₹90 Lakhs", "2 Crore") or null if not mentioned
- location: The preferred city or area (e.g. "Chennai", "Bangalore, Whitefield") or null
- property_type: The type of property (e.g. "3BHK Apartment", "Villa", "Plot") or null
- urgency: One of "high", "medium", or "low" based on language urgency cues
- buyer_intent: One of "serious", "researching", or "comparing" based on commitment signals

Rules:
- urgency is "high" if they use words like urgent, immediately, ASAP, moving soon, need by <date>
- urgency is "medium" if they have a timeline in weeks/months
- urgency is "low" if they are just browsing or asking generally
- buyer_intent is "serious" if they mention financing, ready to buy, or need immediate possession
- buyer_intent is "researching" if they are asking for options or exploring
- buyer_intent is "comparing" if they mention multiple locations or price ranges
- Return null for fields you cannot extract — do not guess`;

export async function POST(req: NextRequest) {
  try {
    const { leadId, rawMessage } = await req.json();

    if (!leadId || !rawMessage) {
      return NextResponse.json({ error: "leadId and rawMessage are required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Customer message: "${rawMessage}"` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const raw = completion.choices[0].message.content ?? "{}";
    let extracted: Record<string, string | null>;

    try {
      extracted = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    // Validate enum fields
    const validUrgency = ["high", "medium", "low"];
    const validIntent = ["serious", "researching", "comparing"];

    const urgency = validUrgency.includes(extracted.urgency as string)
      ? (extracted.urgency as string)
      : "medium";
    const buyer_intent = validIntent.includes(extracted.buyer_intent as string)
      ? (extracted.buyer_intent as string)
      : "researching";

    const updatePayload = {
      summary: extracted.summary ?? null,
      budget: extracted.budget ?? null,
      location: extracted.location ?? null,
      property_type: extracted.property_type ?? null,
      urgency,
      buyer_intent,
      ai_analyzed: true,
    };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads")
      .update(updatePayload)
      .eq("id", leadId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ lead: data, extracted: updatePayload });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
