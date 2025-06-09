import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00796B",
      }}
    >
      <Tabs.Screen name="Home" options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        )
      }} />
      <Tabs.Screen name="Explore" options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="search-outline" size={size} color={color} />
        )
      }} />
      <Tabs.Screen name="Bookings" options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="ticket-outline" size={size} color={color} />
        )
      }} />
      <Tabs.Screen name="Favorites" options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart-outline" size={size} color={color} />
        )
      }} />
    </Tabs>
  );
}
