import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const projectRoot = process.cwd();
const envFilePath = path.join(projectRoot, ".env.local");

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
  const envSource = await readFile(envFilePath, "utf8");
  const parsed = parseEnv(envSource);

  for (const [key, value] of Object.entries(parsed)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function normalizeSlashes(value) {
  return value.split(path.sep).join("/");
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".webp":
      return "image/webp";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

async function walkFiles(dir) {
  const names = (await readdir(dir)).sort((left, right) => left.localeCompare(right));
  const files = [];

  for (const name of names) {
    const absolutePath = path.join(dir, name);
    const entryStat = await stat(absolutePath);

    if (entryStat.isDirectory()) {
      files.push(...await walkFiles(absolutePath));
      continue;
    }

    files.push(absolutePath);
  }

  return files;
}

function buildStoragePublicUrl(projectUrl, bucket, objectPath) {
  const trimmedProjectUrl = projectUrl.replace(/\/+$/, "");

  return `${trimmedProjectUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
}

function toSafeObjectPath(objectPath) {
  return objectPath
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment).replaceAll("%", "_"))
    .join("/");
}

async function buildBusinessNewsObjectPathMap() {
  const seedSqlPath = path.join(projectRoot, "supabase", "seed.sql");
  const seedSql = await readFile(seedSqlPath, "utf8");
  const businessIdByDirectory = new Map();

  const businessInsertPattern = /\('([^']+)','([^']+)'/g;
  for (const match of seedSql.matchAll(businessInsertPattern)) {
    const [, businessId, businessName] = match;
    if (businessId.startsWith("biz_")) {
      businessIdByDirectory.set(businessName, businessId);
    }
  }

  const objectPathByRelativePath = new Map();
  const files = await walkFiles(path.join(projectRoot, "supabase", "images", "business-news"));

  for (const absolutePath of files) {
    const relativePath = normalizeSlashes(path.relative(path.join(projectRoot, "supabase", "images", "business-news"), absolutePath));
    const segments = relativePath.split("/");

    if (segments.length < 3) {
      continue;
    }

    const [businessDirectory, newsDirectory, fileName] = segments;
    const businessId = businessIdByDirectory.get(businessDirectory);
    const newsMatch = newsDirectory.match(/(\d+)/);

    if (!businessId || !newsMatch) {
      continue;
    }

    objectPathByRelativePath.set(relativePath, `${businessId}/news-${newsMatch[1]}/${fileName}`);
  }

  return objectPathByRelativePath;
}

function createTableUpdater(client, mapping) {
  async function tableExists(table, selectColumns) {
    const { error } = await client.from(table).select(selectColumns).limit(1);

    if (!error) {
      return true;
    }

    if (String(error.message).includes("Could not find the table")) {
      return false;
    }

    throw error;
  }

  async function updateRows({ table, keyColumn, imageColumn, resolveNextValue }) {
    const exists = await tableExists(table, `${keyColumn},${imageColumn}`);

    if (!exists) {
      return { table, exists: false, updated: 0 };
    }

    const { data, error } = await client.from(table).select(`${keyColumn},${imageColumn}`);

    if (error) {
      throw error;
    }

    let updated = 0;

    for (const row of data ?? []) {
      const currentValue = row[imageColumn];
      const nextValue = resolveNextValue(currentValue, mapping);

      if (!nextValue || nextValue === currentValue) {
        continue;
      }

      const { error: updateError } = await client
        .from(table)
        .update({ [imageColumn]: nextValue })
        .eq(keyColumn, row[keyColumn]);

      if (updateError) {
        throw updateError;
      }

      updated += 1;
    }

    return { table, exists: true, updated };
  }

  return { updateRows };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function replaceInFiles(replacements, projectUrl) {
  const targets = [
    path.join(projectRoot, "lib", "sell-flow.ts"),
    path.join(projectRoot, "supabase", "seed.sql"),
    path.join(projectRoot, "supabase", "community_posts_seed.sql"),
    path.join(projectRoot, "supabase", "community_posts_seed.csv"),
    path.join(projectRoot, "supabase", "business_news_posts_seed.sql"),
  ];

  for (const target of targets) {
    let content = await readFile(target, "utf8");
    let changed = false;

    for (const [from, to] of replacements) {
      if (!content.includes(from)) {
        continue;
      }

      content = content.split(from).join(to);
      changed = true;
    }

    const escapedProjectUrl = escapeRegex(projectUrl);
    const duplicateItemUrlPattern = new RegExp(
      `/api/item-images/(?:${escapedProjectUrl}/storage/v1/object/public/items/)+`,
      "g",
    );
    const duplicateNativeAdUrlPattern = new RegExp(
      `(?:${escapedProjectUrl}/storage/v1/object/public/home-native-ads/){2,}`,
      "g",
    );
    const duplicateCommunityUrlPattern = new RegExp(
      `(?:${escapedProjectUrl}/storage/v1/object/public/community-posts/){2,}`,
      "g",
    );

    const normalizedContent = content
      .replace(duplicateItemUrlPattern, `${projectUrl}/storage/v1/object/public/items/`)
      .replace(duplicateCommunityUrlPattern, `${projectUrl}/storage/v1/object/public/community-posts/`)
      .replace(duplicateNativeAdUrlPattern, `${projectUrl}/storage/v1/object/public/home-native-ads/`);

    if (normalizedContent !== content) {
      content = normalizedContent;
      changed = true;
    }

    if (changed) {
      await writeFile(target, content, "utf8");
    }
  }
}

async function main() {
  await loadEnv();

  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

  if (!projectUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  const client = createClient(projectUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const imageGroups = [
    {
      bucket: "items",
      root: path.join(projectRoot, "supabase", "images", "items"),
      localRoutePrefix: "/api/item-images/",
    },
    {
      bucket: "community-posts",
      root: path.join(projectRoot, "supabase", "images", "community-posts"),
    },
    {
      bucket: "business-news",
      root: path.join(projectRoot, "supabase", "images", "business-news"),
    },
    {
      bucket: "home-native-ads",
      root: path.join(projectRoot, "supabase", "images", "home-native-ads"),
    },
  ];

  const replacements = new Map();
  const uploadSummary = [];
  const businessNewsObjectPathMap = await buildBusinessNewsObjectPathMap();

  for (const group of imageGroups) {
    const { bucket, root, localRoutePrefix } = group;
    const { data: existingBucket, error: bucketError } = await client.storage.getBucket(bucket);

    if (bucketError && !String(bucketError.message).includes("not found")) {
      throw bucketError;
    }

    if (!existingBucket) {
      const { error: createBucketError } = await client.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: "10MB",
      });

      if (createBucketError && !String(createBucketError.message).includes("exists")) {
        throw createBucketError;
      }
    }

    const files = await walkFiles(root);

    for (const absolutePath of files) {
      const buffer = await readFile(absolutePath);
      const relativePath = normalizeSlashes(path.relative(root, absolutePath));
      const objectPath = bucket === "business-news"
        ? businessNewsObjectPathMap.get(relativePath) ?? toSafeObjectPath(relativePath)
        : toSafeObjectPath(relativePath);
      const { error: uploadError } = await client.storage.from(bucket).upload(objectPath, buffer, {
        upsert: true,
        contentType: getContentType(absolutePath),
      });

      if (uploadError) {
        throw uploadError;
      }

      const publicUrl = buildStoragePublicUrl(projectUrl, bucket, objectPath);
      if (bucket === "community-posts" || bucket === "business-news") {
        replacements.set(relativePath, publicUrl);
      }

      if (bucket === "business-news") {
        const oldPublicUrl = buildStoragePublicUrl(projectUrl, bucket, toSafeObjectPath(relativePath));
        replacements.set(oldPublicUrl, publicUrl);
      }

      if (localRoutePrefix) {
        replacements.set(`${localRoutePrefix}${relativePath}`, publicUrl);
      }

      uploadSummary.push({ bucket, relativePath, publicUrl });
    }
  }

  const { updateRows } = createTableUpdater(client, replacements);

  const updateResults = [];

  updateResults.push(await updateRows({
    table: "users",
    keyColumn: "id",
    imageColumn: "avatar_url",
    resolveNextValue(currentValue, imageMapping) {
      if (typeof currentValue !== "string") return null;
      return imageMapping.get(currentValue) ?? null;
    },
  }));

  updateResults.push(await updateRows({
    table: "item_images",
    keyColumn: "id",
    imageColumn: "image_url",
    resolveNextValue(currentValue, imageMapping) {
      if (typeof currentValue !== "string") return null;
      return imageMapping.get(currentValue) ?? null;
    },
  }));

  updateResults.push(await updateRows({
    table: "community_posts",
    keyColumn: "id",
    imageColumn: "image_path",
    resolveNextValue(currentValue, imageMapping) {
      if (typeof currentValue !== "string") return null;
      return imageMapping.get(currentValue) ?? null;
    },
  }));

  updateResults.push(await updateRows({
    table: "business_news_posts",
    keyColumn: "id",
    imageColumn: "image_path",
    resolveNextValue(currentValue, imageMapping) {
      if (typeof currentValue !== "string") return null;
      return imageMapping.get(currentValue) ?? null;
    },
  }));

  updateResults.push(await updateRows({
    table: "home_native_ads",
    keyColumn: "id",
    imageColumn: "image_url",
    resolveNextValue(currentValue, imageMapping) {
      if (typeof currentValue !== "string") return null;
      return imageMapping.get(currentValue) ?? null;
    },
  }));

  await replaceInFiles([...replacements.entries()], projectUrl);

  const result = {
    uploaded: uploadSummary.length,
    buckets: imageGroups.map((group) => group.bucket),
    updatedTables: updateResults,
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
