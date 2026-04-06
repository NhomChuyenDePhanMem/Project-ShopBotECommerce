# 4. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

Tài liệu này xác định các ràng buộc và chất lượng (Quality Attributes) mà hệ thống SShopBot phải đáp ứng. Tất cả các yêu cầu phi chức năng tại đây đều được định lượng bằng **con số cụ thể** để có thể đo lường và kiểm thử được thay vì dùng từ ngữ mơ hồ ("load nhanh", "bảo mật tốt").

---

## 4.1 Hiệu Suất & Tải Trọng (Performance & Scalability)

*   **Thời gian phản hồi (Response Time):** 
    *   Thời gian tải trang (Page Load Time) cho frontend (First Contentful Paint) bắt buộc **< 3 giây** trên kết nối mạng trung bình (4G).
    *   Thời gian phản hồi của các lệnh API nội bộ (đọc danh sách, thêm kho) phải **< 500ms** cho 95% số lượng request trong điều kiện bình thường.
*   **Xử lý đồng thời (Concurrency):** Hệ thống cần kiến trúc hạ tầng đáp ứng tối thiểu **500 user thao tác đồng thời (CCU)** (gồm view sản phẩm và chat AI) mà không gặp lỗi nghẽn cổ chai (Bottleneck) dẫn đến Crash Server.
*   **Hiệu năng AI Chatbot:** Thời gian tính từ khi kết thúc truyền prompt nhập đến lúc Stream ký tự đầu tiên trả về từ LLM (Time-To-First-Token) phải rơi vào mức **< 2.5 giây**. Thời gian Stream toàn bộ câu tư vấn không quá **8 giây**. Hành vi này cần sử dụng Edge Cache để tối ưu.

---

## 4.2 Bảo Mật (Security)

*   **Bảo vệ Xác Thực (Authentication):** Giao thức bắt buộc sử dụng **JWT (JSON Web Token)** để thiết lập Session Stateless. Access Token có thời hạn ngắn (15 phút - 2 giờ), và Refresh Token có thời hạn lưu trong cookie bảo mật (`HttpOnly` & `Secure`) để ngừa đánh cắp XSS.
*   **Mã hóa thông tin (Encryption):** 
    *   Tất cả Password của các Role đăng nhập đều phải được mã hóa (băm) bằng hàm **Bcrypt** với Salt rounds tối thiểu là `10` trước khi lưu trữ vào PostgreSQL. Tuyệt đối không lưu plaintext password.
    *   Giao tiếp mạng End-to-End phải truyền qua Transport Layer Security (HTTPS/TLS v1.2 hoặc v1.3).
*   **Bảo vệ API (Rate Limiting/DDoS Defense):** Giới hạn tần suất gọi API từ Client ở mức **100 requests / 1 phút** mỗi số IP. Nếu vượt quá sẽ nhận HTTP 429 "Too Many Requests".

---

## 4.3 Khả Dụng & Tương Thích (Availability & Compatibility)

*   **Thời gian hoạt động thực (Uptime):** Hệ thống đặt mục tiêu SLA đạt mức khả dụng **99.9% / tháng** (Đồng nghĩa với việc thời gian Downtime cho bảo trì/sập nguồn không được vượt quá 43 phút / tháng).
*   **Dung sai mất dữ liệu (Reliability - Backup):** Hệ thống PostgreSQL CSDL tự động Snapshot/Sao lưu định kỳ **mỗi 24 giờ một lần**, lưu trữ bản sao tối thiểu **15 ngày** phòng chống rủi ro hỏng hóc vật lý. 
*   **Tính Tương thích (Compatibility):** UI React.js phải render chính xác trên các nền tảng:
    *   Trình duyệt: Chrome (>= v90), Safari (>= v14), Firefox (>= v88).
    *   Thiết bị: Responsive hoạt động hoàn hảo từ màn hình Điện thoại nhỏ (Mobile-size tĩnh `360px`) cho đến PC màn hình rộng Desktop/4K (`1920px`).
