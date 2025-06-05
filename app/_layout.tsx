import { Stack } from "expo-router";
import { FavoritesProvider } from "../context/FavoritesContext";



export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack />
    </FavoritesProvider>
  );
}
