import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { AntDesign } from '@expo/vector-icons'; // Importing AntDesign icons
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api from "../../../../lib/api"; // Import your API module
import moment from "moment";

export function DonationReceivedList() {
  const navigation = useNavigation();

  const [donors, setDonors] = useState([]);
  const [doacoes, setDoacoes] = useState([]);

  const fetchData = async () => {
    try {
    
      const doacaoResponse = await api.get("/donation-received"); 
      setDoacoes(doacaoResponse.data); 

      const donorResponse = await api.get("/donor");
      setDonors(donorResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

  };
 

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleEdit = (donationReceived) => {
    navigation.navigate('DonationReceivedCreate', { donationReceived });
  };

  const getDonorName = (donorId) => {
    
    const donor = donors.find(d => d.id === donorId);
    return donor ? donor.name : "Desconhecido";
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY");
  };

  const handleRemove = (donationReceived) => {
    Alert.alert(
      "Confirmação",
      `Tem certeza que deseja remover a doação ${donationReceived.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/donation-received/${donationReceived.id}`);
              setDoacoes((prev) =>
                prev.filter((item) => item.id !== donationReceived.id)
              );
              Alert.alert("Sucesso", "Doação removido com sucesso!");
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Erro",
                "Não foi possível remover a doação. Tente novamente."
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
        {doacoes.map((doacao) => (
          <View key={doacao.id} style={styles.donationCard}>
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.donationItem}>{doacao.item}</Text>
                <Text style={styles.donationDate}>Data da doação: {formatDate(doacao.date)}</Text>
                <Text style={styles.donationDonor}>Doador: {getDonorName(doacao.donor.id)}</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => handleEdit(doacao)} 
                >
                  <AntDesign name="edit" size={24} color="blue" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleRemove(doacao)}>
                  <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('DonationReceivedCreate')}>
          <Text style={styles.addButtonText}>+ Adicionar nova doação</Text>
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
  donationDonor: {
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
