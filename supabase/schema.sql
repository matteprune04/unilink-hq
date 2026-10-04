-- UniLink HQ — struttura del database (Supabase / Postgres)
-- Da incollare UNA volta in Supabase → SQL Editor → Run.
-- Tutti i dati sono leggibili e modificabili SOLO da chi ha fatto l'accesso con
-- l'account unico del team (hq@unilinkfirenze.it). Chiunque altro non vede nulla.

create table if not exists public.docs (
  col        text        not null,           -- sezione: ideas, tasks, okrs, metrics, google, ...
  id         text        not null,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (col, id)
);

create table if not exists public.images (
  id   text primary key,
  data text not null,                        -- immagine JPEG compressa (data URL)
  by   text,
  at   timestamptz not null default now()
);

alter table public.docs   enable row level security;
alter table public.images enable row level security;
alter table public.docs   replica identity full;   -- serve per ricevere anche le cancellazioni in tempo reale

create or replace function public.is_hq_team() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'hq@unilinkfirenze.it'
$$;

drop policy if exists hq_team_docs on public.docs;
create policy hq_team_docs on public.docs
  for all to authenticated using (public.is_hq_team()) with check (public.is_hq_team());

drop policy if exists hq_team_images on public.images;
create policy hq_team_images on public.images
  for all to authenticated using (public.is_hq_team()) with check (public.is_hq_team());

-- aggiornamenti in tempo reale tra i dispositivi (solo la tabella docs: le immagini si caricano a richiesta)
do $$ begin
  alter publication supabase_realtime add table public.docs;
exception when duplicate_object then null; end $$;
