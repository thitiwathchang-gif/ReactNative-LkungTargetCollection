import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/services/storage";
import { Product } from "@/types/product";

// Products service
export const supabaseProductsService = {
  // Fetch all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from("products").select("*");

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  // Fetch product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  // Fetch featured products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("isFeatured", true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("title", `%${query}%`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  },
};

// Add product helper (uploads image when imageUri provided)
export const supabaseAdminService = {
  async addProduct(product: Partial<Product> & { imageUri?: string }) {
    try {
      const payload: any = { ...product };

      if (product.imageUri) {
        // upload image and replace image with public url
        const url = await uploadImage(
          product.imageUri,
          (product.id as string) || "public",
        );
        payload.image = url;
        delete payload.imageUri;
      }

      const { data, error } = await supabase
        .from("products")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as Product;
    } catch (error) {
      console.error("Error adding product:", error);
      return null;
    }
  },
};

// Favorites service
export const supabaseFavoritesService = {
  // Add favorite
  async addFavorite(userId: string, productId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("favorites").insert({
        user_id: userId,
        product_id: productId,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error adding favorite:", error);
      return false;
    }
  },

  // Remove favorite
  async removeFavorite(userId: string, productId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error removing favorite:", error);
      return false;
    }
  },

  // Get user favorites
  async getUserFavorites(userId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("products(*)")
        .eq("user_id", userId);

      if (error) throw error;
      return data?.map((fav: any) => fav.products) || [];
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  },

  // Check if product is favorite
  async isFavorite(userId: string, productId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows found
      return !!data;
    } catch (error) {
      console.error("Error checking favorite:", error);
      return false;
    }
  },
};

// Reviews service
export const supabaseReviewsService = {
  // Get reviews for product
  async getProductReviews(productId: string) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  // Add review
  async addReview(
    productId: string,
    userId: string,
    rating: number,
    comment: string,
  ) {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          product_id: productId,
          user_id: userId,
          rating,
          comment,
          created_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error("Error adding review:", error);
      return null;
    }
  },
};
