
import { View, TextInput, Button } from "react-native";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Register" onPress={() => signUp(email, password)} />
    </View>
  );
}