import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../lib/supabaseClient";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.warn("User not logged in.");
        setNotLoggedIn(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch failed:", error.message);
        Alert.alert("Error", "No user profile found.");
      } else {
        setName(data.name || "");
        setEmail(data.email || "");
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("users")
      .update({
        name,
        email,
        ...(password ? { password } : {}),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Update error:", error.message);
      Alert.alert("Update failed", error.message);
    } else {
      Alert.alert("Success", "Profile updated.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  if (notLoggedIn) {
    return (
      <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
        <View style={styles.centeredMessage}>
          <Text style={styles.warningText}>
            ❗ You need to be logged in to access your profile.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="example@email.com"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />
      </View>

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    color: "#015958",
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00796B",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  warningText: {
    fontSize: 18,
    color: "#C62828",
    textAlign: "center",
  },
});
