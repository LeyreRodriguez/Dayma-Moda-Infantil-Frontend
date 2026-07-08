import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Checkbox,
  App,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { productService } from "../../api/services/productService";
import { categoryService } from "../../api/services/categoryService";
import { sizeService } from "../../api/services/sizeService";
import type { Category } from "../../types/category";
import type { Size } from "../../types/size";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({
  open,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    Promise.all([categoryService.getAll(), sizeService.getAll()])
      .then(([cats, szs]) => {
        setCategories(cats);
        setSizes(szs);
      })
      .catch(() => message.error("Error al cargar opciones del formulario"));
    setFiles([]);
  }, [open, message]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinish = async (values: Record<string, unknown>) => {
    if (files.length === 0) {
      message.warning("Selecciona al menos una imagen");
      return;
    }
    setLoading(true);
    try {
      const selectedSizes = (values.sizeCodes as string[]) ?? [];
      const formData = new FormData();
      formData.append("name", values.name as string);
      formData.append("description", values.description as string);
      formData.append("price", String(values.price as number));
      formData.append("category", values.category as string);
      selectedSizes.forEach((code: string, i: number) => {
        formData.append(`sizes[${i}].code`, code);
      });
      formData.append("isNew", values.isNew ? "true" : "false");
      files.forEach((file) => formData.append("images", file));
      await productService.createWithImages(formData);
      message.success("Producto creado correctamente");
      form.resetFields();
      setFiles([]);
      onSuccess();
      onClose();
    } catch {
      message.error("Error al crear el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={typeof window !== "undefined" && window.innerWidth < 640 ? "95%" : 640}
      title={
        <span className="font-headline-md text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">add_box</span>
          Nuevo Producto
        </span>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto px-1 -mx-1">
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={handleFinish}
          className="mt-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label={
                <span className="font-label-md text-on-surface">Nombre</span>
              }
              rules={[{ required: true, message: "El nombre es obligatorio" }]}
              className="col-span-2"
            >
              <Input
                placeholder="Nombre del producto"
                className="!rounded-lg"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={
                <span className="font-label-md text-on-surface">
                  Descripción
                </span>
              }
              rules={[
                { required: true, message: "La descripción es obligatoria" },
              ]}
              className="col-span-2"
            >
              <Input.TextArea
                rows={3}
                placeholder="Descripción del producto"
                className="!rounded-lg"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="price"
              label={
                <span className="font-label-md text-on-surface">
                  Precio (€)
                </span>
              }
              rules={[{ required: true, message: "El precio es obligatorio" }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                className="!w-full !rounded-lg"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="isNew"
              label={
                <span className="font-label-md text-on-surface">Estado</span>
              }
              valuePropName="checked"
            >
              <Checkbox>Novedad</Checkbox>
            </Form.Item>

            <Form.Item
              name="category"
              label={
                <span className="font-label-md text-on-surface">Categoría</span>
              }
              rules={[{ required: true, message: "Selecciona una categoría" }]}
            >
              <Select
                placeholder="Seleccionar categoría"
                className="!rounded-lg"
                size="large"
                options={categories.map((c) => ({
                  label: c.category,
                  value: c.code,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="sizeCodes"
              label={
                <span className="font-label-md text-on-surface">
                  Tallas disponibles
                </span>
              }
            >
              <Select
                mode="multiple"
                placeholder="Seleccionar tallas"
                className="!rounded-lg"
                size="large"
                options={sizes.map((s) => ({ label: s.size, value: s.code }))}
              />
            </Form.Item>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-md text-on-surface">Imágenes</span>
              <Button
                type="dashed"
                onClick={() => fileRef.current?.click()}
                icon={<PlusOutlined />}
                size="small"
              >
                Seleccionar imágenes
              </Button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {files.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="relative group rounded-lg overflow-hidden border border-outline-variant/30"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <DeleteOutlined className="text-xs" />
                    </button>
                    <p className="text-[10px] text-on-surface-variant truncate px-1 pb-1">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <Button onClick={onClose} size="large" className="!rounded-lg">
              Cancelar
            </Button>
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={loading}
              className="!rounded-lg !bg-primary"
            >
              Crear Producto
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
