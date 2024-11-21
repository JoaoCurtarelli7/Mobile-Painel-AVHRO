import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../components/pages/Home";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [keyboardSpace, setKeyboardSpace] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { marginBottom: -keyboardSpace }]}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: "#ffffff",
            borderRadius: 100,
            height: 70,
          },
          tabBarActiveTintColor: "#F25D27",
          tabBarInactiveTintColor: "#808080",
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <View style={{ alignItems: "center" }}>
                <Ionicons
                  name="home-outline"
                  size={size}
                  color={focused ? "#F25D27" : "#808080"}
                />
                <Text
                  style={{
                    color: focused ? "#F25D27" : "#808080",
                    fontSize: 12,
                  }}
                >
                  Início
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
});
