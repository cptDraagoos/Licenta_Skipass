import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { supabase } from "../../lib/supabaseClient";

const API_KEY = "e740da7b392b0587da8ad998b04d57fb";

export default function ResortDetails() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const [resort, setResort] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: resortData, error } = await supabase
        .from("resorts")
        .select("*")
        .eq("route_name", name)
        .single();

      if (error) {
        console.error("Error fetching resort:", error.message);
      } else {
        setResort(resortData);
        fetchWeather(resortData.location);
        fetchPrices(resortData.id);
      }

      setLoading(false);
    };

    const fetchPrices = async (resortId: string) => {
      const { data, error } = await supabase
        .from("prices")
        .select("*")
        .eq("resort_id", resortId);

      if (error) {
        console.error("Error fetching prices:", error.message);
      } else {
        setPrices(data);
        if (data.length > 0) setSelectedPrice(data[0]);
      }
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

    fetchData();
  }, [name]);

  const handleBuyPass = () => {
    if (!resort || !selectedPrice) return;

    router.push({
      pathname: "/Checkout",
      params: {
        resort: resort.name,
        price: selectedPrice.amount,
        label: selectedPrice.label,
      },
    });
  };

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
    <LinearGradient colors={["#F0F8FF", "#E0F2F1", "#CCEBF4"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{resort.name}</Text>
        <Text style={styles.location}>📍 {resort.location}</Text>
        <Text style={styles.detail}>🎿 Length: {resort.length}</Text>
        <Text style={styles.detail}>⛰ Difficulty: {resort.difficulty}</Text>
        <Text style={styles.detail}>🚡 Lift: {resort.lift}</Text>
        <Text style={styles.detail}>🎒 Rental: {resort.rental}</Text>
        <Text style={styles.description}>{resort.description}</Text>

        {/* Price options with buttons */}
        {prices.length > 0 && (
          <View style={styles.pricesSection}>
            <Text style={styles.sectionTitle}>🎫 Select Skipass Type</Text>
            <View style={styles.priceOptions}>
              {prices.map((p) => {
                const isSelected = selectedPrice?.id === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setSelectedPrice(p)}
                    style={[
                      styles.priceButton,
                      isSelected && styles.priceButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.priceText,
                        isSelected && styles.priceTextSelected,
                      ]}
                    >
                      {p.label} - {p.amount} RON
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.buyButton} onPress={handleBuyPass}>
              <Text style={styles.buyText}>🎟 Buy Pass</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Weather */}
        {forecast.length > 0 && (
          <View style={styles.forecastContainer}>
            <Text style={styles.sectionTitle}>🌤 3-Day Weather Forecast</Text>
            {forecast.map((day, index) => (
              <View key={index} style={styles.weatherCard}>
                <Text style={styles.weatherDate}>
                  📅 {new Date(day.dt_txt).toLocaleDateString()}
                </Text>
                <Text style={styles.weatherInfo}>
                  🌡 {day.main.temp}°C  |  {day.weather[0].description}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Webcam */}
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
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },
  title: { fontSize: 30, fontWeight: "bold", color: "#015958", marginBottom: 14 },
  location: { fontSize: 18, marginBottom: 12, color: "#2F4F4F" },
  detail: { fontSize: 16, marginVertical: 4, color: "#2E2E2E" },
  description: { marginTop: 20, fontSize: 16, lineHeight: 22, color: "#555" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#00796B", marginBottom: 10 },
  pricesSection: {
    marginTop: 20,
  },
  priceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  priceButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderColor: "#00796B",
    borderWidth: 1,
  },
  priceButtonSelected: {
    backgroundColor: "#00796B",
  },
  priceText: {
    color: "#00796B",
    fontWeight: "600",
  },
  priceTextSelected: {
    color: "#fff",
  },
  buyButton: {
    backgroundColor: "#00796B",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  buyText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  weatherCard: {
    backgroundColor: "#ffffffcc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  weatherDate: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#00796B",
  },
  weatherInfo: { fontSize: 14, color: "#444" },
  forecastContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0fcff",
    borderRadius: 10,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "#C00" },
  webviewContainer: {
    height: 250,
    marginTop: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f4fafd",
    borderWidth: 1,
    borderColor: "#d0e3ec",
  },
  webcamTitle: { fontWeight: "bold", marginBottom: 6, fontSize: 18, color: "#015958" },
  webview: { flex: 1 },
});
