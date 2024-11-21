import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import api from "../../../lib/api";

export function Login() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("curtarelli@gmail.com");
  const [password, setPassword] = useState("123456789");

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", { email, password });

      const { token } = response.data;

      if (!token) {
        Alert.alert("Erro", "Token não recebido.");
        return;
      }

      await AsyncStorage.setItem("token", token);

      navigation.navigate("Home");
    } catch (error) {
      console.error("Erro ao fazer login:", error.response?.data || error.message);
      Alert.alert("Erro", "Usuário ou senha inválidos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel</Text>
      <Text style={styles.subtitle}>AVHRO</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#e5e7eb",
    fontSize: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
