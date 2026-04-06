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
- **Cấu trúc Modules dự kiến**:
  - `AuthModule`: Hệ thống xác thực bằng JWT (Passport).
  - `UsersModule`: API cho profile và quản lý tài khoản.
  - `ProductsModule`: API cho danh mục, chi tiết sản phẩm.
  - `OrdersModule`: Quản lý booking, giỏ hàng, và hóa đơn thanh toán.
  - `ChatbotModule`: Cầu nối với model LLM (như OpenAI API, Ollama hoặc Google Gemini) và quản lý session trò chuyện.

### 4.2 Database (PostgreSQL)
- Sử dụng **TypeORM** (hoặc Prisma) cho NestJS Backend.
- Sơ đồ bảng (Tables) cơ bản:
  - `User`, `Role`
  - `Product`, `Category`
  - `Order`, `OrderItem`
  - `ChatSession`, `ChatMessage`

### 4.3 Frontend (React + Vite + TypeScript)
- Chạy nhanh gọn và hiện đại dựa trên Vite.
- Thư viện UI/CSS: TailwindCSS và linh kiện giao diện tự dựng.
- Quản lý State: Redux Toolkit hoặc Zustand.
- Quản lý API Call: React Query / Axios.

---
_Tài liệu đang trong quá trình phát triển và hoàn thiện. Vui lòng đóng góp và chỉnh sửa để hoàn bị các modules tính năng._

## 5. Cập nhật kiến trúc (03/2026)
- Đã bổ sung `ReviewModule`, `NotificationModule`, `PaymentModule` ở backend để tách nghiệp vụ rõ ràng.
- Đã tách `PAYMENT` độc lập với `ORDER`; thêm bảng `REVIEW`; `CATEGORY` hỗ trợ `parent_id`; `PRODUCT` có `seller_id`.
- `ChatbotModule` dùng `ChatSession` + `ChatMessage`, có `context window` và `token limit` theo phiên.
- Đã thêm `rate limiting` cho endpoint AI để tránh bị lạm dụng và kiểm soát chi phí.
- Frontend dùng `Zustand` cho cart state, có optimistic checkout, `ErrorBoundary`, và i18n cơ bản `vi/en`.
