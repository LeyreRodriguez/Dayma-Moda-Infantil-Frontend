import { get } from "../httpClient";
import type { Product, ProductFilters, PaginatedResponse } from "../../types/product";
import type { ProductImage } from "../../types/productImage";
import type { ProductSize } from "../../types/productSize";

export const productService = {
  getAll: (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters?.categories?.length) params.set("categories", filters.categories.join(","));
    if (filters?.sizes?.length) params.set("sizes", filters.sizes.join(","));
    if (filters?.materials?.length) params.set("materials", filters.materials.join(","));
    if (filters?.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
    if (filters?.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
    if (filters?.sortBy) params.set("sortBy", filters.sortBy);
    if (filters?.collection) params.set("collection", filters.collection);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));
    const qs = params.toString();
    return get<PaginatedResponse<Product>>(`/products${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) => get<Product>(`/products/${id}`),
  getByCode: (code: string) => get<Product>(`/products/${code}`),
  getImageByProductCode: (code: string) => get<ProductImage[]>(`/products/images/${code}`),
  getSizeByProductCode: (code: string) => get<ProductSize[]>(`/products/sizes/${code}`),
};
