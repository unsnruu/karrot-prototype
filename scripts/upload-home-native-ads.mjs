import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !secret) {
  throw new Error("Missing Supabase env for storage upload.");
}

const bucket = "home-native-ads";
const root = path.join(process.cwd(), "supabase", "images", "home-native-ads");
const folders = ["town-map", "town-life", "meetup", "cafe"];

const client = createClient(url, secret, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function ensureBucket() {
  const { data, error } = await client.storage.getBucket(bucket);
  if (!error && data) return;

  const { error: createError } = await client.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: "5MB",
  });

  if (createError && !String(createError.message).includes("exists")) {
    throw createError;
  }
}

async function main() {
  await ensureBucket();

  const uploaded = [];

  for (const folder of folders) {
    const dir = path.join(root, folder);
    const names = (await readdir(dir))
      .filter((name) => name.endsWith(".webp"))
      .sort();

    for (const name of names) {
      const filePath = path.join(dir, name);
      const fileBuffer = await readFile(filePath);
      const fileStat = await stat(filePath);
      const objectPath = `${folder}/${name}`;

      const { error } = await client.storage.from(bucket).upload(objectPath, fileBuffer, {
        cacheControl: "3600",
        contentType: "image/webp",
        upsert: true,
      });

      if (error) {
        throw error;
      }

      const { data } = client.storage.from(bucket).getPublicUrl(objectPath);
      uploaded.push({
        folder,
        name,
        bytes: fileStat.size,
        publicUrl: data.publicUrl,
      });
    }
  }

  process.stdout.write(JSON.stringify(uploaded, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
