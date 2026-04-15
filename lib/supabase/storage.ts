function normalizeStoragePath(assetPath: string) {
  return assetPath
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function getSupabaseProjectOrigin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return url ? url.replace(/\/+$/, "") : null;
}

type SupabaseBackedImageOptions = {
  bucket: string;
  localRoutePrefix: string;
  preferStorage?: boolean;
};

export function buildSupabaseBackedImageSrc(
  assetPath: string | null,
  { bucket, localRoutePrefix, preferStorage = false }: SupabaseBackedImageOptions,
) {
  if (!assetPath) {
    return undefined;
  }

  if (/^https?:\/\//.test(assetPath)) {
    return assetPath;
  }

  if (assetPath.startsWith("/")) {
    return encodeURI(assetPath);
  }

  if (preferStorage) {
    const projectOrigin = getSupabaseProjectOrigin();

    if (projectOrigin) {
      return `${projectOrigin}/storage/v1/object/public/${bucket}/${normalizeStoragePath(assetPath)}`;
    }
  }

  return encodeURI(`${localRoutePrefix}/${assetPath}`);
}
