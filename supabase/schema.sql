create extension if not exists "pgcrypto";

create or replace function public.format_relative_time_ko(source_time timestamptz)
returns text
language sql
stable
as $$
  select
    case
      when source_time is null then ''
      when now() - source_time < interval '1 hour' then
        greatest(1, floor(extract(epoch from now() - source_time) / 60))::int || '분 전'
      when now() - source_time < interval '1 day' then
        floor(extract(epoch from now() - source_time) / 3600)::int || '시간 전'
      when now() - source_time < interval '7 days' then
        floor(extract(epoch from now() - source_time) / 86400)::int || '일 전'
      when now() - source_time < interval '30 days' then
        floor(extract(epoch from now() - source_time) / 604800)::int || '주 전'
      else floor(extract(epoch from now() - source_time) / 2592000)::int || '개월 전'
    end
$$;

create or replace function public.format_price_krw(price integer)
returns text
language sql
immutable
as $$
  select case
    when price is null then null
    else to_char(price, 'FM999,999,999,990') || '원'
  end
$$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_url text,
  town text not null,
  response_rate integer not null default 0 check (response_rate between 0 and 100),
  manner_score numeric(4, 1) not null default 36.5,
  repeat_deals integer not null default 0 check (repeat_deals >= 0),
  badges text[] not null default '{}',
  is_business boolean not null default false,
  bio text,
  created_at timestamptz not null default now(),
  last_active_at timestamptz
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  price_value integer check (price_value is null or price_value >= 0),
  price_currency text not null default 'KRW',
  status text not null default 'active' check (status in ('active', 'reserved', 'sold')),
  category text not null,
  price_negotiable boolean not null default false,
  town text not null,
  posted_at timestamptz not null default now(),
  refreshed_at timestamptz,
  view_count integer not null default 0 check (view_count >= 0),
  likes_count integer not null default 0 check (likes_count >= 0),
  chats_count integer not null default 0 check (chats_count >= 0),
  meetup_place_name text,
  meetup_place_address text,
  meetup_place_lat numeric(10, 7),
  meetup_place_lng numeric(10, 7),
  meetup_distance_meters integer check (meetup_distance_meters is null or meetup_distance_meters >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.item_images (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  image_url text not null,
  sort_order integer not null check (sort_order between 0 and 4),
  created_at timestamptz not null default now(),
  constraint item_images_sort_order_unique unique (item_id, sort_order)
);

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists items_set_updated_at on public.items;
drop trigger if exists businesses_set_updated_at on public.businesses;
drop trigger if exists chat_threads_set_updated_at on public.chat_threads;

create trigger items_set_updated_at
before update on public.items
for each row
execute function public.set_updated_at();

create trigger chat_threads_set_updated_at
before update on public.chat_threads
for each row
execute function public.set_updated_at();

create index if not exists users_town_idx on public.users (town);
create index if not exists items_seller_id_idx on public.items (seller_id);
create index if not exists items_status_idx on public.items (status);
create index if not exists items_category_idx on public.items (category);
create index if not exists items_sort_idx on public.items (sort_order asc, posted_at desc, created_at desc);
create index if not exists item_images_item_id_idx on public.item_images (item_id, sort_order);
create index if not exists chat_threads_updated_at_idx on public.chat_threads (updated_at desc, created_at desc);
create index if not exists chat_messages_thread_id_idx on public.chat_messages (thread_id, sort_order, created_at);

alter table public.users enable row level security;
alter table public.items enable row level security;
alter table public.item_images enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Public read users" on public.users;
drop policy if exists "Public read items" on public.items;
drop policy if exists "Public read item images" on public.item_images;
drop policy if exists "Public read chat threads" on public.chat_threads;
drop policy if exists "Public read chat messages" on public.chat_messages;

create policy "Public read users"
on public.users
for select
to anon, authenticated
using (true);

create policy "Public read items"
on public.items
for select
to anon, authenticated
using (true);

create policy "Public read item images"
on public.item_images
for select
to anon, authenticated
using (true);

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

create or replace view public.sellers
with (security_invoker = true)
as
select
  u.id::text as id,
  u.name,
  coalesce(u.avatar_url, '') as avatar_url,
  u.town,
  u.response_rate,
  u.manner_score,
  u.repeat_deals,
  u.badges,
  u.created_at
from public.users as u;

create or replace view public.marketplace_items
with (security_invoker = true)
as
select
  i.id::text as id,
  i.seller_id::text as seller_id,
  i.title,
  null::text as subtitle,
  i.description,
  coalesce(img.image_url, '') as image_url,
  i.town,
  case
    when i.meetup_distance_meters is null then '거리 정보 없음'
    when i.meetup_distance_meters < 1000 then i.meetup_distance_meters::text || 'm'
    else round(i.meetup_distance_meters / 1000.0, 1)::text || 'km'
  end as distance,
  public.format_relative_time_ko(coalesce(i.refreshed_at, i.posted_at)) as posted_at_label,
  public.format_price_krw(i.price_value) as price_label,
  i.price_value,
  i.chats_count,
  i.likes_count,
  case
    when u.response_rate >= 95 then '응답이 정말 빨라요'
    when u.repeat_deals >= 10 then '재거래가 많은 판매자예요'
    when i.status = 'reserved' then '예약이 진행 중인 상품이에요'
    when i.status = 'sold' then '거래가 완료된 상품이에요'
    else '동네에서 신뢰를 쌓고 있는 판매자예요'
  end as trust_label,
  case
    when u.response_rate >= 95 then '최근 문의에도 빠르게 답하는 편이라 채팅 연결이 수월해요.'
    when u.repeat_deals >= 10 then '같은 동네에서 여러 번 거래한 이력이 있어 안심하고 문의하기 좋아요.'
    when i.price_negotiable then '가격 제안을 받을 수 있어 부담 없이 문의해볼 수 있어요.'
    else '상품 설명과 거래 장소 정보가 비교적 또렷하게 정리된 편이에요.'
  end as trust_note,
  array_remove(
    array[
      i.category,
      case when i.price_negotiable then '가격 제안 가능' else null end,
      case when i.meetup_place_name is not null then '거래 희망 장소: ' || i.meetup_place_name else null end
    ],
    null
  ) as selling_points,
  case
    when i.status = 'reserved' then '예약중'
    when i.status = 'sold' then '판매완료'
    else '판매중'
  end as condition_label,
  coalesce(i.meetup_place_name, i.town || ' 인근') as meetup_hint,
  false as promoted,
  i.sort_order,
  i.created_at
from public.items as i
join public.users as u on u.id = i.seller_id
left join lateral (
  select ii.image_url
  from public.item_images as ii
  where ii.item_id = i.id
  order by ii.sort_order asc, ii.created_at asc
  limit 1
) as img on true;
