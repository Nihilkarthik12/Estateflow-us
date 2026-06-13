# EstateFlow US — n8n Automation Setup

## What These Workflows Do

| Workflow | Trigger | What It Does |
|---|---|---|
| 01 - WhatsApp Lead Capture | Meta sends webhook | Captures WhatsApp message → AI analyzes → saves lead in CRM → sends auto-reply |
| 02 - Follow-up Sequence | Daily 9 AM Mon-Sat | Finds leads needing follow-up → generates AI message → sends via WhatsApp + Email |
| 03 - Rent Reminder | Daily 10 AM | Finds tenants with rent due in 3 days → sends WhatsApp reminder |
| 04 - Visit Confirmation | Webhook trigger | Sends WhatsApp confirmation when visit is booked |
| 05 - Visit Reminder | Daily 8 AM | Sends WhatsApp reminder 1 day before visit |
| 07 - Lease Renewal Alert | Daily 9 AM | Alerts tenants 60 days before lease expires |
| 08 - Lead Re-engagement | Daily 10 AM | Re-engages leads inactive for 4+ days via WhatsApp + Email |
| 09 - Post-Sale Referral | Daily 10 AM | Asks satisfied buyers for referrals via WhatsApp + Email |
| 10 - New Property Matching | Webhook trigger | Matches new listings to leads and notifies via WhatsApp + Email |
| 11 - No-Response Alert | Hourly | Alerts agent on WhatsApp if new lead has no response in 1 hour |
| 12 - Visit No-Show Recovery | Daily 11 AM | Follows up with leads who missed their visit |

---

## WhatsApp Provider — Meta Cloud API (Free)

This project uses **Meta WhatsApp Cloud API** (NOT WATI). It is completely free for up to 1,000 conversations/month.

**Credentials (already hardcoded in all workflow JSONs):**
- Phone Number ID: `1221327281053499`
- Test number: `+1 (555) 649-4634`
- Access token: regenerate at developers.facebook.com → Estateflow app → Use cases → Step 1

> **Important:** The access token expires every 24 hours in test mode. Regenerate before each demo session.

---

## Step 1 — Add Environment Variables to Vercel

Go to Vercel project → Settings → Environment Variables → add:

```
N8N_SECRET           = estateflow-us-n8n-secret-2026
WEBHOOK_SECRET       = estateflow-us-webhook-2026
RESEND_API_KEY       = re_LMtoUbFB_JLkrBDNyKAbKxqP8qBHkNtbp
RESEND_FROM          = EstateFlow <noreply@leadgen.sbs>
NEXT_PUBLIC_APP_URL  = https://estateflow-us.vercel.app
```

---

## Step 2 — Set Up n8n on Render

n8n is hosted at: `https://n8n-ymr9.onrender.com`

In n8n → Settings → Variables, no WATI variables needed. All Meta API credentials are hardcoded in the workflow JSONs.

---

## Step 3 — Import All 11 Workflows into n8n

1. In n8n → click **+** → **Import from File**
2. Import all files from `n8n/workflows/` folder
3. After importing each, flip the **Active** toggle ON

---

## Step 4 — Test

### Test WhatsApp (Meta API):
- Go to developers.facebook.com → Estateflow app → Use cases → Step 1
- Add your WhatsApp number as recipient
- Trigger a workflow manually in n8n → you receive WhatsApp message

### Test Email:
- Submit a lead via the chat widget on estateflow-us.vercel.app
- Check your inbox for automated email from `noreply@leadgen.sbs`

---

## Total Cost

| Service | Cost |
|---|---|
| Meta WhatsApp Cloud API | **Free** (1,000 conversations/month) |
| n8n on Render | **Free** (free tier) |
| Resend Email | **Free** (3,000 emails/month) |
| Vercel | **Free** |
| Supabase | **Free** |
