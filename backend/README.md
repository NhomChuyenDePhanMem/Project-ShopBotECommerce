# Backend — ShopBot E-Commerce (NestJS)

API phục vụ nền tảng **ShopBot** (TMĐT + chatbot AI). Đề tài đăng ký: [docs/de-tai/shopbot-summary.docx](../docs/de-tai/shopbot-summary.docx). Hướng dẫn chạy cả stack: [README gốc](../README.md).

---

## PostgreSQL, Auth & API chính

1. **PostgreSQL:** ở **root repo** chạy `docker compose up -d` (file `docker-compose.yml`), hoặc dùng instance có sẵn. Sao chép `backend/.env.example` → `backend/.env` (mặc định khớp Docker: `DB_HOST=localhost`, `DB_DATABASE=sshopbot`, user/pass `postgres`).
2. **Migration + seed từ `docs/design/schema.sql`:** trong `backend/` chạy `npm run db:init` để reset và nạp toàn bộ schema + seed dữ liệu mẫu.
3. **Lần đầu DB rỗng (không chạy db:init):** seed khi app khởi động sẽ tạo role `admin`, `cashier`, `kitchen_staff`, tài khoản `SEED_ADMIN_USERNAME` (mặc định `admin01` / `SEED_ADMIN_PASSWORD` mặc định `Admin@123`), categories, menu items, dining tables, reservations.
4. **API Auth & users:**
   - `POST /api/auth/login` — body `{ "username": "...", "password": "..." }` → `{ accessToken, user }`.
   - Header `Authorization: Bearer <accessToken>` cho route được bảo vệ.
   - `GET /api/users/me` — user hiện tại.
   - `GET /api/users/roles` — `{ id, name }` (admin, chọn `roleId` khi tạo user).
   - `GET` / `POST` / `GET :id` / `PATCH` / `DELETE` trên `/api/users` — chỉ role `admin`.
   - `POST /api/auth/logout` — cần JWT, trả `204`.
5. **API quản lý bàn/đặt bàn:**
   - `GET /api/dining-tables` (`?status=available|occupied|reserved`)
   - `GET /api/dining-tables/:id`
   - `POST /api/dining-tables`
   - `PATCH /api/dining-tables/:id/status`
   - `GET /api/reservations` (`?activeOnly=true`)
   - `GET /api/reservations/:id`
   - `POST /api/reservations`
   - `PATCH /api/reservations/:id/status`
6. **API demo** (sản phẩm, đơn hàng, …) hiện mở, không bắt JWT.
7. **E2E:** cần Postgres đang chạy và `.env` hợp lệ — `npm run test:e2e` (`app.e2e-spec.ts`, `auth.e2e-spec.ts`).

---

## Cài đặt & chạy

```bash
npm install
npm run start:dev    # watch
# npm run start      # một lần
# npm run start:prod # production build
```

## Kiểm thử

```bash
npm run test         # unit
npm run test:e2e     # e2e (cần DB)
npm run test:cov     # coverage
```

---

NestJS: [tài liệu chính thức](https://docs.nestjs.com). License framework: MIT.
