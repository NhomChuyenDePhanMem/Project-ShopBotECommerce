import React from 'react';
import { useAsyncAction } from './hooks/useAsyncAction';
import { USER_TOKEN_KEY } from './lib/apiClient';
import {
  formatChatbotReplyForDisplay,
  sendChatMessage,
} from './services/chatbotService';
import {
  createUser,
  deleteUser,
  getMe,
  listRoles,
  listUsers,
  login,
  requireLoginAccessToken,
  type Role,
  type User,
} from './services/authService';
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  type CartView,
} from './services/cartService';
import {
  cancelOrder,
  completeOrder,
  confirmOrder,
  createOrder,
  listOrders,
  shipOrder,
  type Order,
} from './services/orderService';
import { createPayment, type PaymentMethod } from './services/paymentService';
import {
  listProductCategories,
  listProducts,
  type Product,
  type ProductCategory,
} from './services/productService';
import { CartPage } from './pages/CartPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import {
  parseRoleFromJwt,
  ROLE_LABEL_VI,
  type AppView,
  type UserRole,
  VIEW_LABEL_VI,
  VIEWS_BY_ROLE,
} from './types/navigation';

function App() {
  const { errorMessage, isBusy, runAsync } = useAsyncAction();

  const [accessToken, setAccessToken] = React.useState(
    () => localStorage.getItem(USER_TOKEN_KEY) ?? '',
  );
  const [loginForm, setLoginForm] = React.useState({ username: '', password: '' });
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<UserRole | null>(() =>
    parseRoleFromJwt(localStorage.getItem(USER_TOKEN_KEY) ?? ''),
  );

  const [activePage, setActivePage] = React.useState<AppView>('products');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<ProductCategory[]>([]);
  const [catalogFilters, setCatalogFilters] = React.useState({ q: '', category: '' });
  const [cart, setCart] = React.useState<CartView | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [newUserForm, setNewUserForm] = React.useState({
    username: '',
    password: '',
    fullName: '',
    roleId: '',
  });
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('cod');
  const [chatInput, setChatInput] = React.useState('');
  const [chatOutput, setChatOutput] = React.useState('');
  const [chatSessionId, setChatSessionId] = React.useState<string>();
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const quickQuestions = React.useMemo(
    () => [
      'Gợi ý laptop dưới 20 triệu',
      'So sánh iPhone và Samsung tầm trung',
      'Tư vấn tai nghe cho sinh viên',
    ],
    [],
  );

  const allowedViews = React.useMemo(() => (role ? VIEWS_BY_ROLE[role] : []), [role]);
  const customerUserId = currentUser ? String(currentUser.id) : '';

  const loadCatalog = React.useCallback(async () => {
    const [productRows, categoryRows] = await Promise.all([
      listProducts({
        q: catalogFilters.q || undefined,
        category: catalogFilters.category || undefined,
      }),
      listProductCategories(),
    ]);
    setProducts(productRows);
    setCategories(categoryRows);
  }, [catalogFilters.category, catalogFilters.q]);

  const loadCart = React.useCallback(async () => {
    if (!customerUserId) return;
    setCart(await getCart(customerUserId));
  }, [customerUserId]);

  const loadOrders = React.useCallback(async () => {
    if (!accessToken) return;
    setOrders(await listOrders(accessToken));
  }, [accessToken]);

  const loadAdminData = React.useCallback(async () => {
    if (!accessToken || role !== 'admin') return;
    const [userRows, roleRows] = await Promise.all([
      listUsers(accessToken),
      listRoles(accessToken),
    ]);
    setUsers(userRows);
    setRoles(roleRows);
  }, [accessToken, role]);

  React.useEffect(() => {
    if (!accessToken) return;
    runAsync(async () => {
      const me = await getMe(accessToken);
      setCurrentUser(me);
      const parsedRole = parseRoleFromJwt(accessToken);
      setRole(parsedRole);
      if (parsedRole) setActivePage(VIEWS_BY_ROLE[parsedRole][0]);
    });
  }, [accessToken, runAsync]);

  React.useEffect(() => {
    if (!accessToken) return;
    runAsync(async () => {
      await loadCatalog();
    });
  }, [accessToken, loadCatalog, runAsync]);

  React.useEffect(() => {
    if (!accessToken || !customerUserId) return;
    runAsync(async () => {
      await loadCart();
    });
  }, [accessToken, customerUserId, loadCart, runAsync]);

  React.useEffect(() => {
    if (!accessToken) return;
    runAsync(async () => {
      await loadOrders();
      await loadAdminData();
    });
  }, [accessToken, loadAdminData, loadOrders, runAsync]);

  React.useEffect(() => {
    if (allowedViews.length > 0 && !allowedViews.includes(activePage)) {
      setActivePage(allowedViews[0]);
    }
  }, [activePage, allowedViews]);

  const logout = () => {
    localStorage.removeItem(USER_TOKEN_KEY);
    setAccessToken('');
    setCurrentUser(null);
    setRole(null);
    setCart(null);
    setActivePage('products');
  };

  const placeOrder = async () => {
    if (!accessToken || !currentUser || !cart?.items.length) return;
    const createdOrder = await createOrder(
      {
        createdBy: currentUser.id,
        customerName: currentUser.fullName,
        orderType: 'shipping',
        items: cart.items.map((line) => ({
          productId: Number(line.productId),
          quantity: line.quantity,
        })),
      },
      accessToken,
    );

    await createPayment({
      orderId: createdOrder.id,
      paymentMethod,
      amount: createdOrder.total,
    });

    await clearCart(customerUserId);
    setCart(await getCart(customerUserId));
    setActivePage('orders');
    await loadOrders();
  };

  if (!accessToken) {
    return (
      <LoginPage
        username={loginForm.username}
        password={loginForm.password}
        busy={isBusy}
        errorMessage={errorMessage}
        onUsernameChange={(value) =>
          setLoginForm((prev) => ({ ...prev, username: value }))
        }
        onPasswordChange={(value) =>
          setLoginForm((prev) => ({ ...prev, password: value }))
        }
        onSubmit={() =>
          runAsync(async () => {
            const loginResponse = await login(loginForm.username, loginForm.password);
            const next = requireLoginAccessToken(loginResponse);
            localStorage.setItem(USER_TOKEN_KEY, next);
            setAccessToken(next);
            setRole(parseRoleFromJwt(next));
          })
        }
      />
    );
  }

  return (
    <main className="mx-auto min-h-dvh max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <header className="sb-card sb-card-pad mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="sb-heading-page">ShopBot Ecommerce</h1>
            <p className="mt-1 text-sm text-slate-600">
              Xin chào, <span className="font-medium text-slate-800">{currentUser?.username}</span>
              <span className="mx-1 text-slate-400">-</span>
              <span>{role ? ROLE_LABEL_VI[role] : 'Chưa xác định vai trò'}</span>
            </p>
          </div>
          <button type="button" className="sb-btn-secondary w-full sm:w-auto" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <nav className="-mx-1 mb-5 flex gap-2 overflow-x-auto pb-1 sm:mx-0 sm:flex-wrap">
        {allowedViews
          .filter((view) => !(role === 'customer' && view === 'chatbot'))
          .map((view) => (
          <button
            key={view}
            type="button"
            className={`sb-btn-tab ${activePage === view ? 'sb-btn-tab-active' : ''}`}
            onClick={() => setActivePage(view)}
          >
            {VIEW_LABEL_VI[view]}
          </button>
        ))}
      </nav>

      <section className="sb-card sb-card-pad mb-4 text-sm">
        <h3 className="font-semibold text-slate-900">Phân quyền truy cập rõ ràng theo vai trò</h3>
        <p className="mt-2 text-slate-700">
          Customer: xem sản phẩm, quản lý giỏ hàng, đặt hàng, theo dõi đơn, dùng chatbot.
        </p>
        <p className="text-slate-700">
          Seller: xem catalog, xử lý đơn hàng (xác nhận/giao), dùng chatbot.
        </p>
        <p className="text-slate-700">
          Admin: toàn bộ quyền của seller + quản trị users/hệ thống.
        </p>
        <p className="mt-2 text-slate-600">
          Hệ thống chỉ hiển thị đúng chức năng theo vai trò đang đăng nhập, giúp quản trị viên không
          chuyên CNTT vẫn dễ sử dụng và tránh thao tác nhầm.
        </p>
      </section>

      {errorMessage && (
        <p className="sb-alert-error mb-4" role="alert">
          {errorMessage}
        </p>
      )}

      {isBusy && (
        <p className="mb-4 flex items-center gap-2 text-sm text-slate-600" role="status">
          <span className="sb-spinner" aria-hidden />
          Đang xử lý...
        </p>
      )}

      {activePage === 'products' && (
        <ProductsPage
          products={products}
          categories={categories}
          keyword={catalogFilters.q}
          category={catalogFilters.category}
          busy={isBusy}
          onKeywordChange={(value) =>
            setCatalogFilters((prev) => ({ ...prev, q: value }))
          }
          onCategoryChange={(value) =>
            setCatalogFilters((prev) => ({ ...prev, category: value }))
          }
          onApplyFilter={() => runAsync(loadCatalog)}
          onAddToCart={(product) =>
            runAsync(async () => {
              if (role !== 'customer') return;
              await addCartItem(customerUserId, product.id, 1);
              await loadCart();
              setActivePage('cart');
            })
          }
        />
      )}

      {activePage === 'cart' && role === 'customer' && (
        <CartPage
          cart={cart}
          busy={isBusy}
          onRemoveItem={(productId) =>
            runAsync(async () => {
              await removeCartItem(customerUserId, productId);
              await loadCart();
            })
          }
          onClearCart={() =>
            runAsync(async () => {
              await clearCart(customerUserId);
              await loadCart();
            })
          }
          onCheckout={() => setActivePage('checkout')}
        />
      )}

      {activePage === 'checkout' && role === 'customer' && (
        <CheckoutPage
          cart={cart}
          paymentMethod={paymentMethod}
          busy={isBusy}
          onPaymentMethodChange={setPaymentMethod}
          onPlaceOrder={() => runAsync(placeOrder)}
        />
      )}

      {activePage === 'orders' && (
        <OrdersPage
          orders={orders}
          role={role}
          busy={isBusy}
          onConfirm={(orderId) =>
            runAsync(async () => {
              if (!accessToken) return;
              await confirmOrder(orderId, accessToken);
              await loadOrders();
            })
          }
          onShip={(orderId) =>
            runAsync(async () => {
              if (!accessToken) return;
              await shipOrder(orderId, accessToken);
              await loadOrders();
            })
          }
          onComplete={(orderId) =>
            runAsync(async () => {
              if (!accessToken) return;
              await completeOrder(orderId, accessToken);
              await loadOrders();
            })
          }
          onCancel={(orderId) =>
            runAsync(async () => {
              if (!accessToken) return;
              await cancelOrder(orderId, accessToken);
              await loadOrders();
            })
          }
        />
      )}

      {activePage === 'chatbot' && (
        <ChatbotPage
          input={chatInput}
          output={chatOutput}
          busy={isBusy}
          onInputChange={setChatInput}
          onSend={() =>
            runAsync(async () => {
              const reply = await sendChatMessage(chatInput, chatSessionId);
              setChatSessionId(reply.sessionId);
              setChatOutput(formatChatbotReplyForDisplay(reply));
            })
          }
        />
      )}

      {activePage === 'admin' && role === 'admin' && (
        <AdminUsersPage
          users={users}
          roles={roles}
          form={newUserForm}
          busy={isBusy}
          onFormChange={(key, value) =>
            setNewUserForm((prev) => ({ ...prev, [key]: value }))
          }
          onCreateUser={() =>
            runAsync(async () => {
              if (!accessToken || !newUserForm.roleId) return;
              await createUser(accessToken, {
                username: newUserForm.username,
                password: newUserForm.password,
                fullName: newUserForm.fullName,
                roleId: Number(newUserForm.roleId),
              });
              setNewUserForm({ username: '', password: '', fullName: '', roleId: '' });
              await loadAdminData();
            })
          }
          onDeleteUser={(id) =>
            runAsync(async () => {
              if (!accessToken) return;
              await deleteUser(accessToken, id);
              await loadAdminData();
            })
          }
        />
      )}

      {role === 'customer' && (
        <>
          <button
            type="button"
            className="sb-btn-primary fixed bottom-6 left-1/2 z-40 -translate-x-1/2 shadow-lg ring-4 ring-white/70"
            onClick={() => setIsChatOpen((prev) => !prev)}
          >
            {isChatOpen ? 'Ẩn chat hỗ trợ' : 'Cần hỗ trợ? Mở Chatbot'}
          </button>

          {isChatOpen && (
            <section className="fixed inset-0 z-50 grid place-items-center bg-black/25 p-4">
              <article className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">Chatbot hỗ trợ khách hàng</h3>
                  <button
                    type="button"
                    className="sb-btn-secondary sb-btn-sm"
                    onClick={() => setIsChatOpen(false)}
                  >
                    Đóng
                  </button>
                </div>

                <form
                  className="flex flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    runAsync(async () => {
                      const reply = await sendChatMessage(chatInput, chatSessionId);
                      setChatSessionId(reply.sessionId);
                      setChatOutput(formatChatbotReplyForDisplay(reply));
                    });
                  }}
                >
                  <input
                    className="sb-input min-h-11 flex-1"
                    placeholder="Ví dụ: gợi ý laptop dưới 20 triệu"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" className="sb-btn-primary w-full sm:w-auto" disabled={isBusy}>
                    Gửi
                  </button>
                </form>

                <div className="mt-3 flex flex-wrap gap-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
                      onClick={() => setChatInput(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {chatOutput && (
                  <pre className="mt-4 max-h-[40vh] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
                    {chatOutput}
                  </pre>
                )}
              </article>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default App;
