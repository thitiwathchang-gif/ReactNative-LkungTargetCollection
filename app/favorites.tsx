import ProductList from "@/components/product/ProductList";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { getFavorites } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, []),
  );

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
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
        {/* Loading State */}
        {loading && favorites.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
            }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text
              style={{
                marginTop: SPACING.md,
                color: COLORS.textSecondary,
              }}
            >
              Loading favorites...
            </Text>
          </View>
        )}

        {/* Favorites List */}
        {favorites.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: COLORS.text,
                marginBottom: SPACING.md,
              }}
            >
              Your Favorites
            </Text>
            <ProductList products={favorites} />
          </View>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
            }}
          >
            <Text style={{ fontSize: 16, color: COLORS.textSecondary }}>
              ❤️ No favorites yet
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLORS.textSecondary,
                marginTop: SPACING.sm,
              }}
            >
              Add products to your favorites to see them here
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
