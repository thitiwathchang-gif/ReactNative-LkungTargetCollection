import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { Product } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import FavoriteButton from "../ui/FavoriteButton";

export default function ProductCard({ product }: { product: Product }) {
  const openURL = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error("Error opening URL:", error);
    }
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: SPACING.md,
          right: SPACING.md,
          zIndex: 10,
        }}
      >
        <FavoriteButton product={product} />
      </View>

      <Image
        source={{ uri: product.image }}
        style={{
          height: 160,
          borderRadius: 12,
          marginBottom: SPACING.md,
          backgroundColor: COLORS.background,
        }}
      />

      <Text style={{ fontWeight: "bold", fontSize: 16, color: COLORS.text }}>
        {product.title}
      </Text>

      <Text
        style={{
          color: COLORS.accent,
          fontWeight: "600",
          fontSize: 14,
          marginVertical: SPACING.sm,
        }}
      >
        ฿{product.price.toLocaleString()}
      </Text>

      {/* Action Buttons */}
      <View style={{ marginTop: SPACING.md, gap: SPACING.sm }}>
        {/* Shopee Button */}
        <TouchableOpacity
          onPress={() => openURL(product.shopeeUrl)}
          style={styles.buttonPrimary}
        >
          <Ionicons name="bag" size={16} color="white" />
          <Text style={styles.buttonTextPrimary}>เข้าซื้อใน Shopee</Text>
        </TouchableOpacity>

        {/* Video and Playlist Buttons Row */}
        <View style={{ flexDirection: "row", gap: SPACING.sm }}>
          {/* Video Button */}
          {product.videoUrl && (
            <TouchableOpacity
              onPress={() => openURL(product.videoUrl!)}
              style={[styles.buttonSecondary, { flex: 1 }]}
            >
              <Ionicons name="play-circle" size={16} color={COLORS.primary} />
              <Text style={styles.buttonTextSecondary}>วิดีโอ</Text>
            </TouchableOpacity>
          )}

          {/* Playlist Button */}
          {product.playlistUrl && (
            <TouchableOpacity
              onPress={() => openURL(product.playlistUrl!)}
              style={[styles.buttonSecondary, { flex: 1 }]}
            >
              <Ionicons name="list" size={16} color={COLORS.primary} />
              <Text style={styles.buttonTextSecondary}>เพลย์ลิสต์</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
  },
  buttonTextPrimary: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  buttonSecondary: {
    backgroundColor: "#F0F0F0",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonTextSecondary: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 12,
  },
});
