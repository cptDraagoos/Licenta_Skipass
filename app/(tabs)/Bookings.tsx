import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabaseClient";

interface Booking {
  id: string;
  resort: string;
  price: string;
  purchase_date: string;
  activated_at: string | null;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);

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
      .eq("user_id", user.id)
      .order("purchase_date", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error.message);
    } else {
      const validBookings = (data as Booking[]).filter((booking) => {
        if (!booking.activated_at) return true;
        const activated = new Date(booking.activated_at);
        const now = new Date();
        return now.getTime() - activated.getTime() < 12 * 60 * 60 * 1000;
      });
      setBookings(validBookings);
    }
  };

  const handleActivate = async (bookingId: string) => {
    const { error } = await supabase
      .from("purchases")
      .update({ activated_at: new Date().toISOString() })
      .eq("id", bookingId);

    if (error) {
      Alert.alert("Error", "Failed to activate ticket.");
    } else {
      fetchBookings();
    }
  };

  useEffect(() => {
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

            {item.activated_at ? (
              <Text style={styles.activated}>✅ Activated</Text>
            ) : (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => handleActivate(item.id)}
              >
                <Text style={styles.scanText}>Activate Ticket</Text>
              </TouchableOpacity>
            )}
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
  activated: {
    marginTop: 10,
    color: "green",
    fontWeight: "bold",
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
