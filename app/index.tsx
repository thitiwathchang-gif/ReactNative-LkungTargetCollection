import CreatorBanner from "@/components/creator/CreatorBanner";
import ProductList from "@/components/product/ProductList";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { useFetch } from "@/hooks/useFetch";
import { getShopeeProducts } from "@/services/shopee";
import { supabaseProductsService } from "@/services/supabaseService";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";


import { getProducts } from "@/services/productService";
import { supabase } from "@/utils/supabase";
useEffect(() => {
  supabase.from("favorites").select("*")
    .then(console.log);
}, []);

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);

const [Products, setProducts] = useState<any[]>([]);

useEffect(() => {
  const load = async () => {
    const data = await getProducts();
    setProducts(data);
  };
  load();
}, []);
  const fetchProducts = useCallback(async () => {
    // try Supabase first
    try {
      const supProd = await supabaseProductsService.getAllProducts();
      if (supProd && supProd.length > 0) return supProd;
    } catch (e) {
      console.warn("Supabase fetch failed, falling back:", e);
    }

    // fallback to bundled/mock Shopee products or external endpoint
    return getShopeeProducts();
  }, []);

  useEffect(() => {
  const test = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);
  };

  test();
}, []);

  const {
    data: productsData,
    loading,
    error,
    refetch,
  } = useFetch(fetchProducts, {
    cacheKey: "products_cache",
    cacheDuration: 10 * 60 * 1000, // 10 minutes
  });

  const products = productsData || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: SPACING.md,
          paddingBottom: SPACING.lg,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Banner */}
        <CreatorBanner />

        {/* Loading State */}
        {loading && products.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: SPACING.xl,
            }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
          
            <Text
              style={{ marginTop: SPACING.md, color: COLORS.textSecondary }}
            >
              Loading products...
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View
            style={{
              backgroundColor: "#ff6b6b22",
              borderWidth: 1,
              borderColor: COLORS.primary,
              borderRadius: 8,
              padding: SPACING.md,
              marginVertical: SPACING.md,
            }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: "500" }}>
              ⚠️ Error Loading Products
            </Text>
            <Text
              style={{
                color: COLORS.textSecondary,
                fontSize: 12,
                marginTop: SPACING.xs,
              }}
            >
              {error}
            </Text>
          </View>
        )}

        {/* Products List */}
        {products.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: COLORS.text,
                marginBottom: SPACING.md,
                marginTop: SPACING.md,
              }}
            >
              Featured Products
            </Text>
            <ProductList products={products} />
          </View>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: SPACING.xl,
            }}
          >
            <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>
              No products found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
