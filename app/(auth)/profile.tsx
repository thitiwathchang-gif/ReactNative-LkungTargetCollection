import { View, Text, Button } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <View style={{ padding: 20 }}>
      {user ? (
        <>
          <Text>Welcome: {user.email}</Text>
          <Button title="Logout" onPress={signOut} />
        </>
      ) : (
        <Text>Not logged in</Text>
      )}
    </View>
  );
}