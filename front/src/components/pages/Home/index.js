import React from "react";
import {
  View,
  StyleSheet,
  Text, TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.smallText}>Painel</Text>
        <Text style={styles.largeText}>AVHRO</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("DonationReceivedList")}
        >
          <Text style={styles.buttonText}>Doações recebidas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("DonationDeliveredList")}
        >
          <Text style={styles.buttonText}>Doações entregues</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}   onPress={() => navigation.navigate("DoneesList")}>
          <Text style={styles.buttonText}>Donatários</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}   onPress={() => navigation.navigate("DonorsList")}>
          <Text style={styles.buttonText}>Doadores</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}   onPress={() => navigation.navigate("FamilyList")}>
          <Text style={styles.buttonText}>Famílias</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}   onPress={() => navigation.navigate("UserList")}>
          <Text style={styles.buttonText}>Usuários</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}   onPress={() => navigation.navigate("ItemsList")}>
          <Text style={styles.buttonText}>Itens</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: "flex-start",
    marginTop: 35,
  },
  smallText: {
    fontSize: 16,
    color: "black",
  },
  largeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
    marginBottom: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
