import { createContext, useState, useContext } from "react";

const FavoritesShowContext = createContext();

export const FavoritesShowProvider = ({ children }) => {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  return (
    <FavoritesShowContext.Provider
      value={{ showFavoritesOnly, setShowFavoritesOnly }}
    >
      {children}
    </FavoritesShowContext.Provider>
  );
};

export const useFavoritesShow = () => useContext(FavoritesShowContext);
