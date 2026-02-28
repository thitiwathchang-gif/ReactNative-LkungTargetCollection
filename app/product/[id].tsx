import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getShopeeProducts } from "@/services/shopee";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    getShopeeProducts().then((data) => {
      const found = data.find((item) => item.id === id);
      setProduct(found || null);
    });
  }, [id]);

  if (!product) return null;

  const openLink = async (url: string | undefined) => {
    if (!url) return;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: SPACING.lg }}
    >
      {/* Product Image */}
      <Image
        source={{ uri: product.image }}
        style={{
          height: 250,
          borderRadius: 20,
          marginBottom: SPACING.lg,
        }}
      />

      {/* Title */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: "white",
          marginBottom: SPACING.sm,
        }}
      >
        {product.title}
      </Text>

      {/* Price */}
      <Text
        style={{
          fontSize: 18,
          color: COLORS.accent,
          marginBottom: SPACING.md,
        }}
      >
        {product.price} บาท
      </Text>

      {/* Description */}
      {product.description && (
        <Text style={{ color: "#ccc", marginBottom: SPACING.lg }}>
          {product.description}
        </Text>
      )}

      {/* Buy Button */}
      <TouchableOpacity
        onPress={() => openLink(product.shopeeUrl)}
        style={{
          backgroundColor: COLORS.primary,
          paddingVertical: 16,
          borderRadius: 16,
          alignItems: "center",
          marginBottom: SPACING.md,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
          🛒 Buy on Shopee
        </Text>
      </TouchableOpacity>

      {/* Watch Review Button */}
      {product.reviewUrl && (
        <TouchableOpacity
          onPress={() => openLink(product.reviewUrl)}
          style={{
            backgroundColor: "#E11D48",
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
            marginBottom: SPACING.md,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            🎥 Watch Review
          </Text>
        </TouchableOpacity>
      )}

      {/* Playlist Button */}
      {product.playlistUrl && (
        <TouchableOpacity
          onPress={() => openLink(product.playlistUrl)}
          style={{
            backgroundColor: "#7C3AED",
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            📺 View Playlist
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}