import { supabase } from "@/lib/supabase";
import {
  deleteImage,
  uploadImage
} from "@/services/storage";
import { Product } from "@/types/product";

// Products service - Read operations
export const supabaseProductsService = {
  // Fetch all products
  async getAllProducts(): Promise<Product[]> {
    try {
      console.log("Fetching all products...");
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log(`Fetched ${data?.length || 0} products`);
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
        .eq("isFeatured", true)
        .order("created_at", { ascending: false });

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
      if (!query || query.trim() === "") {
        return this.getAllProducts();
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("title", `%${query}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  },

  // Get products by price range
  async getProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .gte("price", minPrice)
        .lte("price", maxPrice)
        .order("price", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching products by price:", error);
      return [];
    }
  },
};

// Add product helper (uploads image when imageUri provided)
export const supabaseAdminService = {
  // Add new product
  async addProduct(product: Partial<Product> & { imageUri?: string }) {
    try {
      console.log("Adding product:", product.title);
      const payload: any = { ...product };

      if (product.imageUri) {
        // upload image and replace imageUri with public url
        console.log("Uploading image...");
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
      console.log("Product added successfully:", data.id);
      return data as Product;
    } catch (error) {
      console.error("Error adding product:", error);
      return null;
    }
  },

  // Update existing product
  async updateProduct(
    id: string,
    updates: Partial<Product> & { imageUri?: string },
  ) {
    try {
      console.log("Updating product:", id);
      const payload: any = { ...updates };

      if (updates.imageUri) {
        // upload new image and replace imageUri with public url
        console.log("Uploading new image...");
        const url = await uploadImage(updates.imageUri, id);
        payload.image = url;
        delete payload.imageUri;
      }

      const { data, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      console.log("Product updated successfully:", data.id);
      return data as Product;
    } catch (error) {
      console.error("Error updating product:", error);
      return null;
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    try {
      console.log("Deleting product:", id);

      // First get the product to find the image
      const product = await supabaseProductsService.getProductById(id);
      if (product?.image) {
        // Extract file path from public URL and delete
        const urlParts = product.image.split("/");
        const filePath = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
        await deleteImage(filePath);
      }

      // Delete the product
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      console.log("Product deleted successfully:", id);
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  },

  // Batch add products
  async addMultipleProducts(
    products: Array<Partial<Product> & { imageUri?: string }>,
  ): Promise<Product[]> {
    try {
      console.log(`Adding ${products.length} products...`);
      const results: Product[] = [];

      for (const product of products) {
        const result = await this.addProduct(product);
        if (result) {
          results.push(result);
        }
      }

      console.log(`Successfully added ${results.length} products`);
      return results;
    } catch (error) {
      console.error("Error adding multiple products:", error);
      return [];
    }
  },

  // Toggle featured status
  async toggleFeatured(id: string): Promise<Product | null> {
    try {
      const product = await supabaseProductsService.getProductById(id);
      if (!product) return null;

      return this.updateProduct(id, {
        isFeatured: !product.isFeatured,
      });
    } catch (error) {
      console.error("Error toggling featured:", error);
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
