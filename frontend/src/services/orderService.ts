import { api } from '../lib/apiClient';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packing'
  | 'shipping'
  | 'done'
  | 'cancelled';
export type Order = {
  id: number;
  customerName: string | null;
  orderType: string;
  status: OrderStatus;
  orderedAt: string;
  items: Array<{
    id: number;
    productName: string | null;
    quantity: number;
    lineTotal: number;
  }>;
  total: number;
  payment?: { id: number; method: 'cod' | 'vnpay' | 'momo' | 'stripe' } | null;
};

export function listOrders(token: string) {
  return api<Order[]>('/orders', undefined, token);
}

export function createOrder(payload: {
  createdBy: number;
  customerName?: string;
  orderType: string;
  items: Array<{ productId: number; quantity: number }>;
}, token: string) {
  return api<Order>('/orders', { method: 'POST', body: JSON.stringify(payload) }, token);
}

export function updateOrderStatus(orderId: number, status: OrderStatus, token: string) {
  return api(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, token);
}

export function confirmOrder(orderId: number, token: string) {
  return api(`/orders/${orderId}/seller/confirm`, { method: 'PATCH' }, token);
}

export function shipOrder(orderId: number, token: string) {
  return api(`/orders/${orderId}/seller/ship`, { method: 'PATCH' }, token);
}

export function completeOrder(orderId: number, token: string) {
  return api(`/orders/${orderId}/customer/complete`, { method: 'PATCH' }, token);
}

export function cancelOrder(orderId: number, token: string) {
  return api(`/orders/${orderId}/customer/cancel`, { method: 'PATCH' }, token);
}
