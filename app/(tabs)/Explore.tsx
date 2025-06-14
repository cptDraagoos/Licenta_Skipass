import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFavorites } from "../../context/FavoritesContext";
import { supabase } from "../../lib/supabaseClient";

interface Resort {
  id: string;
  name: string;
  location: string;
  price: string;
  length: string;
  difficulty: string;
  route_name: string;
}

export default function Explore() {
  const [search, setSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const router = useRouter();
  const { addFavorite, removeFavorite, favorites } = useFavorites();

  useEffect(() => {
    const fetchResorts = async () => {
      const { data, error } = await supabase.from("resorts").select("*");
      if (error) {
        console.error("Failed to fetch resorts:", error.message);
        return;
      }
      setResorts(data as Resort[]);
    };

    fetchResorts();
  }, []);

  const filteredResorts = resorts.filter((resort) =>
    resort.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    console.log("Logging out...");
    setMenuVisible(false);
  };

  const handleBuyPass = async (resortName: string, price: string) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("You must be logged in to buy a pass.");
      return;
    }

    router.push({
      pathname: "/Checkout",
      params: { resort: resortName, price: price },
    });
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
        {filteredResorts.map((resort) => {
          const isFavorite = favorites.some(f => f.id === resort.route_name);

          return (
            <View key={resort.id} style={styles.card}>
              <Link href={`/partii/${resort.route_name}`} asChild>
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
                  isFavorite
                    ? removeFavorite(resort.route_name)
                    : addFavorite({
                        id: resort.route_name,
                        name: resort.name,
                        location: resort.location,
                        price: resort.price,
                        routeName: resort.route_name,
                      })
                }
              >
                <Text style={styles.favoriteText}>
                  {isFavorite ? "❤️ In Favorites" : "🖤 Add to Favorites"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuyPass(resort.name, resort.price)}
              >
                <Text style={styles.buyText}>🎟 Buy Pass</Text>
              </TouchableOpacity>
            </View>
          );
        })}
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
  buyButton: {
    marginTop: 8,
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
});
