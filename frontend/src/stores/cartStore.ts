import { create } from 'zustand';

type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isCheckingOut: boolean;
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  checkout: () => Promise<void>;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCheckingOut: false,
  addItem: (product) => {
    const current = get().items;
    const existing = current.find((item) => item.productId === product.productId);
    if (existing) {
      set({
        items: current.map((item) =>
          item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      });
      return;
    }

    set({
      items: [...current, { ...product, quantity: 1 }],
    });
  },
  removeItem: (productId) => {
    set({
      items: get().items.filter((item) => item.productId !== productId),
    });
  },
  checkout: async () => {
    set({ isCheckingOut: true });
    // Optimistic: UI clears cart immediately, then simulates API.
    const snapshot = get().items;
    set({ items: [] });
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch {
      set({ items: snapshot });
    } finally {
      set({ isCheckingOut: false });
    }
  },
}));
