export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  shopeeUrl: string;

  description?: string;
  videoUrl?: string;
  playlistUrl?: string;
  reviewUrl?: string;

  isFeatured?: boolean;
};