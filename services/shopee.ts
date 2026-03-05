import { SHOPEE_DATA_URL } from "@/config/env";
import { Product } from "@/types/product";

export async function getShopeeProducts(): Promise<Product[]> {
  // if a remote URL is configured, attempt fetch
  if (SHOPEE_DATA_URL) {
    try {
      const res = await fetch(SHOPEE_DATA_URL);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          return json as Product[];
        }
      }
    } catch (e) {
      console.warn(
        "Failed to fetch remote shopee data, falling back to local",
        e,
      );
    }
  }

  // local fallback data
  return [
    {
      id: "1",
      title: "T-Rex Nanmu Smart Series Alpha 3.0 สีน้ำตาล",
      price: 4995,
      image:
        "https://scontent.fbkk12-3.fna.fbcdn.net/v/t39.30808-6/537269920_1370016071593623_253272574871282016_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=WslXaO6MJc0Q7kNvwGEfph0&_nc_oc=AdnPcBZ0-ocNVIV-lWtag3FlYVR7-Zs_ZhHQPdOAM1xs3y_CSp326WuCuXfDI-vYitGB65CEhOzwTrrYhuGDGb2E&_nc_zt=23&_nc_ht=scontent.fbkk12-3.fna&_nc_gid=UctAclnhNwWwIfzjoOWLuQ&oh=00_AfurS3DhoPoYf2fAeYVITZAiw2Pd66HC4wylxNE0p78W-Q&oe=6988C715",
      shopeeUrl: "https://s.shopee.co.th/AKUrYrTiXo",
      videoUrl: "https://youtu.be/1kWDEjiJXjc?si=ltiy4ClqJ7S9xPov62",
      isFeatured: true,
    },
    {
      id: "2",
      title: "Mattel Jurassic World by official Wangdek",
      price: 9999,
      image:
        "https://i.ytimg.com/vi/-_RB3r3uGiY/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDkEbDlVB8EfjmX6SfiE32utreorQ",
      image_url: "https://collectjurassic.com/wp-content/uploads/2022/06/DominionToysFtr.jpg",
      shopeeUrl: "https://th.shp.ee/5rJdxsG",
      playlistUrl:
        "https://youtube.com/playlist?list=PLcEypFWfI8oXnbSA09ef6v-ZB0CQxupK8&si=2mn7AEsUrq_v4pkC",
      isFeatured: true,
    },
    {
      id: "3",
      title: "Mattel Jurassic World by Home Monster Toys",
      price: 9999,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5HNvJTX4esdPMZf8XUmKVdBqs-fy8JTOorQ&s",
      shopeeUrl: "https://th.shp.ee/FwM8oN7",
      playlistUrl:
        "https://youtube.com/playlist?list=PLcEypFWfI8oXnbSA09ef6v-ZB0CQxupK8&si=2mn7AEsUrq_v4pkC",
      isFeatured: true,
    },
    {
      id: "4",
      title: "Jurassic Park/World และของเล่นอื่นๆ by ร้านน้าเดช",
      price: 9999,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS94RTARAITKvdQqM7KnpyArjeco4LlsgJdPA&s",
      shopeeUrl: "https://s.shopee.co.th/9zs1BUCX0d",
      playlistUrl:
        "https://youtube.com/playlist?list=PLcEypFWfI8oXnbSA09ef6v-ZB0CQxupK8&si=2mn7AEsUrq_v4pkC",
      isFeatured: true,
    },
  ];
}
