import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const resortDetails = {
  PartiaRarau: {
    name: "Pârtia Rarău",
    location: "Câmpulung Moldovenesc",
    price: "120 RON / day",
    length: "2.8 km",
    difficulty: "Intermediate",
    lift: "Chairlift available to reach the top.",
    rental: "Equipment rental available near the base station.",
    images: [require("../../pic/rarau1.jpg"), require("../../pic/rarau2.jpg")],
    description:
      "Located in the beautiful Bucovina region, Pârtia Rarău is a modern ski slope surrounded by scenic forest landscapes. It offers a relaxing and scenic experience ideal for intermediate skiers. The resort has snowmaking equipment, a chairlift, and cozy nearby chalets.",
  },
  PartiaBorsa: {
    name: "Borșa – Pârtia Olimpică",
    location: "Borșa, Maramureș",
    price: "130 RON / day",
    length: "2.65 km",
    difficulty: "Intermediate (Red)",
    lift: "Modern gondola lift to the summit.",
    rental: "Full equipment rental services available on-site.",
    description:
      "Featuring Romania's first Olympic-grade slope, Pârtia Olimpică in Borșa is a modern resort with gondola lifts, snowmaking systems, and night skiing. It offers a high-quality experience for intermediate skiers and breathtaking views of the Rodna Mountains.",
  },
  Straja: {
    name: "Straja",
    location: "Hunedoara",
    price: "130 RON / day",
    length: "3.4 km",
    difficulty: "Intermediate",
    lift: "Chairlifts and surface lifts available.",
    rental: "Several rental shops are available in the village.",
    description:
      "Straja is a well-developed ski area in the Jiu Valley with 12 slopes and beautiful mountain views. It’s ideal for families and intermediate skiers looking for variety and comfort.",
  },
  PoianaBrasov: {
    name: "Poiana Brașov",
    location: "Brașov",
    price: "170 RON / day",
    length: "4.8 km",
    difficulty: "Advanced",
    lift: "Gondola and chairlifts serving the mountain.",
    rental: "Wide range of ski rental centers around the resort.",
    description:
      "Romania’s most famous ski resort, Poiana Brașov offers world-class infrastructure, ski schools, and a wide selection of slopes. Ideal for advanced skiers and international visitors.",
  },
  ArenaPlatos: {
    name: "Arena Platoș",
    location: "Sibiu",
    price: "90 RON / day",
    length: "1.5 km",
    difficulty: "Beginner",
    lift: "Surface lift (button lift) available.",
    rental: "Equipment rental and snow fun park nearby.",
    description:
      "Arena Platoș is perfect for beginners and families, with gentle slopes, snow tubing, ski schools, and fun parks. Located in the scenic Păltiniș area near Sibiu.",
  },
};

export default function ResortPage() {
  const { name } = useLocalSearchParams();
  const resort = resortDetails[name as keyof typeof resortDetails];

  if (!resort) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Resort not found.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#E0F7FA", "#80DEEA"]} style={styles.container}>
      <Text style={styles.title}>{resort.name}</Text>
      <Text style={styles.info}>📍 {resort.location}</Text>
      <Text style={styles.info}>🎿 Length: {resort.length}</Text>
      <Text style={styles.info}>⛰ Difficulty: {resort.difficulty}</Text>
      <Text style={styles.info}>🚡 Lift Access: {resort.lift}</Text>
      <Text style={styles.info}>🎒 Equipment Rental: {resort.rental}</Text>
      <Text style={styles.info}>🎫 Skipass: {resort.price}</Text>
      <Text style={styles.description}>{resort.description}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Buy a pass</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginVertical: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 12,
    color: "#333",
  },
  button: {
    backgroundColor: "#00796B",
    marginTop: 30,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFound: {
    fontSize: 18,
    color: "red",
  },
});