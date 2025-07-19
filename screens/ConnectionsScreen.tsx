import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

export default function ConnectionsScreen() {
  const [userId, setUserId] = useState("");
  const [inputId, setInputId] = useState("");
  const [connections, setConnections] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      let id = await AsyncStorage.getItem("userId");
      if (!id) {
        id = uuidv4();
        await AsyncStorage.setItem("userId", id);
      }
      setUserId(id);

      const stored = await AsyncStorage.getItem("connections");
      if (stored) setConnections(JSON.parse(stored));
    };
    loadData();
  }, []);

  const addConnection = async () => {
    if (!inputId || connections.includes(inputId) || inputId === userId) return;
    const newConnections = [...connections, inputId];
    setConnections(newConnections);
    setInputId("");
    await AsyncStorage.setItem("connections", JSON.stringify(newConnections));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your ID:</Text>
      <Text selectable style={styles.id}>
        {userId}
      </Text>

      <Text style={styles.subtitle}>Connect to another user:</Text>
      <TextInput
        placeholder="Enter their ID"
        value={inputId}
        onChangeText={setInputId}
        style={styles.input}
      />
      <Button title="Connect" onPress={addConnection} />

      <Text style={styles.subtitle}>Your Connections:</Text>
      <FlatList
        data={connections}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text style={styles.connection}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  id: {
    fontSize: 16,
    marginBottom: 20,
    color: "#1d4ed8",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  connection: {
    padding: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
    marginBottom: 6,
  },
});
