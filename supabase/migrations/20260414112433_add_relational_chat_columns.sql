alter table public.chat_threads
  add column if not exists seller_id uuid references public.users(id) on delete cascade,
  add column if not exists buyer_id uuid references public.users(id) on delete cascade,
  add column if not exists status text not null default 'active' check (status in ('active', 'closed')),
  add column if not exists last_message_at timestamptz;

update public.chat_threads as ct
set seller_id = i.seller_id
from public.items as i
where ct.item_id = i.id
  and ct.seller_id is null;

update public.chat_threads
set buyer_id = '00000000-0000-0000-0000-000000001000'::uuid
where buyer_id is null;

update public.chat_threads
set last_message_at = updated_at
where last_message_at is null;

alter table public.chat_threads
  alter column seller_id set not null,
  alter column buyer_id set not null;

alter table public.chat_threads
  drop constraint if exists chat_threads_item_id_unique;

alter table public.chat_threads
  drop constraint if exists chat_threads_item_buyer_unique;

alter table public.chat_threads
  add constraint chat_threads_item_buyer_unique unique (item_id, buyer_id);

alter table public.chat_threads
  drop constraint if exists chat_threads_seller_buyer_different;

alter table public.chat_threads
  add constraint chat_threads_seller_buyer_different check (seller_id <> buyer_id);

alter table public.chat_messages
  add column if not exists sender_id uuid references public.users(id) on delete set null;

update public.chat_messages as cm
set sender_id = case
  when cm.message_type = 'buyer' then ct.buyer_id
  when cm.message_type = 'seller' then ct.seller_id
  else null
end
from public.chat_threads as ct
where cm.thread_id = ct.id
  and cm.sender_id is null;

create index if not exists chat_threads_seller_id_updated_at_idx
on public.chat_threads (seller_id, updated_at desc, created_at desc);

create index if not exists chat_threads_buyer_id_updated_at_idx
on public.chat_threads (buyer_id, updated_at desc, created_at desc);

create index if not exists chat_messages_sender_id_idx
on public.chat_messages (sender_id, created_at desc);
