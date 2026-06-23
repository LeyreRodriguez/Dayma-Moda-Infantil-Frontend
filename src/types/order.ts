import type { User } from "./auth";
import type { OrderStatus } from "./orderStatus";
import type { Product } from "./product";

export interface Order {
  total: number;
  status: OrderStatus;
  appUser: User;
  code: string;
  date: string;
}

export interface ProductOrder {
  product: Product;
  order: Order;
}
