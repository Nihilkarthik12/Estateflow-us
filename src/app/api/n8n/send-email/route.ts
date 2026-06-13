import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email";

// Called by n8n workflows to email a lead/tenant.
// Auth: same x-n8n-secret header as the other /api/n8n/* routes.
// Body: { to, subject, body, lead_id? }
//   - `body` is plain text (newlines become <br/>); we wrap it in a branded shell.
//   - `lead_id` (optional) logs the email as an outbound conversation, like WhatsApp.
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: { to?: string; subject?: string; body?: string; html?: string; lead_id?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { to, subject, body, html, lead_id } = payload;
  if (!to || !subject || (!body && !html)) {
    return NextResponse.json(
      { error: "to, subject, and body (or html) are required" },
      { status: 400 },
    );
  }

  const finalHtml = html ?? wrap(subject, body ?? "");

  const result = await sendEmail(to, subject, finalHtml);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  // Log the outbound email against the lead so it shows in the conversation history.
  if (lead_id) {
    try {
      const supabase = createServiceClient(
        process.env.NEXT_PUBLIC_SB_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
      );
      await supabase.from("conversations").insert({
        lead_id,
        message: `📧 Email — ${subject}\n\n${body ?? ""}`.trim(),
        direction: "outbound",
      });
    } catch {
      // Logging is best-effort — never fail the send because of it.
    }
  }

  return NextResponse.json({ ok: true, id: result.id });
}

// Wraps a plain-text message in a clean, brand-consistent HTML shell.
function wrap(subject: string, text: string): string {
  const safe = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  return `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 540px; margin: 0 auto; background: #ffffff; color: #0f1726; padding: 32px; border: 1px solid #e2e8f0; border-radius: 14px;">
      <div style="margin-bottom: 20px;">
        <span style="background: #2563eb; color: #fff; font-size: 13px; font-weight: 700;">EstateFlow</span>
      </div>
      <h2 style="margin: 0 0 16px; font-size: 19px; color: #0f1726;">${subject}</h2>
      <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.7;">${safe}</p>
      <p style="margin: 28px 0 0; color: #94a3b8; font-size: 12px;">Sent by EstateFlow on behalf of your agent.</p>
    </div>
  `;
}
