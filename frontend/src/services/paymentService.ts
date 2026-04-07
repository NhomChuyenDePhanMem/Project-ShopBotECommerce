import { api } from '../lib/apiClient';

export type PaymentMethod = 'cod' | 'vnpay' | 'momo' | 'stripe';

export function createPayment(payload: {
  orderId: number;
  paymentMethod: PaymentMethod;
  amount: number;
}) {
  return api<{ id: number }>('/payments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
