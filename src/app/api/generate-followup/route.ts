import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { leadId } = await req.json();

    if (!leadId) {
      return NextResponse.json({ error: "leadId is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const n8nSecret = req.headers.get("x-n8n-secret");
    const isN8N = n8nSecret && n8nSecret === process.env.N8N_SECRET;

    const supabase = isN8N
      ? createServiceClient(process.env.NEXT_PUBLIC_SB_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
      : await createClient();

    const { data: lead, error } = await supabase
      .from("leads")
      .select("name, phone, budget, location, property_type, urgency, buyer_intent, summary, status, raw_message")
      .eq("id", leadId)
      .single();

    if (error || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const stageLabels: Record<string, string> = {
      new: "New Lead",
      contacted: "Recently Contacted",
      qualified: "Qualified",
      site_visit: "Showing Scheduled",
      negotiation: "Under Contract",
    };

    const context = [
      `Customer Name: ${lead.name ?? "the customer"}`,
      lead.budget ? `Budget: ${lead.budget}` : null,
      lead.location ? `Looking in: ${lead.location}` : null,
      lead.property_type ? `Property type: ${lead.property_type}` : null,
      lead.urgency ? `Urgency: ${lead.urgency}` : null,
      lead.buyer_intent ? `Intent: ${lead.buyer_intent}` : null,
      lead.summary ? `Summary: ${lead.summary}` : null,
      lead.status ? `Pipeline stage: ${stageLabels[lead.status] ?? lead.status}` : null,
      lead.raw_message ? `Original message: "${lead.raw_message}"` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional real estate agent assistant. Write warm, concise follow-up messages to potential buyers.

Guidelines:
- Keep it under 100 words
- Sound helpful and professional, not salesy
- Reference the customer's specific requirement naturally
- End with a clear next step or question
- Write in plain text, no markdown
- Address the customer by their first name`,
        },
        {
          role: "user",
          content: `Write a follow-up message for this lead:\n\n${context}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const message = completion.choices[0].message.content?.trim() ?? "";

    return NextResponse.json({ message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
