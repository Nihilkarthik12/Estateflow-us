@echo off
REM ============================================================
REM   EstateFlow US n8n launcher  —  double-click to start
REM
REM   This is a SEPARATE n8n instance from the UAE one:
REM     UAE n8n  ->  port 5678,  data in D:\n8n-data
REM     US  n8n  ->  port 5679,  data in D:\n8n-data-us
REM   Both can run at the same time without touching each other.
REM ============================================================

set N8N_USER_FOLDER=D:\n8n-data-us
set N8N_PORT=5679
set N8N_BLOCK_ENV_ACCESS_IN_NODE=false

REM Point at the US app (local dev server). Change to your Vercel
REM URL when the US site is deployed.
set ESTATEFLOW_URL=http://localhost:3000

set N8N_SECRET=estateflow-us-n8n-secret-2026
set WEBHOOK_SECRET=estateflow-us-webhook-2026

REM US Supabase project (mishbyycoknjwtrmrpkn) — separate from UAE
set NEXT_PUBLIC_SB_URL=https://mishbyycoknjwtrmrpkn.supabase.co
set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pc2hieXljb2tuand0cm1ycGtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTA1NjY1MywiZXhwIjoyMDk2NjMyNjUzfQ.udK47V1WlPx89AEROS0hgh7R7ldmBLNAE8_HE4qq-sg

set WATI_API_KEY=skip-for-now
set WATI_ACCOUNT_ID=skip-for-now

echo Starting US n8n... open http://localhost:5679 in your browser
echo (UAE n8n stays on http://localhost:5678 - both can run together)
echo (Keep this window OPEN. Closing it stops n8n.)
call D:\n8n-global\n8n.cmd start
pause
