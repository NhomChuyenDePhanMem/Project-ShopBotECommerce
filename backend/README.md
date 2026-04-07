# Backend — ShopBot Ecommerce API

API NestJS cho nền tảng ShopBot (thương mại điện tử).

## Cấu trúc thư mục `src/`

| Đường dẫn | Mục đích |
|-----------|----------|
| `main.ts` | Khởi tạo HTTP: kiểm tra cấu hình production, `configureHttpApp` (Helmet, CORS, prefix `/api`, `ValidationPipe`). |
| `bootstrap/configure-app.ts` | Helmet, CORS theo `CORS_ORIGINS`, chuẩn hóa giống E2E `setup-app.ts`. |
| `app.module.ts` | Gắn Config, TypeORM, Throttle, seed, toàn bộ feature module. |
| `app.controller.ts` / `app.service.ts` | Health + kiểm tra PostgreSQL (`GET /api` → `database: up` \| `down`). |
| `common/` | Kiểu dữ liệu / mock dùng chung (vd. chat). |
| `database/entities/` | Ánh xạ TypeORM ↔ PostgreSQL (`docs/design/schema.sql`). |
| `database/seed.*` | Dữ liệu mẫu khi khởi động. |
| `database/init-from-schema.ts` | Script `npm run db:init` — tạo bảng từ SQL. |
| `modules/*/` | Mỗi miền: `*.module.ts`, `*.controller.ts`, `*.service.ts`, thư mục `dto/` nếu có. |
| `modules/auth/` | JWT, guard, decorator `@Roles`, strategy Passport. |
| `test/` | E2E + `setup-app.ts` (app test phải khớp `main.ts`). |

**Quy ước nhanh:** DTO validate bằng `class-validator`; chuyển trạng thái đơn tập trung tại `ORDER_STATUS_TRANSITIONS` trong `orders.service.ts`.

## Bảo mật, CSDL, hiệu suất, vận hành

- **Bảo mật:** `helmet` (header HTTP an toàn hơn), CORS danh sách gốc qua `CORS_ORIGINS`, `ValidationPipe` (whitelist + forbid unknown), mật khẩu bcrypt, JWT. Toàn cục `ThrottlerGuard`; `POST /api/auth/login` giới hạn chặt hơn (10/phút). Khi `NODE_ENV=production`: bắt buộc `JWT_SECRET` dài ≥ 32 ký tự, không dùng giá trị mẫu, và `TYPEORM_SYNC=false`.
- **CSDL:** Entity khớp `docs/design/schema.sql`; index trên các cột truy vấn thường gặp (`menu_items.category_id`, `orders.created_by` / `status`, `order_items.order_id` / `menu_item_id`). Production nên migration có kiểm soát, không bật `synchronize`.
- **Hiệu suất:** Lọc catalog (`category`, `q`, `minPrice`, `maxPrice`) xử lý ở PostgreSQL qua QueryBuilder; pool kết nối `DB_POOL_MAX`.
- **Bảo trì:** `GET /api` kiểm tra `SELECT 1`; theo dõi log ứng dụng, phiên bản dependency. Chi tiết backup/restore, quyền PostgreSQL, scale: [`docs/database.md`](../docs/database.md).

## Module chính

| Nhóm | Module |
|------|--------|
| Xác thực & người dùng | `auth`, `users` (JWT + phân quyền theo role) |
| Catalog & giỏ | `products`, `cart` |
| Đơn & thanh toán | `orders`, `payments` |
| Khác | `reviews`, `notifications` |
| AI | `chatbot` (provider: `gemini` \| `openai` \| `rule_based`) |

## Chạy local

```bash
npm install
npm run db:init
npm run start:dev
```

Cần PostgreSQL (ví dụ `docker compose up -d` từ thư mục gốc repo).

## Biến môi trường

Sao chép `.env.example` → `.env`.

- **CSDL:** `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_POOL_MAX`
- **Triển khai:** `NODE_ENV`, `CORS_ORIGINS` (danh sách gốc frontend, cách nhau bằng dấu phẩy)
- **JWT:** `JWT_SECRET`, `JWT_EXPIRES_SEC`
- **Chatbot:** `CHATBOT_PROVIDER`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `GEMINI_API_KEY`, `GEMINI_MODEL`, …
- **Seed:** `SEED_ADMIN_*`, `SEED_SELLER_*`, `SEED_CUSTOMER_*`

## Kiểm thử

```bash
npm run build
npm run test
npm run test:e2e
```

E2E cần PostgreSQL đang chạy và `.env` khớp với Docker Compose.
