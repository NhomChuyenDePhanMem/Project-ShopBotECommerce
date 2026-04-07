# Frontend — ShopBot Ecommerce

Ứng dụng React + TypeScript + Vite cho ShopBot (TMĐT + chatbot).

## Cấu trúc thư mục `src/`

| Đường dẫn | Mục đích |
|-----------|----------|
| `main.tsx` | Mount React, `ErrorBoundary`. |
| `App.tsx` | Toàn bộ UI và state (tab theo role); gọi `services/*`. |
| `App.css` / `index.css` | Style (Tailwind + custom). |
| `lib/apiClient.ts` | `fetch`: Bearer, parse lỗi JSON Nest, `HttpApiError`, mạng. |
| `lib/errors.ts` | `getErrorMessage` cho UI/hook. |
| `lib/formatVnd.ts` | Định dạng tiền VND. |
| `types/navigation.ts` | Tab (`AppView`), vai (`UserRole`), parse JWT, nhãn tiếng Việt. |
| `hooks/useAsyncAction.ts` | `isBusy` + `errorMessage` + `runAsync` cho form/nút async. |
| `services/*.ts` | Một file ≈ một nhóm endpoint backend (auth, cart, orders, …). |
| `components/` | Component dùng lại (vd. `ErrorBoundary`). |

**Ghi chú:** Chưa dùng react-router; điều hướng bằng state `activeView` trong `App.tsx` (đủ cho MVP).

## Quy ước nhanh (team)

- **Tên:** `accessToken`, `currentUser`, `activeView`, `catalogFilters` — tránh `p` / `o` / `me` mơ hồ trong UI chính.
- **DRY:** `formatVnd`, `requireLoginAccessToken`, `formatChatbotReplyForDisplay`, `getErrorMessage`.
- **Type-only import:** bật `verbatimModuleSyntax` — dùng `import type { … }` cho kiểu thuần.

## UX & responsive

- Hệ thống lớp `sb-*` trong `src/index.css`: nút tối thiểu ~44px chiều cao trên mobile, `touch-manipulation`, `focus-visible` ring, trạng thái `active` nhẹ.
- Lưới catalog `1 → 2 → 3` cột; tab điều hướng cuộn ngang trên điện thoại; form/chat xếp cột trên mobile, hàng trên `sm+`.
- Font **system stack** (không tải Inter ngoài) để first paint nhanh hơn.

## Luồng chính

- Đăng nhập theo role: `customer`, `seller`, `admin`
- Danh mục sản phẩm (lọc / tìm kiếm)
- Giỏ hàng và checkout (gọi API `cart`, `orders`, `payments`)
- Theo dõi đơn và thao tác theo vai (xác nhận / giao hàng / hoàn tất / hủy)
- Chatbot tư vấn
- Quản trị người dùng (chỉ **admin**)

## Chạy dev

```bash
npm install
npm run dev
```

Tùy chọn — file `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Build & lint

```bash
npm run build
npm run lint
```
