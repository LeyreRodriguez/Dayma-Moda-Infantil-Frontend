import {
  createContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { CartItem } from "../types/shoppingCart";
import { shoppingCartService } from "../api/services/shoppingCartService";
import { useAuth } from "../hooks/useAuth";
import OrderDetailModal from "../components/common/OrderDetailModal";

const CART_KEY = "cart_items";
const CART_SIZES_KEY = "cart_sizes";

function loadLocalCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

interface SizeInfo {
  name: string;
  code: string;
}

function loadCartSizes(): Record<string, SizeInfo> {
  try {
    return JSON.parse(localStorage.getItem(CART_SIZES_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCartSizes(sizes: Record<string, SizeInfo>) {
  localStorage.setItem(CART_SIZES_KEY, JSON.stringify(sizes));
}

export interface OrderModalData {
  code: string;
  date: string;
  status: string;
  items: { name: string; quantity: number; price: number; imageUrl: string; size?: string }[];
  total: number;
}

export interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (productCode: string, size: string) => Promise<void>;
  updateQuantity: (
    productCode: string,
    size: string,
    quantity: number,
  ) => Promise<void>;
  clearCart: () => Promise<void>;
  finishPurchase: () => Promise<void>;
  orderModal: OrderModalData | null;
  showOrderModal: (data: OrderModalData) => void;
  hideOrderModal: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [orderModal, setOrderModal] = useState<OrderModalData | null>(null);
  const prevAuth = useRef(isAuthenticated);
  const initialised = useRef(false);

  // Load cart on mount & when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      shoppingCartService
        .getShoppingCart()
        .then((backendItems) => {
          const sizes = loadCartSizes();
          const merged: CartItem[] = backendItems.map((si) => {
            const s = sizes[si.product.code];
            return {
              product: si.product,
              quantity: si.quantity,
              selectedSize: s?.name ?? "",
              sizeCode: s?.code ?? "",
            };
          });
          setItems(merged);
        })
        .catch(() => {
          setItems(loadLocalCart());
        });
    } else if (initialised.current && prevAuth.current) {
      // just logged out — load local
      setItems(loadLocalCart());
    } else {
      // initial load, not authenticated
      setItems(loadLocalCart());
    }

    prevAuth.current = isAuthenticated;
    initialised.current = true;
  }, [isAuthenticated]);

  // Persist to localStorage on every change
  useEffect(() => {
    if (!initialised.current) return;
    saveLocalCart(items);

    if (isAuthenticated) {
      const sizes: Record<string, { name: string; code: string }> = {};
      items.forEach((i) => {
        if (i.selectedSize)
          sizes[i.product.code] = { name: i.selectedSize, code: i.sizeCode };
      });
      saveCartSizes(sizes);
    }

    window.dispatchEvent(new Event("cart-change"));
  }, [items, isAuthenticated]);

  const addItem = useCallback(
    async (entry: CartItem) => {
      if (isAuthenticated) {
        try {
          await shoppingCartService.addShoppingCart(
            entry.product.code,
            entry.quantity,
            entry.sizeCode,
          );
        } catch {
          // continue with local
        }
      }

      setItems((prev) => {
        const idx = prev.findIndex(
          (i) =>
            i.product.code === entry.product.code &&
            i.sizeCode === entry.sizeCode,
        );
        if (idx !== -1) {
          return prev.map((i, n) =>
            n === idx ? { ...i, quantity: i.quantity + entry.quantity } : i,
          );
        }
        return [...prev, entry];
      });
    },
    [isAuthenticated],
  );

  const removeItem = useCallback(
    async (productCode: string, sizeCode: string) => {
      if (isAuthenticated) {
        try {
          await shoppingCartService.deleteFromShoppingCart(productCode, sizeCode);
        } catch {
          // continue with local
        }
      }

      setItems((prev) =>
        prev.filter(
          (i) =>
            !(i.product.code === productCode && i.sizeCode === sizeCode),
        ),
      );
    },
    [isAuthenticated],
  );

  const updateQuantity = useCallback(
    async (productCode: string, sizeCode: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(productCode, sizeCode);
        return;
      }
      const prev = items.find(
        (i) => i.product.code === productCode && i.sizeCode === sizeCode,
      );
      if (isAuthenticated && prev) {
        try {
          await shoppingCartService.updateShoppingCartItem(productCode, quantity, sizeCode);
        } catch {
          // continue with local
        }
      }
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.product.code === productCode && i.sizeCode === sizeCode
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [removeItem, isAuthenticated, items],
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated && items.length > 0) {
      try {
        await Promise.allSettled(
          items.map((i) =>
            shoppingCartService.deleteFromShoppingCart(i.product.code, i.sizeCode),
          ),
        );
      } catch {
        // continue with local
      }
    }
    setItems([]);
  }, [isAuthenticated, items]);

  const finishPurchase = useCallback(async () => {
    const snapshot = [...items];
    await shoppingCartService.finishPurchase();
    setItems([]);
    window.dispatchEvent(new Event("purchase-complete"));
    setOrderModal({
      code: "",
      date: new Date().toISOString(),
      status: "Pendiente",
      items: snapshot.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        imageUrl: i.product.imageUrl,
        size: i.selectedSize,
      })),
      total: snapshot.reduce((s, i) => s + i.product.price * i.quantity, 0),
    });
  }, [items]);

  const showOrderModal = useCallback((data: OrderModalData) => {
    setOrderModal(data);
  }, []);

  const hideOrderModal = useCallback(() => {
    setOrderModal(null);
  }, []);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        finishPurchase,
        orderModal,
        showOrderModal,
        hideOrderModal,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
      {orderModal && (
        <OrderDetailModal
          open={!!orderModal}
          onClose={hideOrderModal}
          code={orderModal.code}
          date={orderModal.date}
          status={orderModal.status}
          items={orderModal.items}
          total={orderModal.total}
        />
      )}
    </CartContext.Provider>
  );
}
