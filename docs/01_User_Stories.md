# 1. Quản lý Yêu cầu và User Stories

Tài liệu này định nghĩa chi tiết các đối tượng người dùng (Actors), các nhóm chức năng lớn (Epics), và phân rã thành các User Stories cùng Tasks đi kèm. 
Mỗi User Story đều bao gồm các tiêu chí chấp nhận (Acceptance Criteria) theo định dạng **Given-When-Then** chuẩn mực.

---

## 1.1 Các Vai Trò (Actors)
1. **Buyer (Người Mua):** Người sử dụng nền tảng để tìm kiếm, mua sắm, tương tác với AI và theo dõi trạng thái đơn hàng.
2. **Seller (Người Bán):** Người đăng bán sản phẩm, quản lý kho hàng, xử lý đơn hàng và theo dõi doanh thu. Tham khảo gợi ý từ AI để viết mô tả.
3. **Admin (Quản trị Viên):** Người quản lý cấu hình hệ thống, duyệt người bán mới, kiểm soát tài khoản và giám sát toàn bộ hoạt động.
4. **AI Bot (Hệ thống hệ quả):** Trợ lý ảo phục vụ việc trả lời câu hỏi tự động và gợi ý theo logic NLP/LLM.

---

## 1.2 Phân Rã Yêu Cầu (Epics → Stories → Tasks)

### Epic 1: Quản lý Tài Khoản và Xác Thực (Auth & Account)
*Tính năng liên quan đến việc định danh người dùng và an toàn bảo mật.*

#### **Story 1.1: Đăng Nhập Hệ Thống (Login)**
> **As a** Buyer / Seller,  
> **I want** to securely log in to the platform using my email and password,  
> **so that** I can access my personalized dashboard and shopping history.

* **Tasks (Phân rã kỹ thuật):**
  - Thiết kế UI form Đăng nhập & Validate Frontend.
  - Viết API `POST /api/auth/login` kiểm tra DB và cấp phát JWT.
  - Implement logic lưu trữ và gửi kèm token ở Header (Interceptor).

* **Acceptance Criteria (Giới hạn chấp nhận):**
  - **Given** người dùng đang truy cập trang `/login`.
  - **When** họ nhập email + password đã đăng ký và bấm "Đăng Nhập".
  - **Then** hệ thống cấp token, lưu vào client, và chuyển hướng người dùng đến `/dashboard` (đối với Seller) hoặc `/` (đối với Buyer).
  - **Given** người dùng nhập password sai.
  - **When** bấm "Đăng Nhập".
  - **Then** hiển thị thông báo lỗi "Tài khoản hoặc mật khẩu không chính xác" bằng Toast Notification, giữ nguyên trang.

---

### Epic 2: Mua Sắm và Thanh Toán (Shopping Process)

#### **Story 2.1: Bộ lọc Sản Phẩm (Search & Filter)**
> **As a** Buyer,  
> **I want** to search for products by keyword and filter by price/category,  
> **so that** I can easily find the items I intend to purchase.

* **Tasks:**
  - Xây dựng UI Search Bar và Sidebar chứa Filter Panel.
  - Viết Query Builder cho API `GET /api/products` để hỗ trợ parameter lọc.

* **Acceptance Criteria:**
  - **Given** người mua đang ở trang danh sách sản phẩm.
  - **When** họ gõ từ khóa "Laptop" và chọn mức giá "Dưới 15 triệu".
  - **Then** hệ thống cập nhật danh sách hiển thị chỉ bao gồm đúng sản phẩm thỏa điều kiện với thời gian phản hồi không quá 2 giây.

#### **Story 2.2: Quy trình Thanh Toán (Checkout Flow)**
> **As a** Buyer,  
> **I want** to pay for the items in my cart securely via a digital payment gateway,  
> **so that** my order is fulfilled.

* **Tasks:**
  - Tạo giao diện Step-by-Step Checkout.
  - Viết Logic giảm trừ số lượng tồn kho (Transaction rollback nếu lỗi).
  - Tích hợp cổng thử nghiệm Stripe / VNPay Sandbox.

* **Acceptance Criteria:**
  - **Given** người mua có ít nhất 1 sản phẩm còn hàng trong giỏ.
  - **When** nhấn nút "Thanh Toán" và hoàn tất bước xác thực thẻ thành công.
  - **Then** hệ thống trừ số lượng kho tương ứng, đổi trạng thái đơn sang "Đã Thanh Toán", và gửi 1 Email xác nhận về hòm thư người mua.
  - **Given** một người dùng mua sản phẩm số lượng = 5, nhưng kho chỉ còn 2.
  - **When** bấm "Thanh Toán".
  - **Then** hệ thống block thao tác và cảnh báo "Số lượng trong kho không đủ (chỉ còn 2)".

---

### Epic 3: Trợ lý AI (AI Assistant)

#### **Story 3.1: Chatbot Tư vấn mua hàng**
> **As a** Buyer,  
> **I want** to tell the AI my budget and needs,  
> **so that** I receive accurate product recommendations.

* **Tasks:**
  - Triển khai Chat UI nổi (Floating Widget).
  - Viết module trung gian gọi LLM Model (OpenAI API).
  - Định nghĩa cơ chế Function Calling để bot gọi lại dữ liệu sản phẩm trong DB.

* **Acceptance Criteria:**
  - **Given** người dùng click vào Icon Chatbot góc màn hình.
  - **When** nhập "Tôi cần tìm điện thoại học sinh dưới 4 triệu".
  - **Then** bot trả về câu trả lời tự nhiên đi kèm tối đa 3 thẻ sản phẩm rẻ hơn 4 triệu trong hệ thống, kèm nút "Xem ngay" cho mỗi món.

---

### Epic 4: Bảng Điều Khiển Người Bán (Seller / Vendor Dashboard)

#### **Story 4.1: Đăng Tải Sản Phẩm (CRUD Product)**
> **As a** Seller,  
> **I want** to add a new product with full specifications and images,  
> **so that** buyers can discover and purchase it.

* **Tasks:**
  - Hoàn thiện trang `POST /api/products` phân quyền Role Seller.
  - Làm UI Form đăng sản phẩm.

* **Acceptance Criteria:**
  - **Given** Seller đang truy cập `/seller/products/new`.
  - **When** điền đầy đủ form và upload hợp lệ 1 tấm hình (.jpg), rồi ấn "Submit".
  - **Then** sản phẩm lưu thành công, hiển thị ở trạng thái "Chờ duyệt" hoặc "Active".
