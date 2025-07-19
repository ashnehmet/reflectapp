import React from "react";
import { View, Text, StyleSheet, Switch, Alert } from "react-native";
import { useUser } from "../contexts/UserContext";

export default function UpgradeScreen() {
  const { isProUser, setIsProUser } = useUser();

  const toggleSwitch = () => {
    const newVal = !isProUser;
    setIsProUser(newVal);
    Alert.alert("Pro Access", newVal ? "Pro features unlocked!" : "Pro features disabled");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade to Reflecta Pro</Text>
      <Text style={styles.subtitle}>Unlock these features:</Text>
      <Text style={styles.item}>• Tone & Communication Feedback</Text>
      <Text style={styles.item}>• Unlimited Connections</Text>
      <Text style={styles.item}>• Delegated Task Tracking</Text>
      <Text style={styles.item}>• Filter & History</Text>
      <Text style={styles.toggleLabel}>Simulate Pro access:</Text>
      <Switch value={isProUser} onValueChange={toggleSwitch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 6,
  },
  toggleLabel: {
    fontSize: 16,
    marginTop: 24,
    marginBottom: 6,
    color: "#0f172a",
  },
});
