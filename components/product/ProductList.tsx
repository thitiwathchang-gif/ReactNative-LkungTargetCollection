import { FlatList } from "react-native";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

export default function ProductList({
  products,
}: {
  products: Product[];
}) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard product={item} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}