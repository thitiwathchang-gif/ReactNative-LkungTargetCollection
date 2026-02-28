import Map from "@/components/ui/Map";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { useFetch } from "@/hooks/useFetch";
import { getCurrentLocation } from "@/services/location";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";

export default function MapScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // memoize fetch function so useFetch effect deps are stable
  const fetchLocation = useCallback(() => getCurrentLocation(), []);

  const {
    data: location,
    loading,
    refetch,
  } = useFetch(fetchLocation, {
    cacheKey: "location_cache",
    cacheDuration: 2 * 60 * 1000, // 2 minutes
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
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
      >
        {loading && !location ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : location ? (
          <Map location={location} title="Your Current Location" />
        ) : null}
      </ScrollView>
    </View>
  );
}
