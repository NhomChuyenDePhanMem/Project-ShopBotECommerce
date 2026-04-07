# Thiết kế CSDL & kiến trúc — ShopBot E-Commerce

Thư mục `docs/design/` mô tả **mô hình dữ liệu và kiến trúc** của hệ thống thương mại điện tử trong repo (NestJS + PostgreSQL).

- **Vai trò người dùng** trong `schema.sql` / seed: `admin`, `seller`, `customer`.
- **Bảng `menu_items`**: lưu danh mục sản phẩm (trong code map sang entity `Product`); `order_items.menu_item_id` là khóa ngoại tương ứng `productId`.

## Danh sách file

1. `system-architecture.md` — Kiến trúc 3 lớp, module backend.
2. `system-architecture.drawio` — Bản vẽ draw.io (có thể cập nhật cho khớp sơ đồ mới).
3. `erd.dbml` — ERD cho dbdiagram.io.
4. `schema.sql` — `CREATE TABLE` baseline (chạy qua `backend` → `npm run db:init`).
5. `design-patterns.md` — Gợi ý design pattern (tham chiếu module thực tế trong code).

**Vận hành CSDL (bảo mật, hiệu năng, backup, scale):** xem [`../database.md`](../database.md).

**Link ERD (dbdiagram.io)** có thể tạo lại từ nội dung `erd.dbml` hiện tại.
