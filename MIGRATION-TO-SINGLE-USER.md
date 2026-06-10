# Migration from Multi-Tenant to Single-User EstateFlow

This guide will help you migrate your EstateFlow application from a multi-tenant system (supporting multiple real estate organizations) to a single-user personal real estate CRM.

## ⚠️ Important: Backup Your Data First!

Before proceeding, **backup your existing Supabase database** as this process will modify your database schema and cannot be easily reversed.

## Step 1: Database Migration

### Option A: Fresh Start (Recommended for Development)

If you're okay with starting fresh with sample data:

1. Go to your Supabase Dashboard → SQL Editor
2. Run the new schema file: `supabase/schema-single-user.sql`
3. Run the seed data: `supabase/seed-single-user.sql` (replace `YOUR_USER_UUID` with your actual user ID)

### Option B: Preserve Existing Data

If you need to preserve your existing properties and leads:

1. **Export your current data:**
   ```sql
   -- Export properties
   SELECT * FROM properties WHERE organization_id = 'YOUR_ORG_ID';
   
   -- Export leads  
   SELECT * FROM leads WHERE organization_id = 'YOUR_ORG_ID';
   ```

2. **Run the new schema:** Execute `supabase/schema-single-user.sql`

3. **Import your data back** (remove organization_id from your exported data first)

## Step 2: Update Environment Variables

Remove or update these environment variables:

```env
# Remove these if they exist:
NEXT_PUBLIC_ORG_ID=
```

The following variables remain the same:
```env
NEXT_PUBLIC_SB_URL=your_supabase_url
NEXT_PUBLIC_SB_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
RESEND_API_KEY=your_resend_key
WEBHOOK_SECRET=your_webhook_secret
N8N_VISIT_CONFIRMATION_WEBHOOK=your_n8n_webhook
```

## Step 3: Test the Application

1. **Sign up for a new account** (or use existing)
2. **Verify functionality:**
   - ✅ Properties: Create, view, edit, delete properties
   - ✅ Leads: View leads, add notes, change status
   - ✅ Visits: Schedule and manage site visits
   - ✅ Tenants: Add and manage tenants (for property management)
   - ✅ Maintenance: Create maintenance tickets
   - ✅ Notifications: Receive notifications for new leads/visits

## Changes Made

### Database Schema Changes:
- ❌ Removed `organizations` table
- ❌ Removed `organization_id` from all tables
- ❌ Removed role-based permissions (`admin`/`agent`)
- ✅ Simplified RLS policies to user-based only
- ✅ Added missing tables: `tenants`, `leases`, `maintenance_tickets`, `visitors`, `visits`

### Code Changes:
- ❌ Removed organization context from auth provider
- ❌ Removed role system completely
- ✅ Updated all data hooks to remove organization filtering
- ✅ Updated UI to show "Personal Real Estate CRM" instead of organization name
- ✅ Simplified sidebar to show "Owner" instead of role
- ✅ Updated API routes to work without organization context

### Features Now Available:
- 🏠 **Property Management**: Add, edit, and manage your property listings
- 👥 **Lead Management**: Track potential buyers with AI-powered analysis
- 📅 **Visit Scheduling**: Manage site visits and appointments
- 🏢 **Tenant Management**: Handle tenants and lease agreements
- 🔧 **Maintenance Tracking**: Create and track maintenance requests
- 📊 **Analytics**: View insights about your properties and leads
- 🔔 **Notifications**: Get notified about new leads and visits

## Webhook Integration

Your webhook endpoints remain the same, but they no longer require `organization_id`:

### Lead Webhook (WhatsApp/Web Forms):
```json
POST /api/lead-webhook
{
  "name": "John Doe",
  "phone": "(512) 555-0142",
  "email": "john@example.com",
  "raw_message": "Looking for a 3-bed in Austin under $650K",
  "source": "sms",
  "webhook_secret": "your_secret"
}
```

### Visit Booking (Public Form):
```json
POST /api/public/book-visit
{
  "visitor_name": "Jane Smith",
  "visitor_phone": "(512) 555-0188",
  "visitor_email": "jane@example.com",
  "property_id": "uuid-of-property",
  "visit_date": "2026-06-01",
  "visit_time": "14:00"
}
```

## Troubleshooting

### Issue: "Profile not found" errors
- Ensure your user profile exists in the `profiles` table
- Check that RLS policies are properly applied

### Issue: No properties showing
- Verify properties exist in database
- Check browser console for JavaScript errors

### Issue: Webhooks not working
- Verify `WEBHOOK_SECRET` environment variable matches
- Check Supabase service role key is correct

## Support

If you encounter issues during migration, check:

1. **Browser Console**: Look for JavaScript errors
2. **Supabase Logs**: Check for database query errors  
3. **Network Tab**: Verify API requests are successful
4. **Database**: Ensure RLS policies allow your user to access data

Your EstateFlow is now a personal real estate CRM! 🎉