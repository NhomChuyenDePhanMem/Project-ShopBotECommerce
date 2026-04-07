# ShopBot E-Commerce

**Nền tảng thương mại điện tử full-stack** kèm **chatbot AI** hỗ trợ tư vấn mua sắm: khách xem sản phẩm, giỏ hàng, đặt hàng, thanh toán; người bán và quản trị thao tác qua giao diện và API có phân quyền.

**Hữu ích vì:** gom **frontend (React)**, **backend (NestJS + PostgreSQL)** và **tích hợp AI** trong một repo có tài liệu thiết kế (`docs/`), phù hợp học tập, demo môn học hoặc làm nền mở rộng thật (thanh toán, vận chuyển, v.v.).

---

## Mục lục

- [Giới thiệu ngắn](#intro)
- [Yêu cầu hệ thống](#requirements)
- [Cài đặt](#installation)
- [Sử dụng](#usage)
- [Kiểm thử và build](#testing)
- [Cấu trúc thư mục](#structure)
- [Tài liệu liên quan](#docs)
- [Đóng góp](#contributing)

---

<h2 id="intro">Giới thiệu ngắn</h2>

| Khía cạnh | Nội dung |
|-----------|----------|
| **Nghiệp vụ** | Đăng nhập JWT, catalog, giỏ, đơn hàng, thanh toán, đánh giá, thông báo, chatbot |
| **Vai trò** | `customer`, `seller`, `admin` |
| **Công nghệ** | React 19 + Vite + TypeScript + Tailwind; NestJS 11; PostgreSQL 16 |

---

<h2 id="requirements">Yêu cầu hệ thống</h2>

- **Node.js** 20+ (khuyến nghị LTS)
- **npm** (đi kèm Node)
- **Docker Desktop** (hoặc Docker Engine + Compose) để chạy PostgreSQL — hoặc bạn tự cài PostgreSQL và chỉnh biến môi trường cho khớp

---

<h2 id="installation">Cài đặt</h2>

### 1. Sao chép mã nguồn

```bash
git clone <URL-repo-của-bạn>.git
cd Project-ShopBotECommerce
```

### 2. PostgreSQL bằng Docker

Tại **thư mục gốc** của repo:

```bash
docker compose up -d
```

(Tùy chọn) Sao chép `.env.example` → `.env` ở thư mục gốc để đổi `POSTGRES_PASSWORD`, `POSTGRES_PORT`, v.v.

Đợi container `healthy` (khoảng vài giây). CSDL mặc định: `sshopbot`, user `postgres` (xem `docker-compose.yml`).

### 3. Backend

```bash
cd backend
copy .env.example .env
# macOS/Linux: cp .env.example .env
npm install
npm run db:init
npm run start:dev
```

- `db:init` áp dụng `docs/design/schema.sql` lên PostgreSQL.
- Seed tài khoản demo chạy khi backend khởi động (nếu bảng `users` còn trống). Cấu hình seed: `SEED_*` trong `backend/.env`.

API mặc định: **http://localhost:3000/api**

### 4. Frontend

Mở terminal **mới**:

```bash
cd frontend
copy .env.example .env
# macOS/Linux: cp .env.example .env
npm install
npm run dev
```

Ứng dụng web: **http://localhost:5173** (hoặc cổng Vite in ra trên terminal).  
Biến `VITE_API_BASE_URL` trong `frontend/.env` trỏ tới API (mặc định `http://localhost:3000/api`).

---

<h2 id="usage">Sử dụng</h2>

### Giao diện web

1. Mở trình duyệt tại URL Vite (thường `http://localhost:5173`).
2. Đăng nhập bằng tài khoản demo (bảng dưới).
3. Duyệt sản phẩm, giỏ hàng, đơn hàng, chatbot (tùy vai trò).

### Tài khoản demo (seed)

| Tên đăng nhập | Mật khẩu | Vai trò |
|---------------|----------|---------|
| `admin01` | `Admin@123` | Quản trị |
| `seller01` | `Seller@123` | Người bán |
| `customer01` | `![1775548879791](image/README/1775548879791.png)` | Khách hàng |

Đổi mật khẩu seed: chỉnh `SEED_*` trong `backend/.env` trước lần seed đầu tiên.

### API (ví dụ với `curl`)

**Kiểm tra health (kèm trạng thái DB):**

```bash
curl -s http://localhost:3000/api
```

**Đăng nhập (lấy JWT):**

```bash
curl -s -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"customer01\",\"password\":\"Customer@123\"}"
```

Trên **macOS/Linux**, thay `^` bằng `\` và gộp dòng tùy ý. Trên **PowerShell**, có thể gọi một dòng:  
`curl.exe -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"customer01\",\"password\":\"Customer@123\"}"`

Dùng token trả về: `Authorization: Bearer <access_token>` cho các route được bảo vệ.

### Chatbot AI (tùy chọn)

Trong `backend/.env`, cấu hình `CHATBOT_PROVIDER` và khóa API (`GEMINI_API_KEY` / `OPENAI_API_KEY`) theo `backend/.env.example`. Không có khóa thì có thể dùng chế độ quy tắc (`rule_based`) tùy cấu hình hiện tại — xem chi tiết trong `backend/README.md`.

---

<h2 id="testing">Kiểm thử và build</h2>

| Thành phần | Thư mục | Lệnh gợi ý |
|------------|---------|------------|
| Backend | `backend/` | `npm run build`, `npm run test`, `npm run test:e2e` |
| Frontend | `frontend/` | `npm run build`, `npm run lint` |

**E2E backend** cần PostgreSQL đang chạy và `backend/.env` khớp với Docker Compose (host, port, user, password, database).

---

<h2 id="structure">Cấu trúc thư mục</h2>

```
Project-ShopBotECommerce/
├── backend/          # NestJS API
├── frontend/         # React + Vite
├── docs/             # Tài liệu dự án, thiết kế CSDL, ERD
├── docker-compose.yml
└── README.md
```

---

<h2 id="docs">Tài liệu liên quan</h2>

| Tài liệu | Mô tả |
|----------|--------|
| [docs/README.md](docs/README.md) | Mục lục / báo cáo tổng hợp |
| [docs/database.md](docs/database.md) | Bảo mật CSDL, backup, hiệu năng, mở rộng |
| [docs/design/schema.sql](docs/design/schema.sql) | Schema PostgreSQL baseline |
| [backend/README.md](backend/README.md) | Module API, biến môi trường, bảo mật HTTP |
| [frontend/README.md](frontend/README.md) | Giao diện, build, UX |

---

<h2 id="contributing">Đóng góp</h2>

Mọi đóng góp đều được hoan nghênh. Gợi ý quy trình:

1. **Fork** repository và tạo **nhánh mới** (`feature/...` hoặc `fix/...`).
2. Giữ commit **nhỏ, rõ nội dung**; mô tả PR bằng tiếng Việt hoặc tiếng Anh, nêu **mục đích** và **cách kiểm tra**.
3. Trước khi mở PR:
   - Chạy `npm run build` và test/lint tương ứng cho phần bạn sửa (`backend` / `frontend`).
   - Nếu đụng API hoặc schema, cập nhật **README** hoặc `docs/` cho khớp hành vi mới.
4. Tuân thủ **style có sẵn** trong repo (ESLint/Prettier nếu đã cấu hình).

Nếu repo có quy tắc riêng của nhóm môn học (nhánh `main`, deadline, reviewer), ưu tiên theo quy định đó.

---

*Nên cập nhật README khi thêm bước cài đặt, đổi cổng, đổi biến môi trường hoặc thay đổi luồng chạy dự án.*
