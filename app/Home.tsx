import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    setMenuVisible(false);
  };

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
        <Text style={styles.menuText}>⋮</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Welcome to PeakPass</Text>
      <Text style={styles.subtitle}>Your gateway to Romanian ski adventures!</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/Explore")}> 
        <Text style={styles.buttonText}>Explore Resorts</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/Profile")}> 
        <Text style={styles.buttonText}>My Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/Favorites")}> 
        <Text style={styles.buttonText}>Favorites / Wishlist</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/Bookings")}> 
        <Text style={styles.buttonText}>Booking History</Text>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuTopRight}>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  menuButton: {
    position: "absolute",
    top: 60,
    right: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 100,
  },
  menuText: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginBottom: 40,
    marginTop: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00796B",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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