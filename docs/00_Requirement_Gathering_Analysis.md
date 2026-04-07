# THU THẬP & PHÂN TÍCH YÊU CẦU PHẦN MỀM (Requirement Gathering & Analysis)

**Tên dự án:** ShopBot / SShopBot — Nền tảng thương mại điện tử tích hợp chatbot AI

**Quy mô nhóm:** 6 thành viên (đề đăng ký môn Chuyên đề phát triển phần mềm).

Tài liệu này mô tả cách nhóm thu thập và phân tích yêu cầu cho sản phẩm TMĐT: người mua, người bán, quản trị; luồng xem hàng → giỏ → đơn → thanh toán; và tư vấn bằng AI trên catalog.

---

## 1. Phương pháp thu thập yêu cầu

1. **Phỏng vấn / khảo sát nhanh** kỳ vọng mua sắm trực tuyến và chatbot tư vấn.
2. **Phân tích đề tài & tài liệu:** `de-tai/shopbot-summary.docx`, `SShopBot_Design.md`, `design/schema.sql`.
3. **Thống nhất stack triển khai:** NestJS, PostgreSQL, React (Vite), Docker Compose (môi trường nhóm).

---

## 2. Stakeholder (bên liên quan)

| Nhóm | Nhu cầu chính |
|------|----------------|
| **Khách hàng (customer)** | Tìm sản phẩm, giỏ hàng, đặt hàng, thanh toán, theo dõi trạng thái đơn |
| **Người bán (seller)** | Xác nhận / giao hàng (chuyển trạng thái đơn phù hợp API) |
| **Quản trị (admin)** | Quản lý user, vai trò |
| **Hệ thống AI** | Trả lời câu hỏi trong phạm vi TMĐT; gợi ý sản phẩm theo ngân sách / mô tả |

---

## 3. So sánh As-Is / To-Be (tóm tắt)

| Khía cạnh | As-Is (không có nền tảng) | To-Be (ShopBot) |
|-----------|---------------------------|------------------|
| Tư vấn sản phẩm | Tự lọc danh sách thủ công | Chatbot + catalog có cấu trúc |
| Đơn & thanh toán | Rời rạc, khó truy vết | REST: orders + payments, JWT phân quyền |
| Triển khai nhóm | Không chuẩn hóa môi trường | Docker + `schema.sql` + seed |

---

## 4. Kết luận phần thu thập

Các yêu cầu được chuyển tiếp sang **User Stories** (`01_User_Stories.md`) và **Functional Requirements** (`02_Functional_Requirements.md`, …). Phân công 6 thành viên: `assignments/README.md`, bảng PDF `phan-cong-nhom.pdf` (sinh từ `generate-phan-cong-pdf.py`).
