import { formatVnd } from '../lib/formatVnd';
import type { Order } from '../services/orderService';

type OrdersPageProps = {
  orders: Order[];
  role: 'admin' | 'seller' | 'customer' | null;
  busy?: boolean;
  onConfirm: (orderId: number) => void;
  onShip: (orderId: number) => void;
  onComplete: (orderId: number) => void;
  onCancel: (orderId: number) => void;
};

export function OrdersPage(props: OrdersPageProps) {
  const { orders, role, busy, onConfirm, onShip, onComplete, onCancel } = props;
  const statusLabel: Record<Order['status'], string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    packing: 'Đang đóng gói',
    shipping: 'Đang giao',
    done: 'Hoàn tất',
    cancelled: 'Đã hủy',
  };

  return (
    <section className="sb-card sb-card-pad">
      <h2 className="sb-heading-section mb-4">Đơn hàng</h2>
      {orders.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-8 text-center text-sm text-slate-500">
          Chưa có đơn hàng nào.
        </p>
      )}
      <ul className="space-y-3">
        {orders.map((order) => (
          <li key={order.id} className="rounded-xl border border-slate-200 p-4 text-sm shadow-sm">
            <p className="font-semibold text-slate-900">
              Don #{order.id}{' '}
              <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                {statusLabel[order.status]}
              </span>
            </p>
            <p className="mt-1 text-slate-700">{formatVnd(order.total)}</p>
            <p className="mt-1 text-xs text-slate-500">Loại: {order.orderType}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {(role === 'seller' || role === 'admin') && (
                <>
                  <button
                    type="button"
                    className="sb-btn-secondary sb-btn-sm"
                    onClick={() => onConfirm(order.id)}
                    disabled={busy}
                  >
                    Xác nhận
                  </button>
                  <button
                    type="button"
                    className="sb-btn-secondary sb-btn-sm"
                    onClick={() => onShip(order.id)}
                    disabled={busy}
                  >
                    Giao hàng
                  </button>
                </>
              )}

              {role === 'customer' && (
                <>
                  <button
                    type="button"
                    className="sb-btn-secondary sb-btn-sm"
                    onClick={() => onComplete(order.id)}
                    disabled={busy}
                  >
                    Hoàn tất
                  </button>
                  <button
                    type="button"
                    className="sb-btn-danger sb-btn-sm"
                    onClick={() => onCancel(order.id)}
                    disabled={busy}
                  >
                    Hủy
                  </button>
                </>
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Hướng dẫn nhanh: Seller/Admin xử lý đơn theo thứ tự Xác nhận - Giao hàng. Customer
              chỉ thao tác với đơn của mình.
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

