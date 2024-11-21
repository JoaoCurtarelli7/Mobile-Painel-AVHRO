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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "../../../../lib/api";
import moment from "moment";

export function DoneesList() {
  const navigation = useNavigation();
  const [donees, setDonees] = useState([]);

  const fetchDonees = async () => {
    try {
      const response = await api.get("/donatary");
      setDonees(response.data);
    } catch (error) {
      console.error("Erro ao carregar donatários:", error);
      Alert.alert("Erro", "Não foi possível carregar os donatários.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDonees();
    }, [])
  );

  const formatDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  const handleEdit = (donee) => {
    navigation.navigate("DoneesCreate", { donee });
  };

  const handleRemove = (donee) => {
    Alert.alert(
      "Confirmação",
      `Tem certeza que deseja remover o donatário ${donee.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/donatary/${donee.id}`);
              setDonees((prevDonees) =>
                prevDonees.filter((item) => item.id !== donee.id)
              );
              Alert.alert("Sucesso", "Donatário removido com sucesso!");
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Erro",
                "Não foi possível remover o donatário. Tente novamente."
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
      {donees.length === 0 ? (
          <Text style={styles.noDonatary}>Nenhum donatário encontrado.</Text>
        ) : (
        donees.map((donee) => (
          <View key={donee.id} style={styles.doneeCard}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.doneeName}>{donee.name}</Text>
                <Text style={styles.doneeCpf}>CPF: {donee.cpf}</Text>
                <Text style={styles.doneeDate}>
                  Data de Registro: {formatDate(donee.dateRegistration)}
                </Text>
              </View>

              <View style={styles.iconContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEdit(donee)}
                >
                  <AntDesign name="edit" size={24} color="blue" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleRemove(donee)}>
                  <AntDesign name="delete" size={24} color="blue" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("DoneesCreate")}
        >
          <Text style={styles.addButtonText}>+ Adicionar Donatário</Text>
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
  doneeCard: {
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
  doneeName: {
    fontSize: 18,
    fontWeight: "600",
  },
  doneeCpf: {
    color: "#6B7280",
    marginTop: 4,
  },
  doneeDate: {
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
  noDonatary: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },
});
