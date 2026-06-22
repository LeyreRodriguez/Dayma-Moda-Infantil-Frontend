import { useEffect, useState, useCallback, useRef } from "react";
import { productService } from "../api/services/productService";
import { categoryService } from "../api/services/categoryService";
import { sizeService } from "../api/services/sizeService";
import { collectionService } from "../api/services/collectionService";
import type { Product, ProductFilters } from "../types/product";
import type { Category } from "../types/category";
import type { Size } from "../types/size";
import ProductCard from "../components/common/ProductCard";
import FilterSidebar from "../components/common/FilterSidebar";
import type { Collection, FeaturedCollection } from "../types/collection";

const SORT_OPTIONS = [
  { value: "newest", label: "Lo más nuevo" },
  { value: "price_asc", label: "Precio: Menor a Mayor" },
  { value: "price_desc", label: "Precio: Mayor a Menor" },
  { value: "relevance", label: "Relevancia" },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [featuredProduct, setFeaturedProduct] =
    useState<FeaturedCollection | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    categoryService
      .getAll()
      .then(setCategories)
      .catch(() => {});
    sizeService
      .getAll()
      .then(setSizes)
      .catch(() => {});
    collectionService
      .getAll()
      .then(setCollections)
      .catch(() => {});
    collectionService
      .getFeaturedCollection()
      .then(setFeaturedProduct)
      .catch(() => {});
  }, []);

  const handleFiltersChange = useCallback((next: ProductFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    setPage(1);
  }, []);

  const handleCollectionChange = useCallback((code: string) => {
    setFilters((prev) => ({ ...prev, collection: code || undefined }));
    setPage(1);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getAll({
          ...filters,
          sortBy,
          page: page - 1,
          limit: 6,
        });
        setProducts(res.content ?? []);
        setTotal(res.totalElements ?? 0);
      } catch {
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(total / 6));

  return (
    <div className="bg-background text-on-background parchment-texture min-h-screen selection:bg-secondary-container selection:text-on-secondary-container">
      <header className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div className="z-10 space-y-6">
            <span className="font-label-md text-label-md text-secondary tracking-[0.2em] uppercase">
              {"Nueva Colección"}
            </span>
            <h1 className="font-display-lg text-display-lg text-primary leading-tight">
              {featuredProduct?.name ?? ""}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md italic">
              {featuredProduct?.description ?? ""}
            </p>
            <div className="h-[1px] w-24 bg-tertiary-fixed-dim" />
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
            <img
              className="w-full h-full object-cover"
              src={featuredProduct?.imageUrl}
              alt={featuredProduct?.name ?? "Colección"}
            />
            <div className="absolute inset-0 hero-gradient hidden md:block" />
          </div>
        </div>
      </header>

      {/* Subcategory Carousel */}
      <nav className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop mb-12">
        <div className="relative flex items-center border-b border-outline-variant/10 pb-4">
          <button
            className="hidden md:flex items-center justify-center w-10 h-10 text-primary hover:bg-primary/5 rounded-full transition-colors flex-shrink-0"
            onClick={() =>
              scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })
            }
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto scroll-smooth no-scrollbar"
          >
            <div className="flex items-center gap-x-10 px-4 whitespace-nowrap">
              <button
                className={`font-headline-md text-headline-md pb-2 transition-all duration-300 ${
                  !filters.collection
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-primary hover:scale-105"
                }`}
                onClick={() => handleCollectionChange("")}
              >
                Ver Todo
              </button>
              {collections.map((sc) => (
                <button
                  key={sc.code}
                  className={`font-headline-md text-headline-md pb-2 transition-all duration-300 ${
                    filters.collection === sc.code
                      ? "text-primary border-b-2 border-primary"
                      : "text-on-surface-variant hover:text-primary hover:scale-105"
                  }`}
                  onClick={() => handleCollectionChange(sc.code)}
                >
                  {sc.name}
                </button>
              ))}
            </div>
          </div>
          <button
            className="hidden md:flex items-center justify-center w-10 h-10 text-primary hover:bg-primary/5 rounded-full transition-colors flex-shrink-0"
            onClick={() =>
              scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })
            }
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row gap-gutter">
        <aside className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            categories={categories.map((c) => ({
              label: c.category,
              code: c.code,
            }))}
            sizes={sizes.map((s) => ({ label: s.size, code: s.code }))}
          />
        </aside>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <span className="font-body-md text-body-md text-on-surface-variant">
              Mostrando{" "}
              <span className="font-bold text-primary">{products.length}</span>{" "}
              productos
            </span>
            <div className="flex items-center gap-2 border-b border-outline px-2 py-1">
              <span className="font-label-md text-label-md text-on-surface-variant">
                Ordenar por:
              </span>
              <select
                className="bg-transparent border-none focus:ring-0 font-label-md text-label-md text-primary cursor-pointer pr-8"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">
                refresh
              </span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body-lg text-on-surface-variant">
                No hay productos disponibles.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product.code} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-24 flex flex-col items-center gap-8">
              <button
                className="px-12 py-4 border border-primary text-primary font-label-md text-label-md rounded-full hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              >
                Ver Más Tesoros
              </button>
              <div className="flex items-center gap-4 text-on-surface-variant">
                <button
                  className="p-2 hover:text-primary transition-colors disabled:opacity-30"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <span
                      key={p}
                      className={`font-label-md text-label-md px-2 cursor-pointer ${
                        p === page
                          ? "border-b-2 border-primary text-primary"
                          : "hover:text-primary"
                      }`}
                      onClick={() => setPage(p)}
                    >
                      {String(p).padStart(2, "0")}
                    </span>
                  ),
                )}
                <button
                  className="p-2 hover:text-primary transition-colors disabled:opacity-30"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
