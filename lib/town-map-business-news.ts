import fallbackRows from "@/lib/town-map-business-news.json";

export type TownMapBusinessNewsFallbackRow = {
  id: string;
  business_id: string;
  business_name: string;
  category: string;
  town: string;
  title: string;
  body: string;
  created_at: string;
  image_path: string | null;
};

export type TownMapBusinessNewsPost = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  postedAtLabel: string;
  imageSrc?: string;
};

export const townMapBusinessNewsFallbackRows = fallbackRows as TownMapBusinessNewsFallbackRow[];
