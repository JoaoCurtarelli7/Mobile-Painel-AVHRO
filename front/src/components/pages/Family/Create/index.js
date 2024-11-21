import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../../../lib/api";

export function FamilyCreate() {
  const route = useRoute();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: "",
    numberMembers: "",
    dateRegistration: "",
    bairro: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (route.params?.family) {
      console.log(route.params.family);

      const formattedDate = route.params.family.dateRegistration
        ? new Date(route.params.family.dateRegistration)
        : new Date();

      setFormData({
        name: route.params.family.name || "",
        numberMembers: route.params.family.numberMembers || "",
        dateRegistration: formattedDate,
        bairro: route.params.family.bairro || "",
      });
    }
  }, [route.params]);

  const handleInputChange = (field, value) => {
    if (field === "numberMembers") {
      value = parseInt(value, 10); // Ensure it's an integer
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.dateRegistration;
    setShowDatePicker(false);
    handleInputChange("dateRegistration", currentDate);
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      numberMembers: formData.numberMembers,
      dateRegistration: moment(formData.dateRegistration).format("YYYY-MM-DD"),
      bairro: formData.bairro,
    };

    try {
      if (route.params?.family?.id) {
        await api.put(`/family/${route.params.family.id}`, payload);
        alert("Família atualizada com sucesso!");
      } else {
        await api.post("/family", payload);
        alert("Família cadastrada com sucesso!");
      }
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro. Tente novamente.");
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
          {route.params?.family ? "Editar Família" : "Cadastro de Família"}
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            value={formData.name}
            onChangeText={(value) => handleInputChange("name", value)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Número de Membros</Text>
          <TextInput
            value={formData.numberMembers.toString()}
            onChangeText={(value) =>
              handleInputChange("numberMembers", value.replace(/\D/g, ""))
            } 
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bairro</Text>
          <TextInput
            value={formData.bairro}
            onChangeText={(value) => handleInputChange("bairro", value)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de Registro</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {formData.dateRegistration
                ? formatDate(formData.dateRegistration)
                : "Escolha uma data"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dateRegistration || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>
          {route.params?.family ? "Atualizar" : "Cadastrar"}
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
