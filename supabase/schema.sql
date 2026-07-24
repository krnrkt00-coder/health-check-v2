create table if not exists public.health_shared_state (
  id text primary key,
  people jsonb not null default '[]'::jsonb,
  records jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- The app uses the service role key from server-side API routes.
-- RLS is optional here; enabling it is fine because service role bypasses RLS.
alter table public.health_shared_state enable row level security;
