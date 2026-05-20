import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { title, price, location, city, bedrooms, bathrooms, area, amenities, property_type, furnishing } =
      await req.json();

    if (!title || !location) {
      return NextResponse.json({ error: "title and location are required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI not configured" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const details = [
      `Title: ${title}`,
      property_type ? `Type: ${property_type}` : null,
      `Location: ${city ?? location}`,
      price ? `Price: ₹${Number(price).toLocaleString("en-IN")}` : null,
      bedrooms ? `Bedrooms: ${bedrooms}` : null,
      bathrooms ? `Bathrooms: ${bathrooms}` : null,
      area ? `Area: ${area} sqft` : null,
      furnishing ? `Furnishing: ${furnishing}` : null,
      amenities?.length ? `Amenities: ${amenities.join(", ")}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional real estate copywriter. Write a compelling 3-sentence property description. Be specific, highlight key features, and appeal to buyers. Use a warm, professional tone. No markdown, plain text only.",
        },
        {
          role: "user",
          content: `Write a property description for:\n${details}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const description = completion.choices[0].message.content?.trim() ?? "";
    return NextResponse.json({ description });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
