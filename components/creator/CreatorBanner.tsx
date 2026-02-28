import { View, Text, Button, Linking } from "react-native";
import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { router } from "expo-router";
export default function CreatorBanner() {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Lkung The Nublar Collector
      </Text>

      <Text style={{ marginVertical: 8 }}>
        รีวิวของสะสม Jurassic และของเล่นระดับ Collector
      </Text>


<Button
  title="Creator Profile"
  onPress={() => router.push("/youtube")}
/>
      <Button
        title="เปิดช่อง YouTube"
        onPress={() =>
          Linking.openURL(
            "https://youtube.com/@lkungthe-nublarcollector3862"
          )
        }
      />
    </View>
  );
}