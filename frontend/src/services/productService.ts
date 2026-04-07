import { api } from '../lib/apiClient';

export type Product = {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  sellerId: string;
  price: number;
  rating: number;
  stockQty: number;
  description: string;
  isAvailable: boolean;
};

export type ProductCategory = {
  id: string;
  name: string;
  parentId: string | null;
};

export function listProductCategories() {
  return api<ProductCategory[]>('/products/categories');
}

export function listProducts(params?: {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.q) query.set('q', params.q);
  if (params?.minPrice !== undefined) query.set('minPrice', String(params.minPrice));
  if (params?.maxPrice !== undefined) query.set('maxPrice', String(params.maxPrice));
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return api<Product[]>(`/products${suffix}`);
}
