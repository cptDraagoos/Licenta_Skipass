import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { supabase } from "../../lib/supabaseClient";

const API_KEY = "e740da7b392b0587da8ad998b04d57fb";

export default function ResortDetails() {
  const { name } = useLocalSearchParams();
  const [resort, setResort] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<any[]>([]);

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
        fetchWeather(data.location);
      }

      setLoading(false);
    };

    const fetchWeather = async (location: string) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            location
          )}&appid=${API_KEY}&units=metric`
        );
        const json = await response.json();
        if (json.list) {
          const daily = json.list.filter((_: any, index: number) => index % 8 === 0);
          setForecast(daily.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchResort();
  }, [name]);

  const WebcamEmbed = ({ url }: { url: string }) => (
    <View style={styles.webviewContainer}>
      <Text style={styles.webcamTitle}>🟢 Live webcam:</Text>
      <WebView source={{ uri: url }} style={styles.webview} />
    </View>
  );

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

        {forecast.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.webcamTitle}>🌤 3-Day Forecast:</Text>
            {forecast.map((day, index) => (
              <Text key={index} style={styles.detail}>
                📅 {new Date(day.dt_txt).toLocaleDateString()} - {day.main.temp}°C, {day.weather[0].description}
              </Text>
            ))}
          </View>
        )}

        {resort.route_name === "PartiaRarau" && (
          <WebcamEmbed url="https://webcamromania.ro/webcam-partii-de-schi/webcam-rarau/" />
        )}
        {resort.route_name === "PartiaBorsa" && (
          <WebcamEmbed url="https://webcamromania.ro/webcam-partii-de-schi/webcam-partia-borsa/" />
        )}
        {resort.route_name === "PoianaBrasov" && (
          <WebcamEmbed url="https://webcamromania.ro/webcam-partii-de-schi/webcam-poiana-brasov/" />
        )}
        {resort.route_name === "Straja" && (
          <WebcamEmbed url="https://webcamromania.ro/webcam-partii-de-schi/webcam-live-partia-platoul-soarelui-straja/" />
        )}
        {resort.route_name === "ArenaPlatos" && (
          <WebcamEmbed url="https://webcamromania.ro/webcam-partii-de-schi/webcam-live-arena-platos/" />
        )}
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
  webviewContainer: {
    height: 250,
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  webcamTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
    color: "#00796B",
  },
  webview: {
    flex: 1,
  },
});
