// Email sending via Resend.
// Silently skips if RESEND_API_KEY is not configured.

const RESEND_FROM = process.env.RESEND_FROM ?? "EstateFlow <noreply@leadgen.sbs>";

interface SendEmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

// Generic sender used by automations (n8n) to email leads/customers.
// Returns a result object so callers can report success/failure.
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.message ?? `HTTP ${res.status}` };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendLeadNotificationEmail(
  agentEmail: string,
  leadName: string,
  summary: string,
  leadId: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const leadUrl = `${appUrl}/dashboard/leads/${leadId}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #0f0f13; color: #e2e8f0; padding: 32px; border-radius: 12px;">
      <div style="margin-bottom: 24px;">
        <span style="background: #6366f1; color: white; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">New Lead</span>
      </div>
      <h2 style="margin: 0 0 8px; font-size: 20px; color: #f1f5f9;">New lead: ${leadName}</h2>
      <p style="margin: 0 0 24px; color: #94a3b8; font-size: 14px; line-height: 1.6;">${summary || "A new lead has been submitted and is waiting for your review."}</p>
      <a href="${leadUrl}" style="display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">View Lead →</a>
      <p style="margin: 24px 0 0; color: #475569; font-size: 12px;">EstateFlow AI · You received this because you are an admin in your organization.</p>
    </div>
  `;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "EstateFlow <onboarding@resend.dev>",
        to: agentEmail,
        subject: `New lead: ${leadName}`,
        html,
      }),
    });
  } catch {
    // Email failure should never crash the webhook
  }
}
