import { Modal } from "antd";

interface OrderLineItem {
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
  size?: string;
}

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  code: string;
  date: string;
  status: string;
  items: OrderLineItem[];
  total: number;
}

export default function OrderDetailModal({
  open,
  onClose,
  code,
  date,
  status,
  items,
  total,
}: OrderDetailModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={typeof window !== "undefined" && window.innerWidth < 640 ? "95%" : 520}
    >
      <div className="py-4">
        <div className="text-center mb-6">
          <span className="material-symbols-outlined text-4xl text-primary">
            check_circle
          </span>
          <h2 className="font-headline-md text-primary mt-2">
            Pedido {code ? `#${code}` : "confirmado"}
          </h2>
          <p className="font-body-md text-on-surface-variant mt-1">
            {date
              ? new Date(date).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </p>
        </div>

        <div className="space-y-3 mb-6 max-h-72 overflow-y-auto custom-scrollbar">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg bg-surface-container-low"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-14 h-16 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-primary truncate">
                  {item.name}
                </p>
                {item.size && (
                  <p className="font-caption text-on-surface-variant">
                    Talla: {item.size}
                  </p>
                )}
                <p className="font-caption text-on-surface-variant">
                  Cant: {item.quantity}
                </p>
              </div>
              <p className="font-label-md text-primary shrink-0">
                {(item.price * item.quantity).toFixed(2).replace(".", ",")}€
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-outline-variant pt-4 flex justify-between items-center">
          <span className="font-label-md text-on-surface-variant">Total</span>
          <span className="font-headline-md text-primary">
            {total.toFixed(2).replace(".", ",")}€
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 justify-center">
          <span
            className={`w-2 h-2 rounded-full ${
              status === "Entregado" ? "bg-outline" : "bg-primary animate-pulse"
            }`}
          />
          <span className="font-label-md text-label-md text-on-surface-variant">
            {status}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-primary text-on-primary py-3 rounded-lg font-headline-md hover:opacity-90 transition-opacity"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
}
