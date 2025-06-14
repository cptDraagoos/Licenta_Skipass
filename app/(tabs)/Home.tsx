import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserLoggedIn(!!data.session);
    };
    checkSession();
  }, []);

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}> Welcome to PeakPass</Text>
        <Text style={styles.subtitle}>Your gateway to ski resort passes</Text>

        {!userLoggedIn ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/SignIn")}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.options}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/Bookings")}
            >
              <Text style={styles.buttonText}>📄 My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/ActiveBookings")}
            >
              <Text style={styles.buttonText}>✅ Active Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/Profile")}
            >
              <Text style={styles.buttonText}>👤 Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00796B",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  options: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#00796B",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginBottom: 16,
    width: "85%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
