import { useEffect, useState, useCallback, useRef } from "react";
import { Input, Select, Table, Button, App, Tag, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { productService } from "../../api/services/productService";
import { categoryService } from "../../api/services/categoryService";
import { adminService } from "../../api/services/adminService";
import { getImageUrl } from "../../api/httpClient";
import type { Product } from "../../types/product";
import type { Category } from "../../types/category";
import type { ProductSize as ProductSizeType } from "../../types/productSize";

interface CartItem {
  product: Product;
  sizeCode: string;
  sizeName: string;
  quantity: number;
}

export default function InStorePurchase() {
  const { message } = App.useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState<string | undefined>();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sizesCache, setSizesCache] = useState<Record<string, ProductSizeType[]>>({});
  const [finishing, setFinishing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async (code?: string, name?: string, category?: string) => {
    setLoading(true);
    try {
      const res = await productService.search({ code, name });
      let filtered = res.content ?? [];
      if (category) {
        filtered = filtered.filter((p) => p.category === category);
      }
      setProducts(filtered);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(
        searchCode || undefined,
        searchName || undefined,
        searchCategory,
      );
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchCode, searchName, searchCategory, fetchProducts]);

  const handleCodeSearch = (value: string) => {
    setSearchCode(value);
    if (value) setSearchName("");
  };

  const handleNameSearch = (value: string) => {
    setSearchName(value);
    if (value) setSearchCode("");
  };

  const getStockForItem = (item: CartItem): number => {
    const sizes = sizesCache[item.product.code];
    if (!sizes) return 0;
    const ps = sizes.find((s) => s.size.code === item.sizeCode);
    return ps?.stock ?? 0;
  };

  const addToCart = async (product: Product) => {
    let sizes = sizesCache[product.code];
    if (!sizes) {
      try {
        sizes = await productService.getSizeByProductCode(product.code);
        setSizesCache((prev) => ({ ...prev, [product.code]: sizes }));
      } catch {
        message.error("Error al cargar tallas");
        return;
      }
    }
    const available = sizes.filter((s) => s.stock > 0);
    if (available.length === 0) {
      message.warning("No hay stock disponible para este producto");
      return;
    }
    if (available.length === 1) {
      const s = available[0];
      const existing = cart.find(
        (i) => i.product.code === product.code && i.sizeCode === s.size.code
      );
      if (existing) {
        if (existing.quantity >= s.stock) {
          message.warning("No hay más stock disponible para esta talla");
          return;
        }
        setCart((prev) =>
          prev.map((i) =>
            i.product.code === product.code && i.sizeCode === s.size.code
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        );
      } else {
        setCart((prev) => [
          ...prev,
          {
            product,
            sizeCode: s.size.code,
            sizeName: s.size.size,
            quantity: 1,
          },
        ]);
      }
      message.success("Producto añadido");
      return;
    }
    showSizePicker(product, available);
  };

  const [sizePicker, setSizePicker] = useState<{
    visible: boolean;
    product?: Product;
    sizes?: ProductSizeType[];
  }>({ visible: false });

  const showSizePicker = (product: Product, sizes: ProductSizeType[]) => {
    setSizePicker({ visible: true, product, sizes });
  };

  const confirmSize = (size: ProductSizeType) => {
    const p = sizePicker.product!;
    const existing = cart.find(
      (i) => i.product.code === p.code && i.sizeCode === size.size.code
    );
    if (existing) {
      if (existing.quantity >= size.stock) {
        message.warning("No hay más stock disponible para esta talla");
        setSizePicker({ visible: false });
        return;
      }
      setCart((prev) =>
        prev.map((i) =>
          i.product.code === p.code && i.sizeCode === size.size.code
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        { product: p, sizeCode: size.size.code, sizeName: size.size.size, quantity: 1 },
      ]);
    }
    setSizePicker({ visible: false });
    message.success("Producto añadido");
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const item = prev[index];
      const stock = getStockForItem(item);
      const newQty = item.quantity + delta;
      if (newQty > stock) return prev;
      return prev.map((it, i) =>
        i === index ? { ...it, quantity: Math.max(1, newQty) } : it
      );
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const finishPurchase = async () => {
    if (cart.length === 0) return;
    setFinishing(true);
    try {
      const items = cart.map((item) => ({
        productCode: item.product.code,
        sizeCode: item.sizeCode,
        quantity: item.quantity,
      }));
      await adminService.createInStorePurchase(items);
      message.success("Venta completada");
      setCart([]);
    } catch {
      message.error("Error al finalizar la venta");
    } finally {
      setFinishing(false);
    }
  };

  const productColumns: ColumnsType<Product> = [
    {
      title: "Producto",
      key: "product",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl(record.imageUrl) || "https://placehold.co/48x48?text=No"}
            alt={record.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div>
            <p className="font-label-md text-on-surface">{record.name}</p>
            <p className="text-xs text-on-surface-variant">{record.code}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Precio",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price: number) => (
        <span className="font-label-md">{price.toFixed(2)} €</span>
      ),
    },
    {
      title: "Categoría",
      dataIndex: "category",
      key: "category",
      width: 130,
      responsive: ["md"],
    },
    {
      title: "",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(record);
          }}
        >
          Añadir
        </Button>
      ),
    },
  ];

  const cartColumns: ColumnsType<CartItem> = [
    {
      title: "Producto",
      key: "product",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <img
            src={getImageUrl(record.product.imageUrl) || "https://placehold.co/40x40?text=No"}
            alt={record.product.name}
            className="w-10 h-10 object-cover rounded"
          />
          <div>
            <p className="font-label-md text-on-surface text-sm">{record.product.name}</p>
            <Tag className="text-xs">{record.sizeName}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Precio",
      key: "price",
      width: 90,
      render: (_, record) => (
        <span>{(record.product.price * record.quantity).toFixed(2)} €</span>
      ),
    },
    {
      title: "Cant.",
      key: "quantity",
      width: 150,
      render: (_, record, index) => {
        const stock = getStockForItem(record);
        const atMax = record.quantity >= stock;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(index, -1)}
                className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center font-label-md">{record.quantity}</span>
              <button
                onClick={() => updateQuantity(index, 1)}
                disabled={atMax}
                className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <span className="text-xs text-on-surface-variant">
              Stock: {stock}
            </span>
          </div>
        );
      },
    },
    {
      title: "",
      key: "remove",
      width: 60,
      render: (_, __, index) => (
        <button
          onClick={() => removeFromCart(index)}
          className="text-error hover:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-headline-lg text-on-background">Venta en tienda</h2>
          <p className="font-body-md text-on-surface-variant">
            Selecciona productos para la venta presencial
          </p>
        </div>

        {/* Search */}
        <div className="bg-surface-container-lowest rounded-xl artisanal-shadow p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-label-md text-xs text-on-surface-variant mb-1 block">
                Buscar por código
              </label>
              <Input
                placeholder="Código del producto..."
                value={searchCode}
                onChange={(e) => handleCodeSearch(e.target.value)}
                allowClear
                size="large"
              />
            </div>
            <div>
              <label className="font-label-md text-xs text-on-surface-variant mb-1 block">
                Buscar por nombre
              </label>
              <Input
                placeholder="Nombre del producto..."
                value={searchName}
                onChange={(e) => handleNameSearch(e.target.value)}
                allowClear
                size="large"
              />
            </div>
            <div>
              <label className="font-label-md text-xs text-on-surface-variant mb-1 block">
                Filtrar por categoría
              </label>
              <Select
                className="!w-full"
                placeholder="Todas las categorías"
                value={searchCategory}
                onChange={(val) => setSearchCategory(val)}
                allowClear
                size="large"
                options={categories.map((c) => ({
                  label: c.category,
                  value: c.code,
                }))}
              />
            </div>
          </div>

          <div className="mt-4">
            <Table
              columns={productColumns}
              dataSource={products}
              rowKey="code"
              loading={loading}
              pagination={false}
              size="small"
              className="[&_.ant-table-thead_.ant-table-cell]:!bg-surface-container-low [&_.ant-table-thead_.ant-table-cell]:!font-label-md"
            />
          </div>
        </div>

        {/* Cart */}
        <div className="bg-surface-container-lowest rounded-xl artisanal-shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-md text-on-background">
              Carrito de tienda
              {cart.length > 0 && (
                <span className="ml-2 text-sm text-on-surface-variant">
                  ({cart.length} producto{cart.length !== 1 ? "s" : ""})
                </span>
              )}
            </h3>
            <div className="flex items-center gap-4">
              <span className="font-headline-md text-primary">
                Total: {total.toFixed(2)} €
              </span>
              <Button
                type="primary"
                size="large"
                disabled={cart.length === 0 || finishing}
                onClick={finishPurchase}
                className="!font-label-md"
              >
                {finishing ? "Finalizando..." : "Finalizar venta"}
              </Button>
            </div>
          </div>

          {cart.length === 0 ? (
            <p className="text-center py-8 text-on-surface-variant font-body-md">
              No hay productos en el carrito
            </p>
          ) : (
            <Table
              columns={cartColumns}
              dataSource={cart}
              rowKey={(_, i) => String(i)}
              pagination={false}
              size="small"
              className="[&_.ant-table-thead_.ant-table-cell]:!bg-surface-container-low [&_.ant-table-thead_.ant-table-cell]:!font-label-md"
            />
          )}
        </div>
      </div>

      {/* Size picker modal */}
      <Modal
        open={sizePicker.visible}
        onCancel={() => setSizePicker({ visible: false })}
        footer={null}
        centered
        width={400}
        title={
          <span className="font-headline-md text-primary">
            Seleccionar talla
          </span>
        }
      >
        <div className="py-4">
          <p className="font-body-md text-on-surface-variant mb-4">
            {sizePicker.product?.name}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {sizePicker.sizes
              ?.filter((s) => s.stock > 0)
              .map((s) => (
                <button
                  key={s.size.code}
                  onClick={() => confirmSize(s)}
                  className="px-4 py-3 rounded-lg border border-outline-variant text-center
                    hover:border-primary hover:text-primary transition-colors font-label-md"
                >
                  {s.size.size}
                  <br />
                  <span className="text-xs text-on-surface-variant">
                    {s.stock} ud.
                  </span>
                </button>
              ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
