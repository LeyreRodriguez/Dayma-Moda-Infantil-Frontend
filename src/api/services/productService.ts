import { get, post, put, del, postFormData } from "../httpClient";
import type { Product, ProductFilters, PaginatedResponse, CreateProductRequest } from "../../types/product";
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
    if (filters?.name) params.set("name", filters.name);
    if (filters?.code) params.set("code", filters.code);
    if (filters?.archived !== undefined) params.set("archived", String(filters.archived));
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));
    const qs = params.toString();
    return get<PaginatedResponse<Product>>(`/products${qs ? `?${qs}` : ""}`);
  },

  search: (params?: { name?: string; code?: string }) => {
    const query = new URLSearchParams();
    if (params?.name) query.set("name", params.name);
    if (params?.code) query.set("code", params.code);
    query.set("limit", "200");
    const qs = query.toString();
    return get<PaginatedResponse<Product>>(`/products${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) => get<Product>(`/products/${id}`),
  getByCode: (code: string) => get<Product>(`/products/${code}`),
  getImageByProductCode: (code: string) => get<ProductImage[]>(`/products/images/${code}`),
  getSizeByProductCode: (code: string) => get<ProductSize[]>(`/products/sizes/${code}`),

  create: (product: CreateProductRequest) => post<Product>("/products", product),

  createWithImages: (formData: FormData) => postFormData<Product>("/products", formData),

  updateSizeStock: (productCode: string, sizeCode: string, stock: number) =>
    put<ProductSize>(`/products/${productCode}/sizes/${sizeCode}/stock`, { stock }),

  addSizeToProduct: (productCode: string, sizeCode: string, stock: number) =>
    post<ProductSize>(`/products/${productCode}/sizes`, { sizeCode, stock }),

  updateCollection: (productCode: string, collectionCode: string) =>
    put<Product>(`/products/${productCode}/collection`, { collectionCode }),

  removeFromCollection: (productCode: string) =>
    del(`/products/${productCode}/collection`),

  update: (productCode: string, isNew: boolean, archived: boolean) =>
    put<Product>(`/products/${productCode}`, { isNew, archived }),

};
