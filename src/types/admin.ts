export interface InventorySummary {
  newArrivals: number;
  lowStock: number;
  organicMaterialsPercent: number;
  archived: number;
}

export interface PendingOrder {
  code: string;
  customerName: string;
  customerInitials: string;
  itemsCount: number;
  status: string;
}

export interface RevenueBar {
  month: string;
  amount: number;
}

export interface AnalyticsData {
  revenueGrowth: string;
  newSubscribers: number;
  monthlyRevenue: RevenueBar[];
  currentMonthAmount: number;
}

export interface GrowthPoint {
  period: string;
  deliveredOrders: number;
  subscribedUsers: number;
}
