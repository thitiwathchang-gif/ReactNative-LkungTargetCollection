import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";

import { COLORS } from "@/constants/colors";
import { SPACING } from "@/constants/spacing";
import { IMAGES } from "@/constants/images";


export default function CreatorHub() {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}
      contentContainerStyle={{
        padding: SPACING.lg,
        alignItems: "center",
      }}
    >
      {/* Creator Avatar */}
      <Image
        source={{
          uri: "https://via.placeholder.com/300",
        }}
        style={{
  width: 150,
  height: 150,
  borderRadius: 999,
  marginTop: 20,
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 12,
}}
      />

<Image
  source={IMAGES.creator}
  style={{
    width: 150,
    height: 150,
    borderRadius: 999,
  }}
/>
      {/* Channel Name */}
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "white",
          marginTop: SPACING.md,
        }}
      >
        Lkung The Nublar Collector
      </Text>

      {/* Tagline */}
      <Text
        style={{
          color: "#aaa",
          textAlign: "center",
          marginTop: SPACING.sm,
        }}
      >
        Jurassic Collector • Toy Reviews • Premium Figures
      </Text>

      {/* Stats Card */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: COLORS.card,
          borderRadius: 18,
          padding: SPACING.md,
          marginTop: SPACING.lg,
        }}
      >
        <Stat title="Videos" value="100+" />
        <Stat title="Collectors" value="Growing" />
        <Stat title="Reviews" value="Expert" />
      </View>

      {/* Primary CTA */}
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(
            "https://youtube.com/@lkungthe-nublarcollector3862"
          )
        }
        style={{
          backgroundColor: COLORS.primary,
          paddingVertical: 16,
          paddingHorizontal: 36,
          borderRadius: 16,
          marginTop: SPACING.xl,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          🎥 Watch YouTube Channel
        </Text>
      </TouchableOpacity>

      {/* Secondary CTA */}
      <TouchableOpacity
        onPress={() =>
          Linking.openURL(
            "https://youtube.com/@lkungthe-nublarcollector3862?sub_confirmation=1"
          )
        }
        style={{
          borderWidth: 1,
          borderColor: "#444",
          paddingVertical: 14,
          paddingHorizontal: 36,
          borderRadius: 16,
          marginTop: SPACING.md,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          Subscribe
        </Text>
      </TouchableOpacity>

      {/* About */}
      <View
        style={{
          backgroundColor: COLORS.card,
          borderRadius: 18,
          padding: SPACING.lg,
          marginTop: SPACING.xl,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 6,
          }}
        >
          About Creator
        </Text>

        <Text style={{ color: COLORS.subtext }}>
          ช่องรีวิวของสะสม Jurassic และของเล่นระดับ Collector
          เน้นรีวิวจริง ใช้งานจริง และแนะนำสินค้าที่ควรค่าแก่การสะสม
        </Text>
      </View>
    </ScrollView>
  );
}

/* ---------- Small Component ---------- */

function Stat({ title, value }: any) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          color: COLORS.subtext,
        }}
      >
        {title}
      </Text>
    </View>
  );
}