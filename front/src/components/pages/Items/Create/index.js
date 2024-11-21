import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import moment from "moment";
import api from "../../../../lib/api";
import DateTimePicker from "@react-native-community/datetimepicker";

export function ItemsCreate() {
  const route = useRoute();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    dateAdded: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (route.params?.item) {
      const { name, description, quantity, dateAdded } = route.params.item;

      setFormData({
        name: name || "",
        description: description || "",
        quantity: quantity?.toString() || "",
        dateAdded: dateAdded ? new Date(dateAdded) : new Date(),
      });
    }
  }, [route.params]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "quantity" ? value.replace(/\D/g, "") : value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.dateAdded;
    setShowDatePicker(false);
    handleInputChange("dateAdded", currentDate);
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  const handleSubmit = async () => {
    const payload = {
      name: formData.name,
      description: formData.description,
      quantity: parseInt(formData.quantity, 10) || 0,
      dateAdded: moment(formData.dateAdded).format("YYYY-MM-DD"),
    };

    try {
      if (route.params?.item?.id) {
        await api.put(`/items/${route.params.item.id}`, payload);
        Alert.alert("Sucesso", "Item atualizado com sucesso!");
      } else {
        await api.post("/items", payload);
        Alert.alert("Sucesso", "Item cadastrado com sucesso!");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar item:", error);
      Alert.alert("Erro", "Não foi possível salvar o item. Tente novamente.");
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
          {route.params?.item ? "Editar Item" : "Cadastro de Item"}
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
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            value={formData.description}
            onChangeText={(value) => handleInputChange("description", value)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Quantidade</Text>
          <TextInput
            value={formData.quantity}
            onChangeText={(value) => handleInputChange("quantity", value)}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de Adição</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>
              {formData.dateAdded
                ? formatDate(formData.dateAdded)
                : "Escolha uma data"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.dateAdded || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>
          {route.params?.item ? "Atualizar" : "Cadastrar"}
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
