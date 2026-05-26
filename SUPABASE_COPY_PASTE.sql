-- ═══════════════════════════════════════════════════════════════
-- allig8or — Supabase SQL (copy entire file → SQL Editor → Run)
-- Dashboard: https://supabase.com/dashboard → your project → SQL
-- ═══════════════════════════════════════════════════════════════

-- Projects
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default 'Untitled',
  type text not null check (type in ('presentation', 'spreadsheet', 'document', 'website', 'pdf')),
  prompt text not null,
  file_url text,
  html_content text,
  messages jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table projects enable row level security;

drop policy if exists "Users can view own projects" on projects;
create policy "Users can view own projects"
  on projects for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own projects" on projects;
create policy "Users can insert own projects"
  on projects for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own projects" on projects;
create policy "Users can update own projects"
  on projects for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own projects" on projects;
create policy "Users can delete own projects"
  on projects for delete using (auth.uid() = user_id);

-- Usage
create table if not exists usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null,
  tokens_used integer default 0,
  created_at timestamp with time zone default now()
);

alter table usage enable row level security;

drop policy if exists "Users can view own usage" on usage;
create policy "Users can view own usage"
  on usage for select using (auth.uid() = user_id);

-- Subscriptions (Lemon Squeezy)
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  lemonsqueezy_customer_id text unique,
  lemonsqueezy_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  status text not null default 'active',
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table subscriptions enable row level security;

drop policy if exists "Users can view own subscription" on subscriptions;
create policy "Users can view own subscription"
  on subscriptions for select using (auth.uid() = user_id);

-- New user → free subscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'active')
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_projects_updated_at on projects;
create trigger update_projects_updated_at
  before update on projects
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_subscriptions_updated_at on subscriptions;
create trigger update_subscriptions_updated_at
  before update on subscriptions
  for each row execute procedure update_updated_at_column();
