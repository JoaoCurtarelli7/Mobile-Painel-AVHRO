import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import api from "../../../../lib/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

export function DonationReceivedCreate() {
  const route = useRoute();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    item: "",
    donorId: "",
    date: "",
  });
  const [selectDonor, setSelectDonor] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    api.get("/donor")
      .then((response) => {
        setSelectDonor(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar doadores:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de doadores.");
      });
  }, []);

  useEffect(() => {
    if (route.params?.donationReceived) {
      console.log(route.params?.donationReceived, 'route.params?.donationReceived');
      
      setFormData({
        item: route.params.donationReceived.item || "",
        donorId: route.params.donationReceived.donor.id || "", // Certifique-se que a API retorna donorId
        date: route.params.donationReceived.date || "",
      });
    }
  }, [route.params]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.date;
    setShowDatePicker(false);
    handleInputChange("date", currentDate);
  };

  const formatDate = (date) => {
    return date ? moment(date).format("DD/MM/YYYY") : "Escolha uma data";
  };

  const handleSubmit = async () => {
    try {
      if (route.params?.donationReceived?.id) {
        await api.put(
          `/donation-received/${route.params.donationReceived.id}`,
          formData
        );
        Alert.alert("Sucesso", "Doação recebida atualizada com sucesso!");
      } else {
        await api.post("/donation-received", formData);
        Alert.alert("Sucesso", "Doação recebida cadastrada com sucesso!");
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTextSmall}>Painel</Text>
        <Text style={styles.headerTextLarge}>AVHRO</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {route.params?.donationReceived
            ? "Editar Doação Recebida"
            : "Cadastro de Doação Recebida"}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Item</Text>
          <TextInput
            value={formData.item}
            onChangeText={(value) => handleInputChange("item", value)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Doador</Text>
          <Picker
            selectedValue={formData.donorId}
            onValueChange={(value) => handleInputChange("donorId", value)}
            style={styles.input}
          >
            <Picker.Item label="Selecione um doador" value="" />
            {selectDonor.map((donor) => (
              <Picker.Item key={donor.id} label={donor.name} value={donor.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de Registro</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formatDate(formData.date)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.date ? new Date(formData.date) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>
          {route.params?.donationReceived ? "Atualizar" : "Cadastrar"}
        </Text>
      </TouchableOpacity>
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
  formContainer: {
    marginBottom: 32,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 12,
    color: "black",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
