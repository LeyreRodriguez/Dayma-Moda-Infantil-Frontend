import { createContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { favouriteService } from "../api/services/favouriteService";
import { useAuth } from "../hooks/useAuth";

export interface FavouritesContextValue {
  favouriteCodes: Set<string>;
  isFavourite: (code: string) => boolean;
  toggleFavourite: (code: string) => Promise<void>;
}

export const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favouriteCodes, setFavouriteCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isAuthenticated) {
      favouriteService.getFavourites().then((favs) => {
        setFavouriteCodes(new Set(favs.map((f) => f.product.code)));
      }).catch(() => {});
    } else {
      setFavouriteCodes(new Set());
    }
  }, [isAuthenticated]);

  const isFavourite = useCallback(
    (code: string) => favouriteCodes.has(code),
    [favouriteCodes],
  );

  const toggleFavourite = useCallback(
    async (code: string) => {
      const wasFav = favouriteCodes.has(code);
      setFavouriteCodes((prev) => {
        const next = new Set(prev);
        if (wasFav) next.delete(code);
        else next.add(code);
        return next;
      });
      try {
        if (wasFav) {
          await favouriteService.deleteFavourite(code);
        } else {
          await favouriteService.setFavourite(code);
        }
      } catch {
        setFavouriteCodes((prev) => {
          const next = new Set(prev);
          if (wasFav) next.add(code);
          else next.delete(code);
          return next;
        });
      }
    },
    [favouriteCodes],
  );

  return (
    <FavouritesContext.Provider value={{ favouriteCodes, isFavourite, toggleFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
}
