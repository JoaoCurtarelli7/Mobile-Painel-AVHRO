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
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../../../lib/api";
import moment from "moment";

export function DonationDeliveredCreate() {
  const navigation = useNavigation();
  const route = useRoute();

  const [formData, setFormData] = useState({
    item: "",
    donataryId: "",
    date: "",
  });
  const [donataries, setDonataries] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    api
      .get("/donatary")
      .then((response) => {
        setDonataries(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar donatários:", error);
        Alert.alert("Erro", "Não foi possível carregar a lista de donatários.");
      });
  }, []);

  useEffect(() => {
    if (route.params?.donation) {
      setFormData({
        item: route.params.donation.item || "",
        donataryId: route.params.donation.donatary.id || "",
        date: route.params.donation.date || "",
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
      if (!formData.item || !formData.donataryId || !formData.date) {
        Alert.alert("Erro", "Por favor, preencha todos os campos.");
        return;
      }

      if (route.params?.donation?.id) {
        await api.put(
          `/donation-delivered/${route.params.donation.id}`,
          formData
        );
        Alert.alert("Sucesso", "Doação entregue atualizada com sucesso!");
      } else {
        await api.post("/donation-delivered", formData);
        Alert.alert("Sucesso", "Doação entregue cadastrada com sucesso!");
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro ao salvar a doação. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{"< Voltar"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTextLarge}>AVHRO</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {route.params?.donation
            ? "Editar Doação Entregue"
            : "Cadastro de Doação Entregue"}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Item</Text>
          <TextInput
            value={formData.item}
            onChangeText={(value) => handleInputChange("item", value)}
            style={styles.input}
            placeholder="Digite o item"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Donatário</Text>
          <Picker
            selectedValue={formData.donataryId}
            onValueChange={(value) => handleInputChange("donataryId", value)}
            style={styles.input}
          >
            <Picker.Item label="Selecione um donatário" value="" />
            {donataries.map((donatary) => (
              <Picker.Item
                key={donatary.id}
                label={donatary.name}
                value={donatary.id}
              />
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
          {route.params?.donation ? "Atualizar" : "Cadastrar"}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    padding: 10,
    backgroundColor: "#3B82F6",
    borderRadius: 5,
  },
  backButtonText: {
    color: "white",
    fontSize: 14,
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
