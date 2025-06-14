import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { supabase } from "../lib/supabaseClient";

export default function ActiveBookings() {
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchActive = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id)
        .not("activated_at", "is", null);

      if (!error && data) {
        const now = new Date();
        const filtered = data.filter((item) => {
          const activated = new Date(item.activated_at);
          return now.getTime() - activated.getTime() < 12 * 60 * 60 * 1000;
        });
        setActiveBookings(filtered);
      }
    };

    fetchActive();
  }, []);

  const handleNfcScan = () => {
    Alert.alert("✅ NFC Pass Scanned", "Access granted to ski resort!");
  };

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <Text style={styles.title}>🎟 Active Bookings</Text>
      <FlatList
        data={activeBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = item.id === selectedBookingId;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedBookingId(isSelected ? null : item.id)}
            >
              <Text style={styles.resort}>{item.resort}</Text>
              <Text style={styles.detail}>💸 {item.price}</Text>
              <Text style={styles.detail}>
                ⏱ Activated: {new Date(item.activated_at).toLocaleString()}
              </Text>

              {isSelected && (
                <View style={styles.qrContainer}>
                  <Text style={styles.qrLabel}>🎟 QR Code</Text>
                  <QRCode
                    value={`booking:${item.id}`}
                    size={180}
                    backgroundColor="#fff"
                  />
                  <TouchableOpacity style={styles.scanButton} onPress={handleNfcScan}>
                    <Text style={styles.scanText}>📱 NFC Scan</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No active bookings</Text>}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  card: {
    backgroundColor: "#ffffffcc",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  resort: { fontSize: 18, fontWeight: "bold", color: "#00796B" },
  detail: { fontSize: 14, color: "#444", marginTop: 4 },
  empty: { textAlign: "center", fontSize: 16, color: "#666", marginTop: 40 },
  qrContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#00796B",
  },
  scanButton: {
    marginTop: 16,
    backgroundColor: "#00796B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  scanText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
