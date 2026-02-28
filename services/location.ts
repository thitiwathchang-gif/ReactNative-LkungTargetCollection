export type Location = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
};

// Get current location using expo-location when available.
// Falls back to a safe mock when running in environments without the module.
export const getCurrentLocation = async (): Promise<Location> => {
  try {
    // dynamic import so code won't crash if expo-location isn't installed
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const Location = await import("expo-location");

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission not granted");
    }

    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      altitude: pos.coords.altitude ?? undefined,
      speed: pos.coords.speed ?? undefined,
    };
  } catch (error) {
    console.warn("getCurrentLocation: falling back to mock location", error);
    // fallback mock (Bangkok)
    return {
      latitude: 13.7563,
      longitude: 100.5018,
      accuracy: 10,
      altitude: 5,
      speed: 0,
    };
  }
};

// Watch location using expo-location when available. Returns an unsubscribe fn.
export const watchLocation = (
  callback: (location: Location) => void,
  onError?: (error: string) => void,
): (() => void) => {
  let subscriber: any = null;

  (async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const Location = await import("expo-location");
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        onError?.("Location permission not granted");
        return;
      }

      subscriber = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (pos: any) => {
          callback({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude ?? undefined,
            speed: pos.coords.speed ?? undefined,
          });
        },
      );
    } catch (err) {
      console.warn("watchLocation: using mock fallback", err);
      const interval = setInterval(() => {
        callback({
          latitude: 13.7563 + (Math.random() - 0.5) * 0.01,
          longitude: 100.5018 + (Math.random() - 0.5) * 0.01,
          accuracy: Math.random() * 20,
          altitude: 5,
          speed: Math.random() * 10,
        });
      }, 5000);

      subscriber = { remove: () => clearInterval(interval) };
    }
  })();

  return () => {
    try {
      if (subscriber && typeof subscriber.remove === "function")
        subscriber.remove();
      if (
        subscriber &&
        typeof subscriber.remove === "undefined" &&
        typeof subscriber === "function"
      )
        subscriber();
    } catch (e) {
      // ignore
    }
  };
};

// Calculate distance between two locations (in kilometers)
export const calculateDistance = (
  location1: Location,
  location2: Location,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((location2.latitude - location1.latitude) * Math.PI) / 180;
  const dLon = ((location2.longitude - location1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((location1.latitude * Math.PI) / 180) *
      Math.cos((location2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
