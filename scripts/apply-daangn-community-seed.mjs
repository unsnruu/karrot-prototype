import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const projectRoot = process.cwd();
const envFilePath = path.join(projectRoot, ".env.local");
const datasetSlug = process.env.COMMUNITY_SEED_SLUG || "daangn-ara";
const assetPath = path.join(projectRoot, "public", "assets", "community", datasetSlug, "posts.json");

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
