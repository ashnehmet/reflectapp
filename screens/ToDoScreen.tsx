import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Task {
  text: string;
  completed: boolean;
  fromMe?: boolean;
  toMe?: boolean;
}

export default function ToDoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
const [filter, setFilter] = useState<"all" | "fromMe" | "toMe" | "mine">("all");


  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("tasks");
      if (saved) setTasks(JSON.parse(saved));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const toggleComplete = (index: number) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([{ text: newTask, completed: false }, ...tasks]);
      setNewTask("");
    }
  };

  const deleteTask = (index: number) => {
    const updated = [...tasks];
    updated.splice(index, 1);
    setTasks(updated);
  };

  const clearAll = () => setTasks([]);

	const visibleTasks = tasks.filter(task => {
	  if (filter === "fromMe") return task.fromMe && !task.toMe;
	  if (filter === "toMe") return task.toMe && !task.fromMe;
	  if (filter === "mine") return task.fromMe && task.toMe;
	  return true;
	});

return (
  <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>To Do</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Add a task..."
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addText}>＋</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {(["all", "fromMe", "toMe", "mine"] as const).map(type => (
          <TouchableOpacity
            key={type}
            onPress={() => setFilter(type)}
            style={[styles.filterBtn, filter === type && styles.active]}
          >
            <Text>
              {type === "all" ? "All" : type === "fromMe" ? "From Me" : type === "toMe" ? "To Me" : "Mine"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {visibleTasks.map((task, i) => (
        <View key={i} style={styles.taskRow}>
          <TouchableOpacity onPress={() => toggleComplete(i)}>
            <Text style={[styles.task, task.completed && styles.done]}>
              {task.completed ? "✅ " : "☐ "}{task.text}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTask(i)}>
            <Text style={styles.delete}>🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={clearAll} style={styles.clearBtn}>
        <Text style={styles.clearText}>Clear All</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  inputRow: { flexDirection: "row", marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    marginLeft: 8,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 8,
  },
  addText: { fontSize: 20, color: "white" },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: "#e2e8f0",
  },
  active: { backgroundColor: "#a5b4fc" },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  task: { fontSize: 16, color: "#1e293b" },
  done: { textDecorationLine: "line-through", color: "#94a3b8" },
  delete: { marginLeft: 10, fontSize: 16 },
  clearBtn: { marginTop: 24, alignSelf: "center" },
  clearText: { color: "#ef4444", fontWeight: "bold" },
});
