import type { Product } from "./product";
import type { Size } from "./size";

export interface ProductSize {
  product : Product,
  size : Size,
  stock : number,
}