import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SharedScreen() {
  const [userId, setUserId] = useState("");
  const [sharedTasks, setSharedTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState<"to" | "from">("to");

  useEffect(() => {
    const load = async () => {
      const id = await AsyncStorage.getItem("userId");
      const storedTasks = await AsyncStorage.getItem("sharedTasks");
      setUserId(id || "");
      setSharedTasks(storedTasks ? JSON.parse(storedTasks) : []);
    };
    load();
  }, []);

  const filtered = sharedTasks.filter(task =>
    filter === "to" ? task.assignedToId === userId : task.fromId === userId
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => setFilter("to")}
          style={[styles.button, filter === "to" && styles.active]}
        >
          <Text style={styles.buttonText}>Assigned To Me</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilter("from")}
          style={[styles.button, filter === "from" && styles.active]}
        >
          <Text style={styles.buttonText}>Assigned By Me</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={styles.taskText}>{item.text}</Text>
            <Text style={styles.meta}>Assigned To: {item.assignedTo || "—"}</Text>
            <Text style={styles.meta}>From: {item.fromId || "—"}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9fafb",
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  button: {
    padding: 10,
    backgroundColor: "#e5e7eb",
    borderRadius: 6,
  },
  active: {
    backgroundColor: "#2563eb",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  task: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    fontSize: 12,
    color: "#6b7280",
  },
});
