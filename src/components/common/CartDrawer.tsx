import { useCart } from "../../hooks/useCart";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    total,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    finishPurchase,
  } = useCart();

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-surface shadow-2xl transition-transform duration-400 ease-out flex flex-col ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30">
          <h2 className="font-headline-md text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">shopping_bag</span>
            Carrito ({itemCount})
          </h2>
          <button
            onClick={closeCart}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
          >
            close
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-on-surface-variant gap-4">
              <span className="material-symbols-outlined text-5xl text-outline">
                shopping_cart
              </span>
              <p className="font-body-md">Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.code}-${item.selectedSize}`}
                className="flex gap-3 p-3 sm:p-4 rounded-xl bg-surface-container-low group hover:bg-surface-container transition-colors"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-label-md text-primary truncate">
                    {item.product.name}
                  </p>
                  <p className="font-caption text-on-surface-variant">
                    Talla: {item.selectedSize}
                  </p>
                  <p className="font-body-lg text-tertiary font-semibold mt-1">
                    {item.product.price.toFixed(2).replace(".", ",")}€
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.code,
                          item.sizeCode,
                          item.quantity - 1,
                        )
                      }
                      className="w-11 h-11 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">
                        remove
                      </span>
                    </button>
                    <span className="min-w-[44px] text-center font-label-md text-primary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.code,
                          item.sizeCode,
                          item.quantity + 1,
                        )
                      }
                      className="w-11 h-11 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-primary hover:text-on-primary hover:border-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">
                        add
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <button
                    onClick={() => removeItem(item.product.code, item.sizeCode)}
                    className="material-symbols-outlined text-sm text-on-surface-variant hover:text-error transition-colors"
                  >
                    delete
                  </button>
                  <p className="font-label-md text-primary font-semibold">
                    {(item.product.price * item.quantity)
                      .toFixed(2)
                      .replace(".", ",")}
                    €
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-outline-variant/30 px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-label-md text-on-surface-variant">
                Total
              </span>
              <span className="font-headline-md text-primary">
                {total.toFixed(2).replace(".", ",")}€
              </span>
            </div>
            <button
              onClick={async () => {
                await finishPurchase();
                closeCart();
              }}
              className="w-full bg-primary text-on-primary py-4 rounded-lg font-headline-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">check</span>
              Finalizar Pedido
            </button>
            <button
              onClick={clearCart}
              className="w-full text-center font-label-md text-on-surface-variant hover:text-error transition-colors underline underline-offset-2"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
