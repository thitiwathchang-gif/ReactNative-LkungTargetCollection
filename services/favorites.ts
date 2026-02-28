// Safe cloud favorite stub
export const addFavorite = async (userId: string, productId: string) => {
  console.log("Mock add favorite:", userId, productId);
  return true;
};

export const getFavorites = async (userId: string) => {
  console.log("Mock get favorites:", userId);
  return [];
};