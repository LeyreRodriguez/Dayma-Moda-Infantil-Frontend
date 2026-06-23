import type { ShoppingCart } from "../../types/shoppingCart";
import { post, put, del, get } from "../httpClient";

export const shoppingCartService = {
  addShoppingCart: (code: string, quantity: number, sizeCode: string) =>
    post<ShoppingCart>(`/shoppingCart`, { code, quantity, sizeCode }),

  finishPurchase: () =>
    post<ShoppingCart>(`/shoppingCart/finish`),

  updateShoppingCartItem: (code: string, quantity: number, sizeCode: string) =>
    put<ShoppingCart>(`/shoppingCart`, { code, quantity, sizeCode }),

  deleteFromShoppingCart: (code: string, sizeCode: string ) =>
    del<ShoppingCart>(`/shoppingCart/${code}/${sizeCode}`),

  getShoppingCart: () => get<ShoppingCart[]>(`/shoppingCart`),
};
