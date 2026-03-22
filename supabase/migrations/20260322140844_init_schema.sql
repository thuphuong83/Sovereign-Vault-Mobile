-- ============================================================
-- Sovereign Vault — Initial Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Enums ───────────────────────────────────────────────────
create type asset_category as enum (
  'real_estate', 'metals', 'cash', 'equities', 'crypto', 'collectibles', 'other'
);

create type liability_category as enum (
  'mortgage', 'vehicle', 'personal', 'business', 'other'
);

-- ── Profiles ────────────────────────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  avatar_url   text,
  currency     text not null default 'VND',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Assets ──────────────────────────────────────────────────
create table public.assets (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  category    asset_category not null,
  value       numeric(20, 2) not null default 0,
  currency    text not null default 'VND',
  unit        text,
  quantity    numeric(20, 6),
  location    text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── Liabilities ─────────────────────────────────────────────
create table public.liabilities (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  name           text not null,
  category       liability_category not null,
  principal      numeric(20, 2) not null default 0,
  balance        numeric(20, 2) not null default 0,
  interest_rate  numeric(5, 4) not null default 0,
  currency       text not null default 'VND',
  lender         text,
  collateral     text,
  due_date       date,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ── Net Worth Snapshots ─────────────────────────────────────
create table public.net_worth_snapshots (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  total_assets      numeric(20, 2) not null default 0,
  total_liabilities numeric(20, 2) not null default 0,
  net_worth         numeric(20, 2) not null default 0,
  snapshotted_at    date not null default current_date,
  unique (user_id, snapshotted_at)
);

-- ── updated_at trigger function ─────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at    before update on public.profiles    for each row execute procedure public.set_updated_at();
create trigger assets_updated_at      before update on public.assets      for each row execute procedure public.set_updated_at();
create trigger liabilities_updated_at before update on public.liabilities for each row execute procedure public.set_updated_at();

-- ── Row Level Security ──────────────────────────────────────
alter table public.profiles            enable row level security;
alter table public.assets              enable row level security;
alter table public.liabilities         enable row level security;
alter table public.net_worth_snapshots enable row level security;

create policy "profiles: own read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);

create policy "assets: own all" on public.assets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "liabilities: own all" on public.liabilities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "snapshots: own all" on public.net_worth_snapshots
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Indexes ─────────────────────────────────────────────────
create index assets_user_id_idx       on public.assets(user_id);
create index assets_category_idx      on public.assets(category);
create index liabilities_user_id_idx  on public.liabilities(user_id);
create index snapshots_user_date_idx  on public.net_worth_snapshots(user_id, snapshotted_at desc);
