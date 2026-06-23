import type { User } from "./auth";
import type { Product } from "./product";

export interface Favourite {
  product : Product,
  user : User
}