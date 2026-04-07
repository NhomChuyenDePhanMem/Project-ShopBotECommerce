export type AppView =
  | 'products'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'chatbot'
  | 'admin';

export type UserRole = 'admin' | 'seller' | 'customer';

const ROLES: UserRole[] = ['admin', 'seller', 'customer'];

function isUserRole(value: string): value is UserRole {
  return (ROLES as string[]).includes(value);
}

/** Role trong JWT chỉ để chọn tab; quyền thật do API kiểm tra. */
export function parseRoleFromJwt(accessToken: string): UserRole | null {
  try {
    const payloadSegment = accessToken.split('.')[1];
    if (!payloadSegment) return null;
    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(normalized)) as { role?: string };
    if (payload.role && isUserRole(payload.role)) return payload.role;
    return null;
  } catch {
    return null;
  }
}

export const ROLE_LABEL_VI: Record<UserRole, string> = {
  admin: 'Quản trị',
  seller: 'Người bán',
  customer: 'Khách hàng',
};

export const VIEWS_BY_ROLE: Record<UserRole, AppView[]> = {
  admin: ['products', 'orders', 'chatbot', 'admin'],
  seller: ['products', 'orders', 'chatbot'],
  customer: ['products', 'cart', 'checkout', 'orders', 'chatbot'],
};

export const VIEW_LABEL_VI: Record<AppView, string> = {
  products: 'Sản phẩm',
  cart: 'Giỏ hàng',
  checkout: 'Đặt hàng',
  orders: 'Đơn hàng',
  chatbot: 'Chatbot',
  admin: 'Quản trị user',
};
