import type { ProductFilters } from "../../types/product";

interface FilterOption {
  label: string;
  code: string;
}

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories: FilterOption[];
  sizes: FilterOption[];
}

export default function FilterSidebar({ filters, onFiltersChange, categories, sizes }: FilterSidebarProps) {
  const toggleArray = (key: "categories" | "sizes" , value: string) => {
    const current = filters[key] ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: next });
  };

  return (
    <div className="sticky top-28 space-y-10">
      <h3 className="font-headline-md text-headline-md text-primary mb-6">Filtros</h3>

      <div className="mb-8">
        <p className="font-label-md text-label-md text-secondary uppercase mb-4 tracking-wider">Categoría</p>
        <ul className="space-y-3">
          {categories.map((cat) => (
            <li key={cat.code} className="flex items-center gap-3">
              <input
                className="rounded-sm border-outline text-primary focus:ring-primary-container"
                id={`cat-${cat.code}`}
                type="checkbox"
                checked={(filters.categories ?? []).includes(cat.code)}
                onChange={() => toggleArray("categories", cat.code)}
              />
              <label className="font-body-md text-body-md text-on-surface-variant" htmlFor={`cat-${cat.code}`}>
                {cat.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <p className="font-label-md text-label-md text-secondary uppercase mb-4 tracking-wider">Talla</p>
        <div className="grid grid-cols-2 gap-2">
          {sizes.map((size) => {
            const selected = (filters.sizes ?? []).includes(size.code);
            return (
              <button
                key={size.code}
                type="button"
                className={`px-3 py-2 text-center rounded-sm font-label-md text-label-md transition-colors ${
                  selected
                    ? "border border-primary bg-primary-container/10 text-primary"
                    : "border border-outline-variant hover:bg-surface-container-high"
                }`}
                onClick={() => toggleArray("sizes", size.code)}
              >
                {size.label}
              </button>
            );
          })}
        </div>
      </div>


      <div>
        <p className="font-label-md text-label-md text-secondary uppercase mb-4 tracking-wider">Rango de Precio</p>
        <div className="flex items-center gap-3">
          <input
            className="w-full border border-outline-variant rounded-sm px-3 py-2 font-body-md text-body-md bg-transparent"
            type="number"
            placeholder="Min"
            min={0}
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <span className="text-on-surface-variant">—</span>
          <input
            className="w-full border border-outline-variant rounded-sm px-3 py-2 font-body-md text-body-md bg-transparent"
            type="number"
            placeholder="Max"
            min={0}
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
