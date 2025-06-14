import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFavorites } from "../../context/FavoritesContext";

export default function Favorites() {
  const router = useRouter();
  const { favorites } = useFavorites(); 

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <Text style={styles.title}>Favorites / Wishlist</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/partii/${item.routeName}`)} 
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>{item.location}</Text>
            <Text style={styles.detail}>{item.price}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No favorites yet. Add some from Explore!
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
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
  empty: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 40,
  },
});
