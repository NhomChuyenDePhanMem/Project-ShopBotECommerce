# 2. Yêu Cầu Chức Năng Chi Tiết (Functional Requirements)

Tài liệu này trình bày các yêu cầu chức năng cốt lõi của hệ thống SShopBot. Các yêu cầu được mô tả rõ ràng theo 4 thành phần để tránh sự mơ hồ: **Input**, **Processing**, **Output**, và **Error Handling**.

---

## 2.0 Sơ Đồ Use Case Tổng Quan

Dưới đây là sơ đồ Use Case tổng quan mô tả các chức năng chính của 3 nhóm đối tác (Actors) tham gia vào hệ thống SShopBot: Người Mua, Người Bán và Quản Trị Viên.

```mermaid
usecaseDiagram
    actor "Người Mua\n(Buyer)" as Buyer
    actor "Người Bán\n(Seller)" as Seller
    actor "Quản Trị Viên\n(Admin)" as Admin

    package "Hệ thống SShopBot" {
        usecase "Đăng nhập / Đăng ký" as UC_Auth
        usecase "Tìm kiếm & Lọc Sản phẩm" as UC_Search
        usecase "Quản lý Giỏ hàng" as UC_Cart
        usecase "Thanh toán Đơn hàng" as UC_Checkout
        usecase "Chatbot AI Tư vấn" as UC_Chatbot
        usecase "Đăng tải Sản Phẩm" as UC_ManageProduct
        usecase "Quản lý Đơn hàng" as UC_ManageOrder
        usecase "Quản lý Người dùng & Seller" as UC_ManageUser
        usecase "Giám sát Hệ thống" as UC_Monitor
    }

    Buyer --> UC_Auth
    Buyer --> UC_Search
    Buyer --> UC_Cart
    Buyer --> UC_Checkout
    Buyer --> UC_Chatbot

    Seller --> UC_Auth
    Seller --> UC_ManageProduct
    Seller --> UC_ManageOrder

    Admin --> UC_Auth
    Admin --> UC_ManageUser
    Admin --> UC_Monitor
```

---

## 2.1 Tính năng Xác Thực & Phân Quyền (Auth & Authorization)

### FR1: Đăng Nhập Hệ Thống
*   **Input:** Email (chuỗi, đúng định dạng `*@*.*`) và Password (chuỗi, >= 8 ký tự).
*   **Processing:**
    1. Xác thực định dạng cơ bản trên Client.
    2. Form gửi request `POST` lên `/api/auth/login`.
    3. Dữ liệu chạy qua Middleware validate. Server tìm user qua email trong bảng `Users` PostgreSQL, mã hóa mật khẩu và so sánh Hash bằng bcrypt.
    4. Nếu đúng mật khẩu, server sinh ra JWT Token (hiệu lực 7 ngày).
*   **Output:** Trả về JSON `{ "token": "...", "user": {"id", "role", "name"} }`. UI chuyển hướng người dùng vào trang Chủ hoặc Dashboard quản lý tùy Role.
*   **Error Handling:**
    *   Nếu sai email hoặc password → Trả về HTTP 401 Unauthorized: `{"error": "Tài khoản hoặc mật khẩu không chính xác"}`.
    *   Nếu tài khoản bị định danh block → Trả về HTTP 403 Forbidden: `{"error": "Tài khoản đã bị khóa bởi hệ thống"}`.

---

## 2.2 Quản Lý Sản Phẩm (Product Management)

### FR2: Thêm Mới Sản Phẩm (Dành cho Seller)
*   **Input:** Form gồm `Tên sản phẩm` (<= 255 ký tự), `Giá bán` (số nguyên dương), `Số lượng tồn kho` (số nguyên dương), `Phân loại` (UUID), `Hình ảnh tải lên` (File .png/.jpg < 5MB).
*   **Processing:**
    1. API Guard kiểm tra Authenticated Token và đảm bảo Role = `SELLER` hoặc `ADMIN`.
    2. Upload file hình ảnh lên hệ thống lưu trữ Cloudinary/S3, nhận trả về URL public ảnh.
    3. Validate dữ liệu logic: Giá bán bắt buộc > 0 Đồng, Tên không được chứa html tags.
    4. Mở kết nối Database và `INSERT` bản ghi mới vào bảng `Product`, khóa ngoại `seller_id` tương ứng với ID người gửi Request.
*   **Output:** Phản hồi HTTP 201 Created. UI thông báo "Tạo sản phẩm thành công" và chuyển về màn danh sách sản phẩm.
*   **Error Handling:**
    *   File ảnh vượt quá 5MB/sai định dạng → HTTP 400 Bad Request: `{"error": "Hình ảnh vượt quá 5MB hoặc sai định dạng hỗ trợ"}`.
    *   Thiếu dữ liệu (Tên, Giá) → HTTP 400 và trả về mảng báo lỗi chi tiết UI Validation message tương ứng từng field.

---

## 2.3 Giỏ Hàng & Thanh Toán Đơn Hàng (Cart & Checkout Flow)

### FR3: Thêm Sản Phẩm Vào Giỏ (Add to Cart)
*   **Input:** `product_id` (UUID), `quantity` (số lượng).
*   **Processing:**
    1. Kiểm tra thông tin phiên / JWT Token.
    2. Truy vấn SQL kiểm tra current `stock_quantity` mong muốn của bản ghi `product_id` tương ứng.
    3. So sánh nếu `quantity` yêu cầu <= tồn kho hiện tại, cập nhật Record ở bảng `CartItem` (hoặc mảng LocalStorage nếu là guest session).
*   **Output:** UI Navbar - Tăng số lượng Badge trên Icon Giỏ hàng, bật Toast hiển thị dòng chữ "Sản phẩm đã được thêm vào giỏ".
*   **Error Handling:**
    *   Số lượng mua lớn hơn tồn kho hiện tại → Toast Alert UI "Kho không đủ số lượng (Chỉ còn X cái)". Database từ chối Insert.

### FR4: Tạo Đơn Hàng Thanh Toán (Order Checkout)
*   **Input:** Object JSON chứa mảng `cart_items`, `shipping_address`, và tham số `payment_method` (COD / GATEWAY).
*   **Processing:**
    1. API Endpoint `POST /api/orders/checkout`.
    2. Khởi tạo DB Transaction nghiêm ngặt.
    3. Sử dụng Lock Table for row updates: Kiểm tra lại tổng cộng `stock_quantity` 1 lần nữa để tránh Race condition (đụng độ ghi khi có 2 người mua cùng 1 lúc).
    4. Trừ `stock_quantity` cho tất cả mặt hàng trong mảng (`UPDATE Product SET stock = stock - qty WHERE id = ?`).
    5. Ghi mới bản ghi bảng `Order` trạng thái `PENDING` và lưu chi tiết vào `OrderItem`.
    6. Nếu OK hết → `COMMIT` Transaction, giải phóng Locks. Lỗi ở bất kì đâu lập tức `ROLLBACK`.
*   **Output:** Trả về Mã Đơn hàng (`order_id`). Hệ thống tự động đẩy email xác nhận qua dịch vụ Queue trung gian (RabbitMQ/BullMQ).
*   **Error Handling:**
    *   Đụng độ ghi (Concurrency conflict, sản phẩm vừa mất kho) → Khởi chạy Rollback. HTTP 409 Conflict: `{"error": "Rất tiếc, sản phẩm XYZ vừa hết hàng do có người khác đang thanh toán nhanh hơn."}`. Giao diện tải lại số lượng thực tế.

---

## 2.4 Trợ Lý Chatbot Tính Năng AI (AI Chat Assistance)

### FR5: Hỏi đáp & Gợi ý Sản Phẩm Tự Động
*   **Input:** Tin nhắn văn bản từ User (max 500 characters).
*   **Processing:**
    1. Gateway WebSockets WebSocket / Socket.io nhận gói tin nhập từ chatbox.
    2. Xếp luồng xử lý NLP/LLM Model (gọi OpenAI API/Gemini). Inject System Prompt cấu hình bot thương mại điện tử vào cùng với Input text.
    3. Bot Function Calling quét dữ liệu Database (Ví dụ: `SELECT id, name, price, thumbnail WHERE price <= X`).
    4. LLM phản hồi string tự nhiên + trả về payload data mã JSON.
*   **Output:** Streaming hiển thị tin nhắn Text từ bot từ từ lên UI, đồng thời hiển thị tối đa 3 Card Sản Phẩm kèm cấu hình HTML/CSS chuẩn (Hình, Tên, Giá bán, Nút Mở Link).
*   **Error Handling:**
    *   Timeout kết nối API từ nhà cung cấp LLM (> 10s không phản hồi) → Bot auto trả về fallback template: "Hệ thống AI hiện đang xử lý chậm, bạn có thể tham khảo danh sách sản phẩm bằng tay hoặc để lại lời nhắn."
    *   Phát hiện tin nhắn Spam/Ngôn từ vi phạm → Hàm kiểm duyệt cắt ngay luồng Request, trả về "Xin lỗi, tôi không thể hỗ trợ vấn đề này."
