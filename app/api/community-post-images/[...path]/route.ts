import { readFile } from "node:fs/promises";
import path from "node:path";

const IMAGES_ROOT = path.join(process.cwd(), "supabase", "images", "community-posts");

function getContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".webp":
      return "image/webp";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  const decodedSegments = segments.map((segment) => decodeURIComponent(segment));
  const resolvedPath = path.resolve(IMAGES_ROOT, ...decodedSegments);

  if (!resolvedPath.startsWith(IMAGES_ROOT)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(resolvedPath);

    return new Response(file, {
      headers: {
        "Content-Type": getContentType(resolvedPath),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
