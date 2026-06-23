import type { Order, ProductOrder } from "../../types/order";
import { get } from "../httpClient";

export const orderService = {
  
  getOrders: () => get<Order[]>(`/order`),

  getProductOrders: (orderCode: string) =>
    get<ProductOrder[]>(`/products/order/${orderCode}`),

};
