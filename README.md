# ShopBot E-Commerce

Dự án nhóm môn **Chuyên đề phát triển phần mềm** — nền tảng TMĐT tích hợp chatbot AI.

| Mục | Tham chiếu |
|-----|------------|
| **Đề tài đăng ký** | [docs/de-tai/shopbot-summary.docx](docs/de-tai/shopbot-summary.docx) |
| **Nhóm** | **6** thành viên (giảng viên đã chấp nhận; đề môn chung ghi 3–5) |
| **Mục lục tài liệu** | [docs/README.md](docs/README.md) |
| **Nộp cuối kỳ** | [docs/cuoi-ky-de-bai.md](docs/cuoi-ky-de-bai.md) |

## Cài đặt và chạy

1. **PostgreSQL:** ở thư mục gốc repo chạy `docker compose up -d` (xem `docker-compose.yml`).
2. **Backend:** sao chép `backend/.env.example` → `backend/.env`, rồi:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   API mặc định: `http://localhost:3000`, prefix `/api`.
3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Tùy chọn: biến môi trường `VITE_API_BASE_URL` (mặc định trong code: `http://localhost:3000/api`).
4. **Auth & endpoint chi tiết:** [backend/README.md](backend/README.md).  
5. **E2E:** trong `backend/`, cần Postgres đang chạy: `npm run test:e2e`.

## Cấu trúc thư mục (trên Git)

```text
Project-ShopBotECommerce/
├── assignments/          # Phân công: BRANCHES.txt + assignments/<MSSV>/SCOPE.txt
├── backend/              # NestJS — Auth + DB; API demo TMĐT (mock)
├── docker-compose.yml    # PostgreSQL (dev)
├── docs/
│   ├── README.md         # Mục lục tài liệu (vào đây trước)
│   ├── de-tai/           # Đề tài đăng ký — shopbot-summary.docx
│   ├── design/           # Phụ lục mini project Quản lý quán ăn (ERD, schema, kiến trúc)
│   ├── SShopBot_Design.md, 00_…06_*.md  # Tài liệu phân tích/thiết kế ShopBot (TMĐT + AI)
│   └── …
├── frontend/             # React + Vite
└── README.md             # File này
```

- **Không commit** thư mục lồng nhầm: `Project-ShopBotECommerce/` hoặc `1721031693_*` (đã có trong `.gitignore`).
- Sau khi clone chỉ làm việc trong **một** thư mục gốc có `.git`, `backend/`, `frontend/`.

## Một mạch: đề tài, code và phân công

**Trục chính (báo cáo & demo):** **ShopBot** — mô tả trong `shopbot-summary.docx` và bộ tài liệu `docs/SShopBot_Design.md` + `docs/0x_*.md` (trong văn bản dùng tên sản phẩm **SShopBot**). **Frontend** + **backend** (NestJS) triển khai luồng TMĐT + chatbot mock.

**Phụ lục thiết kế:** `docs/design/*` là bài **Quản lý quán ăn** (ERD, `schema.sql`, kiến trúc module). **Auth** và bảng `users` / `roles` hiện **khớp** schema này (`admin`, `cashier`, `kitchen_staff`). **Phân công nhánh Git** (`assignments/BRANCHES.txt`) bám module bàn / menu / đơn / thanh toán theo phụ lục; báo cáo nên **dẫn dắt theo ShopBot** và nêu rõ mối liên hệ (ví dụ Auth dùng chung schema quán ăn).

## Phân công

- Bảng nhánh: [assignments/BRANCHES.txt](assignments/BRANCHES.txt)  
- Phạm vi từng thành viên: [assignments/](assignments/) (thư mục theo MSSV).

## Bài tập cuối kỳ (nhóm)

Theo đề bài môn: **PDF báo cáo** (≥20 trang, gợi ý 50–70) + **GitHub** (code chạy được, README, lịch sử commit, `.gitignore`) + **video YouTube** (public hoặc unlisted). Hạn nộp nhóm theo đề: **trước 10/04/2026** (đối chiếu thông báo lớp).

- Checklist & cấu trúc chương: [docs/cuoi-ky-de-bai.md](docs/cuoi-ky-de-bai.md)  
- **Phụ lục báo cáo:** link GitHub + YouTube; **đầu mỗi chương** ghi thành viên tham gia (không ghi người không đóng góp).

## Danh sách thành viên

| STT | MSSV       | Họ và Tên            |
|-----|------------|----------------------|
| 1   | 1721031099 | Vũ Đình Mạnh         |
| 2   | 1721031693 | Huỳnh Minh Tiến      |
| 3   | 1721031203 | Nguyễn Tiến Đạt      |
| 4   | 1721031524 | Nguyễn Viết Quốc Anh |
| 5   | 1721031448 | Nguyễn Mai Quốc Khánh|
| 6   | 1721031423 | Trần Quang Huy       |
