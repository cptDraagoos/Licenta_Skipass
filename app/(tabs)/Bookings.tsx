import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabaseClient";

interface Booking {
  id: string;
  resort: string;
  price: string;
  purchase_date: string;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not authenticated");
        return;
      }

      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching bookings:", error.message);
      } else {
        setBookings(data as Booking[]);
      }
    };

    fetchBookings();
  }, []);

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <Text style={styles.title}>My Skipass Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.resort}>{item.resort}</Text>
            <Text style={styles.detail}>💸 {item.price}</Text>
            <Text style={styles.detail}>
              📅 {new Date(item.purchase_date).toLocaleDateString()}
            </Text>

            <Link href="/Scan" asChild>
              <TouchableOpacity style={styles.scanButton}>
                <Text style={styles.scanText}>Scan NFC</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No bookings found.</Text>}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
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
  resort: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
  },
  detail: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 40,
  },
  scanButton: {
    marginTop: 10,
    backgroundColor: "#00796B",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  scanText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
