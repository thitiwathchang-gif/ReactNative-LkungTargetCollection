import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITE_KEY = "favorites";

export async function getFavorites() {
  try {
    const data = await AsyncStorage.getItem(FAVORITE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveFavorites(products: any[]) {
  await AsyncStorage.setItem(
    FAVORITE_KEY,
    JSON.stringify(products)
  );
}

export async function toggleFavorite(product: any) {
  const favorites = await getFavorites();

  const exists = favorites.find((p: any) => p.id === product.id);

  let updated;

  if (exists) {
    updated = favorites.filter((p: any) => p.id !== product.id);
  } else {
    updated = [...favorites, product];
  }

  await saveFavorites(updated);
  return updated;
}