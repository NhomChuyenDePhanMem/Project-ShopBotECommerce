# Project ShopBot E-Commerce

## Cấu trúc thư mục (trên Git)

```text
Project-ShopBotECommerce/
├── assignments/          # Phân công theo MSSV + BRANCHES.txt
├── backend/              # NestJS API (Auth + DB; các module khác đang mock)
├── docker-compose.yml    # PostgreSQL (dev)
├── docs/
│   ├── README.md         # Mục lục tài liệu (vào đây trước)
│   ├── design/           # Đề tài Quản lý quán ăn — ERD, schema, kiến trúc
│   ├── SShopBot_Design.md + 00–06…  # Tài liệu SShopBot (TMĐT + AI)
│   └── …
├── frontend/             # React / Vite
└── README.md             # File này
```

- **Không commit** thư mục lồng nhầm: `Project-ShopBotECommerce/` hoặc `1721031693_*` (đã có trong `.gitignore`).
- Clone xong chỉ mở **một** thư mục gốc có `.git`, `backend/`, `frontend/`.

## Làm việc nhanh

- PostgreSQL: tại root chạy `docker compose up -d`, rồi `backend/.env` (xem `backend/.env.example`).
- API Auth: `backend/README.md`.

## Đề tài & định hướng — có đang cùng một hướng không?

Trong repo hiện có **hai mảng tài liệu**:

| Mảng | Nội dung | Code hiện khớp mức nào |
|------|-----------|------------------------|
| **Quản lý quán ăn** | `docs/design/*` — thu ngân / bếp / bàn / menu / order / payment theo PostgreSQL `schema.sql` | **Auth + users/roles** đã gắn bảng `users`, `roles` (admin, cashier, kitchen_staff). **Chưa** có đủ API thực cho menu/bàn/đặt bàn/đơn quán ăn — `products`, `chatbot`, `reviews`… đang là **mock TMĐT** (SShopBot). |
| **SShopBot (TMĐT + AI)** | `docs/SShopBot_Design.md`, `docs/0x_*.md` | **Frontend + mock backend** (sản phẩm, giỏ, chatbot mock) phù hợp luồng này hơn. |

**Kết luận:** Repo **chưa thuần một đề tài** — đang **lai** giữa bài **quán ăn** (thiết kế DB + Auth) và prototype **e-commerce + AI**. Để **đi đúng hướng đề quán ăn** (theo `docs/design/system-architecture.md`), nhóm cần: thay/refactor mock thành **categories / menu_items / dining_tables / reservations / orders** đúng schema; giữ hoặc tách SShopBot thành nhánh/tài liệu riêng nếu môn chỉ chấm quán ăn.

## Danh sách thành viên

| STT | MSSV       | Họ và Tên            |
|-----|------------|----------------------|
| 1   | 1721031099 | Vũ Đình Mạnh         |
| 2   | 1721031693 | Huỳnh Minh Tiến      |
| 3   | 1721031203 | Nguyễn Tiến Đạt      |
| 4   | 1721031524 | Nguyễn Viết Quốc Anh |
| 5   | 1721031448 | Nguyễn Mai Quốc Khánh|
| 6   | 1721031423 | Trần Quang Huy       |
