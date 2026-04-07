import { api } from '../lib/apiClient';

export type CartView = {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    productName: string;
    unitPrice: number;
    lineTotal: number;
  }>;
  total: number;
};

export function getCart(userId: string) {
  return api<CartView>(`/cart/${userId}`);
}

export function addCartItem(userId: string, productId: string, quantity: number) {
  return api<CartView>(`/cart/${userId}/items`, {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(userId: string, productId: string, quantity: number) {
  return api<CartView>(`/cart/${userId}/items/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(userId: string, productId: string) {
  return api<CartView>(`/cart/${userId}/items/${productId}`, { method: 'DELETE' });
}

export function clearCart(userId: string) {
  return api<CartView>(`/cart/${userId}`, { method: 'DELETE' });
}
