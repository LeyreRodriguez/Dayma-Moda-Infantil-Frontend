import type { Favourite } from "../../types/favourite";
import { del, get, post } from "../httpClient";


export const favouriteService = {
 
  setFavourite: (code: string) => post<Favourite>(`/favourites`, {code}),
  deleteFavourite: (code: string) => del<Favourite>(`/favourites/${code}`),
  getFavourites: () => get<Favourite[]>(`/favourites`,),

};
