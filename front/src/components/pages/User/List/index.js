import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Importando os ícones do AntDesign
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../../../../lib/api";

export function UserList() {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users");

      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error.message);
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      Alert.alert("Sucesso", "Usuário removido com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir usuário:", error.message);
      Alert.alert("Erro", "Não foi possível excluir o usuário.");
    }
  };

  const editUser = (user) => {
    navigation.navigate("UserCreate", { user });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUsers();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTextSmall}>Painel</Text>
        <Text style={styles.headerTextLarge}>AVHRO</Text>
      </View>
      <View style={styles.separator} />

      <ScrollView style={styles.scrollView}>
        {users.map((user) => (
          <View key={user.id} style={styles.donationCard}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.donationItem}>{user.name}</Text>
                <Text style={styles.donationDate}>E-mail: {user.email}</Text>
                <Text style={styles.donationDate}>
                  Administrador: {user.isAdmin ? "Sim" : "Não"}
                </Text>
              </View>

              <View style={styles.iconContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => editUser(user)}
                >
                  <AntDesign name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteUser(user.id)}>
                  <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("UserCreate")}
        >
          <Text style={styles.addButtonText}>+ Adicionar Usuário</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerTextSmall: {
    fontSize: 12,
    color: "black",
  },
  headerTextLarge: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: "#3B82F6",
    marginBottom: 32,
  },
  scrollView: {
    flex: 1,
  },
  donationCard: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  donationItem: {
    fontSize: 18,
    fontWeight: "600",
  },
  donationDate: {
    color: "#6B7280",
  },
  iconContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
