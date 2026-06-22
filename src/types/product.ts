export interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  size: string;
  material: string;
  imageUrl: string;
  isNew?: boolean;
  images?: string[];
  sizes?: { size: string; available: boolean }[];
  rating?: number;
  reviews?: number;
  collectionName?: string;
  id:string;
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
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber:number;
  totalElements: number;
  totalPages: number;
  pageSize: number;
}

