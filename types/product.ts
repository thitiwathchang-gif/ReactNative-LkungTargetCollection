export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  image_url?: string;
  shopeeUrl: string;

  description?: string;
  videoUrl?: string;
  playlistUrl?: string;
  reviewUrl?: string;

  isFeatured?: boolean;
};