import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../../../../lib/api"; // Import your API module
import moment from "moment";

export function DonationDeliveredList() {
  const navigation = useNavigation();

  const [donataries, setDonataries] = useState([]); // Donatários
  const [donations, setDonations] = useState([]); // Doações entregues

  // Buscar os dados da API
  const fetchData = async () => {
    try {
      const donationsResponse = await api.get("/donation-delivered"); // Doações entregues
      setDonations(donationsResponse.data);

      const donataryResponse = await api.get("/donatary"); // Donatários
      setDonataries(donataryResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleEdit = (donation) => {
    navigation.navigate("DonationDeliveredCreate", { donation });
  };

  // Obter nome do donatário
  const getDonataryName = (donataryId) => {
    const donatary = donataries.find((d) => d.id === donataryId);
    return donatary ? donatary.name : "Desconhecido";
  };

  // Formatar data
  const formatDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  // Remover uma doação
  const handleRemove = (donation) => {
    Alert.alert(
      "Confirmação",
      `Tem certeza que deseja remover a doação ${donation.item}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/donation-delivered/${donation.id}`);
              setDonations((prev) => prev.filter((item) => item.id !== donation.id));
              Alert.alert("Sucesso", "Doação removida com sucesso!");
            } catch (error) {
              console.error("Erro ao remover doação:", error);
              Alert.alert("Erro", "Não foi possível remover a doação.");
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
        {donations.map((donation) => (
          <View key={donation.id} style={styles.donationCard}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.donationItem}>{donation.item}</Text>
                <Text style={styles.donationDate}>Entregue em: {formatDate(donation.date)}</Text>
                <Text style={styles.donationDonatary}>
                  Donatário: {getDonataryName(donation.donatary.id)}
                </Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEdit(donation)}
                >
                  <AntDesign name="edit" size={24} color="blue" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleRemove(donation)}>
                  <AntDesign name="delete" size={24} color="red"/>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("DonationDeliveredCreate")}
        >
          <Text style={styles.addButtonText}>+ Adicionar Doação</Text>
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
  donationDonatary: {
    fontSize: 14,
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
