import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFavorites } from "../../context/FavoritesContext";
import { supabase } from "../../lib/supabaseClient";

export default function Favorites() {
  const router = useRouter();
  const { favorites, refreshFavorites } = useFavorites();
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  const checkAuthAndRefresh = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setNotLoggedIn(true);
    } else {
      setNotLoggedIn(false);
      refreshFavorites(); // fetch from DB
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkAuthAndRefresh();
    }, [])
  );

  const handleBuyPass = (resortName: string, price: string) => {
    router.push({
      pathname: "/Checkout",
      params: {
        resort: resortName,
        price,
      },
    });
  };

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <Text style={styles.title}>Favorites / Wishlist</Text>

      {notLoggedIn ? (
        <View style={styles.centeredMessage}>
          <Text style={styles.warningText}>
            ❗ You need to be logged in to view your favorite resorts.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.routeName}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => router.push(`/partii/${item.routeName}`)}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.detail}>{item.location}</Text>
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
  centeredMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  warningText: {
    fontSize: 18,
    color: "#C62828",
    textAlign: "center",
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
