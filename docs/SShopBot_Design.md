# SShopBot
**AI-Powered E-Commerce Platform**
**Tài liệu Tóm tắt Ý tưởng & Thiết kế Hệ thống**

| Thuộc tính | Chi tiết |
|---|---|
| **Phiên bản** | v1.0 — Bản thảo |
| **Ngày tạo** | Tháng 3, 2026 |
| **Loại phần mềm** | Web App + Chatbot AI |
| **Tech Stack** | NestJS + PostgreSQL + React |
| **Đối tượng** | Cộng đồng / Nhiều nhóm người dùng (Người mua, Người bán, Quản trị viên) |
| **Quy mô nhóm** | **6 thành viên** (theo đề đăng ký môn Chuyên đề phát triển phần mềm) |

**Đề tài đăng ký (môn học):** *ShopBot* — file chính thức [de-tai/shopbot-summary.docx](de-tai/shopbot-summary.docx). Trong các tài liệu chi tiết (`00_`–`06_*.md`), tên **SShopBot** là tên gọi nền tảng; cùng một hướng sản phẩm với đề tài.

**Phân công nhóm:** bảng PDF [phan-cong-nhom.pdf](phan-cong-nhom.pdf) (sinh từ [generate-phan-cong-pdf.py](generate-phan-cong-pdf.py)), chi tiết từng MSSV: [assignments/README.md](../assignments/README.md).

---

## 1. Giới thiệu Dự án
SShopBot hướng tới việc xây dựng nền tảng thương mại điện tử kết hợp sức mạnh của Trí tuệ Nhân tạo (AI). Nền tảng này không chỉ cung cấp những tính năng quen thuộc của một sàn TMĐT mà còn trang bị "Trợ lý AI" thông minh để hỗ trợ toàn diện các nhóm người dùng trên hệ thống. 

## 2. Mục tiêu Dự án
- **Tự động hóa quá trình chăm sóc khách hàng:** Cho phép chatbot làm việc 24/7.
- **Tăng trải nghiệm mua sắm:** Trợ lý AI có thể tư vấn sản phẩm dựa trên nhu cầu thực tế, phân tích ngân sách và thu thập sở thích của từng nhóm người dùng.
- **Hỗ trợ người bán:** Dự đoán xu hướng mua sắm hoặc hỗ trợ quản lý kho, tự động tạo ra mô tả thu hút cho các sản phẩm.

## 3. Các tính năng chính (Core Features)

### 3.1 Giao diện cho Người mua (Buyers)
- **Quản lý tài khoản**: Đăng ký, Đăng nhập (JWT/OAuth2), Profile, Lịch sử mua hàng.
- **Tìm kiếm & Trải nghiệm Mua sắm**: Lọc sản phẩm nâng cao.
- **Giỏ hàng & Thanh toán (Cart & Checkout)**.
- **AI Chatbot Tư vấn**: 
  - Chat trực tiếp với bot để hỏi chi tiết về sản phẩm.
  - Hỗ trợ giải đáp chính sách giao hàng, hoàn trả.
  - Gợi ý sản phẩm liên quan theo thói quen và nhu cầu.

### 3.2 Giao diện cho Người bán (Sellers / Vendors)
- **Dashboard Quản lý**: Giao diện thống kê đơn hàng, doanh thu (Charts/Graphs).
- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm, giá cả, và thiết lập số lượng kho ngầm.
- **Công cụ AI cho Vendor**: AI giúp tự động tạo mô tả sản phẩm tối ưu SEO, hoặc gợi ý giá bán để cạnh tranh.

### 3.3 Giao diện cho Quản trị viên (Admins)
- **Quản lý Users**: Phân quyền, duyệt quyền người bán, khóa tài khoản vi phạm.
- **System Monitoring**: Giám sát log giao dịch, theo dõi hiệu suất và phản hồi của AI Chatbot.

## 4. Kiến trúc Hệ thống (Architecture)

### 4.1 Backend (NestJS + TypeScript)
- Cung cấp dữ liệu tĩnh và động qua API (RESTful).
- **Cấu trúc Modules (backend NestJS — khớp repo)**:
  - `AuthModule`: JWT (Passport), đăng nhập.
  - `UsersModule`: profile, CRUD user (theo quyền).
  - `ProductsModule`: catalog — danh mục & sản phẩm (CSDL: bảng `categories`, `menu_items`; entity `Product`).
  - `CartModule`: giỏ hàng (demo in-memory, gắn `userId`).
  - `OrdersModule`: đơn hàng, `order_items`, luồng trạng thái (customer / seller).
  - `PaymentsModule`: ghi nhận thanh toán theo đơn (`cod`, `vnpay`, `momo`, `stripe`).
  - `ReviewsModule`, `NotificationsModule`: khung mở rộng.
  - `ChatbotModule`: OpenAI / Gemini / rule-based, tư vấn theo catalog.
  - `SeedModule`: seed roles, user mẫu, catalog mặc định.

### 4.2 Database (PostgreSQL)
- **TypeORM** + đồng bộ schema (dev): xem [design/schema.sql](design/schema.sql), [design/erd.dbml](design/erd.dbml).
- Bảng chính:
  - `roles`, `users`
  - `categories`, `menu_items` (catalog — map entity `Product`)
  - `orders`, `order_items` (FK sản phẩm: cột `menu_item_id` ↔ `productId` trong code)
  - `payments`
- Phiên chatbot có thể dùng mock session trong code; có thể bổ sung bảng lưu session sau này.

### 4.3 Frontend (React + Vite + TypeScript)
- Chạy nhanh gọn và hiện đại dựa trên Vite.
- Thư viện UI/CSS: TailwindCSS và linh kiện giao diện tự dựng.
- Quản lý State: Redux Toolkit hoặc Zustand.
- Gọi API: `fetch` qua client tùy chỉnh / service layer (có thể bổ sung React Query sau).

---
_Tài liệu đang trong quá trình phát triển và hoàn thiện._

## 5. Cập nhật kiến trúc (04/2026)
- Backend: `Cart`, `Orders`, `Payments`, `Products`, `Auth`, `Users`, `Chatbot`, `Reviews`, `Notifications`, `Seed`.
- Thanh toán tách bảng `payments`; vai trò seed: `admin`, `seller`, `customer`.
- `ChatbotModule`: giới hạn context / token, provider từ biến môi trường; **Throttler** (rate limit) toàn cục trên API.
- Frontend: `App.tsx` theo vai trò; có thể dùng `Zustand` cho cart store; `ErrorBoundary`, i18n tùy cấu hình.
- Đã loại bỏ khỏi codebase các module phụ lục nhà hàng (bàn, đặt bàn, API menu riêng); nghiệp vụ thống nhất TMĐT.

## 6. Phân công 6 thành viên (tóm tắt)

| STT | MSSV | Họ tên | Hạng mục chính |
|:---:|:---:|---|---|
| 1 | 1721031099 | Vũ Đình Mạnh | DevOps/DB: Docker, PostgreSQL, `db:init`, `schema.sql` |
| 2 | 1721031693 | Huỳnh Minh Tiến | Auth JWT, roles, users |
| 3 | 1721031203 | Nguyễn Tiến Đạt | Catalog: categories + products (`menu_items`) |
| 4 | 1721031524 | Nguyễn Viết Quốc Anh | Orders, `order_items`, luồng trạng thái |
| 5 | 1721031448 | Nguyễn Mai Quốc Khánh | Payments, checkout / thanh toán (FE+BE) |
| 6 | 1721031423 | Trần Quang Huy | FE React: catalog, giỏ, đơn, chatbot, admin user, README/demo |

Chi tiết: [assignments/BRANCHES.txt](../assignments/BRANCHES.txt), [generate-phan-cong-pdf.py](generate-phan-cong-pdf.py).
