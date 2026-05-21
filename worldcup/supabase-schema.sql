create table if not exists public.worldcup_participants (
  id text primary key,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.worldcup_predictions (
  participant_id text not null references public.worldcup_participants(id) on delete cascade,
  match_id text not null,
  home_score integer check (home_score between 0 and 99),
  away_score integer check (away_score between 0 and 99),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (participant_id, match_id)
);

create table if not exists public.worldcup_results (
  match_id text primary key,
  home_score integer check (home_score between 0 and 99),
  away_score integer check (away_score between 0 and 99),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_worldcup_participants_updated_at on public.worldcup_participants;
create trigger touch_worldcup_participants_updated_at
before update on public.worldcup_participants
for each row execute function public.touch_updated_at();

drop trigger if exists touch_worldcup_predictions_updated_at on public.worldcup_predictions;
create trigger touch_worldcup_predictions_updated_at
before update on public.worldcup_predictions
for each row execute function public.touch_updated_at();

drop trigger if exists touch_worldcup_results_updated_at on public.worldcup_results;
create trigger touch_worldcup_results_updated_at
before update on public.worldcup_results
for each row execute function public.touch_updated_at();

alter table public.worldcup_participants enable row level security;
alter table public.worldcup_predictions enable row level security;
alter table public.worldcup_results enable row level security;

grant usage on schema public to anon;
grant select, insert, update, delete on public.worldcup_participants to anon;
grant select, insert, update, delete on public.worldcup_predictions to anon;
grant select, insert, update, delete on public.worldcup_results to anon;

drop policy if exists "worldcup participants read" on public.worldcup_participants;
create policy "worldcup participants read"
on public.worldcup_participants for select
to anon
using (true);

drop policy if exists "worldcup participants insert" on public.worldcup_participants;
create policy "worldcup participants insert"
on public.worldcup_participants for insert
to anon
with check (true);

drop policy if exists "worldcup participants update" on public.worldcup_participants;
create policy "worldcup participants update"
on public.worldcup_participants for update
to anon
using (true)
with check (true);

drop policy if exists "worldcup participants delete" on public.worldcup_participants;
create policy "worldcup participants delete"
on public.worldcup_participants for delete
to anon
using (true);

drop policy if exists "worldcup predictions read" on public.worldcup_predictions;
create policy "worldcup predictions read"
on public.worldcup_predictions for select
to anon
using (true);

drop policy if exists "worldcup predictions insert" on public.worldcup_predictions;
create policy "worldcup predictions insert"
on public.worldcup_predictions for insert
to anon
with check (true);

drop policy if exists "worldcup predictions update" on public.worldcup_predictions;
create policy "worldcup predictions update"
on public.worldcup_predictions for update
to anon
using (true)
with check (true);

drop policy if exists "worldcup predictions delete" on public.worldcup_predictions;
create policy "worldcup predictions delete"
on public.worldcup_predictions for delete
to anon
using (true);

drop policy if exists "worldcup results read" on public.worldcup_results;
create policy "worldcup results read"
on public.worldcup_results for select
to anon
using (true);

drop policy if exists "worldcup results insert" on public.worldcup_results;
create policy "worldcup results insert"
on public.worldcup_results for insert
to anon
with check (true);

drop policy if exists "worldcup results update" on public.worldcup_results;
create policy "worldcup results update"
on public.worldcup_results for update
to anon
using (true)
with check (true);

drop policy if exists "worldcup results delete" on public.worldcup_results;
create policy "worldcup results delete"
on public.worldcup_results for delete
to anon
using (true);

insert into public.worldcup_participants (id, name, sort_order)
values
  ('person-cho-younghun', '조영훈', 0),
  ('person-cho-sihun', '조시훈', 1),
  ('person-kim-hyunsung', '김현성', 2)
on conflict (id) do update
set name = excluded.name,
    sort_order = excluded.sort_order;
