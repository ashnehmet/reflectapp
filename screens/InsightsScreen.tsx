
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InsightsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Insights</Text>
      <Text style={styles.text}>
        You were mostly warm and clear this week, but rushed in 2 conversations.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#4b5563",
  },
});
