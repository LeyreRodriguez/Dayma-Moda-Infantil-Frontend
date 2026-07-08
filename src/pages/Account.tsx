import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { favouriteService } from "../api/services/favouriteService";
import { orderService } from "../api/services/orderService";
import type { Favourite } from "../types/favourite";
import type { Order } from "../types/order";

export default function Account() {
  const { user, logout } = useAuth();
  const { items: cartItems, total, finishPurchase, showOrderModal } = useCart();

  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () =>
    orderService.getOrders().then(setOrders).catch(() => {});

  useEffect(() => {
    Promise.all([favouriteService.getFavourites(), fetchOrders()])
      .then(([favs]) => {
        setFavourites(favs.filter((f) => f.product));
      })
      .catch((e) => {
        console.error("Account load error", e);
      })
      .finally(() => setLoading(false));
  }, []);
  console.log(user);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface pt-24 lg:pt-32 parchment-texture">
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-16">
        <section className="mb-16">
          <h1 className="font-display-lg text-display-lg text-primary mb-2">
            Bienvenid{user?.name ? `o, ${user.name}` : "@ de nuevo"}
          </h1>
          <p className="font-body-lg text-on-surface-variant italic">
            Échale un vistazo a tus pedidos anteriores y a tus productos
            favoritos
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-16">
            <nav className="flex flex-wrap gap-4">
              <a
                className="flex items-center gap-3 bg-surface-container-low px-6 py-4 rounded-xl hover:bg-surface-container-high transition-colors"
                href="#favorites"
              >
                <span className="material-symbols-outlined text-primary">
                  favorite
                </span>
                <span className="font-label-md text-label-md text-primary">
                  Mis Favoritos ({favourites.length})
                </span>
              </a>
              <button
                onClick={logout}
                className="flex items-center gap-3 bg-surface-container-high px-6 py-4 rounded-xl hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-primary">
                  logout
                </span>
                <span className="font-label-md text-label-md text-primary">
                  Cerrar sesión
                </span>
              </button>
            </nav>

            <section>
              <div className="flex justify-between items-end mb-8 border-b border-outline-variant pb-4">
                <h2 className="font-headline-lg text-headline-lg text-primary">
                  Pedidos recientes
                </h2>
              </div>
              <div className="space-y-6 max-h-80 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="bg-surface-container-high p-4 md:p-6 lg:p-8 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 animate-pulse"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-32 bg-outline-variant/40 rounded" />
                          <div className="h-4 w-40 bg-outline-variant/40 rounded" />
                        </div>
                        <div className="space-y-2 text-center">
                          <div className="h-6 w-24 bg-outline-variant/40 rounded mx-auto md:mx-0" />
                          <div className="h-4 w-20 bg-outline-variant/40 rounded mx-auto md:mx-0" />
                        </div>
                        <div className="h-10 w-32 bg-outline-variant/40 rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <p className="font-body-md text-on-surface-variant text-center py-8">
                    No tienes pedidos aún.
                  </p>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.code}
                      className="bg-surface-container-high p-4 md:p-6 lg:p-8 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-label-md text-label-md text-on-surface-variant">
                          Pedido #{order.code}
                        </span>
                        <span className="font-body-md text-body-md">
                          {order.date
                            ? new Date(order.date).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : ""}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-center md:text-left">
                        <span className="font-headline-md text-headline-md text-primary">
                          {(order.total ?? 0).toFixed(2).replace(".", ",")}€
                        </span>
                        <div className="flex items-center gap-2 justify-center md:justify-start">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              order.status?.status === "Entregado"
                                ? "bg-outline"
                                : "bg-primary animate-pulse"
                            }`}
                          />
                          <span
                            className={`font-label-md text-label-md ${
                              order.status?.status === "Entregado"
                                ? "text-on-surface-variant"
                                : "text-primary"
                            }`}
                          >
                            {order.status?.status ?? "Desconocido"}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            const productOrders =
                              await orderService.getProductOrders(order.code);
                            const items = productOrders.map((po) => ({
                              name: po.product.name ?? "",
                              quantity: 1,
                              price: po.product.price ?? 0,
                              imageUrl: po.product.imageUrl ?? "",
                            }));
                            showOrderModal({
                              code: order.code,
                              date: order.date,
                              status: order.status?.status ?? "",
                              items,
                              total: order.total,
                            });
                          } catch (e) {
                            console.error("View Details error", e);
                          }
                        }}
                        className="px-8 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section id="favorites">
              <div className="flex justify-between items-end mb-8 border-b border-outline-variant pb-4">
                <h2 className="font-headline-lg text-headline-lg text-primary">
                  Mis Favoritos
                </h2>
              </div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-surface-container-lowest p-6 rounded-xl flex gap-4 animate-pulse"
                    >
                      <div className="w-24 h-24 bg-outline-variant/40 rounded-lg flex-shrink-0" />
                      <div className="space-y-2 flex-1 py-2">
                        <div className="h-4 w-32 bg-outline-variant/40 rounded" />
                        <div className="h-4 w-24 bg-outline-variant/40 rounded" />
                        <div className="h-4 w-20 bg-outline-variant/40 rounded mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : favourites.length === 0 ? (
                <p className="font-body-md text-on-surface-variant text-center py-12">
                  No tienes favoritos aún.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-80 overflow-y-auto custom-scrollbar">
                  {favourites.map((fav) => (
                    <Link
                      key={fav.product.code}
                      to={`/product/${fav.product.code}`}
                      className="bg-surface-container-lowest p-6 rounded-xl flex gap-4 group cursor-pointer"
                    >
                      <div className="w-24 h-24 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          src={fav.product.imageUrl}
                          alt={fav.product.name}
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-label-md text-label-md text-primary">
                          {fav.product.name}
                        </span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          {fav.product.material}
                        </span>
                        <span className="font-label-md text-label-md text-secondary mt-1">
                          {(fav.product.price ?? 0)
                            .toFixed(2)
                            .replace(".", ",")}
                          €
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="lg:col-span-4 sticky top-32">
            <div className="bg-surface-container-high/40 p-4 md:p-6 lg:p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="font-headline-md text-headline-md text-primary mb-8 flex items-center gap-3">
                Carrito de la Compra
                <span className="bg-secondary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {cartItems.length}
                </span>
              </h3>
              {loading ? (
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-20 h-20 bg-outline-variant/40 rounded-lg flex-shrink-0" />
                      <div className="space-y-2 flex-1 py-2">
                        <div className="h-4 w-28 bg-outline-variant/40 rounded" />
                        <div className="h-4 w-20 bg-outline-variant/40 rounded" />
                        <div className="h-4 w-16 bg-outline-variant/40 rounded mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : cartItems.length === 0 ? (
                <p className="font-body-md text-on-surface-variant text-center py-8">
                  Tu carrito está vacío.
                </p>
              ) : (
                <div className="space-y-6 mb-8 max-h-72 overflow-y-auto custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.product.code} className="flex gap-4">
                      <div className="w-20 h-20 bg-surface-container-highest rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          src={item.product.imageUrl}
                          alt={item.product.name}
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-label-md text-label-md text-primary">
                          {item.product.name}
                        </span>
                        <span className="font-body-md text-body-md text-on-surface-variant">
                          {item.product.material}
                        </span>
                        <span className="font-label-md text-label-md text-secondary mt-1">
                          {item.product.price?.toFixed(2).replace(".", ",")}€
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-outline-variant pt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md">Subtotal</span>
                  <span className="font-headline-md text-headline-md text-primary">
                    {total.toFixed(2).replace(".", ",")}€
                  </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant italic">
                  Envío calculado en el siguiente paso.
                </p>
                <button
                  onClick={async () => {
                    await finishPurchase();
                    fetchOrders();
                  }}
                  disabled={cartItems.length === 0}
                  className="w-full py-4 bg-primary text-on-primary font-label-md text-label-md rounded-xl hover:shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
