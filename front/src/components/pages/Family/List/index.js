import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "../../../../lib/api";
import moment from "moment";

export function FamilyList() {
  const navigation = useNavigation();
  const [families, setFamilies] = useState([]);

  const fetchFamilies = async () => {
    try {
      const response = await api.get("/family");
      setFamilies(response.data);
    } catch (error) {
      console.error("Erro ao carregar famílias:", error);
      Alert.alert("Erro", "Não foi possível carregar as famílias.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFamilies();
    }, [])
  );

  const formatDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  const handleEdit = (family) => {
    navigation.navigate("FamilyCreate", { family });
  };

  const handleRemove = (family) => {
    Alert.alert(
      "Confirmação",
      `Tem certeza que deseja remover a família ${family.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/family/${family.id}`); // Alterar para o endpoint de remoção da família
              setFamilies((prevFamilies) =>
                prevFamilies.filter((item) => item.id !== family.id)
              );
              Alert.alert("Sucesso", "Família removida com sucesso!");
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Erro",
                "Não foi possível remover a família. Tente novamente."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTextSmall}>Painel</Text>
        <Text style={styles.headerTextLarge}>AVHRO</Text>
      </View>
      <View style={styles.separator} />

      <ScrollView style={styles.scrollView}>
        {families.length === 0 ? (
          <Text style={styles.noFamilies}>Nenhuma família encontrada.</Text>
        ) : (
          families.map((family) => (
            <View key={family.id} style={styles.familyCard}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.familyName}>{family.name}</Text>
                  <Text style={styles.familyDetails}>
                    Membros: {family.numberMembers}
                  </Text>
                  <Text style={styles.familyDetails}>
                    Bairro: {family.bairro}
                  </Text>
                  <Text style={styles.familyDetails}>
                    Data: {formatDate(family.dateRegistration)}
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleEdit(family)}
                  >
                    <AntDesign name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemove(family)}>
                    <AntDesign name="delete" size={24} color="blue" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("FamilyCreate")}
        >
          <Text style={styles.addButtonText}>+ Adicionar Família</Text>
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
  familyCard: {
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
  familyName: {
    fontSize: 18,
    fontWeight: "600",
  },
  familyDetails: {
    color: "#6B7280",
    marginTop: 4,
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
  noFamilies: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },
});
