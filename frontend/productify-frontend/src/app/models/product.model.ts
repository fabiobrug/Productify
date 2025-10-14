export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  description?: string;
}

export interface ProductFilter {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'id';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filter: ProductFilter;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
