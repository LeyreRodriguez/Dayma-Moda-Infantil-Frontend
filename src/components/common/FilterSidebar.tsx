import { Select, Slider } from "antd";
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
    <div className="sticky top-28 max-md:static space-y-10">
      <h3 className="font-headline-md text-headline-md text-primary mb-6">Filtros</h3>

      <div className="mb-8">
        <p className="font-label-md text-label-md text-secondary uppercase mb-4 tracking-wider">Categoría</p>
        <Select
          mode="multiple"
          className="w-full"
          placeholder="Seleccionar categorías"
          value={filters.categories ?? []}
          onChange={(val) => onFiltersChange({ ...filters, categories: val })}
          options={categories.map((cat) => ({ label: cat.label, value: cat.code }))}
        />
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
                className={`px-3 py-4 text-center rounded-sm font-label-md text-label-md transition-colors ${
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
        <Slider
          range
          min={0}
          max={200}
          step={5}
          defaultValue={[0, 200]}
          onAfterChange={([min, max]) =>
            onFiltersChange({
              ...filters,
              minPrice: min > 0 ? min : undefined,
              maxPrice: max < 200 ? max : undefined,
            })
          }
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-on-surface-variant">
          <span>{filters.minPrice ? `${filters.minPrice}€` : "0€"}</span>
          <span>{filters.maxPrice ? `${filters.maxPrice}€` : "200€"}</span>
        </div>
      </div>

      {(filters.categories?.length || filters.sizes?.length || filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.collection) && (
        <button
          onClick={() => onFiltersChange({})}
          className="w-full py-4 border border-outline-variant text-on-surface-variant font-label-md hover:border-primary hover:text-primary transition-colors"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
