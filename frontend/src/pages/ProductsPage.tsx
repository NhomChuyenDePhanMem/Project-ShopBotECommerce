import { formatVnd } from '../lib/formatVnd';
import type { Product, ProductCategory } from '../services/productService';

type ProductsPageProps = {
  products: Product[];
  categories: ProductCategory[];
  keyword: string;
  category: string;
  busy?: boolean;
  onKeywordChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onApplyFilter: () => void;
  onAddToCart: (product: Product) => void;
};

export function ProductsPage(props: ProductsPageProps) {
  const {
    products,
    categories,
    keyword,
    category,
    busy,
    onKeywordChange,
    onCategoryChange,
    onApplyFilter,
    onAddToCart,
  } = props;

  return (
    <section className="sb-card sb-card-pad">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="sb-heading-section">Menu / Sản phẩm</h2>
          <p className="text-sm text-slate-600">
            Tổng số <span className="font-semibold text-slate-900">{products.length}</span> sản phẩm đang hiển thị
          </p>
        </div>
        <p className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
          Gợi ý: dùng bộ lọc để tìm nhanh theo danh mục
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <input
          className="sb-input"
          type="search"
          placeholder="Tìm theo tên, mô tả..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
        <select
          className="sb-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Lọc theo danh mục"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="sb-btn-primary w-full sm:col-span-2 lg:col-span-1"
          onClick={onApplyFilter}
          disabled={busy}
        >
          Áp dụng bộ lọc
        </button>
      </div>

      {products.length === 0 && (
        <p className="mb-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
          Không có sản phẩm phù hợp bộ lọc hiện tại.
        </p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="sb-product-card">
            <div className="flex items-start justify-between gap-2">
              <p className="text-base font-semibold text-slate-900">{product.name}</p>
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                  product.isAvailable
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {product.isAvailable ? 'Còn hàng' : 'Tạm ngưng'}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {product.brand}
              <span className="mx-1 text-slate-400">-</span>
              <span className="font-medium text-slate-800">{formatVnd(product.price)}</span>
            </p>
            <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
            <button
              type="button"
              className="sb-btn-primary mt-1 w-full sm:mt-2"
              onClick={() => onAddToCart(product)}
              disabled={busy}
            >
              Thêm vào giỏ
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

