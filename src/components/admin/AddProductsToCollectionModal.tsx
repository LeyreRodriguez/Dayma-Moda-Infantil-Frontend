import { useEffect, useState } from "react";
import { Modal, Select, App, Button } from "antd";
import { productService } from "../../api/services/productService";
import type { Product } from "../../types/product";

interface AddProductsToCollectionModalProps {
  open: boolean;
  collectionCode: string;
  collectionName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductsToCollectionModal({
  open,
  collectionCode,
  collectionName,
  onClose,
  onSuccess,
}: AddProductsToCollectionModalProps) {
  const { message } = App.useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [existingCodes, setExistingCodes] = useState<string[]>([]);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedCodes([]);
    Promise.all([
      productService.getAll({ limit: 500 }),
      productService.getAll({ collection: collectionCode, limit: 500 }),
    ])
      .then(([all, inCollection]) => {
        setProducts(all.content);
        setExistingCodes(inCollection.content.map((p) => p.code));
      })
      .catch(() => message.error("Error al cargar datos"));
  }, [open, collectionCode, message]);

  const availableProducts = products.filter(
    (p) => !existingCodes.includes(p.code),
  );

  const handleSave = async () => {
    if (selectedCodes.length === 0) return;
    setSaving(true);
    try {
      await Promise.all(
        selectedCodes.map((code) =>
          productService.updateCollection(code, collectionCode),
        ),
      );
      message.success(`${selectedCodes.length} producto(s) añadido(s)`);
      onSuccess();
      onClose();
    } catch {
      message.error("Error al añadir productos");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={typeof window !== "undefined" && window.innerWidth < 640 ? "95%" : 520}
      title={
        <span className="font-headline-md text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">playlist_add</span>
          Añadir productos a {collectionName}
        </span>
      }
    >
      <div className="mt-4 space-y-4">
        <Select
          mode="multiple"
          placeholder="Buscar y seleccionar productos..."
          className="!w-full !rounded-lg"
          size="large"
          value={selectedCodes}
          onChange={setSelectedCodes}
          options={availableProducts.map((p) => ({
            label: `${p.code} — ${p.name}`,
            value: p.code,
          }))}
          filterOption={(input, option) =>
            (option?.label as string)
              ?.toLowerCase()
              .includes(input.toLowerCase())
          }
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
          <Button onClick={onClose} size="large" className="!rounded-lg">
            Cancelar
          </Button>
          <Button
            type="primary"
            size="large"
            loading={saving}
            disabled={selectedCodes.length === 0}
            onClick={handleSave}
            className="!rounded-lg !bg-primary"
          >
            Añadir {selectedCodes.length > 0 ? `(${selectedCodes.length})` : ""}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
