alter table public.businesses
add column if not exists image_url text;

comment on column public.businesses.image_url is '대표 업체 이미지의 공개 URL';
