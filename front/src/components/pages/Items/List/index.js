import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../../../../lib/api";
import moment from "moment";

export function ItemsList() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await api.get("/items");
      setItems(response.data);
    } catch (error) {
      console.error("Erro ao buscar itens:", error.message);
      Alert.alert("Erro", "Não foi possível carregar a lista de itens.");
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [])
  );


  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/items/${itemId}`);
      setItems(items.filter((item) => item.id !== itemId));
      Alert.alert("Sucesso", "Item removido com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir item:", error.message);
      Alert.alert("Erro", "Não foi possível remover o item.");
    }
  };

  const editItem = (item) => {
    navigation.navigate("ItemsCreate", { item });
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTextSmall}>Painel</Text>
        <Text style={styles.headerTextLarge}>AVHRO</Text>
      </View>
      <View style={styles.separator} />

      <ScrollView style={styles.scrollView}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  {`Adicionado em: ${formatDate(item.dateAdded)}`}
                </Text>
                <Text style={styles.itemDetails}>{`Quantidade: ${item.quantity}`}</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => editItem(item)}
                >
                  <AntDesign name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                  <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("ItemsCreate")}
        >
          <Text style={styles.addButtonText}>+ Adicionar Item</Text>
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
  itemCard: {
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
  itemName: {
    fontSize: 18,
    fontWeight: "600",
  },
  itemDetails: {
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
