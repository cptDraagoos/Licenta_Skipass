import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabaseClient";

export default function Checkout() {
  const { resort, price } = useLocalSearchParams();
  const router = useRouter();

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (input: string) => {
    return input
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19); // Max 16 digits + 3 spaces
  };

  const handleFakePayment = async () => {
    const numberOnly = cardNumber.replace(/\s/g, "");

    // Basic validation
    if (!cardName || !numberOnly || !expMonth || !expYear || !cvv) {
      Alert.alert("Missing Info", "Please complete all fields.");
      return;
    }

    if (numberOnly.length !== 16) {
      Alert.alert("Invalid Card Number", "Card number must be 16 digits.");
      return;
    }

    const mm = parseInt(expMonth, 10);
    const yy = parseInt(`20${expYear}`, 10);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    if (isNaN(mm) || mm < 1 || mm > 12) {
      Alert.alert("Invalid Month", "Please enter a valid expiration month.");
      return;
    }

    if (isNaN(yy) || yy < currentYear || (yy === currentYear && mm < currentMonth)) {
      Alert.alert("Card Expired", "Expiration date is in the past.");
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      Alert.alert("Invalid CVV", "CVV must be 3 digits.");
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        Alert.alert("Login required", "Please login first.");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("purchases").insert([
        {
          user_id: user.id,
          resort,
          price,
          purchase_date: new Date().toISOString(),
        },
      ]);

      setLoading(false);

      if (insertError) {
        Alert.alert("Payment failed", insertError.message);
      } else {
        Alert.alert("Success", "Your pass was purchased!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/Bookings"),
          },
        ]);
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <Text style={styles.label}>Cardholder Name</Text>
      <TextInput
        style={styles.input}
        value={cardName}
        onChangeText={setCardName}
        placeholder="John Doe"
      />

      <Text style={styles.label}>Card Number</Text>
      <TextInput
        style={styles.input}
        value={cardNumber}
        onChangeText={(text) => setCardNumber(formatCardNumber(text))}
        keyboardType="numeric"
        placeholder="4242 4242 4242 4242"
        maxLength={19}
      />

      <View style={styles.expiryContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Exp. Month</Text>
          <TextInput
            style={styles.input}
            value={expMonth}
            onChangeText={setExpMonth}
            placeholder="MM"
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.label}>Exp. Year</Text>
          <TextInput
            style={styles.input}
            value={expYear}
            onChangeText={setExpYear}
            placeholder="YY"
            keyboardType="numeric"
            maxLength={2}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            value={cvv}
            onChangeText={setCvv}
            placeholder="123"
            keyboardType="numeric"
            secureTextEntry
            maxLength={3}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleFakePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Pay {price} RON</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontWeight: "600",
    color: "#00796B",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderColor: "#00796B",
    borderWidth: 1,
  },
  expiryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
