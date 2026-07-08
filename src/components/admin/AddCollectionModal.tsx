import { Modal, Form, Input, Checkbox, App, Button } from "antd";
import { collectionService } from "../../api/services/collectionService";

interface AddCollectionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCollectionModal({
  open,
  onClose,
  onSuccess,
}: AddCollectionModalProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const handleFinish = async (values: Record<string, unknown>) => {
    try {
      const payload = {
        name: values.name as string,
        description: values.description as string,
        featured: values.featured as boolean,
      };
      await collectionService.create(payload);
      message.success("Colección creada correctamente");
      form.resetFields();
      onSuccess();
      onClose();
    } catch {
      message.error("Error al crear la colección");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={typeof window !== "undefined" && window.innerWidth < 640 ? "95%" : 480}
      title={
        <span className="font-headline-md text-primary flex items-center gap-2">
          <span className="material-symbols-outlined">
            collections_bookmark
          </span>
          Nueva Colección
        </span>
      }
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label={<span className="font-label-md text-on-surface">Nombre</span>}
          rules={[{ required: true, message: "El nombre es obligatorio" }]}
        >
          <Input
            placeholder="Nombre de la colección"
            className="!rounded-lg"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={
            <span className="font-label-md text-on-surface">Descripción</span>
          }
        >
          <Input.TextArea
            rows={3}
            placeholder="Descripción de la colección"
            className="!rounded-lg"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="featured"
          valuePropName="checked"
          initialValue={false}
          label={
            <span className="font-label-md text-on-surface">Destacada</span>
          }
        >
          <Checkbox>Colección destacada</Checkbox>
        </Form.Item>

        <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
          <Button onClick={onClose} size="large" className="!rounded-lg">
            Cancelar
          </Button>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            className="!rounded-lg !bg-primary"
          >
            Crear Colección
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
