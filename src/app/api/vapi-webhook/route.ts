import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ExtractedLead {
  name:          string | null;
  phone:         string | null;
  budget:        string | null;
  location:      string | null;
  property_type: string | null;
  bedrooms:      string | null;
  buy_or_rent:   "buy" | "rent" | "invest" | null;
  urgency:       "high" | "medium" | "low";
  buyer_intent:  "serious" | "comparing" | "researching";
  summary:       string;
}

async function extractLeadFromTranscript(transcript: string): Promise<ExtractedLead> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Extract structured lead data from this real estate voice call transcript. Return JSON:
- name: caller's full name (string or null)
- phone: caller's phone number as they said it (string or null)
- budget: budget range in USD (string or null, e.g. "$500,000", "under $400K")
- location: preferred city or area (string or null)
- property_type: "single-family", "condo", "townhouse", "apartment", "multi-family", or null
- bedrooms: number of bedrooms mentioned (string or null, e.g. "3", "3-4")
- buy_or_rent: "buy", "rent", "invest", or null
- urgency: "high" (needs < 30 days), "medium" (1-3 months), "low" (just browsing)
- buyer_intent: "serious" (has budget + timeline), "comparing", or "researching"
- summary: one sentence summarizing what the caller wants

Only use info explicitly stated. Use null if not mentioned.`,
        },
        { role: "user", content: transcript },
      ],
    });
    return JSON.parse(completion.choices[0]?.message?.content ?? "{}");
  } catch {
    return {
      name: null, phone: null, budget: null, location: null,
      property_type: null, bedrooms: null, buy_or_rent: null,
      urgency: "medium", buyer_intent: "researching",
      summary: "Voice call lead",
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Vapi sends different message types — we only care about end-of-call-report
    const msg = body?.message;
    if (!msg || msg.type !== "end-of-call-report") {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const transcript: string = msg.transcript ?? "";
    const callId: string     = msg.call?.id ?? "";

    if (!transcript || transcript.trim().length < 20) {
      return NextResponse.json({ received: true, skipped: "transcript too short" }, { status: 200 });
    }

    const extracted = await extractLeadFromTranscript(transcript);

    // Skip if we couldn't get even a name or phone
    if (!extracted.name && !extracted.phone) {
      return NextResponse.json({ received: true, skipped: "no lead info found" }, { status: 200 });
    }

    const supabase = await createClient();

    // Build raw message from transcript summary + call ID
    const raw_message = `[Voice Call ${callId ? "#" + callId.slice(0, 8) : ""}] ${extracted.summary}\n\nTranscript:\n${transcript}`;

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        name:          extracted.name    ?? "Voice Caller",
        phone:         extracted.phone   ?? "",
        raw_message,
        budget:        extracted.budget        ?? undefined,
        location:      extracted.location      ?? undefined,
        property_type: extracted.property_type ?? undefined,
        notes:         extracted.bedrooms ? `Bedrooms: ${extracted.bedrooms}${extracted.buy_or_rent ? " · " + extracted.buy_or_rent : ""}` : undefined,
        source:        "vapi_voice",
        status:        "new",
        urgency:       extracted.urgency,
        buyer_intent:  extracted.buyer_intent,
        ai_analyzed:   false,
      })
      .select()
      .single();

    if (error) {
      console.error("Vapi webhook — lead insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Notify dashboard users
    const { data: users } = await supabase.from("profiles").select("id");
    if (users && users.length > 0) {
      const urgencyLabel = extracted.urgency === "high" ? "🔥 " : "";
      const label = `${urgencyLabel}New voice lead: ${extracted.name ?? "Unknown"}${extracted.location ? " · " + extracted.location : ""}${extracted.budget ? " · " + extracted.budget : ""}`;
      await supabase.from("notifications").insert(
        users.map((u) => ({
          user_id: u.id,
          message: label,
          type:    "lead",
          link:    `/dashboard/leads/${lead.id}`,
          read:    false,
        }))
      );
    }

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("Vapi webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
