import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View
} from "react-native";
import QRCode from 'react-native-qrcode-svg';

export default function Scan() {
  const [scanned, setScanned] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const ticketInfo = {
    resort: "Pârtia Rarău",
    ticketId: "RARAU-2025-001",
    validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12h from now
  };

  useEffect(() => {
    // Simulate NFC scan on component mount
    const timer = setTimeout(() => {
      setScanned(true);
      setQrVisible(true);
      Alert.alert("✅ NFC Pass Scanned", "Access granted to ski resort!");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <Text style={styles.title}>Scan NFC Pass</Text>

      {scanned && (
        <Text style={styles.result}>🏔 Access Granted – Enjoy your ride!</Text>
      )}

      {qrVisible && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>🎟 Your Ticket QR Code</Text>
          <QRCode
            value={`Resort: ${ticketInfo.resort}\nID: ${ticketInfo.ticketId}\nValid until: ${ticketInfo.validUntil}`}
            size={200}
          />
        </View>
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
  result: {
    fontSize: 16,
    color: "#00796B",
    fontWeight: "500",
    marginBottom: 20,
  },
  qrContainer: {
    alignItems: "center",
  },
  qrLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
    color: "#000",
  },
});
