import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { sanitizeField, isValidPhone, isValidEmail } from "@/lib/sanitize";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ExtractedLead {
  budget:        string | null;
  location:      string | null;
  property_type: string | null;
  urgency:       "high" | "medium" | "low";
  buyer_intent:  "serious" | "researching" | "comparing";
}

async function extractLeadDetails(conversation: string): Promise<ExtractedLead> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 200,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Extract structured lead data from this real estate chat conversation. Return JSON with these fields:
- budget: string or null (e.g. "$500,000", "under $400K", "500k-700k")
- location: string or null (city, neighborhood, or area they mentioned)
- property_type: string or null ("single-family", "condo", "townhouse", "apartment", "multi-family")
- urgency: "high" (needs in < 30 days or urgent), "medium" (1–3 months), or "low" (just browsing)
- buyer_intent: "serious" (ready to act, has budget/timeline), "comparing" (evaluating options), or "researching" (early stage)
Only use information explicitly stated in the conversation. Use null if not mentioned.`,
        },
        { role: "user", content: conversation },
      ],
    });
    return JSON.parse(completion.choices[0]?.message?.content ?? "{}");
  } catch {
    return { budget: null, location: null, property_type: null, urgency: "medium", buyer_intent: "researching" };
  }
}

export async function POST(req: NextRequest) {
  const { allowed } = rateLimit(`chat-lead:${getIP(req)}`, 5, 10 * 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = await req.json();

    const name                = sanitizeField(body.name, 150);
    const phone               = sanitizeField(body.phone, 20);
    const email               = sanitizeField(body.email, 200);
    const conversationSummary = sanitizeField(body.conversationSummary, 2000);

    if (!name || !phone || !email) {
      return NextResponse.json({ error: "name, phone, and email are required" }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    // AI-extract lead details from the full conversation
    const extracted = await extractLeadDetails(conversationSummary || `${name} contacted via chat`);

    const supabase = await createClient();

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        name,
        phone,
        email,
        raw_message:   conversationSummary || `Chat lead: ${name}, ${phone}`,
        budget:        extracted.budget        ?? undefined,
        location:      extracted.location      ?? undefined,
        property_type: extracted.property_type ?? undefined,
        source:        "ai_chat",
        status:        "new",
        urgency:       extracted.urgency,
        buyer_intent:  extracted.buyer_intent,
        ai_analyzed:   false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Notify dashboard users
    const { data: users } = await supabase.from("profiles").select("id");
    if (users && users.length > 0) {
      const urgencyLabel = extracted.urgency === "high" ? "🔥 High intent" : "New";
      await supabase.from("notifications").insert(
        users.map((u) => ({
          user_id: u.id,
          message: `${urgencyLabel} chat lead: ${name}${extracted.location ? " · " + extracted.location : ""}${extracted.budget ? " · " + extracted.budget : ""}`,
          type:    "lead",
          link:    `/dashboard/leads/${lead.id}`,
          read:    false,
        }))
      );
    }

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
