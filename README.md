# Project ShopBot E-Commerce

## Cấu trúc thư mục (trên Git)

```text
Project-ShopBotECommerce/
├── assignments/          # Phân công theo MSSV + BRANCHES.txt
├── backend/              # NestJS API (Auth + DB; các module khác đang mock)
├── docker-compose.yml    # PostgreSQL (dev)
├── docs/
│   ├── README.md         # Mục lục tài liệu (vào đây trước)
│   ├── de-tai/           # Đề tài đăng ký — shopbot-summary.docx
│   ├── design/           # Quản lý quán ăn — ERD, schema, kiến trúc (tài liệu thiết kế)
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

## Đề tài đăng ký

- **Tóm tắt đề tài (Word):** [docs/de-tai/shopbot-summary.docx](docs/de-tai/shopbot-summary.docx)  
- **Nhóm:** **6** thành viên — **giảng viên đã chấp nhận** (đề bài môn ghi 3–5 là khung chung).

## Đề tài & định hướng — có đang cùng một hướng không?

Trong repo hiện có **hai mảng tài liệu**:

| Mảng | Nội dung | Code hiện khớp mức nào |
|------|-----------|------------------------|
| **Quản lý quán ăn** | `docs/design/*` — thu ngân / bếp / bàn / menu / order / payment theo PostgreSQL `schema.sql` | **Auth + users/roles** đã gắn bảng `users`, `roles` (admin, cashier, kitchen_staff). **Chưa** có đủ API thực cho menu/bàn/đặt bàn/đơn quán ăn — `products`, `chatbot`, `reviews`… đang là **mock TMĐT** (SShopBot). |
| **SShopBot (TMĐT + AI)** | `docs/SShopBot_Design.md`, `docs/0x_*.md` | **Frontend + mock backend** (sản phẩm, giỏ, chatbot mock) phù hợp luồng này hơn. |

**Kết luận:** **Đề tài đăng ký** là ShopBot — xem [docs/de-tai/shopbot-summary.docx](docs/de-tai/shopbot-summary.docx). Repo vẫn **lai** tài liệu/code: **quán ăn** (`docs/design/*` + Auth khớp schema) và **TMĐT + AI** (`docs/0x_*.md`, mock frontend). Nhóm có thể thống nhất báo cáo/demo theo ShopBot và dần đồng bộ code với một hướng (hoặc giữ `design/` làm phụ lục thiết kế nếu phù hợp).

## Bài tập cuối kỳ (nhóm)

Theo đề bài môn: **PDF báo cáo** (≥20 trang, gợi ý 50–70) + **GitHub** (code chạy được, README, commit history, `.gitignore`) + **video YouTube** (public/unlisted). Hạn nộp nhóm theo đề: **trước 10/04/2026** (đối chiếu lại với thông báo lớp).

- **Checklist chi tiết & cấu trúc chương:** [docs/cuoi-ky-de-bai.md](docs/cuoi-ky-de-bai.md)  
- **Phụ lục báo cáo:** link repo GitHub + link YouTube; **đầu mỗi chương** ghi thành viên tham gia (không ghi người không đóng góp).

## Danh sách thành viên

| STT | MSSV       | Họ và Tên            |
|-----|------------|----------------------|
| 1   | 1721031099 | Vũ Đình Mạnh         |
| 2   | 1721031693 | Huỳnh Minh Tiến      |
| 3   | 1721031203 | Nguyễn Tiến Đạt      |
| 4   | 1721031524 | Nguyễn Viết Quốc Anh |
| 5   | 1721031448 | Nguyễn Mai Quốc Khánh|
| 6   | 1721031423 | Trần Quang Huy       |
