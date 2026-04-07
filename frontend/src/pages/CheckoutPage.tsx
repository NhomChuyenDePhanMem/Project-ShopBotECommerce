import { formatVnd } from '../lib/formatVnd';
import type { CartView } from '../services/cartService';
import type { PaymentMethod } from '../services/paymentService';

type CheckoutPageProps = {
  cart: CartView | null;
  paymentMethod: PaymentMethod;
  busy?: boolean;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPlaceOrder: () => void;
};

export function CheckoutPage(props: CheckoutPageProps) {
  const { cart, paymentMethod, busy, onPaymentMethodChange, onPlaceOrder } = props;

  return (
    <section className="sb-card sb-card-pad">
      <h2 className="sb-heading-section mb-4">Dat hang</h2>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <p className="font-medium text-slate-800">Tom tat don hang</p>
        <p className="text-slate-600">So mat hang: {cart?.items.length ?? 0}</p>
        <p className="text-lg font-semibold text-slate-900">
          Tong thanh toan: {formatVnd(cart?.total ?? 0)}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <label className="text-sm font-medium text-slate-700">Phuong thuc thanh toan</label>
        <select
          className="sb-select"
          value={paymentMethod}
          onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
        >
          <option value="cod">COD</option>
          <option value="vnpay">VNPay</option>
          <option value="momo">Momo</option>
          <option value="stripe">Stripe</option>
        </select>
      </div>

      <button
        type="button"
        className="sb-btn-primary mt-5 w-full sm:w-auto"
        onClick={onPlaceOrder}
        disabled={!cart?.items.length || busy}
      >
        Xac nhan dat hang
      </button>
    </section>
  );
}

