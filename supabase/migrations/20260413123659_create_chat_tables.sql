create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  buyer_name text not null,
  last_seen_label text not null default '방금',
  response_label text not null default '보통 30분 이내 응답',
  updated_at_label text not null default '방금',
  last_message_preview text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chat_threads_item_id_unique unique (item_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  message_type text not null check (message_type in ('buyer', 'seller', 'system-date', 'system-notice')),
  body text not null,
  sent_at_label text,
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

drop trigger if exists chat_threads_set_updated_at on public.chat_threads;

create trigger chat_threads_set_updated_at
before update on public.chat_threads
for each row
execute function public.set_updated_at();

create index if not exists chat_threads_updated_at_idx
on public.chat_threads (updated_at desc, created_at desc);

create index if not exists chat_messages_thread_id_idx
on public.chat_messages (thread_id, sort_order, created_at);

alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Public read chat threads" on public.chat_threads;
drop policy if exists "Public read chat messages" on public.chat_messages;

create policy "Public read chat threads"
on public.chat_threads
for select
to anon, authenticated
using (true);

create policy "Public read chat messages"
on public.chat_messages
for select
to anon, authenticated
using (true);
