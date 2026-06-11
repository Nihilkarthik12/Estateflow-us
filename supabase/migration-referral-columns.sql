-- Adds the two columns workflows 08/09 need.
-- Run this once in the Supabase SQL Editor (US project: mishbyycoknjwtrmrpkn).

alter table public.leads
  add column if not exists closed_at timestamp with time zone,
  add column if not exists referral_followup_sent_at timestamp with time zone;

-- Stamp closed_at automatically whenever a lead moves to 'closed'
create or replace function public.set_lead_closed_at()
returns trigger as $$
begin
  if new.status = 'closed' and (old.status is distinct from 'closed') then
    new.closed_at := now();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_lead_closed_at on public.leads;
create trigger trg_lead_closed_at
  before update on public.leads
  for each row execute function public.set_lead_closed_at();
