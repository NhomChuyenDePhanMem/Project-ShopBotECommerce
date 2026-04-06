import React from 'react';
import './App.css';

type Category = { id: number; name: string };
type MenuItem = {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: string;
  isAvailable: boolean;
};
type OrderStatus = 'pending' | 'processing' | 'served' | 'paid' | 'cancelled';
type Order = {
  id: number;
  tableId: number | null;
  tableCode: string | null;
  customerName: string | null;
  orderType: string;
  status: OrderStatus;
  orderedAt: string;
  items: Array<{ id: number; menuItemName: string | null; quantity: number; lineTotal: number }>;
  total: number;
  payment?: { id: number; method: 'cash' | 'card' | 'transfer' | 'e_wallet' } | null;
};
type DiningTableStatus = 'available' | 'occupied' | 'reserved';
type DiningTable = { id: number; tableCode: string; capacity: number; status: DiningTableStatus };
type ReservationStatus = 'booked' | 'checked_in' | 'completed' | 'cancelled' | 'no_show';
type Reservation = {
  id: number;
  tableId: number;
  customerName: string;
  customerPhone: string;
  reservedTime: string;
  partySize: number;
  status: ReservationStatus;
};
type User = { id: number; username: string; fullName: string; roleId: number; roleName: string };
type Role = { id: number; name: string };

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';
const USER_TOKEN_KEY = 'shopbot-admin-token';

type View = 'menu' | 'cashier' | 'kitchen' | 'tables' | 'users';
type PaymentMethod = 'cash' | 'card' | 'transfer' | 'e_wallet';

async function api<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('Content-Type') && init?.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function App() {
  const [activeView, setActiveView] = React.useState<View>('menu');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [newCategory, setNewCategory] = React.useState('');
  const [newItem, setNewItem] = React.useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    isAvailable: true,
  });
  const [cashierDraft, setCashierDraft] = React.useState<Array<{ menuItemId: number; quantity: number }>>([]);
  const [cashierForm, setCashierForm] = React.useState({
    createdBy: '1',
    customerName: '',
    orderType: 'dine_in',
    tableId: '',
    paymentMethod: 'cash',
  });

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [tables, setTables] = React.useState<DiningTable[]>([]);
  const [reservations, setReservations] = React.useState<Reservation[]>([]);
  const [newReservation, setNewReservation] = React.useState({
    tableId: '',
    customerName: '',
    customerPhone: '',
    reservedTime: '',
    partySize: '',
  });

  const [token, setToken] = React.useState(localStorage.getItem(USER_TOKEN_KEY) ?? '');
  const [users, setUsers] = React.useState<User[]>([]);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loginForm, setLoginForm] = React.useState({ username: '', password: '' });
  const [newUser, setNewUser] = React.useState({
    username: '',
    password: '',
    fullName: '',
    roleId: '',
  });

  const ordersByStatus = React.useMemo(() => {
    return {
      pending: orders.filter((o) => o.status === 'pending'),
      processing: orders.filter((o) => o.status === 'processing'),
      served: orders.filter((o) => o.status === 'served'),
      paid: orders.filter((o) => o.status === 'paid'),
      cancelled: orders.filter((o) => o.status === 'cancelled'),
    };
  }, [orders]);

  const loadMenu = React.useCallback(async () => {
    const [cats, items] = await Promise.all([
      api<Category[]>('/menu/categories'),
      api<MenuItem[]>('/menu/menu-items'),
    ]);
    setCategories(cats);
    setMenuItems(items);
  }, []);

  const loadKitchen = React.useCallback(async () => {
    const rows = await api<Order[]>('/orders');
    setOrders(rows);
  }, []);

  const loadTableData = React.useCallback(async () => {
    const [tableRows, reservationRows] = await Promise.all([
      api<DiningTable[]>('/dining-tables'),
      api<Reservation[]>('/reservations'),
    ]);
    setTables(tableRows);
    setReservations(reservationRows);
  }, []);

  const loadCashier = React.useCallback(async () => {
    const [items, orderRows, tableRows] = await Promise.all([
      api<MenuItem[]>('/menu/menu-items?isAvailable=true'),
      api<Order[]>('/orders'),
      api<DiningTable[]>('/dining-tables'),
    ]);
    setMenuItems(items);
    setOrders(orderRows);
    setTables(tableRows);
  }, []);

  const loadUsers = React.useCallback(async () => {
    if (!token) return;
    const [userRows, roleRows] = await Promise.all([
      api<User[]>('/users', undefined, token),
      api<Role[]>('/users/roles', undefined, token),
    ]);
    setUsers(userRows);
    setRoles(roleRows);
  }, [token]);

  React.useEffect(() => {
    setBusy(true);
    setError('');
    const loader =
      activeView === 'menu'
        ? loadMenu()
        : activeView === 'cashier'
          ? loadCashier()
        : activeView === 'kitchen'
          ? loadKitchen()
          : activeView === 'tables'
            ? loadTableData()
            : loadUsers();
    loader.catch((e: unknown) => setError(e instanceof Error ? e.message : 'Load data failed')).finally(() => setBusy(false));
  }, [activeView, loadCashier, loadKitchen, loadMenu, loadTableData, loadUsers]);

  const cashierTotal = React.useMemo(() => {
    const priceMap = new Map(menuItems.map((item) => [item.id, Number(item.price)]));
    return cashierDraft.reduce((sum, item) => sum + (priceMap.get(item.menuItemId) ?? 0) * item.quantity, 0);
  }, [cashierDraft, menuItems]);

  const runAction = async (work: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await work();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-gradient-to-br from-slate-50 via-indigo-50/40 to-sky-50/40 px-4 py-6 md:px-8">
      <header className="mb-5 rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-md backdrop-blur">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">ShopBot Restaurant Operation Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">
          Màn hình quản lý menu/danh mục, bếp theo trạng thái đơn, bàn/đặt bàn và người dùng.
        </p>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2">
        {[
          ['menu', 'Menu & Danh mục'],
          ['cashier', 'Thu ngân'],
          ['kitchen', 'Màn hình bếp'],
          ['tables', 'Bàn & Đặt bàn'],
          ['users', 'Người dùng'],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`rounded-lg border px-3 py-2 text-sm transition ${activeView === key ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}
            onClick={() => setActiveView(key as View)}
          >
            {label}
          </button>
        ))}
      </nav>

      {error && <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {busy && <p className="mb-4 text-sm text-slate-500">Đang xử lý...</p>}

      {activeView === 'menu' && (
        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Danh mục món</h2>
            <form
              className="mb-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCategory.trim()) return;
                void runAction(async () => {
                  await api('/menu/categories', {
                    method: 'POST',
                    body: JSON.stringify({ name: newCategory }),
                  });
                  setNewCategory('');
                  await loadMenu();
                });
              }}
            >
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Tên danh mục" className="w-full rounded border px-3 py-2 text-sm" />
              <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">Thêm</button>
            </form>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                  <span>{c.name}</span>
                  <button
                    className="text-red-600"
                    onClick={() =>
                      void runAction(async () => {
                        await api(`/menu/categories/${c.id}`, { method: 'DELETE' });
                        await loadMenu();
                      })
                    }
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Menu items</h2>
            <form
              className="mb-3 grid gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void runAction(async () => {
                  await api('/menu/menu-items', {
                    method: 'POST',
                    body: JSON.stringify({
                      categoryId: Number(newItem.categoryId),
                      name: newItem.name,
                      description: newItem.description || undefined,
                      price: Number(newItem.price),
                      isAvailable: newItem.isAvailable,
                    }),
                  });
                  setNewItem({ categoryId: '', name: '', description: '', price: '', isAvailable: true });
                  await loadMenu();
                });
              }}
            >
              <select className="rounded border px-3 py-2 text-sm" value={newItem.categoryId} onChange={(e) => setNewItem((prev) => ({ ...prev, categoryId: e.target.value }))}>
                <option value="">Chọn danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input className="rounded border px-3 py-2 text-sm" placeholder="Tên món" value={newItem.name} onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" placeholder="Giá" value={newItem.price} onChange={(e) => setNewItem((prev) => ({ ...prev, price: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" placeholder="Mô tả (tùy chọn)" value={newItem.description} onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))} />
              <label className="text-sm">
                <input className="mr-2" type="checkbox" checked={newItem.isAvailable} onChange={(e) => setNewItem((prev) => ({ ...prev, isAvailable: e.target.checked }))} />
                Đang phục vụ
              </label>
              <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">Thêm món</button>
            </form>
            <div className="max-h-96 space-y-2 overflow-auto">
              {menuItems.map((item) => (
                <div key={item.id} className="rounded border px-3 py-2 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-slate-600">{Number(item.price).toLocaleString('vi-VN')} VND</p>
                  <button
                    className="mt-1 text-red-600"
                    onClick={() =>
                      void runAction(async () => {
                        await api(`/menu/menu-items/${item.id}`, { method: 'DELETE' });
                        await loadMenu();
                      })
                    }
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </article>
        </section>
      )}

      {activeView === 'cashier' && (
        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Tạo đơn và chọn món</h2>
            <form
              className="grid gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (cashierDraft.length === 0) return;
                void runAction(async () => {
                  await api('/orders', {
                    method: 'POST',
                    body: JSON.stringify({
                      createdBy: Number(cashierForm.createdBy),
                      customerName: cashierForm.customerName || undefined,
                      orderType: cashierForm.orderType,
                      tableId:
                        cashierForm.orderType === 'dine_in'
                          ? Number(cashierForm.tableId)
                          : undefined,
                      items: cashierDraft,
                    }),
                  });
                  setCashierDraft([]);
                  setCashierForm((prev) => ({ ...prev, customerName: '', tableId: '' }));
                  await loadCashier();
                });
              }}
            >
              <input
                className="rounded border px-3 py-2 text-sm"
                placeholder="createdBy user id"
                type="number"
                min={1}
                value={cashierForm.createdBy}
                onChange={(e) =>
                  setCashierForm((prev) => ({ ...prev, createdBy: e.target.value }))
                }
              />
              <select
                className="rounded border px-3 py-2 text-sm"
                value={cashierForm.orderType}
                onChange={(e) =>
                  setCashierForm((prev) => ({
                    ...prev,
                    orderType: e.target.value,
                    tableId: e.target.value === 'dine_in' ? prev.tableId : '',
                  }))
                }
              >
                <option value="dine_in">dine_in</option>
                <option value="takeaway">takeaway</option>
                <option value="delivery">delivery</option>
              </select>
              {cashierForm.orderType === 'dine_in' && (
                <select
                  className="rounded border px-3 py-2 text-sm"
                  value={cashierForm.tableId}
                  onChange={(e) =>
                    setCashierForm((prev) => ({ ...prev, tableId: e.target.value }))
                  }
                >
                  <option value="">Chọn bàn</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.tableCode} ({table.status})
                    </option>
                  ))}
                </select>
              )}
              <input
                className="rounded border px-3 py-2 text-sm"
                placeholder="Tên khách (tùy chọn)"
                value={cashierForm.customerName}
                onChange={(e) =>
                  setCashierForm((prev) => ({ ...prev, customerName: e.target.value }))
                }
              />
              <div className="rounded border p-2">
                <p className="mb-2 text-sm font-medium">Thêm món vào đơn</p>
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
                      <span>
                        {item.name} - {Number(item.price).toLocaleString('vi-VN')} VND
                      </span>
                      <button
                        type="button"
                        className="rounded border px-2 py-1 text-xs"
                        onClick={() =>
                          setCashierDraft((prev) => {
                            const existing = prev.find(
                              (draft) => draft.menuItemId === item.id,
                            );
                            if (existing) {
                              return prev.map((draft) =>
                                draft.menuItemId === item.id
                                  ? { ...draft, quantity: draft.quantity + 1 }
                                  : draft,
                              );
                            }
                            return [...prev, { menuItemId: item.id, quantity: 1 }];
                          })
                        }
                      >
                        +1
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded border p-2 text-sm">
                <p className="font-medium">Đơn tạm</p>
                {cashierDraft.length === 0 && <p className="text-slate-500">Chưa có món.</p>}
                {cashierDraft.map((item) => {
                  const menu = menuItems.find((x) => x.id === item.menuItemId);
                  return (
                    <div key={item.menuItemId} className="mt-1 flex items-center justify-between">
                      <span>
                        {menu?.name ?? `Mon #${item.menuItemId}`} x {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="text-red-600"
                        onClick={() =>
                          setCashierDraft((prev) =>
                            prev.filter((draft) => draft.menuItemId !== item.menuItemId),
                          )
                        }
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })}
                <p className="mt-2 font-semibold">
                  Tổng tạm tính: {cashierTotal.toLocaleString('vi-VN')} VND
                </p>
              </div>
              <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
                Tạo đơn
              </button>
            </form>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Thanh toán và trạng thái bàn</h2>
            <div className="mb-4 space-y-2">
              <p className="text-sm font-medium">Đơn chưa thanh toán</p>
              {orders
                .filter((order) => order.status !== 'paid' && order.status !== 'cancelled')
                .map((order) => (
                  <div key={order.id} className="rounded border p-2 text-sm">
                    <p className="font-medium">Đơn #{order.id}</p>
                    <p className="text-slate-600">
                      {order.tableCode ?? order.orderType} - {order.total.toLocaleString('vi-VN')} VND
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <select
                        className="rounded border px-2 py-1 text-xs"
                        value={cashierForm.paymentMethod}
                        onChange={(e) =>
                          setCashierForm((prev) => ({
                            ...prev,
                            paymentMethod: e.target.value,
                          }))
                        }
                      >
                        {(['cash', 'card', 'transfer', 'e_wallet'] as PaymentMethod[]).map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                      <button
                        className="rounded bg-emerald-600 px-2 py-1 text-xs text-white"
                        onClick={() =>
                          void runAction(async () => {
                            await api('/payments', {
                              method: 'POST',
                              body: JSON.stringify({
                                orderId: order.id,
                                paymentMethod: cashierForm.paymentMethod,
                                amount: order.total,
                              }),
                            });
                            await loadCashier();
                          })
                        }
                      >
                        Thanh toan
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Trạng thái bàn</p>
              {tables.map((table) => (
                <div key={table.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                  <span>{table.tableCode}</span>
                  <span>{table.status}</span>
                </div>
              ))}
            </div>
          </article>
        </section>
      )}

      {activeView === 'kitchen' && (
        <section className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(ordersByStatus) as OrderStatus[]).map((status) => (
            <article key={status} className="rounded-xl border bg-white p-3">
              <h2 className="mb-2 text-sm font-semibold uppercase">{status}</h2>
              <div className="space-y-2">
                {ordersByStatus[status].map((order) => (
                  <div key={order.id} className="rounded border p-2 text-sm">
                    <p className="font-medium">Đơn #{order.id}</p>
                    <p className="text-slate-600">{order.tableCode ?? order.orderType}</p>
                    <p className="text-slate-600">{order.total.toLocaleString('vi-VN')} VND</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(['processing', 'served', 'paid', 'cancelled'] as OrderStatus[]).map((next) => (
                        <button
                          key={next}
                          className="rounded border px-2 py-1 text-xs"
                          onClick={() =>
                            void runAction(async () => {
                              await api(`/orders/${order.id}/status`, {
                                method: 'PATCH',
                                body: JSON.stringify({ status: next }),
                              });
                              await loadKitchen();
                            })
                          }
                        >
                          {next}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {ordersByStatus[status].length === 0 && <p className="text-xs text-slate-500">Không có đơn.</p>}
              </div>
            </article>
          ))}
        </section>
      )}

      {activeView === 'tables' && (
        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Danh sách bàn</h2>
            <div className="space-y-2">
              {tables.map((table) => (
                <div key={table.id} className="rounded border px-3 py-2 text-sm">
                  <p className="font-medium">{table.tableCode} - {table.capacity} cho</p>
                  <p className="mb-2 text-slate-600">Trạng thái: {table.status}</p>
                  <div className="flex flex-wrap gap-1">
                    {(['available', 'reserved', 'occupied'] as DiningTableStatus[]).map((next) => (
                      <button
                        key={next}
                        className="rounded border px-2 py-1 text-xs"
                        onClick={() =>
                          void runAction(async () => {
                            await api(`/dining-tables/${table.id}/status`, {
                              method: 'PATCH',
                              body: JSON.stringify({ status: next }),
                            });
                            await loadTableData();
                          })
                        }
                      >
                        {next}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Đặt bàn</h2>
            <form
              className="mb-4 grid gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void runAction(async () => {
                  await api('/reservations', {
                    method: 'POST',
                    body: JSON.stringify({
                      tableId: Number(newReservation.tableId),
                      customerName: newReservation.customerName,
                      customerPhone: newReservation.customerPhone,
                      reservedTime: newReservation.reservedTime,
                      partySize: Number(newReservation.partySize),
                    }),
                  });
                  setNewReservation({
                    tableId: '',
                    customerName: '',
                    customerPhone: '',
                    reservedTime: '',
                    partySize: '',
                  });
                  await loadTableData();
                });
              }}
            >
              <select className="rounded border px-3 py-2 text-sm" value={newReservation.tableId} onChange={(e) => setNewReservation((p) => ({ ...p, tableId: e.target.value }))}>
                <option value="">Chọn bàn</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>{t.tableCode}</option>
                ))}
              </select>
              <input className="rounded border px-3 py-2 text-sm" placeholder="Tên khách" value={newReservation.customerName} onChange={(e) => setNewReservation((p) => ({ ...p, customerName: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" placeholder="Số điện thoại" value={newReservation.customerPhone} onChange={(e) => setNewReservation((p) => ({ ...p, customerPhone: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" type="datetime-local" value={newReservation.reservedTime} onChange={(e) => setNewReservation((p) => ({ ...p, reservedTime: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" placeholder="Số người" value={newReservation.partySize} onChange={(e) => setNewReservation((p) => ({ ...p, partySize: e.target.value }))} />
              <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">Tạo đặt bàn</button>
            </form>
            <div className="max-h-72 space-y-2 overflow-auto">
              {reservations.map((r) => (
                <div key={r.id} className="rounded border p-2 text-sm">
                  <p className="font-medium">#{r.id} - {r.customerName}</p>
                  <p className="text-slate-600">{new Date(r.reservedTime).toLocaleString('vi-VN')}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(['booked', 'checked_in', 'completed', 'cancelled', 'no_show'] as ReservationStatus[]).map((status) => (
                      <button
                        key={status}
                        className="rounded border px-2 py-1 text-xs"
                        onClick={() =>
                          void runAction(async () => {
                            await api(`/reservations/${r.id}/status`, {
                              method: 'PATCH',
                              body: JSON.stringify({ status }),
                            });
                            await loadTableData();
                          })
                        }
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      )}

      {activeView === 'users' && (
        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Đăng nhập admin (users API)</h2>
            <form
              className="grid gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void runAction(async () => {
                  const res = await api<{ access_token: string }>('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(loginForm),
                  });
                  localStorage.setItem(USER_TOKEN_KEY, res.access_token);
                  setToken(res.access_token);
                  await loadUsers();
                });
              }}
            >
              <input className="rounded border px-3 py-2 text-sm" placeholder="Username" value={loginForm.username} onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" type="password" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} />
              <div className="flex gap-2">
                <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800">Đăng nhập</button>
                <button
                  type="button"
                  className="rounded border px-3 py-2 text-sm"
                  onClick={() => {
                    localStorage.removeItem(USER_TOKEN_KEY);
                    setToken('');
                    setUsers([]);
                    setRoles([]);
                  }}
                >
                  Đăng xuất local
                </button>
              </div>
            </form>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 font-semibold">Tạo người dùng</h2>
            <form
              className="grid gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!token) return;
                void runAction(async () => {
                  await api('/users', {
                    method: 'POST',
                    body: JSON.stringify({
                      username: newUser.username,
                      password: newUser.password,
                      fullName: newUser.fullName,
                      roleId: Number(newUser.roleId),
                    }),
                  }, token);
                  setNewUser({ username: '', password: '', fullName: '', roleId: '' });
                  await loadUsers();
                });
              }}
            >
              <input className="rounded border px-3 py-2 text-sm" placeholder="username" value={newUser.username} onChange={(e) => setNewUser((p) => ({ ...p, username: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" type="password" placeholder="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} />
              <input className="rounded border px-3 py-2 text-sm" placeholder="full name" value={newUser.fullName} onChange={(e) => setNewUser((p) => ({ ...p, fullName: e.target.value }))} />
              <select className="rounded border px-3 py-2 text-sm" value={newUser.roleId} onChange={(e) => setNewUser((p) => ({ ...p, roleId: e.target.value }))}>
                <option value="">Chọn role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <button disabled={!token} className="rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50">Tạo user</button>
            </form>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2">
            <h2 className="mb-3 font-semibold">Danh sách người dùng</h2>
            {!token && <p className="text-sm text-slate-500">Cần đăng nhập admin để xem.</p>}
            {token && (
              <div className="grid gap-2 md:grid-cols-2">
                {users.map((user) => (
                  <div key={user.id} className="rounded border p-2 text-sm">
                    <p className="font-medium">{user.fullName} ({user.username})</p>
                    <p className="text-slate-600">Role: {user.roleName}</p>
                    <button
                      className="mt-1 text-red-600"
                      onClick={() =>
                        void runAction(async () => {
                          await api(`/users/${user.id}`, { method: 'DELETE' }, token);
                          await loadUsers();
                        })
                      }
                    >
                      Xóa user
                    </button>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      )}
    </main>
  );
}

export default App;
