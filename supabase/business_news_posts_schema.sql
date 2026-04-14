create table if not exists public.business_news_posts (
  id text primary key,
  business_id text not null references public.businesses(id) on delete cascade,
  title text not null,
  body text not null,
  image_path text,
  created_at timestamptz not null default now()
);

create index if not exists business_news_posts_business_created_idx
on public.business_news_posts (business_id, created_at desc);

alter table public.business_news_posts enable row level security;

drop policy if exists "Public read business news posts" on public.business_news_posts;

create policy "Public read business news posts"
on public.business_news_posts
for select
to anon, authenticated
using (true);
