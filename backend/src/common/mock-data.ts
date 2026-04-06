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
};

export type Category = {
  id: string;
  name: string;
  parentId: string | null;
};

export type Order = {
  id: string;
  orderCode: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'packing' | 'shipping' | 'done' | 'cancelled';
  total: number;
  createdAt: string;
};

export type Payment = {
  id: string;
  orderId: string;
  provider: 'cod' | 'vnpay' | 'stripe' | 'momo';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  amount: number;
  paidAt: string | null;
};

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  type: 'order' | 'promotion' | 'system';
  channel: 'email' | 'push';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

export type ChatSession = {
  id: string;
  userId: string;
  startedAt: string;
};

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  estimatedTokens: number;
  sentAt: string;
};

export const CHAT_CONTEXT_WINDOW = 8;
export const CHAT_TOKEN_LIMIT = 1200;

export const mockCategories: Category[] = [
  { id: 'c1', name: 'Phone', parentId: null },
  { id: 'c2', name: 'Laptop', parentId: null },
  { id: 'c3', name: 'Accessory', parentId: null },
  { id: 'c4', name: 'Gaming Laptop', parentId: 'c2' },
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'iPhone 15 128GB',
    brand: 'Apple',
    categoryId: 'c1',
    sellerId: 's1',
    price: 18990000,
    rating: 4.8,
    stockQty: 22,
    description: 'Camera on dinh, hieu nang manh, phu hop da so nguoi dung.',
  },
  {
    id: 'p2',
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    categoryId: 'c1',
    sellerId: 's1',
    price: 17990000,
    rating: 4.7,
    stockQty: 18,
    description: 'Man hinh dep, pin tot, trai nghiem Android cao cap.',
  },
  {
    id: 'p3',
    name: 'MacBook Air M3 13"',
    brand: 'Apple',
    categoryId: 'c2',
    sellerId: 's2',
    price: 26990000,
    rating: 4.9,
    stockQty: 12,
    description: 'Nhe, pin lau, phu hop hoc tap va cong viec van phong.',
  },
  {
    id: 'p4',
    name: 'Asus ROG Zephyrus G14',
    brand: 'Asus',
    categoryId: 'c4',
    sellerId: 's2',
    price: 32990000,
    rating: 4.6,
    stockQty: 7,
    description: 'Laptop hieu nang cao cho gaming va cong viec sang tao.',
  },
  {
    id: 'p5',
    name: 'AirPods Pro 2',
    brand: 'Apple',
    categoryId: 'c3',
    sellerId: 's1',
    price: 5390000,
    rating: 4.8,
    stockQty: 35,
    description: 'Chong on chu dong, ket noi nhanh, am thanh can bang.',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'o1',
    orderCode: '#SP260001',
    userId: 'u1',
    status: 'shipping',
    total: 24380000,
    createdAt: new Date().toISOString(),
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'pay1',
    orderId: 'o1',
    provider: 'cod',
    status: 'pending',
    amount: 24380000,
    paidAt: null,
  },
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    productId: 'p1',
    rating: 5,
    comment: 'May muot, camera dep, pin on dinh.',
    createdAt: new Date().toISOString(),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    type: 'order',
    channel: 'push',
    title: 'Don hang dang giao',
    body: 'Don #SP260001 dang tren duong giao den ban.',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

export const mockChatSessions: ChatSession[] = [
  {
    id: 'cs1',
    userId: 'u1',
    startedAt: new Date().toISOString(),
  },
];

export const mockChatMessages: ChatMessage[] = [];
