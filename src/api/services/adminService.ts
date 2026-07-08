import { get, post } from "../httpClient";
import type { InventorySummary, PendingOrder, AnalyticsData, GrowthPoint } from "../../types/admin";
import type { Order } from "../../types/order";

export const adminService = {
  getInventorySummary: () => get<InventorySummary>("/admin/inventory-summary"),

  getPendingOrders: () => get<PendingOrder[]>("/admin/orders/pending"),

  getAnalytics: () => get<AnalyticsData>("/admin/analytics"),

  getGrowthData: () => get<GrowthPoint[]>("/admin/growth"),

  createInStorePurchase: (items: { productCode: string; sizeCode: string; quantity: number }[]) =>
    post<Order>("/admin/in-store-purchase", { items }),
};
