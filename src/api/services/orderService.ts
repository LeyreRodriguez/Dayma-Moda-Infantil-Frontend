import type { Order, ProductOrder } from "../../types/order";
import type { OrderStatus } from "../../types/orderStatus";
import { get, put } from "../httpClient";

export const orderService = {
  getOrders: (params?: { code?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.code) query.set("code", params.code);
    if (params?.sort) query.set("sort", params.sort);
    const qs = query.toString();
    return get<Order[]>(`/order${qs ? `?${qs}` : ""}`);
  },

    getAllOrders: () => {
    return get<Order[]>(`/order/all`);
  },

  getProductOrders: (orderCode: string) =>
    get<ProductOrder[]>(`/products/order/${orderCode}`),

  updateStatus: (code: string, statusCode: string) =>
    put<Order>(`/order/${code}/status`, { statusCode }),

  getStatus: () =>
    get<OrderStatus[]>("/order/status"),
};
