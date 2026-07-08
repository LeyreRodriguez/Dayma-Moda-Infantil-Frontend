import { useEffect, useMemo, useState } from "react";
import { Table, Select, Input, Tag, App } from "antd";
import type { ColumnsType } from "antd/es/table";
import { orderService } from "../../api/services/orderService";
import type { Order } from "../../types/order";
import type { OrderStatus } from "../../types/orderStatus";

const TAG_COLORS = [
  "orange",
  "blue",
  "purple",
  "cyan",
  "green",
  "magenta",
  "red",
  "lime",
];

export default function Orders() {
  const { message } = App.useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(
    () =>
      search
        ? orders.filter((o) =>
            o.code.toLowerCase().includes(search.toLowerCase()),
          )
        : orders,
    [orders, search],
  );

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      const sorted = [...data].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setOrders(sorted);
    } catch {
      message.error("Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const data = await orderService.getStatus();
      setStatuses(data);
    } catch {
      message.error("Error al cargar estados");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleStatusChange = async (orderCode: string, newStatus: string) => {
    setUpdating(orderCode);
    try {
      await orderService.updateStatus(orderCode, newStatus);
      message.success("Estado actualizado");
      setOrders((prev) =>
        prev.map((o) =>
          o.code === orderCode
            ? {
                ...o,
                status: { ...o.status, code: newStatus, status: newStatus },
              }
            : o,
        ),
      );
    } catch {
      message.error("Error al actualizar el estado");
    } finally {
      setUpdating(null);
    }
  };

  const statusTagColor = (code: string) => {
    const idx = statuses.findIndex((s) => s.code === code || s.status === code);
    return TAG_COLORS[idx >= 0 ? idx % TAG_COLORS.length : 0];
  };

  const statusLabel = (code: string) => {
    const s = statuses.find((st) => st.code === code || st.status === code);
    return s?.status ?? code;
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: 140,
      responsive: ["md"],
    },
    {
      title: "Cliente",
      key: "customer",
      width: 200,
      responsive: ["md"],
      render: (_, record) => (
        <div>
          <p className="font-label-md text-on-surface">
            {record.appUser?.name || "—"}
          </p>
          <p className="text-[11px] text-on-surface-variant">
            {record.appUser?.email}
          </p>
        </div>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      width: 160,
      responsive: ["md"],
      render: (date: string) =>
        new Date(date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      sorter: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 110,
      render: (total: number) => (
        <span className="font-label-md">€{total.toFixed(2)}</span>
      ),
    },
    {
      title: "Estado",
      key: "status",
      width: 180,
      render: (_, record) => {
        const currentCode = record.status?.code || record.status?.status;
        return (
          <Select
            value={currentCode}
            onChange={(val) => handleStatusChange(record.code, val)}
            loading={updating === record.code}
            size="small"
            className="!w-36"
            options={statuses.map((s) => ({
              label: s.status,
              value: s.code || s.status,
            }))}
          />
        );
      },
    },
    {
      title: "Estado",
      key: "statusTag",
      width: 110,
      render: (_, record) => {
        const code = record.status?.code || record.status?.status;
        return <Tag color={statusTagColor(code)}>{statusLabel(code)}</Tag>;
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-on-background">Pedidos</h2>
          <p className="font-body-md text-on-surface-variant">
            {filteredOrders.length} pedido
            {filteredOrders.length !== 1 ? "s" : ""}
            {filteredOrders.length !== orders.length
              ? ` (${orders.length} total)`
              : ""}
          </p>
        </div>
        <Input.Search
          placeholder="Buscar por código..."
          allowClear
          onSearch={handleSearch}
          onChange={(e) => {
            if (!e.target.value) handleSearch("");
          }}
          className="!w-full sm:!w-72"
          size="large"
        />
      </div>

      <div className="bg-surface-container-lowest rounded-xl artisanal-shadow overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="code"
          loading={loading}
          pagination={{ pageSize: 15 }}
          className="[&_.ant-table-thead_.ant-table-cell]:!bg-surface-container-low [&_.ant-table-thead_.ant-table-cell]:!font-label-md"
        />
      </div>
    </>
  );
}
