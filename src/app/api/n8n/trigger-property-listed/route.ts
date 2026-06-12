import { NextRequest, NextResponse } from "next/server";

// Called by the dashboard when a new property is saved.
// Forwards to the n8n webhook so workflow 10 fires automatically.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { property_id } = body;
  if (!property_id) return NextResponse.json({ error: "property_id required" }, { status: 400 });

  const n8nWebhookUrl = process.env.N8N_WEBHOOK_BASE_URL;
  if (!n8nWebhookUrl) {
    // n8n not configured — silently skip
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await fetch(`${n8nWebhookUrl}/webhook/new-property-listed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ property_id }),
    });
  } catch {
    // Non-fatal — don't break property creation if n8n is down
  }

  return NextResponse.json({ ok: true });
}
