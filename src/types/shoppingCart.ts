import type { Product } from "./product";
import type { User } from "./auth";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  sizeCode: string;
}

export interface ShoppingCart {
  product: Product;
  user: User;
  quantity: number;
}

export interface AddProductRequest {
  code: string;
  quantity: number;
}
