import { useEffect, useState } from "react";
import { Table, Tag, Button, App } from "antd";
import type { ColumnsType } from "antd/es/table";
import { productService } from "../../api/services/productService";
import type { Product } from "../../types/product";
import AddProductModal from "../../components/admin/AddProductModal";
import StockModal from "../../components/admin/StockModal";

export default function Inventory() {
  const { message } = App.useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stockModal, setStockModal] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchProducts = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const res = await productService.getAll({ page: p, limit: ps });
      setProducts(res.content);
      setTotal(res.totalElements);
    } catch {
      message.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize]);

  const toggleProductField = async (
    product: Product,
    field: "isNew" | "archived",
  ) => {
    setToggling(product.code);
    try {
      const isNew = field === "isNew" ? !product.isNew : !!product.isNew;
      const archived =
        field === "archived" ? !product.archived : !!product.archived;

      const updated = await productService.update(
        product.code,
        isNew,
        archived,
      );

      setProducts((prev) =>
        prev.map((p) =>
          p.code === product.code
            ? { ...p, [field]: updated[field] ?? !product[field] }
            : p,
        ),
      );
    } catch {
      message.error(
        field === "isNew"
          ? "Error al actualizar el estado"
          : "Error al archivar el producto",
      );
    } finally {
      setToggling(null);
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Imagen",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (url: string) => (
        <img
          src={url || "https://placehold.co/60x60?text=No+Image"}
          alt="producto"
          className="w-12 h-12 object-cover rounded-lg"
        />
      ),
    },
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: 150,
      responsive: ["md"],
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      width: 100,
      responsive: ["md"],
      render: (price: number) => `${price.toFixed(2)} €`,
    },
    {
      title: "Estado",
      key: "status",
      width: 100,
      render: (_, record) =>
        record.isNew ? (
          <Tag
            color="green"
            className="!cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleProductField(record, "isNew");
            }}
          >
            {toggling === record.code ? "..." : "Novedad"}
          </Tag>
        ) : (
          <Tag
            className="!cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleProductField(record, "isNew");
            }}
          >
            {toggling === record.code ? "..." : "Añadir"}
          </Tag>
        ),
    },
    {
      title: "",
      key: "stock",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() =>
            setStockModal({ code: record.code, name: record.name })
          }
          className="!text-primary !font-label-md"
        >
          Ver stock
        </Button>
      ),
    },
    {
      title: "Archivado",
      key: "archived",
      width: 110,
      render: (_, record) => (
        <Tag
          color={record.archived ? "orange" : "default"}
          className="!cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleProductField(record, "archived");
          }}
        >
          {toggling === record.code
            ? "..."
            : record.archived
              ? "Archivado"
              : "Activo"}
        </Tag>
      ),
    },
  ];

  const handleProductCreated = () => {
    fetchProducts(page, pageSize);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-on-background">Inventario</h2>
          <p className="font-body-md text-on-surface-variant">
            {total} producto{total !== 1 ? "s" : ""} en total
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-on-primary font-label-md px-6 py-4 rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Nuevo producto
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl artisanal-shadow overflow-x-auto">
        <Table
          columns={columns}
          dataSource={products}
          rowKey="code"
          loading={loading}
          pagination={{
            current: page + 1,
            pageSize,
            total,
            onChange: (p, ps) => {
              setPage(p - 1);
              setPageSize(ps);
            },
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          className="[&_.ant-table-thead_.ant-table-cell]:!bg-surface-container-low [&_.ant-table-thead_.ant-table-cell]:!font-label-md [&_.ant-table-row]:!cursor-pointer"
          onRow={(record) => ({
            onClick: () =>
              setStockModal({ code: record.code, name: record.name }),
          })}
        />
      </div>

      <AddProductModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleProductCreated}
      />
      <StockModal
        open={!!stockModal}
        productCode={stockModal?.code ?? ""}
        productName={stockModal?.name ?? ""}
        onClose={() => setStockModal(null)}
      />
    </>
  );
}
