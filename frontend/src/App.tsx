import React from 'react';
import './App.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { t } from './i18n';
import type { Locale } from './i18n';
import { useCartStore } from './stores/cartStore';

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  stockQty: number;
  description: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

function App() {
  const [locale, setLocale] = React.useState<Locale>('vi');
  const [chatOpen, setChatOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = React.useState(true);
  const [messages, setMessages] = React.useState([
    { role: 'bot', text: 'Xin chao! Toi la tro ly AI cua ShopBot. Ban quan tam san pham nao?' },
  ]);
  const [input, setInput] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [sessionId, setSessionId] = React.useState<string | undefined>(undefined);
  const [checkoutNote, setCheckoutNote] = React.useState('');

  const { items, addItem, removeItem, checkout, isCheckingOut } = useCartStore();
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_BASE}/products`);
        const data = await response.json();
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    void loadProducts();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;
    setMessages(prev => [...prev, { role: 'user', text: content }]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE}/chatbot/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content, sessionId }),
      });

      const data = await response.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: data.text ?? 'Bot tam thoi chua phan hoi.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Khong ket noi duoc API chatbot. Hay kiem tra backend.' },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutNote('Dang xu ly don hang...');
    await checkout();
    setCheckoutNote('Dat hang thanh cong (optimistic checkout).');
    setTimeout(() => setCheckoutNote(''), 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      {/* Navbar */}
      <nav className="fixed w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {t(locale, 'brand')}
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-blue-600 transition-colors">Trang chủ</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Sản phẩm</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Dành cho Nhà bán</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Về chúng tôi</a>
          </div>
          <div className="flex space-x-2 items-center">
            <button
              onClick={() => setLocale((prev) => (prev === 'vi' ? 'en' : 'vi'))}
              className="rounded-full border border-slate-300 px-3 py-1 text-sm"
            >
              {locale.toUpperCase()}
            </button>
            <button className="text-sm font-medium hover:text-blue-600 transition-colors">
              Gio hang ({items.length})
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 z-10 leading-tight">
          {t(locale, 'heroTitle')}
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-slate-600 mb-10 z-10">{t(locale, 'heroDesc')}</p>
        <div className="flex space-x-4 z-10">
          <button className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">Khám phá ngay</button>
          <button className="px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 hover:scale-105 transition-all">Dành cho Vendor</button>
        </div>
      </section>

      {/* Product Highlight Fake Section */}
      <ErrorBoundary>
        <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center">Sản phẩm nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {loadingProducts && <p className="text-slate-500">{t(locale, 'loading')}</p>}
            {!loadingProducts && products.slice(0, 4).map((product) => (
              <div key={product.id} className="group flex flex-col bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="h-48 bg-slate-200 flex items-center justify-center relative overflow-hidden">
                  <span className="text-slate-500 text-sm px-3 text-center">{product.brand}</span>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description}</p>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-lg font-extrabold text-blue-600">{product.price.toLocaleString('vi-VN')}đ</span>
                    <button
                      onClick={() =>
                        addItem({ productId: product.id, name: product.name, price: product.price })
                      }
                      className="text-sm font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-colors"
                    >
                      {t(locale, 'addToCart')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </section>
      </ErrorBoundary>

      <ErrorBoundary>
        <section className="mx-auto max-w-7xl px-6 pb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-lg font-bold">Cart</h3>
            <p className="text-sm text-slate-500">Tong: {cartTotal.toLocaleString('vi-VN')}đ</p>
            <div className="mt-3 space-y-2">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <button onClick={() => removeItem(item.productId)} className="text-red-600">
                    Xoa
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || items.length === 0}
              className="mt-4 rounded-full bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {isCheckingOut ? '...' : t(locale, 'checkout')}
            </button>
            {checkoutNote && <p className="mt-2 text-sm text-emerald-600">{checkoutNote}</p>}
          </div>
        </section>
      </ErrorBoundary>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {chatOpen && (
          <ErrorBoundary>
          <div className="mb-4 w-80 sm:w-96 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden flex flex-col transform transition-all duration-300 origin-bottom-right">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-sm">🤖</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm">SShop AI Assistant</h3>
                  <p className="text-xs text-blue-100">Đang hoạt động</p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            
            {/* Body */}
            <div className="p-4 h-80 overflow-y-auto bg-slate-50/50 flex flex-col space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t(locale, 'chatbotHint')}
                  className="w-full bg-slate-100 text-sm border-none rounded-full px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <button type="submit" disabled={isSending} className="absolute right-2 w-8 h-8 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors disabled:opacity-60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </div>
          </div>
          </ErrorBoundary>
        )}

        {/* Fab Button */}
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 ${chatOpen ? 'bg-slate-800 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'}`}
        >
          {chatOpen ? '✕' : <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>}
        </button>
      </div>

    </div>
  );
}

export default App;
