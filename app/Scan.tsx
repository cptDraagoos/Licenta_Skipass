import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Scan() {
  const [scanned, setScanned] = useState(false);

  const simulateNfcScan = () => {
    setTimeout(() => {
      setScanned(true);
      Alert.alert("✅ NFC Pass Scanned", "Access granted to ski resort!");
    }, 1500); // Simulate delay
  };

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <Text style={styles.title}>Scan NFC Pass</Text>

      <TouchableOpacity style={styles.button} onPress={simulateNfcScan}>
        <Text style={styles.buttonText}>📱 Tap to Scan</Text>
      </TouchableOpacity>

      {scanned && (
        <Text style={styles.result}>🏔 Access Granted – Enjoy your ride!</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  result: {
    marginTop: 30,
    fontSize: 16,
    color: "#00796B",
    fontWeight: "500",
  },
});
