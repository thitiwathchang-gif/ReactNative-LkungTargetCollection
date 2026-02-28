import { TouchableOpacity, Text } from "react-native";
import { toggleFavorite } from "@/utils/storage";

export default function FavoriteButton({ product }: any) {
  return (
    <TouchableOpacity
      onPress={() => toggleFavorite(product)}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "white",
        padding: 6,
        borderRadius: 20,
      }}
    >
      <Text>⭐</Text>
    </TouchableOpacity>
  );
}