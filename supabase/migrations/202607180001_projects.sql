create table if not exists public.community_projects (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  project jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_projects enable row level security;

drop policy if exists "users read their community projects" on public.community_projects;
drop policy if exists "users create their community projects" on public.community_projects;
drop policy if exists "users update their community projects" on public.community_projects;
drop policy if exists "users delete their community projects" on public.community_projects;

create policy "users read their community projects" on public.community_projects for select using (auth.uid() = user_id);
create policy "users create their community projects" on public.community_projects for insert with check (auth.uid() = user_id);
create policy "users update their community projects" on public.community_projects for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users delete their community projects" on public.community_projects for delete using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('community-assets', 'community-assets', false)
on conflict (id) do nothing;

drop policy if exists "users manage their community assets" on storage.objects;

create policy "users manage their community assets" on storage.objects for all
using (bucket_id = 'community-assets' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'community-assets' and (storage.foldername(name))[1] = auth.uid()::text);
