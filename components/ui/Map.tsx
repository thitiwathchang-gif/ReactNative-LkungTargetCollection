import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { Location } from "@/services/location";
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type MapProps = {
  location: Location;
  title?: string;
};

export default function Map({ location, title = "Your Location" }: MapProps) {
  // use the provided google maps permalink
  const mapUrl =
    "https://www.google.com/maps/place/Wangdek+Galleria+Vivapawdi+%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%A5%E0%B9%88%E0%B8%99+%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%AA%E0%B8%B0%E0%B8%AA%E0%B8%A1+%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%94%E0%B9%87%E0%B8%81/@14.0334998,100.5025704,15z";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Map Link Button */}
      <View style={styles.mapContainer}>
        <TouchableOpacity
          onPress={() => Linking.openURL(mapUrl)}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
            Open Map in Google Maps
          </Text>
        </TouchableOpacity>
      </View>

      {/* Location Details */}
      <View style={styles.detailsContainer}>
        <LocationDetail label="Latitude" value={location.latitude.toString()} />
        <LocationDetail
          label="Longitude"
          value={location.longitude.toString()}
        />
        {location.accuracy !== undefined && (
          <LocationDetail
            label="Accuracy"
            value={`±${location.accuracy.toFixed(1)}m`}
          />
        )}
        {location.altitude !== undefined && (
          <LocationDetail
            label="Altitude"
            value={`${location.altitude.toFixed(1)}m`}
          />
        )}
        {location.speed !== undefined && (
          <LocationDetail
            label="Speed"
            value={`${location.speed.toFixed(1)}m/s`}
          />
        )}
      </View>
    </View>
  );
}

function LocationDetail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mapContainer: {
    height: 250,
    backgroundColor: COLORS.background,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  coordinatesText: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  detailsContainer: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.xs,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
  },
});
