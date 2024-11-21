import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "../../../../lib/api";
import moment from "moment";

export function DonorsList() {
  const navigation = useNavigation();
  const [donors, setDonors] = useState([]);

  const fetchDonors = async () => {
    try {
      const response = await api.get("/donor"); 
      setDonors(response.data);
    } catch (error) {
      console.error("Erro ao carregar doadores:", error);
      Alert.alert("Erro", "Não foi possível carregar os doadores.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDonors();
    }, [])
  );

  const formatDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  const handleEdit = (donor) => {    
    navigation.navigate("DonorsCreate", { donor });
  };

  const handleRemove = (donor) => {
    Alert.alert(
      "Confirmação",
      `Tem certeza que deseja remover o doador ${donor.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/donor/${donor.id}`); 
              setDonors((prevDonors) => prevDonors.filter((item) => item.id !== donor.id));
              Alert.alert("Sucesso", "Doador removido com sucesso!");
            } catch (error) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível remover o doador. Tente novamente.");
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
        {donors.length === 0 ? (
          <Text style={styles.noDonors}>Nenhum doador encontrado.</Text>
        ) : (
          donors.map((donor) => (
            <View key={donor.id} style={styles.donationCard}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.donationItem}>{donor.name}</Text>
                  <Text style={styles.donationCpf}>CPF: {donor.cpf}</Text>
                  <Text style={styles.donationDate}>Data de Registro: {formatDate(donor.dateRegistration)}</Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity style={styles.iconButton} onPress={() => handleEdit(donor)}>
                    <AntDesign name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemove(donor)}>
                    <AntDesign name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("DonorsCreate")}>
          <Text style={styles.addButtonText}>+ Adicionar Doador</Text>
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
  donationCpf: {
    color: "#6B7280",
    marginTop: 4,
  },
  donationDate: {
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
  noDonors: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 20,
  },
});
