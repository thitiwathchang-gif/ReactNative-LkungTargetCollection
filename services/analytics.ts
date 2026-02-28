// Local analytics only (no backend)
export const trackClick = async (
  userId: string,
  productId: string,
  action: string
) => {
  console.log("Track:", userId, productId, action);
};