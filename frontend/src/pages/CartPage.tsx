import { formatVnd } from '../lib/formatVnd';
import type { CartView } from '../services/cartService';

type CartPageProps = {
  cart: CartView | null;
  busy?: boolean;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
};

export function CartPage(props: CartPageProps) {
  const { cart, busy, onRemoveItem, onClearCart, onCheckout } = props;

  return (
    <section className="sb-card sb-card-pad">
      <h2 className="sb-heading-section mb-4">Gio hang</h2>

      {(cart?.items.length ?? 0) === 0 && (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 py-8 text-center text-sm text-slate-500">
          Gio hang trong. Hay them san pham tu trang Menu.
        </p>
      )}

      <ul className="space-y-3">
        {cart?.items.map((line) => (
          <li
            key={line.productId}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-medium text-slate-800">
              {line.productName}{' '}
              <span className="font-normal text-slate-500">x {line.quantity}</span>
            </span>
            <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
              <span className="font-semibold text-slate-900">{formatVnd(line.lineTotal)}</span>
              <button
                type="button"
                className="sb-btn-danger sb-btn-sm"
                onClick={() => onRemoveItem(line.productId)}
                disabled={busy}
              >
                Xoa
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
        Tong cong: {formatVnd(cart?.total ?? 0)}
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="sb-btn-secondary w-full sm:w-auto"
          onClick={onClearCart}
          disabled={!cart?.items.length || busy}
        >
          Xoa tat ca
        </button>
        <button
          type="button"
          className="sb-btn-primary w-full sm:w-auto"
          onClick={onCheckout}
          disabled={!cart?.items.length || busy}
        >
          Dat hang
        </button>
      </div>
    </section>
  );
}

