import { useEffect, useState } from "react";
import { Table, Tag, Button, App, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { collectionService } from "../../api/services/collectionService";
import { productService } from "../../api/services/productService";
import type { Collection } from "../../types/collection";
import type { Product } from "../../types/product";
import AddCollectionModal from "../../components/admin/AddCollectionModal";
import AddProductsToCollectionModal from "../../components/admin/AddProductsToCollectionModal";

export default function Collections() {
  const { message } = App.useApp();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addProducts, setAddProducts] = useState<Collection | null>(null);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<Record<string, Product[]>>({});
  const [productsLoading, setProductsLoading] = useState<Record<string, boolean>>({});
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = await collectionService.getAll();
      setCollections(data);
    } catch {
      message.error("Error al cargar colecciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchProductsForCollection = async (collectionCode: string) => {
    if (collectionProducts[collectionCode]) return;
    setProductsLoading((prev) => ({ ...prev, [collectionCode]: true }));
    try {
      const res = await productService.getAll({ collection: collectionCode, limit: 500 });
      setCollectionProducts((prev) => ({ ...prev, [collectionCode]: res.content }));
    } catch {
      message.error("Error al cargar productos");
    } finally {
      setProductsLoading((prev) => ({ ...prev, [collectionCode]: false }));
    }
  };

  const handleRemove = async (productCode: string, collectionCode: string) => {
    setRemoving(productCode);
    try {
      await productService.removeFromCollection(productCode);
      message.success("Producto eliminado de la colección");
      setCollectionProducts((prev) => ({
        ...prev,
        [collectionCode]: (prev[collectionCode] ?? []).filter(
          (p) => p.code !== productCode,
        ),
      }));
    } catch {
      message.error("Error al eliminar producto");
    } finally {
      setRemoving(null);
    }
  };

  const expandedRowRender = (record: Collection) => {
    const products = collectionProducts[record.code] ?? [];
    const loading = productsLoading[record.code];

    if (loading) {
      return (
        <div className="flex justify-center py-6">
          <Spin />
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <p className="text-on-surface-variant text-center py-4 text-sm">
          No hay productos en esta colección
        </p>
      );
    }

    return (
      <div className="bg-surface-container-lowest rounded-lg p-4">
        <p className="font-label-md text-on-surface mb-3">
          {products.length} producto{products.length !== 1 ? "s" : ""}
        </p>
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p.code}
              className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/20"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.imageUrl || "https://placehold.co/40x40?text=No"}
                  alt={p.name}
                  className="w-10 h-10 object-cover rounded-md"
                />
                <div>
                  <p className="font-label-md text-on-surface text-sm">{p.name}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    {p.code} — €{p.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                danger
                type="text"
                size="small"
                loading={removing === p.code}
                disabled={!!removing}
                onClick={() => handleRemove(p.code, record.code)}
                className="!flex !items-center !justify-center !w-8 !h-8"
              >
                <DeleteOutlined />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const columns: ColumnsType<Collection> = [
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
      width: 140,
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Destacada",
      key: "featured",
      width: 110,
      render: (_, record) =>
        record.featured ? <Tag color="green">Sí</Tag> : <Tag>No</Tag>,
    },
    {
      title: "",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Button
          type="link"
          onClick={(e) => {
            e.stopPropagation();
            setAddProducts(record);
          }}
          className="!text-primary !font-label-md"
        >
          Añadir productos
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-on-background">Colecciones</h2>
          <p className="font-body-md text-on-surface-variant">
            {collections.length} coleccion{collections.length !== 1 ? "es" : ""} en total
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-on-primary font-label-md px-6 py-4 rounded-xl flex items-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Nueva colección
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl artisanal-shadow overflow-x-auto">
        <Table
          columns={columns}
          dataSource={collections}
          rowKey="code"
          loading={loading}
          pagination={false}
          expandable={{
            expandedRowRender,
            expandedRowKeys: expandedCode ? [expandedCode] : [],
            onExpand: (expanded, record) => {
              if (expanded) {
                setExpandedCode(record.code);
                fetchProductsForCollection(record.code);
              } else {
                setExpandedCode(null);
              }
            },
          }}
          className="[&_.ant-table-thead_.ant-table-cell]:!bg-surface-container-low [&_.ant-table-thead_.ant-table-cell]:!font-label-md"
        />
      </div>

      <AddCollectionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchCollections}
      />
      {addProducts && (
        <AddProductsToCollectionModal
          open={!!addProducts}
          collectionCode={addProducts.code}
          collectionName={addProducts.name}
          onClose={() => setAddProducts(null)}
          onSuccess={() => {
            setCollectionProducts((prev) => {
              const next = { ...prev };
              delete next[addProducts.code];
              return next;
            });
            fetchCollections();
          }}
        />
      )}
    </>
  );
}
