import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Modal } from "antd";
import { productService } from "../api/services/productService";
import { collectionService } from "../api/services/collectionService";
import { sizeService } from "../api/services/sizeService";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import type { Product } from "../types/product";
import type { Collection } from "../types/collection";
import type { ProductImage } from "../types/productImage";
import type { ProductSize } from "../types/productSize";
import ProductCard from "../components/common/ProductCard";
import ProductImageCarousel from "../components/common/ProductImageCarousel";

export default function ProductDetail() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [productSizes, setProductSizes] = useState<ProductSize[]>([]);
  const [allSizes, setAllSizes] = useState<string[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (!code) return;
    setLoading(true);

    Promise.all([
      productService.getByCode(code),
      collectionService.getCollectionByProduct(code),
      productService.getImageByProductCode(code),
      productService.getSizeByProductCode(code),
      sizeService.getAll(),
    ])
      .then(([prod, coll, imgs, sizes, all]) => {
        setProduct(prod);
        setCollection(coll);
        setProductImages(imgs);
        setProductSizes(sizes);
        setAllSizes(all.map((s: { size: string }) => s.size));
        return productService.getAll({ collection: coll.name, limit: 5 });
      })
      .then((res) => {
        setRelated((res.content ?? []).filter((p) => p.code !== code));
      })
      .catch(() => navigate("/collection"))
      .finally(() => setLoading(false));
  }, [code, navigate]);

  useEffect(() => {
    const handlePurchase = () => {
      if (!code) return;
      productService
        .getSizeByProductCode(code)
        .then(setProductSizes)
        .catch(() => {});
    };
    window.addEventListener("purchase-complete", handlePurchase);
    return () =>
      window.removeEventListener("purchase-complete", handlePurchase);
  }, [code]);

  if (loading || !product) {
    return (
      <div className="bg-background min-h-screen font-body-md">
        <main className="pt-32 pb-section-padding px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 mb-12 animate-pulse">
            <div className="h-4 w-16 bg-outline-variant/40 rounded" />
            <div className="h-4 w-4 bg-outline-variant/40 rounded" />
            <div className="h-4 w-24 bg-outline-variant/40 rounded" />
            <div className="h-4 w-4 bg-outline-variant/40 rounded" />
            <div className="h-4 w-32 bg-outline-variant/40 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-7">
              <div className="w-full aspect-square bg-surface-container-high rounded-xl animate-pulse" />
            </div>
            <div className="md:col-span-5 flex flex-col gap-10">
              <div className="space-y-4 animate-pulse">
                <div className="h-4 w-24 bg-outline-variant/40 rounded" />
                <div className="h-4 w-full bg-outline-variant/40 rounded" />
                <div className="h-4 w-3/4 bg-outline-variant/40 rounded" />
                <div className="h-8 w-48 bg-outline-variant/40 rounded mt-6" />
              </div>
              <div className="animate-pulse">
                <div className="h-4 w-40 bg-outline-variant/40 rounded mb-4" />
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 bg-outline-variant/40 rounded" />
                  ))}
                </div>
              </div>
              <div className="animate-pulse">
                <div className="h-14 w-full bg-outline-variant/40 rounded-lg" />
              </div>
              <div className="animate-pulse space-y-4 p-6 bg-surface-container rounded-xl">
                <div className="h-6 w-40 bg-outline-variant/40 rounded" />
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-outline-variant/40 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-outline-variant/40 rounded" />
                    <div className="h-4 w-full bg-outline-variant/40 rounded" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-outline-variant/40 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-outline-variant/40 rounded" />
                    <div className="h-4 w-48 bg-outline-variant/40 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const allImages =
    productImages.length > 0 && typeof productImages[0] === "string"
      ? (productImages as unknown as string[])
      : productImages.map((pi) => pi.image);
  console.log(allImages);
  console.log(productImages);
  const collectionName =
    collection?.name ?? product.collectionName ?? "Colección";
  const sizesWithStock = productSizes.filter((ps) => ps.stock > 0);
  const hasStock = sizesWithStock.length > 0;

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden selection:bg-primary/10 selection:text-primary">
      <main className="pt-32 pb-section-padding px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-12 text-on-surface-variant font-label-md uppercase tracking-wider">
          <Link className="hover:text-primary transition-colors" to="/">
            Home
          </Link>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <Link
            className="hover:text-primary transition-colors"
            to="/collection"
          >
            Collections
          </Link>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <span className="text-primary font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Left: Images */}
          <div className="md:col-span-7">
            <ProductImageCarousel images={allImages} name={product.name} />
          </div>

          {/* Right: Product Info */}
          <div className="md:col-span-5 flex flex-col gap-10 sticky top-28 self-start">
            <header>
              <section className="border-y border-outline-variant/30 py-8">
                <span className="material-symbols-outlined">
                  {collectionName}
                </span>
                <p className="font-body-md text-on-surface-variant leading-relaxed">
                  {product.description}
                </p>
                <h1 className="font-headline-xl text-primary mt-2">
                  {product.name}
                </h1>
              </section>

              <p className="text-4xl font-bold text-primary mt-6">
                {product.price.toFixed(2).replace(".", ",")}€
              </p>
            </header>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-label-md text-primary uppercase tracking-widest">
                  Selecciona Talla
                </h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {allSizes.map((s) => {
                  const ps = productSizes.find((p) => p.size.size === s);
                  const available = ps ? ps.stock > 0 : false;
                  return (
                    <div
                      key={s}
                      className={
                        available
                          ? "relative"
                          : "relative opacity-30 cursor-not-allowed"
                      }
                    >
                      {available ? (
                        <>
                          <input
                            className="peer hidden"
                            id={`size-${s}`}
                            name="size"
                            type="radio"
                            checked={selectedSize === s}
                            onChange={() => setSelectedSize(s)}
                          />
                          <label
                            className="flex flex-col items-center justify-center h-14 rounded border cursor-pointer transition-all font-label-md peer-checked:bg-primary peer-checked:text-on-primary peer-checked:border-primary border-outline text-on-surface-variant hover:border-primary"
                            htmlFor={`size-${s}`}
                          >
                            <span>{s}</span>
                          </label>
                        </>
                      ) : (
                        <span className="flex items-center justify-center h-14 rounded border border-outline text-on-surface-variant font-label-md bg-surface-variant line-through">
                          {s}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {!hasStock && (
                <p className="mt-4 font-label-md text-secondary text-center">
                  Este producto no tiene stock disponible
                </p>
              )}
            </section>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  if (!selectedSize) return;
                  if (!isAuthenticated) {
                    setShowAuthModal(true);
                    return;
                  }
                  const sizeCode =
                    productSizes.find((ps) => ps.size.size === selectedSize)
                      ?.size.code ?? "";
                  addItem({
                    product,
                    quantity: 1,
                    selectedSize,
                    sizeCode,
                  });
                  setAddedFeedback(true);
                  setTimeout(() => setAddedFeedback(false), 2000);
                }}
                disabled={!selectedSize || !hasStock}
                className="w-full bg-primary text-on-primary py-6 rounded-lg font-headline-md hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">
                  {!hasStock
                    ? "block"
                    : addedFeedback
                      ? "check"
                      : "shopping_bag"}
                </span>
                {!hasStock
                  ? "Sin stock"
                  : addedFeedback
                    ? "¡Añadido!"
                    : "Añadir al carrito"}
              </button>
              {addedFeedback && (
                <button
                  onClick={openCart}
                  className="w-full text-center font-label-md text-primary underline underline-offset-2 hover:opacity-70 transition-opacity"
                >
                  Ver carrito
                </button>
              )}
              <p className="text-center font-caption text-on-surface-variant italic">
                Pago directo en nuestra tienda al momento de la recogida
              </p>
            </div>

            <section className="mt-4 p-4 sm:p-6 md:p-8 bg-surface-container rounded-xl border border-outline-variant/30 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-[60%_40%_70%_30%_/_40%_50%_60%_40%]" />
              <h3 className="font-headline-md text-primary mb-6">
                Recogida en Tienda
              </h3>
              <div className="space-y-6">
                <div className="flex gap-5">
                  <div className="w-10 h-10 bg-surface-container-lowest rounded-full flex items-center justify-center shrink-0 shadow-sm text-primary">
                    <span className="material-symbols-outlined text-lg">
                      location_on
                    </span>
                  </div>
                  <div>
                    <p className="font-label-md text-primary">
                      Dayma Moda Infantil
                    </p>
                    <p className="font-body-md text-on-surface-variant">
                      C. Matías Zurita, 11, 35200 Telde, Las Palmas
                    </p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-10 h-10 bg-surface-container-lowest rounded-full flex items-center justify-center shrink-0 shadow-sm text-primary">
                    <span className="material-symbols-outlined text-lg">
                      schedule
                    </span>
                  </div>
                  <div>
                    <p className="font-label-md text-primary">
                      Horario de Atención
                    </p>
                    <p className="font-body-md text-on-surface-variant">
                      L-S: 10:00 - 13:00 / S: 17:00 - 20:00
                    </p>
                  </div>
                </div>
                <a
                  className="mt-6 block rounded-lg overflow-hidden min-h-[200px] md:h-32 relative group"
                  href="https://www.google.com/maps/place//data=!4m2!3m1!1s0xc4097e45e7a4431:0x6226b676ab588a99?sa=X&ved=1t:8290&ictx=111"
                >
                  <iframe
                    src="https://maps.google.com/maps?q=Dayma+Moda+Infantil&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "200px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación Dayma"
                    className="grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-[2px] group-hover:bg-transparent group-hover:backdrop-blur-none transition-all">
                    <div className="bg-surface/90 px-6 py-2 rounded-full font-label-md text-primary shadow-xl">
                      Ver ubicación
                    </div>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Divider */}
      <div className="w-full py-12 flex justify-center items-center opacity-30">
        <div className="h-px w-24 bg-primary" />
        <span className="material-symbols-outlined text-primary mx-4">eco</span>
        <div className="h-px w-24 bg-primary" />
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-surface-container-low py-section-padding px-margin-mobile md:px-margin-desktop">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="font-display-lg text-primary text-center mb-16 italic">
              También te puede encantar...
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-gutter">
              {related.map((p) => (
                <ProductCard key={p.code} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Modal
        open={showAuthModal}
        onCancel={() => setShowAuthModal(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="flex flex-col items-center gap-6 py-6">
          <span className="material-symbols-outlined text-5xl text-primary">
            login
          </span>
          <p className="font-headline-md text-primary text-center">
            Inicia sesión para añadir productos al carrito
          </p>
          <p className="font-body-md text-on-surface-variant text-center">
            Necesitas tener una cuenta para poder realizar compras.
          </p>
          <Link
            to="/auth"
            onClick={() => setShowAuthModal(false)}
            className="w-full bg-primary text-on-primary py-4 rounded-lg font-headline-md text-center hover:opacity-90 transition-opacity"
          >
            Iniciar Sesión
          </Link>
          <button
            onClick={() => setShowAuthModal(false)}
            className="font-label-md text-on-surface-variant hover:text-primary transition-colors underline underline-offset-2"
          >
            Seguir explorando
          </button>
        </div>
      </Modal>
    </div>
  );
}
