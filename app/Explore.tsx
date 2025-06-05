import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFavorites } from "../context/FavoritesContext";

const resorts = [
  {
    name: "Pârtia Rărau",
    location: "Câmpulung Moldovenesc",
    price: "120 RON / day",
    length: "2.8 km",
    difficulty: "Intermediate",
    routeName: "PartiaRarau",
  },
  {
    name: "Borșa – Pârtia Olimpică",
    location: "Borșa, Maramureș",
    price: "130 RON / day",
    length: "2.65 km",
    difficulty: "Intermediate (Red)",
    routeName: "PartiaBorsa",
  },
  {
    name: "Straja",
    location: "Hunedoara",
    price: "130 RON / day",
    length: "3.4 km",
    difficulty: "Intermediate",
    routeName: "Straja",
  },
  {
    name: "Poiana Brașov",
    location: "Brașov",
    price: "170 RON / day",
    length: "4.8 km",
    difficulty: "Advanced",
    routeName: "PoianaBrasov",
  },
  {
    name: "Arena Platoș",
    location: "Sibiu",
    price: "90 RON / day",
    length: "1.5 km",
    difficulty: "Beginner",
    routeName: "ArenaPlatos",
  },
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const { addFavorite } = useFavorites();

  const filteredResorts = resorts.filter((resort) =>
    resort.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    console.log("Logging out...");
    setMenuVisible(false);
  };

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Ski Resorts</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuText}>⋯</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search resorts..."
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView contentContainerStyle={styles.list}>
        {filteredResorts.map((resort, index) => (
          <View key={index} style={styles.card}>
            <Link href={`/partii/${resort.routeName}`} asChild>
              <TouchableOpacity>
                <Text style={styles.resortName}>{resort.name}</Text>
                <Text style={styles.resortLocation}>{resort.location}</Text>
                <Text style={styles.detail}>🎫 Skipass: {resort.price}</Text>
                <Text style={styles.detail}>🎿 Slope Length: {resort.length}</Text>
                <Text style={styles.detail}>⛰ Difficulty: {resort.difficulty}</Text>
              </TouchableOpacity>
            </Link>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() =>
                addFavorite({
                id: resort.routeName,
                name: resort.name,
                location: resort.location,
                price: resort.price,
                routeName: resort.routeName, // ✅ make sure this is included
            })
          }
          >
          <Text style={styles.favoriteText}>♡ Add to Favorites</Text>
        </TouchableOpacity>

          </View>
        ))}
      </ScrollView>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuTopRight}>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push("/Profile");
              }}
            >
              <Text style={styles.menuItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.menuItem}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  menuText: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
  searchInput: {
    backgroundColor: "#ffffffcc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffffcc",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resortName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00796B",
  },
  resortLocation: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  favoriteButton: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderColor: "#00796B",
    borderWidth: 1,
  },
  favoriteText: {
    color: "#00796B",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
  },
  menuTopRight: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    width: 160,
    elevation: 5,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
});
