import { readFile, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const projectRoot = process.cwd();
const envFilePath = path.join(projectRoot, ".env.local");
const imagesRoot = path.join(projectRoot, "supabase", "images");
const bucket = "businesses";

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

async function walkBusinessImageFiles(dir) {
  const names = (await readdir(dir)).sort((left, right) => left.localeCompare(right));
  const files = [];

  for (const name of names) {
    const absolutePath = path.join(dir, name);
    const entryStat = await stat(absolutePath);

    if (entryStat.isDirectory()) {
      files.push(...await walkBusinessImageFiles(absolutePath));
      continue;
    }

    if (path.basename(absolutePath) === "image.webp") {
      files.push(absolutePath);
    }
  }

  return files;
}

function buildPublicUrl(projectUrl, objectPath) {
  return `${projectUrl.replace(/\/+$/, "")}/storage/v1/object/public/${bucket}/${objectPath}`;
}

function getBusinessIdFromPath(filePath) {
  const directoryName = path.basename(path.dirname(filePath));
  const match = directoryName.match(/^(biz_\d+)-/);

  if (!match) {
    throw new Error(`Could not parse business id from directory: ${directoryName}`);
  }

  return match[1];
}

async function ensureBucket(client) {
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

  await ensureBucket(client);

  const files = await walkBusinessImageFiles(imagesRoot);
  const uploads = [];

  for (const absolutePath of files) {
    const businessId = getBusinessIdFromPath(absolutePath);
    const objectPath = `${businessId}/image.webp`;
    const buffer = await readFile(absolutePath);
    const { error: uploadError } = await client.storage.from(bucket).upload(objectPath, buffer, {
      upsert: true,
      contentType: "image/webp",
    });

    if (uploadError) {
      throw uploadError;
    }

    uploads.push({
      absolutePath,
      businessId,
      publicUrl: buildPublicUrl(projectUrl, objectPath),
    });
  }

  for (const upload of uploads) {
    const { error: updateError } = await client
      .from("businesses")
      .update({ image_url: upload.publicUrl })
      .eq("id", upload.businessId);

    if (updateError) {
      throw updateError;
    }
  }

  for (const upload of uploads) {
    await rm(upload.absolutePath, { force: true });
  }

  process.stdout.write(`${JSON.stringify({
    bucket,
    uploaded: uploads.length,
    deletedLocalFiles: uploads.length,
    businessIds: uploads.map((upload) => upload.businessId),
  }, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
