import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import api from "../../../../lib/api";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";

export function UserCreate() {
  const navigation = useNavigation();
  const route = useRoute();

  const user = route.params?.user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
    dateRegistration: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: user.password || "",
        isAdmin: user.isAdmin || false,
        dateRegistration: user.dateRegistration
          ? new Date(user.dateRegistration)
          : new Date(),
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      handleInputChange(
        "dateRegistration",
        selectedDate || formData.dateRegistration
      );
    }
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };

  const handleSubmit = async () => {
    const sendValues = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      isAdmin: formData.isAdmin,
      dateRegistration: moment(formData.dateRegistration).format("YYYY-MM-DD"),
    };
    console.log(sendValues, user, "sendValues");

    try {
      if (user) {
        await api.put(`/users/${user.id}`, sendValues);
        Alert.alert("Sucesso", "Usuário atualizado com sucesso.");
      } else {
        await api.post("/users", sendValues);
        Alert.alert("Sucesso", "Usuário criado com sucesso.");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao enviar dados:", error.message);
      Alert.alert("Erro", "Não foi possível salvar os dados.");
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
          {user ? "Editar Usuário" : "Cadastro de Usuário"}
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
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
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
              value={formData.dateRegistration}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {!user && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              style={styles.input}
            />
          </View>
        )}

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Administrador</Text>
          <View style={styles.switchWrapper}>
            <Text style={styles.switchText}>
              {formData.isAdmin ? "Sim" : "Não"}
            </Text>
            <Switch
              value={formData.isAdmin}
              onValueChange={(value) => handleInputChange("isAdmin", value)}
              thumbColor={formData.isAdmin ? "#3B82F6" : "#f4f3f4"}
              trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>
          {user ? "Salvar Alterações" : "Cadastrar"}
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  switchText: {
    fontSize: 16,
    marginRight: 10,
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
