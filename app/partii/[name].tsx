import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "../../lib/supabaseClient";

export default function ResortDetails() {
  const { name } = useLocalSearchParams();
  const [resort, setResort] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResort = async () => {
      const { data, error } = await supabase
        .from("resorts")
        .select("*")
        .eq("route_name", name)
        .single();

      if (error) {
        console.error("Error fetching resort:", error.message);
      } else {
        setResort(data);
      }

      setLoading(false);
    };

    fetchResort();
  }, [name]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  if (!resort) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Resort not found.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{resort.name}</Text>
        <Text style={styles.location}>📍 {resort.location}</Text>
        <Text style={styles.detail}>🎫 {resort.price}</Text>
        <Text style={styles.detail}>🎿 Length: {resort.length}</Text>
        <Text style={styles.detail}>⛰ Difficulty: {resort.difficulty}</Text>
        <Text style={styles.detail}>🚡 Lift: {resort.lift}</Text>
        <Text style={styles.detail}>🎒 Rental: {resort.rental}</Text>
        <Text style={styles.description}>{resort.description}</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00796B",
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  detail: {
    fontSize: 14,
    marginVertical: 2,
    color: "#333",
  },
  description: {
    marginTop: 15,
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#C00",
  },
});
