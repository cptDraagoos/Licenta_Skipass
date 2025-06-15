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
  length: string;
  difficulty: string;
  route_name: string;
  prices: { id: string; label: string; amount: string }[];
}

export default function Explore() {
  const [search, setSearch] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<{ [resortId: string]: string }>({});
  const router = useRouter();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchResorts = async () => {
      const { data: resortsData, error } = await supabase.from("resorts").select("*");
      if (error || !resortsData) {
        console.error("Failed to fetch resorts:", error?.message);
        return;
      }

      const { data: pricesData, error: pricesError } = await supabase.from("prices").select("*");
      if (pricesError || !pricesData) {
        console.error("Failed to fetch prices:", pricesError?.message);
        return;
      }

      const resortsWithPrices = resortsData.map((resort) => ({
        ...resort,
        prices: pricesData.filter((p) => p.resort_id === resort.id),
      }));

      setResorts(resortsWithPrices);
    };
    fetchResorts();
  }, []);

  const handleBuyPass = async (resortName: string, price: string) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("You must be logged in to buy a pass.");
      return;
    }

    router.push({ pathname: "/Checkout", params: { resort: resortName, price } });
  };

  const filteredResorts = resorts.filter((resort) =>
    resort.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFavorite = (resort: Resort) => {
    const isFavorite = favorites.some((fav) => fav.id === resort.id);
    if (isFavorite) {
      removeFavorite(resort.id);
    } else {
      addFavorite({
        id: resort.id,
        name: resort.name,
        location: resort.location,
        price: resort.prices[0]?.amount || "",
        routeName: resort.route_name,
      });
    }
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
          const isFavorite = favorites.some((f) => f.id === resort.id);

          return (
            <View key={resort.id} style={styles.card}>
              <Link href={`/partii/${resort.route_name}`} asChild>
                <TouchableOpacity>
                  <Text style={styles.resortName}>{resort.name}</Text>
                  <Text style={styles.resortLocation}>{resort.location}</Text>
                  <Text style={styles.detail}>🎿 Length: {resort.length}</Text>
                  <Text style={styles.detail}>⛰ Difficulty: {resort.difficulty}</Text>
                </TouchableOpacity>
              </Link>

              <View style={styles.priceOptionsContainer}>
                {resort.prices.map((price) => {
                  const isSelected =
                    selectedPrices[resort.id] === price.amount ||
                    (!selectedPrices[resort.id] && resort.prices[0]?.amount === price.amount);

                  return (
                    <TouchableOpacity
                      key={price.id}
                      onPress={() =>
                        setSelectedPrices((prev) => ({ ...prev, [resort.id]: price.amount }))
                      }
                      style={[
                        styles.priceButton,
                        isSelected && styles.priceButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.priceButtonText,
                          isSelected && styles.priceButtonTextSelected,
                        ]}
                      >
                        {price.label} - {price.amount}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() =>
                  handleBuyPass(resort.name, selectedPrices[resort.id] || resort.prices[0]?.amount)
                }
              >
                <Text style={styles.buyText}>🎟 Buy Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleToggleFavorite(resort)}
              >
                <Text style={styles.favoriteText}>
                  {isFavorite ? "❤️ In Favorites" : "🖤 Add to Favorites"}
                </Text>
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
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuTopRight}>
            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                router.push("/Profile");
              }}
            >
              <Text style={styles.menuItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(false)}>
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
  priceOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 8,
  },
  priceButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderColor: "#00796B",
    borderWidth: 1,
    borderRadius: 8,
  },
  priceButtonSelected: {
    backgroundColor: "#00796B",
  },
  priceButtonText: {
    color: "#00796B",
    fontWeight: "600",
  },
  priceButtonTextSelected: {
    color: "#fff",
  },
});
