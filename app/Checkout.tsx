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
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { resort, price } = useLocalSearchParams();

  const handleFakePayment = async () => {
  if (!cardName || !cardNumber || !expMonth || !expYear || !cvv) {
    Alert.alert("Missing Info", "Please complete all fields.");
    return;
  }

  const mm = parseInt(expMonth, 10);
  const yy = parseInt(`20${expYear}`, 10);
  const now = new Date();
  const thisMonth = now.getMonth() + 1;
  const thisYear = now.getFullYear();

  if (isNaN(mm) || mm < 1 || mm > 12) {
    Alert.alert("Invalid Month", "Please enter a valid expiration month (01-12).");
    return;
  }

  if (isNaN(yy) || yy < thisYear || (yy === thisYear && mm < thisMonth)) {
    Alert.alert("Card Expired", "The expiration date is in the past.");
    return;
  }

  setLoading(true);

  setTimeout(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert("Login required", "Please login first.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("purchases").insert([
      {
        user_id: user.id,
        resort: resort,
        price: price,
        purchase_date: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Insert failed", error);
      Alert.alert("Payment failed", "Please try again.");
    } else {
      Alert.alert("Success", "Your pass was purchased successfully!", [
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

      <TextInput
        placeholder="Cardholder Name"
        value={cardName}
        onChangeText={setCardName}
        style={styles.input}
      />
      <TextInput
        placeholder="Card Number"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
        style={styles.input}
        maxLength={16}
      />

      <View style={styles.expiryContainer}>
        <TextInput
          placeholder="MM"
          value={expMonth}
          onChangeText={setExpMonth}
          keyboardType="numeric"
          maxLength={2}
          style={[styles.input, styles.expiryInput]}
        />
        <Text style={styles.slash}>/</Text>
        <TextInput
          placeholder="YY"
          value={expYear}
          onChangeText={setExpYear}
          keyboardType="numeric"
          maxLength={2}
          style={[styles.input, styles.expiryInput]}
        />
        <TextInput
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="numeric"
          maxLength={3}
          secureTextEntry
          style={[styles.input, styles.cvvInput]}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleFakePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Pay {price}</Text>
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
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#00796B",
    borderWidth: 1,
  },
  expiryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  expiryInput: {
    width: 60,
    marginRight: 5,
  },
  slash: {
    fontSize: 20,
    marginHorizontal: 4,
    color: "#444",
  },
  cvvInput: {
    width: 80,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#00796B",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
