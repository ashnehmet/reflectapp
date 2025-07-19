import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HistoryItem {
  id: number;
  summary: string;
  tag: string;
  timestamp: number;
}

const FILTERS = ["All", "To Do", "Praise", "Reflection"];

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const loadHistory = async () => {
      const stored = await AsyncStorage.getItem("history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    };
    loadHistory();
  }, []);

  const filteredHistory = history.filter((item) =>
    filter === "All" ? true : item.tag === filter
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <View style={styles.filterContainer}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.activeFilter,
            ]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.activeText,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        {filteredHistory.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.date}>
              📅 {new Date(item.timestamp).toLocaleDateString()}
            </Text>
            <Text style={styles.summary}>{item.summary}</Text>
            <Text style={styles.tag}>Tag: {item.tag}</Text>
          </View>
        ))}
      </ScrollView>
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
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilter: {
    backgroundColor: "#3b82f6",
  },
  filterText: {
    fontSize: 14,
    color: "#1f2937",
  },
  activeText: {
    color: "white",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
  },
  summary: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 4,
  },
  tag: {
    fontSize: 14,
    color: "#9ca3af",
  },
});
