create extension if not exists "pgcrypto";

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users(id) on delete cascade,
  topic text not null check (topic in ('일반', '고민/사연', '동네풍경')),
  title text not null,
  body text not null,
  town text not null,
  image_path text,
  views_count integer not null default 0 check (views_count >= 0),
  likes_count integer not null default 0 check (likes_count >= 0),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_posts_topic_idx
on public.community_posts (topic);

create index if not exists community_posts_author_idx
on public.community_posts (author_id);

create index if not exists community_posts_town_idx
on public.community_posts (town);

create index if not exists community_posts_sort_idx
on public.community_posts (sort_order asc, published_at desc, created_at desc);

alter table public.community_posts enable row level security;

drop policy if exists "Public read community posts" on public.community_posts;

create policy "Public read community posts"
on public.community_posts
for select
to anon, authenticated
using (true);
