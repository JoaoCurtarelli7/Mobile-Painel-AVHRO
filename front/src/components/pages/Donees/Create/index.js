import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import api from "../../../../lib/api";
import DateTimePicker from "@react-native-community/datetimepicker"; // Importando o DateTimePicker
import moment from "moment";

export function DoneesCreate() {
  const route = useRoute();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    dateRegistration: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (route.params?.donee) {
      setFormData({
        name: route.params.donee.name || "",
        cpf: route.params.donee.cpf || "",
        dateRegistration: route.params.donee.dateRegistration || "",
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
    const currentDate = selectedDate || formData.dateRegistration;
    setShowDatePicker(false); 
    handleInputChange("dateRegistration", currentDate); 
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  const handleSubmit = async () => {
    try {
      if (route.params?.donee?.id) {
        await api.put(`/donatary/${route.params.donee.id}`, formData);
        alert("Donatário atualizado com sucesso!");
      } else {
        await api.post("/donatary", formData);
        alert("Donatário cadastrado com sucesso!");
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
          {route.params?.donee ? "Editar Donatário" : "Cadastro de Donatários"}
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
          <Text style={styles.label}>CPF</Text>
          <TextInput
            value={formData.cpf}
            onChangeText={(value) => handleInputChange("cpf", value)}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de Registro</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formData.dateRegistration ? formatDate(formData.dateRegistration) : "Escolha uma data"}</Text>
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
          {route.params?.donee ? "Atualizar" : "Cadastrar"}
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
