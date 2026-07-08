import { useEffect, useState } from "react";
import { Modal, Button, Select, InputNumber, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { productService } from "../../api/services/productService";
import { sizeService } from "../../api/services/sizeService";
import type { ProductSize } from "../../types/productSize";
import type { Size } from "../../types/size";

interface StockModalProps {
  open: boolean;
  productCode: string;
  productName: string;
  onClose: () => void;
}

export default function StockModal({ open, productCode, productName, onClose }: StockModalProps) {
  const { message } = App.useApp();
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [allSizes, setAllSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [newSizeCode, setNewSizeCode] = useState<string | null>(null);
  const [newSizeStock, setNewSizeStock] = useState(1);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      productService.getSizeByProductCode(productCode),
      sizeService.getAll(),
    ])
      .then(([ps, all]) => {
        setSizes(ps);
        setAllSizes(all);
      })
      .catch(() => message.error("Error al cargar datos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!open) return;
    fetchData();
    setNewSizeCode(null);
    setNewSizeStock(1);
  }, [open, productCode, message]);

  const adjustStock = async (sizeCode: string, delta: number) => {
    const current = sizes.find((s) => s.size.code === sizeCode);
    if (!current) return;
    const newStock = Math.max(0, current.stock + delta);
    setUpdating(sizeCode);
    try {
      await productService.updateSizeStock(productCode, sizeCode, newStock);
      setSizes((prev) =>
        prev.map((s) =>
          s.size.code === sizeCode ? { ...s, stock: newStock } : s,
        ),
      );
    } catch {
      message.error("Error al actualizar stock");
    } finally {
      setUpdating(null);
    }
  };

  const handleAddSize = async () => {
    if (!newSizeCode) return;
    setUpdating("new");
    try {
      const created = await productService.addSizeToProduct(productCode, newSizeCode, newSizeStock);
      setSizes((prev) => [...prev, created]);
      setNewSizeCode(null);
      setNewSizeStock(1);
      message.success("Talla añadida");
    } catch {
      message.error("Error al añadir talla");
    } finally {
      setUpdating(null);
    }
  };

  const existingCodes = new Set(sizes.map((s) => s.size.code));
  const availableSizes = allSizes.filter((s) => !existingCodes.has(s.code));

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={typeof window !== "undefined" && window.innerWidth < 640 ? "95%" : 520}
      title={
        <span className="font-headline-md text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">inventory</span>
          Stock: {productName}
        </span>
      }
    >
      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {sizes.map((ps) => (
              <div
                key={ps.size.code}
                className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/30"
              >
                <div>
                  <p className="font-label-md text-on-surface">{ps.size.size}</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Código: {ps.size.code}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    danger
                    type="text"
                    className="!flex !items-center !justify-center !w-10 !h-10"
                    disabled={ps.stock <= 0 || updating === ps.size.code}
                    onClick={() => adjustStock(ps.size.code, -1)}
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </Button>
                  <span className="font-headline-md text-primary min-w-[32px] text-center">
                    {ps.stock}
                  </span>
                  <Button
                    type="text"
                    className="!flex !items-center !justify-center !w-10 !h-10 !text-primary"
                    disabled={updating === ps.size.code}
                    onClick={() => adjustStock(ps.size.code, 1)}
                  >
                    <span className="material-symbols-outlined">add</span>
                  </Button>
                </div>
              </div>
            ))}

            {availableSizes.length > 0 && (
              <div className="p-4 bg-surface-container-low rounded-lg border border-dashed border-outline-variant/50">
                <p className="font-label-md text-on-surface mb-3">Añadir nueva talla</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Select
                    placeholder="Seleccionar talla"
                    className="!flex-1 !rounded-lg"
                    size="large"
                    value={newSizeCode}
                    onChange={setNewSizeCode}
                    options={availableSizes.map((s) => ({
                      label: s.size,
                      value: s.code,
                    }))}
                  />
                  <InputNumber
                    min={1}
                    value={newSizeStock}
                    onChange={(v) => setNewSizeStock(v ?? 1)}
                    className="!w-20 !rounded-lg"
                    size="large"
                  />
                  <Button
                    type="primary"
                    className="!rounded-lg !bg-primary"
                    icon={<PlusOutlined />}
                    disabled={!newSizeCode || updating === "new"}
                    loading={updating === "new"}
                    onClick={handleAddSize}
                  />
                </div>
              </div>
            )}

            {sizes.length === 0 && availableSizes.length === 0 && (
              <p className="text-on-surface-variant text-center py-8">
                No hay tallas disponibles
              </p>
            )}

            <div className="flex justify-end pt-2">
              <Button
                onClick={fetchData}
                className="!rounded-lg"
                icon={<span className="material-symbols-outlined text-sm">refresh</span>}
              >
                Recargar
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
