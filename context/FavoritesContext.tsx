import { createContext, ReactNode, useContext, useState } from "react";

export interface FavoriteResort {
  id: string;
  name: string;
  location: string;
  price: string;
}

interface FavoritesContextType {
  favorites: FavoriteResort[];
  addFavorite: (resort: FavoriteResort) => void;
  removeFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteResort[]>([]);

  const addFavorite = (resort: FavoriteResort) => {
    setFavorites((prev) => {
      const exists = prev.find((r) => r.id === resort.id);
      return exists ? prev : [...prev, resort];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
