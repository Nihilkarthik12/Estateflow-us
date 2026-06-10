import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getIP } from "@/lib/rate-limit";
import { formatPrice } from "@/lib/config/market";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Message { role: "user" | "assistant"; content: string; }

export async function POST(req: NextRequest) {
  // 30 messages per minute per IP — generous for real chat, blocks scrapers
  const { allowed } = rateLimit(`chat:${getIP(req)}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Cap message length
    const safeMessage = message.slice(0, 1000);

    // Cap conversation history depth to prevent token abuse
    const safeHistory = (conversationHistory as Message[]).slice(-10);

    let propertyContext = "";
    try {
      const supabase = await createClient();
      const { data: properties } = await supabase
        .from("properties")
        .select("title, description, price, city, area, bedrooms, bathrooms, property_type, status")
        .eq("status", "available")
        .limit(20);

      if (properties && properties.length > 0) {
        propertyContext = `\n\nAvailable Properties:\n${properties
          .map((p) => `- ${p.title} (${p.property_type}) in ${p.city}${p.area ? ", " + p.area : ""}: ${formatPrice(p.price)}, ${p.bedrooms ?? "?"}BD/${p.bathrooms ?? "?"}BA`)
          .join("\n")}`;
      }
    } catch { /* silently skip if property fetch fails */ }

    const systemPrompt = `You are EstateFlow AI, a helpful real estate assistant for a US real estate brokerage. You help prospective buyers and renters explore properties, understand pricing, and book showings.

Your capabilities:
- Answer questions about available properties, pricing, locations, and amenities
- Help users find properties matching their requirements
- Explain the US home buying/rental process — offers, escrow, closing costs, pre-approval, inspections
- Calculate monthly mortgage payments and check affordability
- Schedule or suggest property showings

Mortgage calculation rules:
- Formula: M = P × r × (1+r)^n / ((1+r)^n - 1), where r is the monthly rate and n is the number of payments
- Default assumptions: 20% down payment, 7% annual interest (APR), 30 year term
- Always show: loan amount, estimated monthly payment (principal + interest), total interest, total paid

Guidelines:
- Be concise, friendly, and professional
- Use US dollars ($) for all prices, formatted with commas (e.g. $1,250,000)
- Reference US terms: beds/baths, sq ft, HOA, property taxes, MLS
- If you recommend a showing or booking, end your message with: [ACTION:book_visit]
- Don't make up property details not in the provided list${propertyContext}`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...safeHistory.map((m: Message) => ({ role: m.role, content: m.content })),
      { role: "user", content: safeMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", messages, max_tokens: 400, temperature: 0.7,
    });

    const rawReply = completion.choices[0]?.message?.content ?? "I'm sorry, I couldn't process your request.";
    const hasAction = rawReply.includes("[ACTION:book_visit]");
    const reply = rawReply.replace("[ACTION:book_visit]", "").trim();

    return NextResponse.json({ reply, action: hasAction ? "book_visit" : undefined });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
