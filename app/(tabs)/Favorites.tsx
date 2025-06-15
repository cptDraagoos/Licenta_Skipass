import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../../lib/supabaseClient";

interface Resort {
  id: string;
  name: string;
  location: string;
  price: string;
  route_name: string;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<Resort[]>([]);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn("User not logged in.");
        setNotLoggedIn(true);
        return;
      }

      const { data: favData, error: favError } = await supabase
        .from("favorites")
        .select("resort_id")
        .eq("user_id", user.id);

      if (favError || !favData) {
        console.error("Failed to fetch favorites:", favError?.message);
        return;
      }

      const resortIds = favData.map((fav) => fav.resort_id);

      const { data: resorts, error: resortError } = await supabase
        .from("resorts")
        .select("*")
        .in("route_name", resortIds);

      if (resortError) {
        console.error("Failed to fetch resort info:", resortError.message);
        return;
      }

      setFavorites(resorts as Resort[]);
    };

    fetchFavorites();
  }, []);

  const handleBuyPass = (resortName: string, price: string) => {
    router.push({
      pathname: "/Checkout",
      params: {
        resort: resortName,
        price: price,
      },
    });
  };

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <Text style={styles.title}>Favorites / Wishlist</Text>

      {notLoggedIn ? (
        <Text style={styles.warningText}>
          ❗ You need to be logged in so you can add to favorites.
        </Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.route_name}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => router.push(`/partii/${item.route_name}`)}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.detail}>{item.location}</Text>
                <Text style={styles.detail}>{item.price}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuyPass(item.name, item.price)}
              >
                <Text style={styles.buyText}>🎟 Buy Pass</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No favorites yet. Add some from Explore!</Text>
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
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
  warningText: {
  flex: 1,
  textAlign: "center",
  textAlignVertical: "center",
  fontSize: 20,
  color: "#C62828",
  marginTop: 60,
  paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#ffffffcc",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
  },
  detail: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  buyButton: {
    marginTop: 10,
    backgroundColor: "#00796B",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buyText: {
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
