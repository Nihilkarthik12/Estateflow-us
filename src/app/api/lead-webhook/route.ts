import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendLeadNotificationEmail } from "@/lib/email";

const SYSTEM_PROMPT = `You are a real estate lead analyst. Extract structured information from the customer's message.

Return ONLY valid JSON with exactly these fields:
- summary: A concise, professional one-sentence summary of the customer's requirement
- budget: The budget mentioned (e.g. "₹90 Lakhs", "2 Crore") or null if not mentioned
- location: The preferred city or area or null
- property_type: The type of property (e.g. "3BHK Apartment", "Villa") or null
- urgency: One of "high", "medium", or "low" based on language urgency cues
- buyer_intent: One of "serious", "researching", or "comparing" based on commitment signals`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      raw_message,
      source = "web_form",
      organization_id,
      webhook_secret,
    } = body;

    const configuredSecret = process.env.WEBHOOK_SECRET;
    if (configuredSecret && webhook_secret !== configuredSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!raw_message || !organization_id) {
      return NextResponse.json(
        { error: "raw_message and organization_id are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const leadPayload: Record<string, unknown> = {
      organization_id,
      name: name ?? "Unknown",
      phone: phone ?? null,
      email: email ?? null,
      raw_message,
      source,
      status: "new",
      urgency: "medium",
      buyer_intent: "researching",
      ai_analyzed: false,
    };

    let extractedSummary: string | null = null;
    let extractedPropertyType: string | null = null;
    let extractedLocation: string | null = null;

    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Customer message: "${raw_message}"` },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        });

        const extracted = JSON.parse(completion.choices[0].message.content ?? "{}");
        const validUrgency = ["high", "medium", "low"];
        const validIntent = ["serious", "researching", "comparing"];

        extractedSummary = extracted.summary ?? null;
        extractedPropertyType = extracted.property_type ?? null;
        extractedLocation = extracted.location ?? null;

        Object.assign(leadPayload, {
          summary: extractedSummary,
          budget: extracted.budget ?? null,
          location: extractedLocation,
          property_type: extractedPropertyType,
          urgency: validUrgency.includes(extracted.urgency) ? extracted.urgency : "medium",
          buyer_intent: validIntent.includes(extracted.buyer_intent) ? extracted.buyer_intent : "researching",
          ai_analyzed: true,
        });
      } catch {
        // AI analysis failed — store lead without AI fields
      }
    }

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert(leadPayload)
      .select()
      .single();

    if (leadError) {
      return NextResponse.json({ error: leadError.message }, { status: 500 });
    }

    // Auto-reply: save a welcome message as the first outbound conversation
    const leadFirstName = (name ?? "there").split(" ")[0];
    const propertyRef = extractedPropertyType ?? "property";
    const locationRef = extractedLocation ? ` in ${extractedLocation}` : "";
    const welcomeMessage = `Hi ${leadFirstName}, thank you for your enquiry about ${propertyRef}${locationRef}. Our team will review your requirement and get back to you shortly with suitable options.`;

    await supabase.from("conversations").insert({
      lead_id: lead.id,
      message: welcomeMessage,
      direction: "outbound",
    });

    // Notify admins (in-app + email)
    const { data: admins } = await supabase
      .from("profiles")
      .select("id")
      .eq("organization_id", organization_id)
      .eq("role", "admin");

    if (admins && admins.length > 0) {
      const urgencyFlag = leadPayload.urgency === "high" ? " 🔴 HIGH URGENCY" : "";
      const notifications = admins.map((admin) => ({
        user_id: admin.id,
        organization_id,
        message: `New lead received: ${leadPayload.name}${urgencyFlag} — "${raw_message.slice(0, 80)}${raw_message.length > 80 ? "…" : ""}"`,
        type: "lead",
        link: `/dashboard/leads/${lead.id}`,
        read: false,
      }));

      await supabase.from("notifications").insert(notifications);

      // Email notifications via Resend (only if RESEND_API_KEY + service role key are set)
      if (process.env.RESEND_API_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const serviceClient = createServiceClient(
            process.env.NEXT_PUBLIC_SB_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          );
          const adminIds = admins.map((a) => a.id);
          const { data: authUsers } = await serviceClient.auth.admin.listUsers();
          const adminEmails = authUsers?.users
            .filter((u) => adminIds.includes(u.id) && u.email)
            .map((u) => u.email as string) ?? [];

          await Promise.all(
            adminEmails.map((adminEmail) =>
              sendLeadNotificationEmail(
                adminEmail,
                String(leadPayload.name),
                extractedSummary ?? raw_message.slice(0, 120),
                lead.id
              )
            )
          );
        } catch {
          // Email failure should never crash the webhook
        }
      }
    }

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
