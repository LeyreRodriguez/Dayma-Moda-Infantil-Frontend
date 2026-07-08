import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { adminService } from "../../api/services/adminService";
import type {
  InventorySummary,
  PendingOrder,
  GrowthPoint,
} from "../../types/admin";

export default function Dashboard() {
  const navigate = useNavigate();
  const shapesRef = useRef<HTMLDivElement[]>([]);

  const [inventory, setInventory] = useState<InventorySummary | null>(null);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [growthData, setGrowthData] = useState<GrowthPoint[]>([]);
  const [analyticsView] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inv, orders, growth] = await Promise.all([
          adminService.getInventorySummary(),
          adminService.getPendingOrders(),
          adminService.getGrowthData(),
        ]);
        setInventory(inv);
        setPendingOrders(orders);
        setGrowthData(growth);
      } catch (err) {
        console.error("Failed to load admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      shapesRef.current.forEach((shape, index) => {
        if (shape) {
          const factor = (index + 1) * 15;
          shape.style.transform = `translate(${mouseX * factor}px, ${mouseY * factor}px)`;
        }
      });
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const badgeClass = (status: string) => {
    const lower = status.toLowerCase();
    if (lower === "ready" || lower === "preparado")
      return "bg-primary/10 text-primary";
    if (lower === "urgent" || lower === "urgente")
      return "bg-secondary/10 text-secondary";
    return "bg-surface-container-highest text-on-surface-variant";
  };

  const chartData =
    analyticsView === "yearly" ? growthData : growthData.slice(-12);

  return (
    <>
      <div
        ref={(el) => {
          if (el) shapesRef.current[0] = el;
        }}
        className="absolute top-10 right-10 w-32 h-32 bg-primary/5 organic-shape -z-10 animate-pulse"
      />
      <div
        ref={(el) => {
          if (el) shapesRef.current[1] = el;
        }}
        className="absolute bottom-20 left-10 w-48 h-48 bg-secondary/5 organic-shape -z-10"
        style={{ animation: "bounce 10s infinite alternate" }}
      />

      <header className="flex justify-between items-center mb-12">
        <div className="space-y-1">
          <p className="font-body-md text-on-surface-variant flex items-center gap-2">
            Bienvenido de nuevo, Administrador
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-gutter">
          <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 artisanal-shadow relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  inventory
                </span>
                Vista de inventario
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-6 hover:border-primary/40 transition-all cursor-default">
                <p className="text-[32px] font-bold text-primary mb-1">
                  {inventory?.newArrivals ?? 0}
                </p>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">
                  Nuevos productos
                </p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-6 hover:border-secondary/40 transition-all cursor-default">
                <p className="text-[32px] font-bold text-secondary mb-1">
                  {inventory?.lowStock ?? 0}
                </p>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">
                  Bajo Stock
                </p>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-6 transition-all cursor-default">
                <p className="text-[32px] font-bold text-on-surface-variant mb-1">
                  {inventory?.archived ?? 0}
                </p>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[11px]">
                  Archivado
                </p>
              </div>
            </div>
            <div className="mt-8 overflow-hidden rounded-lg">
              <img
                alt="Fabric Display"
                className="w-full h-44 object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtgvHeSKPI7aVY4lXTWb4xgC71VulLQFpc7p3vgjzbTELt9oSR36aVjDZk3R_gg94FNKCDPCOccZknsZm9DuIXowsEugutOf0nWDn8c0VYGD_dY0FZvwiH-599sbpAFZeH2YqAYccGHg5LC4qEQbi2mKeMbJMPpcrHjUEHFO7lwPeKj2YNQyzADxrZzmGWtmJE2tR__1j-zw7FNky47dDPKtEvuNTxCkCOENFmnCq3pjj263nLCnjP"
              />
            </div>
          </section>

          <section className="col-span-12 lg:col-span-4 bg-surface-container-high/40 backdrop-blur-sm rounded-xl p-8 artisanal-shadow border border-white/40">
            <h3 className="font-headline-md text-on-surface mb-8 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">
                local_mall
              </span>
              Pedidos Pendientes
            </h3>
            <div className="space-y-4 max-h-[320px] overflow-y-auto hide-scrollbar">
              {pendingOrders.length === 0 ? (
                <p className="text-on-surface-variant text-sm text-center py-8">
                  No hay pedidos pendientes
                </p>
              ) : (
                pendingOrders.map((order) => (
                  <div
                    key={order.code}
                    onClick={() => navigate("/admin/orders")}
                    className="flex items-center justify-between p-4 bg-white/60 rounded-lg hover:translate-x-1 transition-transform cursor-pointer border border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-label-md">{order.customerName}</p>
                        <p className="text-[11px] text-on-surface-variant">
                          {order.code} &bull; {order.itemsCount} Items
                        </p>
                      </div>
                    </div>
                    <span
                      className={`${badgeClass(order.status)} text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => navigate("/admin/orders")}
              className="w-full mt-8 py-4 border border-outline text-on-surface-variant font-label-md rounded-lg hover:bg-primary hover:text-white transition-all"
            >
              Ver todos los pedidos pendientes
            </button>
          </section>

          <section className="col-span-12 bg-surface-container-lowest rounded-xl p-10 artisanal-shadow relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
              <div>
                <h3 className="font-headline-lg text-on-surface">Analíticas</h3>
                <p className="font-body-md text-on-surface-variant">
                  Pedidos entregados y suscriptores en el tiempo
                </p>
              </div>
            </div>
            <div className="w-full h-60 md:h-80">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="period" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e0e0e0",
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="deliveredOrders"
                      name="Pedidos entregados"
                      stroke="#2d4236"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#2d4236" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="subscribedUsers"
                      name="Usuarios suscritos"
                      stroke="#b76e79"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#b76e79" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-on-surface-variant">
                  No hay datos disponibles
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
