import { COLORS } from "@/constants/colors";
import { AuthProvider } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: {
            backgroundColor: COLORS.card,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
          },
          headerStyle: {
            backgroundColor: COLORS.card,
            borderBottomColor: COLORS.border,
            borderBottomWidth: 1,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      >
        {/* hide groups that should not appear as tabs */}
        <Tabs.Screen
          name="(tabs)"
          options={{ tabBarButton: () => null, headerShown: false }}
        />
        <Tabs.Screen
          name="(auth)"
          options={{ tabBarButton: () => null, headerShown: false }}
        />
        <Tabs.Screen
          name="modal"
          options={{ tabBarButton: () => null, headerShown: false }}
        />
        <Tabs.Screen
          name="product/[id]"
          options={{ tabBarButton: () => null, headerShown: false }}
        />

        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            headerShown: true,
          }}
        />

        {/* Map Tab */}
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            tabBarLabel: "Map",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
            headerShown: true,
          }}
        />

        {/* Creator Hub Tab */}
        <Tabs.Screen
          name="youtube"
          options={{
            title: "Creator Hub",
            tabBarLabel: "Creators",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="play-circle" size={size} color={color} />
            ),
            headerShown: true,
          }}
        />

        {/* Favorites Tab */}
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            tabBarLabel: "Favorites",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart" size={size} color={color} />
            ),
            headerShown: true,
          }}
        />

        {/* Profile Tab */}
        <Tabs.Screen
          name="(auth)/profile"
          options={{
            title: "Profile",
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            headerShown: true,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
