export type TownMapBusinessNewsPost = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  postedAtLabel: string;
  imageSrc?: string;
  businessId?: string;
  businessName?: string;
  businessCategory?: string;
  businessImageSrc?: string;
};

export type TownMapBusinessNewsFeedPost = TownMapBusinessNewsPost & {
  businessId: string;
  businessName: string;
  businessCategory: string;
  businessImageSrc?: string;
};
