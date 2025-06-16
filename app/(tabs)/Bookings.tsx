import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const router = useRouter();

  const fetchBookings = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", user.id)
      .order("purchase_date", { ascending: false });

    if (!error && data) {
      setBookings(data);
    }
  };

  const activateBooking = async (id: string) => {
    const { error } = await supabase
      .from("purchases")
      .update({ activated_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) {
      fetchBookings();
      router.push("/ActiveBookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatus = (activated_at: string | null) => {
    if (!activated_at) return "Pending";
    const activated = new Date(activated_at);
    const now = new Date();
    return now.getTime() - activated.getTime() < 12 * 60 * 60 * 1000
      ? "Active"
      : "Expired";
  };

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <Text style={styles.title}>All Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.cardInfo}>
                <Text style={styles.resort}>{item.resort}</Text>
                <Text style={styles.detail}>💸 {item.price}</Text>
                <Text style={styles.detail}>
                  📅 {new Date(item.purchase_date).toLocaleDateString()}
                </Text>
                <Text style={styles.status}>Status: {getStatus(item.activated_at)}</Text>
              </View>

              <View style={styles.buttonColumn}>
                {item.activated_at === null && (
                  <TouchableOpacity
                    style={styles.activateButton}
                    onPress={() => activateBooking(item.id)}
                  >
                    <Text style={styles.activateText}>Activate</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
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
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  buttonColumn: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginLeft: 10,
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
  status: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: "bold",
    color: "#00796B",
  },
  activateButton: {
    backgroundColor: "#00796B",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  activateText: {
    color: "#FFF",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 40,
  },
});
