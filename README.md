# EstateFlow AI

**AI-Powered Real Estate Operations SaaS Platform**

A full-stack, multi-tenant SaaS platform that helps real estate agencies manage leads, analyze buyer intent with AI, automate follow-ups, and track their sales pipeline — all from a single premium dashboard.

---

## Features

### AI Lead Intelligence
- Paste or receive any raw lead message and get structured data extracted automatically
- Extracts: budget, location, property type, urgency, buyer intent, and summary
- Powered by **OpenAI GPT-4o-mini** with structured JSON output
- Re-analyze button to refresh AI fields anytime

### Smart Property Matching
- After AI analysis, the system scores all available properties against lead requirements
- Ranks by budget fit, location match, and property type similarity
- Shows top 3 matching properties directly on the lead detail page

### CRM Pipeline
- Full kanban board with 7 pipeline stages: New → Contacted → Qualified → Site Visit → Negotiation → Closed / Lost
- Table view with search, stage filter, urgency filter
- Lead detail page with conversation thread and AI follow-up drafts

### Property Management
- Full CRUD for properties with image uploads to Supabase Storage
- Search and filter by city, type, bedrooms, furnishing, status
- Image carousel, amenities checklist, property status badges

### Automation (n8n)
- **Workflow 1**: Webhook → AI analysis → store lead → notify admins
- **Workflow 2**: Daily cron → detect stale leads → create follow-up notifications
- **Workflow 3**: On-demand AI follow-up message drafting
- Public lead capture form at `/submit-lead` — share on your website or WhatsApp

### Analytics Dashboard
- Real-time charts: Lead volume (area), pipeline funnel (bar), source breakdown (donut)
- Top locations with animated bars, agent performance table
- AI-generated business insights from your live lead data

### Notifications
- In-app notification bell with unread count
- Types: new lead, follow-up reminder, AI, info
- Links directly to the relevant lead

### Multi-Tenant Architecture
- Every agency is an isolated organization
- Row Level Security (RLS) on every Supabase table
- Organization ID enforced on every query

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS + CSS custom properties |
| Animation | Framer Motion |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| AI | OpenAI API (GPT-4o-mini) |
| Charts | Recharts |
| Automation | n8n (self-hosted or cloud) |
| Deployment | Vercel + Supabase Cloud |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/            # Login, signup, forgot/reset password
│   ├── dashboard/         # Protected dashboard pages
│   │   ├── page.tsx       # Overview with live stats + AI insights
│   │   ├── leads/         # Lead list + kanban + detail page
│   │   ├── properties/    # Property grid + detail page
│   │   ├── analytics/     # Recharts analytics dashboard
│   │   └── settings/      # Org settings + team + integrations
│   ├── api/               # API routes (server-side)
│   │   ├── analyze-lead/
│   │   ├── recommend-properties/
│   │   ├── generate-followup/
│   │   ├── generate-insights/
│   │   ├── lead-webhook/
│   │   └── notifications/
│   └── submit-lead/       # Public lead capture form
├── components/
│   ├── dashboard/         # Sidebar, TopBar, NotificationsPanel
│   ├── leads/             # LeadFormModal, KanbanBoard
│   ├── properties/        # PropertyFormModal, PropertyFilterPanel
│   └── ui/                # Button, Input, Select, Modal, Badge, Card, StatCard
├── lib/
│   ├── hooks/             # useLeads, useProperties, useAnalytics, useNotifications
│   ├── auth/              # AuthProvider
│   └── supabase/          # client.ts, server.ts, middleware.ts
└── types/index.ts

supabase/
├── schema.sql             # Complete DB schema with RLS + triggers
└── seed.sql               # Demo data (10 properties + 10 leads)

n8n/
├── workflows/             # Import-ready n8n workflow JSONs
└── README.md              # n8n setup guide
```

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/your-username/estateflow-ai
cd estateflow-ai/estateflow
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In **SQL Editor → New Query**, paste and run `supabase/schema.sql`
3. In **Storage → New Bucket**, create a bucket named `property-images` and set it to **Public**
4. In **Settings → API**, copy your Project URL and anon key

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_ORG_ID=your-org-uuid   # Get from Settings page after first signup
WEBHOOK_SECRET=any-random-string
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:3000 → Sign up → Go to Settings to get your Org ID
```

### 5. Seed demo data (optional)

1. Go to **Settings → copy Organization ID**
2. Open `supabase/seed.sql`, replace `YOUR_ORG_UUID` and `YOUR_USER_UUID`
3. Run in Supabase SQL Editor

---

## Deployment

### Vercel

```bash
npx vercel
```

Or connect GitHub repo at [vercel.com](https://vercel.com). Add these env vars in Vercel Dashboard:

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `OPENAI_API_KEY` | platform.openai.com/api-keys |
| `NEXT_PUBLIC_ORG_ID` | Dashboard → Settings |
| `WEBHOOK_SECRET` | Any random string |

### n8n Automation

```bash
docker run -it --rm -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

Import workflows from `n8n/workflows/`. Full setup in `n8n/README.md`.

---

## API Reference

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/lead-webhook` | POST | Secret | Public lead intake — AI-analyze + store + notify |
| `/api/analyze-lead` | POST | Session | Re-run AI analysis on a lead |
| `/api/recommend-properties` | POST | Session | Top 3 property matches for a lead |
| `/api/generate-followup` | POST | Session | AI follow-up message draft |
| `/api/generate-insights` | POST | Session | AI business insights from live data |
| `/api/notifications` | GET | Session | Fetch user notifications |
| `/api/notifications` | PATCH | Session | Mark notifications as read |

**Webhook payload example:**
```json
{
  "name": "Rahul Sharma",
  "phone": "+91 98765 43210",
  "raw_message": "Need 3BHK in Chennai under 90 lakhs near metro",
  "source": "web_form",
  "organization_id": "your-org-uuid",
  "webhook_secret": "your-secret"
}
```

---

## Skills Demonstrated

| Area | Implementation |
|---|---|
| **AI Engineering** | Structured prompt engineering, JSON extraction, insight generation |
| **Full-Stack** | Next.js App Router, API routes, server + client components |
| **Database Design** | Multi-tenant schema, RLS policies, triggers, indexes |
| **Authentication** | Supabase Auth, session management, protected routes |
| **File Storage** | Supabase Storage, drag-and-drop image uploads |
| **Data Visualization** | Recharts (area, bar, donut), animated CSS bars |
| **Automation** | n8n workflows, webhook design, cron scheduling |
| **Architecture** | Multi-tenant SaaS, organization isolation, role-based access |
| **UX** | Loading skeletons, empty states, error handling, micro-animations |

---

## License

MIT
