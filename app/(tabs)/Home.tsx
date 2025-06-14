import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <Text style={styles.title}>Welcome to PeakPass</Text>

      {!userLoggedIn ? (
        <TouchableOpacity style={styles.button} onPress={() => router.push("/SignIn")}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.options}>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/Bookings")}>
            <Text style={styles.buttonText}>My Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/ActiveBookings")}>
            <Text style={styles.buttonText}>Active Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/Profile")}>
            <Text style={styles.buttonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#00796B",
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  options: {
    width: "100%",
    alignItems: "center",
  },
});
