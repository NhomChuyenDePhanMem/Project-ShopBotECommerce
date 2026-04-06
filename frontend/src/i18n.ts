export type Locale = 'vi' | 'en';

const dict = {
  vi: {
    brand: 'ShopBot',
    heroTitle: 'Nen tang TMDT duoc tro luc boi AI',
    heroDesc:
      'Tim san pham nhanh hon voi chatbot, theo doi don hang va nhan khuyen mai theo thoi gian thuc.',
    addToCart: 'Them gio',
    checkout: 'Thanh toan',
    chatbotHint: 'Hoi bot: laptop duoi 20tr',
    loading: 'Dang tai san pham...',
  },
  en: {
    brand: 'ShopBot',
    heroTitle: 'AI-Powered Commerce Platform',
    heroDesc:
      'Find products faster with chatbot, track orders, and get real-time promotions.',
    addToCart: 'Add to cart',
    checkout: 'Checkout',
    chatbotHint: 'Ask: laptop under 20m VND',
    loading: 'Loading products...',
  },
};

export const t = (locale: Locale, key: keyof (typeof dict)['vi']) => dict[locale][key];
