import { FlatList, Text, View } from "react-native";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

export default function ProductList({
  products,
}: {
  products: Product[];
}) {
  return (
    <FlatList
      data={products || []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ProductCard product={item} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      ListEmptyComponent={
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text>No products available</Text>
        </View>
      }
    />
  );
}