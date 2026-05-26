alter table public.community_posts
  add column if not exists seed_comments jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'community_posts_seed_comments_array_check'
      and conrelid = 'public.community_posts'::regclass
  ) then
    alter table public.community_posts
      add constraint community_posts_seed_comments_array_check
      check (jsonb_typeof(seed_comments) = 'array');
  end if;
end $$;

with comment_plans as (
  select
    id,
    topic,
    title,
    town,
    (('x' || substr(md5(id::text), 1, 2))::bit(8)::int % 4) as comment_count,
    (('x' || substr(md5(id::text || ':' || title), 1, 2))::bit(8)::int) as offset_seed
  from public.community_posts
),
comment_sources as (
  select
    id,
    town,
    comment_count,
    offset_seed,
    array['동네이웃', '아라주민', '검단러', '지나가다', '동네생활러', '이웃님'] as authors,
    array['12분 전', '28분 전', '1시간 전'] as times,
    case topic
      when '고민/사연' then array[
        '너무 조급하게 생각하지 마세요. 조건 맞는 곳 찾는 게 생각보다 오래 걸리더라고요.',
        '저도 비슷한 고민 있었는데 시간대 맞는 일부터 작게 찾아보는 것도 괜찮았어요.',
        '아이 돌보면서 일 찾는 거 쉽지 않죠. 응원합니다.'
      ]
      when '동네사건사고' then array[
        '그 시간대에 지나가신 분들이 보면 좋겠네요. 다친 분은 없었으면 좋겠어요.',
        '혹시 블랙박스 있는 차량이면 도움이 될 수도 있겠어요.',
        '근처 사시는 분들 조심하셔야겠네요.'
      ]
      when '분실/실종' then array[
        '근처 지나가면 한번 살펴볼게요. 꼭 찾으셨으면 좋겠어요.',
        '관리사무소나 기사님 쪽에도 문의해보시면 좋을 것 같아요.',
        '사진이나 특징 있으면 더 찾기 쉬울 것 같아요.'
      ]
      when '반려동물' then array[
        '근처 산책길에서 보면 바로 댓글 남길게요.',
        '사진이 있으면 주변에 공유하기 더 좋을 것 같아요.',
        '빨리 주인분이나 도움 주실 분이 나타나면 좋겠어요.'
      ]
      when '맛집' then array[
        '여기 궁금했는데 후기 감사합니다.',
        '혹시 주차나 웨이팅은 어떤지도 궁금해요.',
        '근처 갈 일 있으면 한번 들러봐야겠네요.'
      ]
      when '병원/약국' then array[
        '저도 추천 궁금해서 댓글 보고 갈게요.',
        '진료 시간이나 대기 긴지도 같이 알면 좋겠어요.',
        '근처 다녀보신 분들 의견 있으면 도움 될 것 같아요.'
      ]
      else array[
        '저도 궁금했어요. 아시는 분 있으면 같이 참고할게요.',
        '비슷한 상황 겪어본 적 있어서 댓글 남겨요. 조금 더 알아보면 좋을 것 같아요.',
        '동네에 아시는 분 있을 것 같아요. 저도 주변에 한번 물어볼게요.',
        '혹시 해결되면 공유 부탁드려요. 저도 궁금하네요.'
      ]
    end as bodies
  from comment_plans
)
update public.community_posts as post
set seed_comments = coalesce(seed_comments.comments, '[]'::jsonb)
from comment_sources as source
cross join lateral (
  select jsonb_agg(
    jsonb_build_object(
      'id', source.id::text || '-seed-comment-' || comment_index,
      'authorName', source.authors[((source.offset_seed + comment_index - 1) % array_length(source.authors, 1)) + 1],
      'authorAvatar', '/images/fallback-placeholder.webp',
      'metaLabel', source.town || ' · ' || source.times[comment_index],
      'body', source.bodies[((source.offset_seed + comment_index - 1) % array_length(source.bodies, 1)) + 1]
    )
    order by comment_index
  ) as comments
  from generate_series(1, source.comment_count) as comment_index
) as seed_comments
where post.id = source.id;
