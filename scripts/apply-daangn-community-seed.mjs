import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const projectRoot = process.cwd();
const envFilePath = path.join(projectRoot, ".env.local");
const datasetSlug = process.env.COMMUNITY_SEED_SLUG || "daangn-ara";
const assetPath = path.join(projectRoot, "public", "assets", "community", datasetSlug, "posts.json");
const fallbackAvatarSrc = "/images/fallback-placeholder.webp";
const seedCommentAuthors = ["동네이웃", "아라주민", "검단러", "지나가다", "동네생활러", "이웃님"];
const seedCommentTimes = ["12분 전", "28분 전", "1시간 전"];
const genericSeedCommentBodies = [
  "저도 궁금했어요. 아시는 분 있으면 같이 참고할게요.",
  "비슷한 상황 겪어본 적 있어서 댓글 남겨요. 조금 더 알아보면 좋을 것 같아요.",
  "동네에 아시는 분 있을 것 같아요. 저도 주변에 한번 물어볼게요.",
  "혹시 해결되면 공유 부탁드려요. 저도 궁금하네요.",
];
const topicSeedCommentBodies = {
  "고민/사연": [
    "너무 조급하게 생각하지 마세요. 조건 맞는 곳 찾는 게 생각보다 오래 걸리더라고요.",
    "저도 비슷한 고민 있었는데 시간대 맞는 일부터 작게 찾아보는 것도 괜찮았어요.",
    "아이 돌보면서 일 찾는 거 쉽지 않죠. 응원합니다.",
  ],
  "동네사건사고": [
    "그 시간대에 지나가신 분들이 보면 좋겠네요. 다친 분은 없었으면 좋겠어요.",
    "혹시 블랙박스 있는 차량이면 도움이 될 수도 있겠어요.",
    "근처 사시는 분들 조심하셔야겠네요.",
  ],
  "분실/실종": [
    "근처 지나가면 한번 살펴볼게요. 꼭 찾으셨으면 좋겠어요.",
    "관리사무소나 기사님 쪽에도 문의해보시면 좋을 것 같아요.",
    "사진이나 특징 있으면 더 찾기 쉬울 것 같아요.",
  ],
  "반려동물": [
    "근처 산책길에서 보면 바로 댓글 남길게요.",
    "사진이 있으면 주변에 공유하기 더 좋을 것 같아요.",
    "빨리 주인분이나 도움 주실 분이 나타나면 좋겠어요.",
  ],
  맛집: [
    "여기 궁금했는데 후기 감사합니다.",
    "혹시 주차나 웨이팅은 어떤지도 궁금해요.",
    "근처 갈 일 있으면 한번 들러봐야겠네요.",
  ],
  "병원/약국": [
    "저도 추천 궁금해서 댓글 보고 갈게요.",
    "진료 시간이나 대기 긴지도 같이 알면 좋겠어요.",
    "근처 다녀보신 분들 의견 있으면 도움 될 것 같아요.",
  ],
};

function hashString(value) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function buildSeedComments(post) {
  const count = hashString(post.id) % 4;
  const bodies = topicSeedCommentBodies[post.topic] ?? genericSeedCommentBodies;
  const offset = hashString(`${post.id}:${post.title}`) % bodies.length;

  return Array.from({ length: count }, (_, index) => ({
    id: `${post.id}-seed-comment-${index + 1}`,
    authorName: seedCommentAuthors[(offset + index) % seedCommentAuthors.length],
    authorAvatar: fallbackAvatarSrc,
    metaLabel: `${post.neighborhood} · ${seedCommentTimes[index]}`,
    body: bodies[(offset + index) % bodies.length],
  }));
}

function parseEnv(source) {
  const values = {};

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

async function loadEnv() {
  const source = await readFile(envFilePath, "utf8");
  const parsed = parseEnv(source);

  for (const [key, value] of Object.entries(parsed)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function toCommunityRow(post) {
  return {
    id: post.id,
    author_id: post.authorId,
    topic: post.topic,
    title: post.title,
    summary: post.summary,
    body: post.body,
    town: post.neighborhood,
    image_path: post.imagePath || null,
    views_count: post.viewsCount,
    likes_count: post.likesCount,
    seed_comments: post.seedComments ?? buildSeedComments(post),
    sort_order: post.sortOrder,
    published_at: post.publishedAt,
  };
}

async function main() {
  const shouldConfirm = process.argv.includes("--confirm");
  await loadEnv();

  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!projectUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.");
  }

  const seed = JSON.parse(await readFile(assetPath, "utf8"));
  const rows = seed.posts.map(toCommunityRow);
  const authors = seed.authors.map((author) => ({
    id: author.id,
    name: author.name,
    town: author.town,
  }));

  if (!shouldConfirm) {
    console.log(`Dry run: ${rows.length} posts, ${seed.topics.length} topics, ${authors.length} authors.`);
    console.log("Run with --confirm after the remote table has been cleared and topic constraint expanded.");
    return;
  }

  const supabase = createClient(projectUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { error: authorError } = await supabase.from("users").upsert(authors, { onConflict: "id" });

  if (authorError) {
    throw authorError;
  }

  for (let index = 0; index < rows.length; index += 25) {
    const chunk = rows.slice(index, index + 25);
    const { error } = await supabase.from("community_posts").insert(chunk);

    if (error) {
      throw error;
    }
  }

  const { count, error: countError } = await supabase
    .from("community_posts")
    .select("id", { count: "exact", head: true });

  if (countError) {
    throw countError;
  }

  const { data: topicRows, error: topicError } = await supabase
    .from("community_posts")
    .select("topic")
    .order("topic", { ascending: true });

  if (topicError) {
    throw topicError;
  }

  const topicCounts = new Map();
  for (const row of topicRows ?? []) {
    topicCounts.set(row.topic, (topicCounts.get(row.topic) ?? 0) + 1);
  }

  console.log(`Inserted ${count} community posts.`);
  console.log([...topicCounts.entries()].map(([topic, topicCount]) => `${topic}: ${topicCount}`).join("\n"));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
