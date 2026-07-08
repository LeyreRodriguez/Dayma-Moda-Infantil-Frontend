export interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  size: string;
  material: string;
  imageUrl: string;
  isNew?: boolean;
  archived?: boolean;
  images?: string[];
  sizes?: { size: string; available: boolean }[];
  rating?: number;
  reviews?: number;
  collectionName?: string;
  id:string;
  stock: number;
  code:string;
}

export interface ProductFilters {
  categories?: string[];
  sizes?: string[];
  materials?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  collection?: string;
  name?: string;
  code?: string;
  archived?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  material: string;
  collection?: string;
  sizes?: { size: string; available: boolean }[];
  images?: string[];
  isNew?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber:number;
  totalElements: number;
  totalPages: number;
  pageSize: number;
}

